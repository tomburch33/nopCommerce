$(document).ready(function () {
  $('#tax-categories-grid').on('draw.dt', function () {
    if ($('body').hasClass('advanced-settings-mode')) {
      $('.onoffswitch-checkbox').trigger('click');
    }

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
      action() { window.location = '/Admin/Product/Create?showtour=True' },
    };

    //'Fixed Rate/By country' switch steps
    tour.addStep({
      title: AdminTourDataProvider.localized_data.TaxManualSwitchTitle,
      text: AdminTourDataProvider.localized_data.TaxManualSwitchText,
      attachTo: {
        element: '.onoffswitch',
        on: 'bottom'
      },
      buttons: [nextButton]
    });

    tour.addStep({
      title: AdminTourDataProvider.localized_data.TaxManualFixedTitle,
      text: AdminTourDataProvider.localized_data.TaxManualFixedText,
      attachTo: {
        element: '.onoffswitch',
        on: 'bottom'
      },
      buttons: [backButton, nextButton]
    });

    tour.addStep({
      title: AdminTourDataProvider.localized_data.TaxManualByCountryTitle,
      text: AdminTourDataProvider.localized_data.TaxManualByCountryText,
      attachTo: {
        element: '.onoffswitch',
        on: 'bottom'
      },
      buttons: [backButton, nextButton]
    });

    //'Tax categories' step
    tour.addStep({
      title: AdminTourDataProvider.localized_data.TaxManualCategoriesTitle,
      text: AdminTourDataProvider.localized_data.TaxManualCategoriesText,
      attachTo: {
        element: '#tax-categories-grid_wrapper',
        on: 'bottom'
      },
      buttons: [backButton, nextButton]
    });

    //'Edit rate' step
    var firstEditButtonId = "buttonEdit_tax_categories_grid1";

    if ($('#' + firstEditButtonId).length) {
      tour.addStep({
        title: AdminTourDataProvider.localized_data.TaxManualEditTitle,
        text: AdminTourDataProvider.localized_data.TaxManualEditText,
        attachTo: {
          element: '#' + firstEditButtonId,
          on: 'bottom'
        },
        buttons: [backButton, nextPageButton]
      });
    }

    //TODO: 'Manage tax categories' step
    //tour.addStep({
    //  title: 'Manage tax categories',
    //  text: 'Using the <b>Manage shipping methods</b> button you can add new shipping methods or delete the existing ones',
    //  attachTo: {
    //    element: '#manage-shipping-methods-button',
    //    on: 'bottom'
    //  },
    //  buttons: [
    //    {
    //      action() {
    //        return tour.back();
    //      },
    //      classes: 'button-back',
    //      text: '<i class="fa fa-arrow-left"></i> &nbsp; Back'
    //    },
    //    {
    //      action() {
    //        return tour.cancel();
    //      },
    //      classes: 'button-done',
    //      text: 'Done',
    //      secondary: true
    //    }
    //  ],
    //});

    tour.start();

  });
})