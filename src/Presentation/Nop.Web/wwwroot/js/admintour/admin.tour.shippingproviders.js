$(document).ready(function () {
  $('#shippingproviders-grid').on('draw.dt', function () {
    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        canClickTarget: false,
        popperOptions: {
          modifiers: [{
            name: 'offset',
            options: {
              offset: [0, 15],
            },
          }],
        },
        classes: 'admin-area-tour',
        cancelIcon: {
          enabled: true
        },
        modalOverlayOpeningPadding: '3',
        scrollTo: { behavior: 'smooth', block: 'center' },
        when: {
          show() {
            const currentStepElement = tour.currentStep.el;
            const header = currentStepElement.querySelector('.shepherd-header');
            const progress = document.createElement('span');
            progress.className = "shepherd-progress";
            progress.innerText = `${tour.steps.indexOf(tour.currentStep) + 1}/${tour.steps.length}`;
            header.insertBefore(progress, currentStepElement.querySelector('.shepherd-title'));
          }
        }
      }
    });

    var backButton = {
      classes: 'button-back',
      text: '<i class="fa fa-chevron-left"></i>' + '<div class="button-text">' + AdminTourDataProvider.localized_data.Back + '</div>',
      secondary: true,
      action() { return tour.back(); }
    };

    var nextButton = {
      classes: 'button-next',
      text: '<div class="button-text">' + AdminTourDataProvider.localized_data.NextStep + '</div>' + '<i class="fa fa-chevron-right"></i>',
      action() { return tour.next(); }
    };

    var nextPageButton = {
      classes: 'button-next-page',
      text: '<div class="button-text">' + AdminTourDataProvider.localized_data.NextPage + '</div>' + ' <i class="fa fa-angle-double-right"></i>',
      action() { window.location = '/Admin/FixedByWeightByTotal/Configure?showtour=true' },
    };

    var manualMethodRowId = 'row_shippingfixedbyweightbytotal';
    var shipStationMethodRowId = 'row_shippingshipstation';

    var manualMethodExists = $('#' + manualMethodRowId).length;
    var shipStationMethodExists = $('#' + shipStationMethodRowId).length;

    //'Set up shipping' step
    var shippingMethodStepButtons = [];
    if (!manualMethodExists && !shipStationMethodExists) {
      shippingMethodStepButtons = [nextPageButton]
    } else {
      shippingMethodStepButtons = [nextButton]
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
        buttons: [backButton, nextButton]
      });
    }

    //'ShipStation shipping provider' step
    if (shipStationMethodExists) {
      var shipStationStepButtons = [backButton];
      if (manualMethodExists) {
        shipStationStepButtons.push(nextButton);
      } else {
        shipStationStepButtons.push(nextPageButton);
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
        buttons: [backButton, nextPageButton]
      });
    }

    tour.start();
  });
})