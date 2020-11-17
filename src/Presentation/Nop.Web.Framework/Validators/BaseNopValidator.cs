using System;
using System.Data;
using System.Linq;
using System.Linq.Dynamic.Core;
using FluentValidation;
using Nop.Core;
using Nop.Core.Infrastructure;
using Nop.Data.Migrations;
using Nop.Services.Localization;

namespace Nop.Web.Framework.Validators
{
    /// <summary>
    /// Base class for validators
    /// </summary>
    /// <typeparam name="TModel">Type of model being validated</typeparam>
    public abstract class BaseNopValidator<TModel> : AbstractValidator<TModel> where TModel : class
    {
        #region Ctor

        protected BaseNopValidator()
        {
            PostInitialize();
        }

        #endregion

        #region Utilities

        /// <summary>
        /// Developers can override this method in custom partial classes in order to add some custom initialization code to constructors
        /// </summary>
        protected virtual void PostInitialize()
        {
        }

        /// <summary>
        /// Sets validation rule(s) to appropriate database model
        /// </summary>
        /// <typeparam name="TEntity">Entity type</typeparam>
        /// <param name="migrationManager">Data provider</param>
        /// <param name="filterStringPropertyNames">Properties to skip</param>
        protected virtual void SetDatabaseValidationRules<TEntity>(IMigrationManager migrationManager, params string[] filterStringPropertyNames)
            where TEntity : BaseEntity
        {
            if (migrationManager is null)
                throw new ArgumentNullException(nameof(migrationManager));

            var entityDescriptor = migrationManager.GetEntityDescriptor(typeof(TEntity));

            SetStringPropertiesMaxLength(entityDescriptor, filterStringPropertyNames);
            SetDecimalMaxValue(entityDescriptor);
        }

        /// <summary>
        /// Sets length validation rule(s) to string properties according to appropriate database model
        /// </summary>
        /// <param name="entityDescriptor">Entity descriptor</param>
        /// <param name="filterPropertyNames">Properties to skip</param>
        protected virtual void SetStringPropertiesMaxLength(EntityDescriptor descriptor, params string[] filterPropertyNames)
        {
            if (descriptor is null)
                return;

            //filter model properties for which need to get max lengths
            var modelPropertyNames = typeof(TModel).GetProperties()
                .Where(property => property.PropertyType == typeof(string) && !filterPropertyNames.Contains(property.Name))
                .Select(property => property.Name).ToList();

            //get max length of these properties
            var columnsMaxLengths = descriptor.Fields.Where(field =>
                modelPropertyNames.Contains(field.Name) && field.Type == typeof(string) && field.Size.HasValue);

            //create expressions for the validation rules
            var maxLengthExpressions = columnsMaxLengths.Select(property => new
            {
                MaxLength = property.Size.Value,
                // We must using identifiers of the form @SomeName to avoid problems with parsing fields that match reserved words https://github.com/StefH/System.Linq.Dynamic.Core/wiki/Dynamic-Expressions#substitution-values
                Expression = DynamicExpressionParser.ParseLambda<TModel, string>(null, false, "@" + property.Name)
            }).ToList();

            //define string length validation rules
            foreach (var expression in maxLengthExpressions)
            {
                RuleFor(expression.Expression).Length(0, expression.MaxLength);
            }
        }

        /// <summary>
        /// Sets max value validation rule(s) to decimal properties according to appropriate database model
        /// </summary>
        /// <param name="entityDescriptor">Entity descriptor</param>
        protected virtual void SetDecimalMaxValue(EntityDescriptor descriptor)
        {
            if (descriptor is null)
                return;

            //filter model properties for which need to get max values
            var modelPropertyNames = typeof(TModel).GetProperties()
                .Where(property => property.PropertyType == typeof(decimal))
                .Select(property => property.Name).ToList();

            //get max values of these properties
            var decimalColumnsMaxValues = descriptor.Fields.Where(field =>
                modelPropertyNames.Contains(field.Name) &&
                field.Type == typeof(decimal) && field.Size.HasValue && field.Precision.HasValue);

            if (!decimalColumnsMaxValues.Any())
                return;

            //create expressions for the validation rules
            var maxValueExpressions = decimalColumnsMaxValues.Select(column => new
            {
                MaxValue = (decimal)Math.Pow(10, column.Size.Value - column.Precision.Value),
                Expression = DynamicExpressionParser.ParseLambda<TModel, decimal>(null, false, column.Name)
            }).ToList();

            //define decimal validation rules
            var localizationService = EngineContext.Current.Resolve<ILocalizationService>();
            foreach (var expression in maxValueExpressions)
            {
                RuleFor(expression.Expression).IsDecimal(expression.MaxValue)
                    .WithMessage(string.Format(localizationService.GetResource("Nop.Web.Framework.Validators.MaxDecimal"), expression.MaxValue - 1));
            }
        }

        #endregion
    }
}