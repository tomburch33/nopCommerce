using FluentValidation;
using Nop.Core.Domain.Tax;
using Nop.Data.Migrations;
using Nop.Services.Localization;
using Nop.Web.Areas.Admin.Models.Tax;
using Nop.Web.Framework.Validators;

namespace Nop.Web.Areas.Admin.Validators.Tax
{
    public partial class TaxCategoryValidator : BaseNopValidator<TaxCategoryModel>
    {
        public TaxCategoryValidator(ILocalizationService localizationService, IMigrationManager migrationManager)
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage(localizationService.GetResource("Admin.Configuration.Tax.Categories.Fields.Name.Required"));

            SetDatabaseValidationRules<TaxCategory>(migrationManager);
        }
    }
}