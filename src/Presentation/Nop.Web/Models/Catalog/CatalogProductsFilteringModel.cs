using Nop.Web.Framework.Models;

namespace Nop.Web.Models.Catalog
{
    /// <summary>
    /// Represents a products filtering model
    /// </summary>
    public partial class CatalogProductsFilteringModel : BaseNopModel
    {
        #region Properties

        /// <summary>
        /// Gets or sets the price range filter model
        /// </summary>
        public PriceRangeFilterModel PriceRangeFilter { get; set; }

        /// <summary>
        /// Gets or sets the specification filter model
        /// </summary>
        public SpecificationFilterModel SpecificationFilter { get; set; }

        #endregion

        #region Ctor

        public CatalogProductsFilteringModel()
        {
            PriceRangeFilter = new PriceRangeFilterModel();
            SpecificationFilter = new SpecificationFilterModel();
        }

        #endregion
    }
}
