using Microsoft.AspNetCore.Mvc;
using Nop.Web.Framework.Components;
using Nop.Web.Models.Catalog;

namespace Nop.Web.Components
{
    public class CatalogFiltersViewComponent : NopViewComponent
    {
        public CatalogFiltersViewComponent()
        {

        }

        public IViewComponentResult Invoke(int currentCategoryId, int currentManufacturerId)
        {
            if (currentCategoryId > 0)
                return PrepareCategoryFilters(currentCategoryId);
            else
            if (currentManufacturerId > 0)
                return PrepareManufacturerFilters(currentManufacturerId);
            else
                return Content(string.Empty);
        }

        private IViewComponentResult PrepareCategoryFilters(int categoryId)
        {
            return View(new CatalogProductsFilteringModel());
        }

        private IViewComponentResult PrepareManufacturerFilters(int manufacturerId)
        {
            return View(new CatalogProductsFilteringModel());
        }
    }
}
