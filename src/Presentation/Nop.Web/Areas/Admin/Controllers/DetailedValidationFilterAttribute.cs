using System;
using System.ComponentModel;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Nop.Core.Infrastructure;
using Nop.Services.Localization;
using Nop.Web.Framework.Mvc.ModelBinding;

namespace Nop.Web.Areas.Admin.Controllers
{
    /// <summary>
    /// Represents a filter attribute that add displayName of property to error text
    /// </summary>
    public class DetailedValidationFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var localizationService = EngineContext.Current.Resolve<ILocalizationService>();
            
            if (context.ModelState.ErrorCount > 0)
            {
                var modelType = context.ActionDescriptor.Parameters.Select(p => p.ParameterType)
                    .FirstOrDefault();

                if (modelType != null)
                    foreach (var modelState in context.ModelState.Where(e => e.Value.ValidationState == ModelValidationState.Invalid))
                    {
                        var property = modelType.GetProperties().FirstOrDefault(p =>
                            p.Name.Equals(modelState.Key, StringComparison.InvariantCultureIgnoreCase));

                        if (property == null)
                            continue;

                        var displayName = property.Name;

                        var displayNameAttributeValue = property
                            .GetCustomAttributes(typeof(NopResourceDisplayNameAttribute), true)
                            .Cast<DisplayNameAttribute>().SingleOrDefault()?.DisplayName;
                        displayName = displayNameAttributeValue ?? displayName;

                        var errors = modelState.Value.Errors.Select(r => r.ErrorMessage.Replace("nop_value_must_not_be_null", string.Format(localizationService.GetResourceAsync("Admin.Common.ValueMustNotBeNull").Result, displayName))).ToList();
                        modelState.Value.Errors.Clear();
                        foreach (var error in errors) 
                            modelState.Value.Errors.Add(error);
                    }
            }

            base.OnActionExecuting(context);
        }
    }
}