using System.Collections.Generic;
using Nop.Web.Framework.Models;

namespace Nop.Web.Models.Catalog
{
    /// <summary>
    /// Represents a specification filter model
    /// </summary>
    public partial class SpecificationFilterModel : BaseNopModel
    {
        #region Properties

        /// <summary>
        /// Gets or sets a value indicating whether filtering is enabled
        /// </summary>
        public bool Enabled { get; set; }

        /// <summary>
        /// Gets or sets the filtrable sprecification attributes
        /// </summary>
        public IList<SpecificationAttributeFilterModel> Attributes { get; set; }

        #endregion

        #region Ctor

        public SpecificationFilterModel()
        {
            Attributes = new List<SpecificationAttributeFilterModel>();
        }

        #endregion
    }
}
