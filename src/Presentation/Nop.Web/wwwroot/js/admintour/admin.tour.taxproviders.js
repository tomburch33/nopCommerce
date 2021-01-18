$(document).ready(function () {
  $('#tax-providers-grid').on('draw.dt', function () {
    const tour = new Shepherd.Tour(AdminTourCommonTourOptions);

    AdminTourNextPageButton.action = function () { window.location = '/Admin/FixedOrByCountryStateZip/Configure?showtour=true' };

    var manualMethodRowId = 'row_taxfixedorbycountrystatezip';
    var avalaraMethodRowId = 'row_taxavalara';

    var manualMethodExists = $('#' + manualMethodRowId).length;
    var avalaraMethodExists = $('#' + avalaraMethodRowId).length;

    //'Tax providers' step
    var taxProvidersStepButtons = [];
    if (!manualMethodExists && !avalaraMethodExists) {
      taxProvidersStepButtons = [AdminTourNextPageButton]
    } else {
      taxProvidersStepButtons = [AdminTourNextButton]
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
        buttons: [AdminTourBackButton, AdminTourNextButton]
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
        buttons: [AdminTourBackButton, AdminTourNextButton]
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
        buttons: [AdminTourBackButton, AdminTourNextButton]
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
        buttons: [AdminTourBackButton, AdminTourNextPageButton]
      });
    }

    tour.start();
  });
})