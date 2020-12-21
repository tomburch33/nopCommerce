using Nop.Web.Framework.Models;

namespace Nop.Web.Models.Catalog
{
    /// <summary>
    /// Represents a price range filter item
    /// </summary>
    public partial class PriceRangeFilterItem : BaseNopModel
    {
        #region Properties

        /// <summary>
        /// Gets or sets the lower price limit
        /// </summary>
        public string From { get; set; }

        /// <summary>
        /// Gets or sets the upper price limit
        /// </summary>
        public string To { get; set; }

        /// <summary>
        /// Gets or sets the filter URL
        /// </summary>
        public string FilterUrl { get; set; }

        /// <summary>
        /// Gets or sets the value indicating whether to the filter is selected
        /// </summary>
        public bool Selected { get; set; }

        #endregion
    }
}
