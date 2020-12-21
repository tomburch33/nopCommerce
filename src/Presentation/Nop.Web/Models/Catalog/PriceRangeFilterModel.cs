using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Nop.Core;
using Nop.Core.Domain.Catalog;
using Nop.Services.Catalog;
using Nop.Web.Framework.Models;

namespace Nop.Web.Models.Catalog
{
    /// <summary>
    /// Represents a products price range filter model
    /// </summary>
    public partial class PriceRangeFilterModel : BaseNopModel
    {
        #region Const

        private const string QUERYSTRINGPARAM = "price";

        #endregion

        #region Properties

        /// <summary>
        /// Gets or sets a value indicating whether filtering is enabled
        /// </summary>
        public bool Enabled { get; set; }

        /// <summary>
        /// Gets or sets the filter items
        /// </summary>
        public IList<PriceRangeFilterItem> Items { get; set; }

        /// <summary>
        /// Gets or sets the URL of "remove filters" button
        /// </summary>
        public string RemoveFilterUrl { get; set; }

        #endregion

        #region Ctor

        /// <summary>
        /// Ctor
        /// </summary>
        public PriceRangeFilterModel()
        {
            Items = new List<PriceRangeFilterItem>();
        }

        #endregion

        #region Utilities

        /// <summary>
        /// Gets parsed price ranges
        /// </summary>
        /// <param name="priceRangesStr">Price ranges in string format</param>
        /// <returns>Price ranges</returns>
        protected virtual IList<PriceRange> GetPriceRangeList(string priceRangesStr)
        {
            var priceRanges = new List<PriceRange>();
            if (string.IsNullOrWhiteSpace(priceRangesStr))
                return priceRanges;
            var rangeArray = priceRangesStr.Split(new[] { ';' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var str1 in rangeArray)
            {
                var fromTo = str1.Trim().Split(new[] { '-' });

                decimal? from = null;
                if (!string.IsNullOrEmpty(fromTo[0]) && !string.IsNullOrEmpty(fromTo[0].Trim()))
                    from = decimal.Parse(fromTo[0].Trim(), new CultureInfo("en-US"));

                decimal? to = null;
                if (!string.IsNullOrEmpty(fromTo[1]) && !string.IsNullOrEmpty(fromTo[1].Trim()))
                    to = decimal.Parse(fromTo[1].Trim(), new CultureInfo("en-US"));

                priceRanges.Add(new PriceRange { From = from, To = to });
            }
            return priceRanges;
        }

        /// <summary>
        /// Exclude query string parameters
        /// </summary>
        /// <param name="url">URL</param>
        /// <param name="webHelper">Web helper</param>
        /// <returns>New URL</returns>
        protected virtual Task<string> ExcludeQueryStringParamsAsync(string url, IWebHelper webHelper)
        {
            //comma separated list of parameters to exclude
            const string excludedQueryStringParams = "pagenumber";
            var excludedQueryStringParamsSplitted = excludedQueryStringParams.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var exclude in excludedQueryStringParamsSplitted)
                url = webHelper.RemoveQueryString(url, exclude);

            return Task.FromResult(url);
        }

        #endregion

        #region Methods

        /// <summary>
        /// Get selected price range
        /// </summary>
        /// <param name="webHelper">Web helper</param>
        /// <param name="priceRangesStr">Price ranges in string format</param>
        /// <returns>Price ranges</returns>
        public virtual Task<PriceRange> GetSelectedPriceRangeAsync(IWebHelper webHelper, string priceRangesStr)
        {
            var range = webHelper.QueryString<string>(QUERYSTRINGPARAM);

            if (string.IsNullOrEmpty(range))
                return Task.FromResult<PriceRange>(null);

            var fromTo = range.Trim().Split(new[] { '-' });
            if (fromTo.Length == 2)
            {
                decimal? from = null;
                if (!string.IsNullOrEmpty(fromTo[0]) && !string.IsNullOrEmpty(fromTo[0].Trim()))
                    from = decimal.Parse(fromTo[0].Trim(), new CultureInfo("en-US"));
                decimal? to = null;
                if (!string.IsNullOrEmpty(fromTo[1]) && !string.IsNullOrEmpty(fromTo[1].Trim()))
                    to = decimal.Parse(fromTo[1].Trim(), new CultureInfo("en-US"));

                var priceRangeList = GetPriceRangeList(priceRangesStr);
                foreach (var pr in priceRangeList)
                {
                    if (pr.From == from && pr.To == to)
                        return Task.FromResult(pr);
                }
            }

            return Task.FromResult<PriceRange>(null);
        }

        /// <summary>
        /// Load price range filters
        /// </summary>
        /// <param name="priceRangeStr">Price range in string format</param>
        /// <param name="webHelper">Web helper</param>
        /// <param name="priceFormatter">Price formatter</param>
        public virtual async Task LoadPriceRangeFiltersAsync(string priceRangeStr, IWebHelper webHelper, IPriceFormatter priceFormatter)
        {
            var priceRangeList = GetPriceRangeList(priceRangeStr);
            if (priceRangeList.Any())
            {
                Enabled = true;

                var selectedPriceRange = await GetSelectedPriceRangeAsync(webHelper, priceRangeStr);

                Items = await priceRangeList.SelectAwait(async x =>
                {
                    //from&to
                    var item = new PriceRangeFilterItem();
                    if (x.From.HasValue)
                        item.From = await priceFormatter.FormatPriceAsync(x.From.Value, true, false);
                    if (x.To.HasValue)
                        item.To = await priceFormatter.FormatPriceAsync(x.To.Value, true, false);
                    var fromQuery = string.Empty;
                    if (x.From.HasValue)
                        fromQuery = x.From.Value.ToString(new CultureInfo("en-US"));
                    var toQuery = string.Empty;
                    if (x.To.HasValue)
                        toQuery = x.To.Value.ToString(new CultureInfo("en-US"));

                    //is selected?
                    if (selectedPriceRange != null
                        && selectedPriceRange.From == x.From
                        && selectedPriceRange.To == x.To)
                        item.Selected = true;

                    //filter URL
                    var url = webHelper.ModifyQueryString(webHelper.GetThisPageUrl(true), QUERYSTRINGPARAM, $"{fromQuery}-{toQuery}");
                    url = await ExcludeQueryStringParamsAsync(url, webHelper);
                    item.FilterUrl = url;

                    return item;
                }).ToListAsync();

                if (selectedPriceRange != null)
                {
                    //remove filter URL
                    var url = webHelper.RemoveQueryString(webHelper.GetThisPageUrl(true), QUERYSTRINGPARAM);
                    url = await ExcludeQueryStringParamsAsync(url, webHelper);
                    RemoveFilterUrl = url;
                }
            }
            else
            {
                Enabled = false;
            }
        }

        #endregion
    }
}
