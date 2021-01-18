$(document).ready(function () {
  $('#shippingproviders-grid').on('draw.dt', function () {
    const tour = new Shepherd.Tour(AdminTourCommonTourOptions);

    AdminTourNextPageButton.action = function () { window.location = '/Admin/FixedByWeightByTotal/Configure?showtour=true' };

    var manualMethodRowId = 'row_shippingfixedbyweightbytotal';
    var shipStationMethodRowId = 'row_shippingshipstation';

    var manualMethodExists = $('#' + manualMethodRowId).length;
    var shipStationMethodExists = $('#' + shipStationMethodRowId).length;

    //'Set up shipping' step
    var shippingMethodStepButtons = [];
    if (!manualMethodExists && !shipStationMethodExists) {
      shippingMethodStepButtons = [AdminTourNextPageButton]
    } else {
      shippingMethodStepButtons = [AdminTourNextButton]
    }

    tour.addStep({
      title: AdminTourDataProvider.localized_data.ShippingProvidersProvidersTitle,
      text: AdminTourDataProvider.localized_data.ShippingProvidersProvidersText,
      attachTo: {
        element: '#shipping-methods-area',
        on: 'bottom'
      },
      buttons: shippingMethodStepButtons
    });

    //'Manual shipping provider' step
    if (manualMethodExists) {
      tour.addStep({
        title: AdminTourDataProvider.localized_data.ShippingProvidersManualTitle,
        text: AdminTourDataProvider.localized_data.ShippingProvidersManualText,
        attachTo: {
          element: '#' + manualMethodRowId,
          on: 'bottom'
        },
        buttons: [AdminTourBackButton, AdminTourNextButton]
      });
    }

    //'ShipStation shipping provider' step
    if (shipStationMethodExists) {
      var shipStationStepButtons = [AdminTourBackButton];
      if (manualMethodExists) {
        shipStationStepButtons.push(AdminTourNextButton);
      } else {
        shipStationStepButtons.push(AdminTourNextPageButton);
      }

      tour.addStep({
        title: AdminTourDataProvider.localized_data.ShippingProvidersShipStationTitle,
        text: AdminTourDataProvider.localized_data.ShippingProvidersShipStationText,
        attachTo: {
          element: '#' + shipStationMethodRowId,
          on: 'bottom'
        },
        buttons: shipStationStepButtons,
      });
    }

    //Redirect to Manual
    if (manualMethodExists) {
      tour.addStep({
        canClickTarget: true,
        title: AdminTourDataProvider.localized_data.ShippingProvidersConfigureTitle,
        text: AdminTourDataProvider.localized_data.ShippingProvidersConfigureText,
        attachTo: {
          element: '#' + manualMethodRowId + ' .column-configure .btn-default',
          on: 'bottom'
        },
        buttons: [AdminTourBackButton, AdminTourNextPageButton]
      });
    }

    tour.start();
  });
})