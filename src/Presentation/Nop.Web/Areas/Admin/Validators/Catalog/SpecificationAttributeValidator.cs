using FluentValidation;
using Nop.Core.Domain.Catalog;
using Nop.Data.Migrations;
using Nop.Services.Localization;
using Nop.Web.Areas.Admin.Models.Catalog;
using Nop.Web.Framework.Validators;

namespace Nop.Web.Areas.Admin.Validators.Catalog
{
    public partial class SpecificationAttributeValidator : BaseNopValidator<SpecificationAttributeModel>
    {
        public SpecificationAttributeValidator(ILocalizationService localizationService, IMigrationManager migrationManager)
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage(localizationService.GetResource("Admin.Catalog.Attributes.SpecificationAttributes.SpecificationAttribute.Fields.Name.Required"));

            SetDatabaseValidationRules<SpecificationAttribute>(migrationManager);
        }
    }
}