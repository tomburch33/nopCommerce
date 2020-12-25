namespace Nop.Core.Caching
{
    /// <summary>
    /// Represents default values related to caching
    /// </summary>
    public static partial class NopCacheDefaults
    {
        /// <summary>
        /// Gets an algorithm used to create the hash value of identifiers need to cache
        /// </summary>
        public static string HashAlgorithm => "SHA1";
    }
}