$(document).ready(function () {
  $('#tax-providers-grid').on('draw.dt', function () {
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
      action() { window.location = '/Admin/FixedOrByCountryStateZip/Configure?showtour=true' },
    };

    var manualMethodRowId = 'row_taxfixedorbycountrystatezip';
    var avalaraMethodRowId = 'row_taxavalara';

    var manualMethodExists = $('#' + manualMethodRowId).length;
    var avalaraMethodExists = $('#' + avalaraMethodRowId).length;

    //'Tax providers' step
    var taxProvidersStepButtons = [];
    if (!manualMethodExists && !avalaraMethodExists) {
      taxProvidersStepButtons = [nextPageButton]
    } else {
      taxProvidersStepButtons = [nextButton]
    }

    tour.addStep({
      title: AdminTourDataProvider.localized_data.TaxProvidersTaxProvidersTitle,
      text: AdminTourDataProvider.localized_data.TaxProvidersTaxProvidersText,
      attachTo: {
        element: '#tax-providers-area',
        on: 'bottom'
      },
      buttons: taxProvidersStepButtons
    });

    //'Avalara tax provider' step
    if (avalaraMethodExists) {
      tour.addStep({
        title: AdminTourDataProvider.localized_data.TaxProvidersAvalaraTitle,
        text: AdminTourDataProvider.localized_data.TaxProvidersAvalaraText,
        attachTo: {
          element: '#' + avalaraMethodRowId,
          on: 'bottom'
        },
        buttons: [backButton, nextButton]
      });
    }

    //'Manual tax provider' step
    if (manualMethodExists) {
      tour.addStep({
        title: AdminTourDataProvider.localized_data.TaxProvidersManualTitle,
        text: AdminTourDataProvider.localized_data.TaxProvidersManualText,
        attachTo: {
          element: '#' + manualMethodRowId,
          on: 'bottom'
        },
        buttons: [backButton, nextButton]
      });
    }

    //'Mark as a primary provider' step
    if (manualMethodExists) {
      tour.addStep({
        title: AdminTourDataProvider.localized_data.TaxProvidersPrimaryProviderTitle,
        text: AdminTourDataProvider.localized_data.TaxProvidersPrimaryProviderText,
        attachTo: {
          element: '#' + manualMethodRowId + ' .column-primary .btn',
          on: 'bottom'
        },
        buttons: [backButton, nextButton]
      });
    }

    //Redirect to Manual
    if (manualMethodExists) {
      tour.addStep({
        canClickTarget: true,
        title: AdminTourDataProvider.localized_data.TaxProvidersConfigureTitle,
        text: AdminTourDataProvider.localized_data.TaxProvidersConfigureText,
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