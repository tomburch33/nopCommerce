using System.Collections.Generic;
using Nop.Web.Framework.UI.Paging;

namespace Nop.Web.Models.Catalog
{
    /// <summary>
    /// Represents a catalog products model
    /// </summary>
    public partial class CatalogProductsModel : BasePageableModel
    {
        #region Properties

        /// <summary>
        /// Gets or sets the filtering model
        /// </summary>
        public CatalogProductsFilteringModel FilteringModel { get; set; }

        /// <summary>
        /// Gets or sets the displaying model
        /// </summary>
        public CatalogProductsDisplayingModel DisplayingModel { get; set; }

        /// <summary>
        /// Gets or sets the products
        /// </summary>
        public IList<ProductOverviewModel> Products { get; set; }

        #endregion

        #region Ctor

        public CatalogProductsModel()
        {
            FilteringModel = new CatalogProductsFilteringModel();
            DisplayingModel = new CatalogProductsDisplayingModel();
            Products = new List<ProductOverviewModel>();
        }

        #endregion
    }
}
