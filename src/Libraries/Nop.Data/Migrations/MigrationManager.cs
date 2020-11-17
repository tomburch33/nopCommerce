using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using FluentMigrator;
using FluentMigrator.Builders.Create.Table;
using FluentMigrator.Builders.IfDatabase;
using FluentMigrator.Expressions;
using FluentMigrator.Infrastructure;
using FluentMigrator.Runner;
using FluentMigrator.Runner.Initialization;
using Nop.Core.Infrastructure;
using Nop.Data.Extensions;
using Nop.Data.Mapping;

namespace Nop.Data.Migrations
{
    /// <summary>
    /// Represents the migration manager
    /// </summary>
    public partial class MigrationManager : IMigrationManager
    {
        #region Fields

        private readonly Dictionary<Type, Action<ICreateTableColumnAsTypeSyntax>> _typeMapping;
        private readonly IFilteringMigrationSource _filteringMigrationSource;
        private readonly IMigrationRunner _migrationRunner;
        private readonly IMigrationRunnerConventions _migrationRunnerConventions;
        private readonly IMigrationContext _migrationContext;
        private readonly ITypeFinder _typeFinder;
        private readonly Lazy<IVersionLoader> _versionLoader;

        #endregion

        #region Ctor

        public MigrationManager(
            IFilteringMigrationSource filteringMigrationSource,
            IMigrationRunner migrationRunner,
            IMigrationRunnerConventions migrationRunnerConventions,
            IMigrationContext migrationContext,
            ITypeFinder typeFinder)
        {
            _versionLoader = new Lazy<IVersionLoader>(() => EngineContext.Current.Resolve<IVersionLoader>());
            
            _typeMapping = new Dictionary<Type, Action<ICreateTableColumnAsTypeSyntax>>
            {
                [typeof(int)] = c => c.AsInt32(),
                [typeof(long)] = c => c.AsInt64(),
                [typeof(string)] = c => c.AsString(int.MaxValue).Nullable(),
                [typeof(bool)] = c => c.AsBoolean(),
                [typeof(decimal)] = c => c.AsDecimal(18, 4),
                [typeof(DateTime)] = c => c.AsDateTime2(),
                [typeof(byte[])] = c => c.AsBinary(int.MaxValue),
                [typeof(Guid)] = c => c.AsGuid()
            };

            _filteringMigrationSource = filteringMigrationSource;
            _migrationRunner = migrationRunner;
            _migrationRunnerConventions = migrationRunnerConventions;
            _migrationContext = migrationContext;
            _typeFinder = typeFinder;
        }

        #endregion

        #region Utils

        /// <summary>
        /// Returns the instances for found types implementing FluentMigrator.IMigration
        /// </summary>
        /// <param name="assembly"></param>
        /// <returns>The instances for found types implementing FluentMigrator.IMigration</returns>
        private IEnumerable<IMigrationInfo> GetMigrations(Assembly assembly)
        {
            var migrations = _filteringMigrationSource.GetMigrations(t => assembly == null || t.Assembly == assembly) ?? Enumerable.Empty<IMigration>();

            return migrations.Select(m => _migrationRunnerConventions.GetMigrationInfoForMigration(m)).OrderBy(migration => migration.Version);
        }

        /// <summary>
        /// Provides migration context with a null implementation of a processor that does not do any work
        /// </summary>
        /// <returns>The context of a migration while collecting up/down expressions</returns>
        protected IMigrationContext CreateNullMigrationContext()
        {
            return new MigrationContext(new NullIfDatabaseProcessor(), _migrationContext.ServiceProvider, null, null);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Executes all found (and unapplied) migrations
        /// </summary>
        /// <param name="assembly">Assembly to find the migration</param>
        /// <param name="isUpdateProcess">Indicates whether the upgrade or installation process is ongoing. True - if an upgrade process</param>
        public void ApplyUpMigrations(Assembly assembly, bool isUpdateProcess = false)
        {
            if(assembly is null)
                throw new ArgumentNullException(nameof(assembly));

            var migrations = GetMigrations(assembly);

            bool needToExecute(IMigrationInfo migrationInfo1)
            {
                var skip = migrationInfo1.Migration.GetType().GetCustomAttributes(typeof(SkipMigrationAttribute)).Any() || isUpdateProcess && migrationInfo1.Migration.GetType()
                    .GetCustomAttributes(typeof(SkipMigrationOnUpdateAttribute)).Any() || !isUpdateProcess && migrationInfo1.Migration.GetType()
                    .GetCustomAttributes(typeof(SkipMigrationOnInstallAttribute)).Any();

                return !skip;
            }

            foreach (var migrationInfo in migrations.Where(needToExecute))
                    _migrationRunner.MigrateUp(migrationInfo.Version);
        }

        /// <summary>
        /// Executes all found (and unapplied) migrations
        /// </summary>
        /// <param name="assembly">Assembly to find the migration</param>
        public void ApplyDownMigrations(Assembly assembly)
        {
            if(assembly is null)
                throw new ArgumentNullException(nameof(assembly));

            var migrations = GetMigrations(assembly).Reverse();

            foreach (var migrationInfo in migrations)
            {
                if (migrationInfo.Migration.GetType().GetCustomAttributes(typeof(SkipMigrationAttribute)).Any())
                    continue;

                _migrationRunner.Down(migrationInfo.Migration);
                _versionLoader.Value.DeleteVersion(migrationInfo.Version);
            }
        }

        public virtual EntityDescriptor GetEntityDescriptor(Type entityType)
        {
            return EntityDescriptors.GetOrAdd(entityType, t => 
            {
                var tableName = NameCompatibilityManager.GetTableName(t);
                var expression = new CreateTableExpression { TableName = tableName };
                var builder = new CreateTableExpressionBuilder(expression, CreateNullMigrationContext());
                
                builder.RetrieveTableExpressions(t);

                return new EntityDescriptor 
                {
                    EntityName = tableName,
                    Fields = builder.Expression.Columns.Select(column => new EntityFieldDescriptor 
                    {
                        Name = column.Name,
                        IsPrimaryKey = column.IsPrimaryKey,
                        IsNullable = column.IsNullable,
                        Size = column.Size,
                        Precision = column.Precision,
                        IsIdentity = column.IsIdentity,
                        Type = getPropertyTypeByColumnName(t, column.Name)
                    }).ToList()
                };
            });

            static Type getPropertyTypeByColumnName(Type targetType, string name)
            {
                var (mappedType, _)  = targetType
                    .GetProperties(BindingFlags.Instance | BindingFlags.Public | BindingFlags.SetProperty)
                    .FirstOrDefault(pi => name.Equals(NameCompatibilityManager.GetColumnName(targetType, pi.Name))).PropertyType.GetTypeToMap();

                return mappedType;

            }
        }

        #endregion

        protected static ConcurrentDictionary<Type, EntityDescriptor> EntityDescriptors { get; } = new ConcurrentDictionary<Type, EntityDescriptor>();
    }
}