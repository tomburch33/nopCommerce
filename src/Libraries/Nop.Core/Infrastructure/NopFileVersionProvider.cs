using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Caching.Memory;
using Nop.Core.Caching;

namespace Nop.Core.Infrastructure
{
    /// <summary>
    /// Represents custom implementation of provider that provides version hash for a specified file
    /// </summary>
    public partial class NopFileVersionProvider : IFileVersionProvider
    {
        #region Fields

        //TODO: can we use IStaticCacheManager here?
        private readonly IMemoryCache _cache;
        private readonly INopFileProvider _nopFileProvider;
        private readonly IWebHostEnvironment _webHostEnvironment;

        private static readonly char[] _queryStringAndFragmentTokens = new[] { '?', '#' };
        private const string VERSION_KEY = "v";

        #endregion

        #region Ctor

        public NopFileVersionProvider(IMemoryCache memoryCache,
            INopFileProvider nopFileProvider,
            IWebHostEnvironment webHostEnvironment)
        {
            _cache = memoryCache;
            _nopFileProvider = nopFileProvider;
            _webHostEnvironment = webHostEnvironment;
        }

        #endregion

        #region Methods

        /// <summary>
        /// Adds version query parameter to the specified file path
        /// </summary>
        /// <param name="requestPathBase">The base path for the current HTTP request</param>
        /// <param name="path">The path of the file to which version should be added</param>
        /// <returns>Path containing the version query string</returns>
        public string AddFileVersionToPath(PathString requestPathBase, string path)
        {
            if (path == null)
                throw new ArgumentNullException(nameof(path));

            //clean the path
            var cleanPath = path;
            var queryStringOrFragmentStartIndex = path.IndexOfAny(_queryStringAndFragmentTokens);
            if (queryStringOrFragmentStartIndex != -1)
                cleanPath = path.Substring(0, queryStringOrFragmentStartIndex);

            //don't append version if the path is absolute
            if (Uri.TryCreate(cleanPath, UriKind.Absolute, out var uri) && !uri.IsFile)
                return path;

            if (_cache.TryGetValue(path, out string value))
                return value;

            new PathString(cleanPath).StartsWithSegments(requestPathBase, out var requestPath);

            //check whether the file exists in the root directory
            var filePath = _nopFileProvider.MapPath(requestPath);
            var physicalFileProvider = _webHostEnvironment.ContentRootFileProvider;
            if (!_nopFileProvider.FileExists(filePath))
            {
                //then check in the web content directory
                filePath = _nopFileProvider.GetAbsolutePath(requestPath);
                physicalFileProvider = _webHostEnvironment.WebRootFileProvider;
            }
            if (!_nopFileProvider.FileExists(filePath))
                return path;

            //prepare file version based on its content and cache this value
            var cacheEntryOptions = new MemoryCacheEntryOptions();
            cacheEntryOptions.AddExpirationToken(physicalFileProvider.Watch(requestPath));
            var hash = HashHelper.CreateHash(_nopFileProvider.ReadAllBytesAsync(filePath).Result, NopCacheDefaults.HashAlgorithm);
            value = QueryHelpers.AddQueryString(path, VERSION_KEY, hash);
            _cache.Set(path, value, cacheEntryOptions);

            return value;
        }

        #endregion
    }
}