using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Nop.Web.Factories;
using Nop.Web.Framework.Components;
using Nop.Web.Models.Catalog;

namespace Nop.Web.Components
{
    public class CatalogFiltersViewComponent : NopViewComponent
    {
        #region Fields
        
        private readonly ICatalogModelFactory _catalogModelFactory;

        #endregion

        #region Ctor

        public CatalogFiltersViewComponent(ICatalogModelFactory catalogModelFactory)
        {
            _catalogModelFactory = catalogModelFactory;
        }

        #endregion

        #region Methods

        public async Task<IViewComponentResult> InvokeAsync(int currentCategoryId, int currentManufacturerId)
        {
            CatalogProductsFilteringModel model = null;

            if (currentCategoryId > 0)
                model = await _catalogModelFactory.PrepareCategoryFilteringModelAsync(currentCategoryId);
            else
            if (currentManufacturerId > 0)
                model = await _catalogModelFactory.PrepareManufacturerFilteringModelAsync(currentManufacturerId);
            else
                return Content(string.Empty);

            return View(model);
        }

        #endregion
    }
}
