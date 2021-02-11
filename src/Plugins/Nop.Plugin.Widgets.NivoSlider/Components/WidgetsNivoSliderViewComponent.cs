using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Nop.Core;
using Nop.Core.Caching;
using Nop.Plugin.Widgets.NivoSlider.Infrastructure.Cache;
using Nop.Plugin.Widgets.NivoSlider.Models;
using Nop.Services.Configuration;
using Nop.Services.Media;
using Nop.Web.Framework.Components;

namespace Nop.Plugin.Widgets.NivoSlider.Components
{
    [ViewComponent(Name = "WidgetsNivoSlider")]
    public class WidgetsNivoSliderViewComponent : NopViewComponent
    {
        private readonly IStoreContext _storeContext;
        private readonly IStaticCacheManager _staticCacheManager;
        private readonly ISettingService _settingService;
        private readonly IPictureService _pictureService;
        private readonly IWebHelper _webHelper;

        public WidgetsNivoSliderViewComponent(IStoreContext storeContext, 
            IStaticCacheManager staticCacheManager, 
            ISettingService settingService, 
            IPictureService pictureService,
            IWebHelper webHelper)
        {
            _storeContext = storeContext;
            _staticCacheManager = staticCacheManager;
            _settingService = settingService;
            _pictureService = pictureService;
            _webHelper = webHelper;
        }

        public async Task<IViewComponentResult> InvokeAsync(string widgetZone, object additionalData)
        {
            var nivoSliderSettings = await _settingService.LoadSettingAsync<NivoSliderSettings>((await _storeContext.GetCurrentStoreAsync()).Id);

            var model = new PublicInfoModel
            {
                Picture1Url = await GetPictureUrlAsync(nivoSliderSettings.Picture1Id),
                Text1 = nivoSliderSettings.Text1,
                Link1 = nivoSliderSettings.Link1,
                AltText1 = nivoSliderSettings.AltText1,

                Picture2Url = await GetPictureUrlAsync(nivoSliderSettings.Picture2Id),
                Text2 = nivoSliderSettings.Text2,
                Link2 = nivoSliderSettings.Link2,
                AltText2 = nivoSliderSettings.AltText2,

                Picture3Url = await GetPictureUrlAsync(nivoSliderSettings.Picture3Id),
                Text3 = nivoSliderSettings.Text3,
                Link3 = nivoSliderSettings.Link3,
                AltText3 = nivoSliderSettings.AltText3,

                Picture4Url = await GetPictureUrlAsync(nivoSliderSettings.Picture4Id),
                Text4 = nivoSliderSettings.Text4,
                Link4 = nivoSliderSettings.Link4,
                AltText4 = nivoSliderSettings.AltText4,

                Picture5Url = await GetPictureUrlAsync(nivoSliderSettings.Picture5Id),
                Text5 = nivoSliderSettings.Text5,
                Link5 = nivoSliderSettings.Link5,
                AltText5 = nivoSliderSettings.AltText5,

                Picture6Url = await GetPictureUrlAsync(nivoSliderSettings.Picture6Id),
                Text6 = nivoSliderSettings.Text6,
                Link6 = nivoSliderSettings.Link6,
                AltText6 = nivoSliderSettings.AltText6,

                Picture7Url = await GetPictureUrlAsync(nivoSliderSettings.Picture7Id),
                Text7 = nivoSliderSettings.Text7,
                Link7 = nivoSliderSettings.Link7,
                AltText7 = nivoSliderSettings.AltText7,

                Picture8Url = await GetPictureUrlAsync(nivoSliderSettings.Picture8Id),
                Text8 = nivoSliderSettings.Text8,
                Link8 = nivoSliderSettings.Link8,
                AltText8 = nivoSliderSettings.AltText8,

                Picture9Url = await GetPictureUrlAsync(nivoSliderSettings.Picture9Id),
                Text9 = nivoSliderSettings.Text9,
                Link9 = nivoSliderSettings.Link9,
                AltText9 = nivoSliderSettings.AltText9,

                Picture10Url = await GetPictureUrlAsync(nivoSliderSettings.Picture10Id),
                Text10 = nivoSliderSettings.Text10,
                Link10 = nivoSliderSettings.Link10,
                AltText10 = nivoSliderSettings.AltText10,
            };

            if (string.IsNullOrEmpty(model.Picture1Url) && string.IsNullOrEmpty(model.Picture2Url) &&
                string.IsNullOrEmpty(model.Picture3Url) && string.IsNullOrEmpty(model.Picture4Url) &&
                string.IsNullOrEmpty(model.Picture5Url) && string.IsNullOrEmpty(model.Picture6Url) &&
                string.IsNullOrEmpty(model.Picture7Url) && string.IsNullOrEmpty(model.Picture8Url) && 
                string.IsNullOrEmpty(model.Picture9Url) && string.IsNullOrEmpty(model.Picture10Url))
                //no pictures uploaded
                return Content("");

            return View("~/Plugins/Widgets.NivoSlider/Views/PublicInfo.cshtml", model);
        }

        protected async Task<string> GetPictureUrlAsync(int pictureId)
        {
            var cacheKey = _staticCacheManager.PrepareKeyForDefaultCache(ModelCacheEventConsumer.PICTURE_URL_MODEL_KEY, 
                pictureId, _webHelper.IsCurrentConnectionSecured() ? Uri.UriSchemeHttps : Uri.UriSchemeHttp);

            return await _staticCacheManager.GetAsync(cacheKey, async () =>
            {
                //little hack here. nulls aren't cacheable so set it to ""
                var url = await _pictureService.GetPictureUrlAsync(pictureId, showDefaultPicture: false) ?? "";
                return url;
            });
        }
    }
}
