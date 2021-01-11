using Nop.Web.Framework.UI.Paging;

namespace Nop.Web.Models.Catalog
{
    /// <summary>
    /// Represents a model to get the catalog products
    /// </summary>
    public class GetCatalogProductsCommand : BasePageableModel
    {
        #region Properties

        /// <summary>
        /// Gets or sets the price ('min-max' format)
        /// </summary>
        public string Price { get; set; }

        /// <summary>
        /// Gets or sets the specification attribute options (comma separated)
        /// </summary>
        public string Specs { get; set; }

        /// <summary>
        /// Gets or sets a order by
        /// </summary>
        public int? OrderBy { get; set; }

        /// <summary>
        /// Gets or sets a product sorting
        /// </summary>
        public string ViewMode { get; set; }

        #endregion
    }
}
