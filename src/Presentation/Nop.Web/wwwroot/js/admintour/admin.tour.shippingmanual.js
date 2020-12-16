$(document).ready(function () {
  $('#shipping-rate-grid').on('draw.dt', function () {
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
      action() { window.location = '/Admin/Payment/Methods?showtour=True' },
    };

    //'Fixed Rate/By Weight' switch steps
    tour.addStep({
      title: AdminTourDataProvider.localized_data.ConfigureManualSwitchTitle,
      text: AdminTourDataProvider.localized_data.ConfigureManualSwitchText,
      attachTo: {
        element: '.onoffswitch',
        on: 'bottom'
      },
      buttons: [nextButton]
    });

    tour.addStep({
      title: AdminTourDataProvider.localized_data.ConfigureManualFixedRateTitle,
      text: AdminTourDataProvider.localized_data.ConfigureManualFixedRateText,
      attachTo: {
        element: '.onoffswitch',
        on: 'bottom'
      },
      buttons: [backButton, nextButton]
    });

    tour.addStep({
      title: AdminTourDataProvider.localized_data.ConfigureManualByWeightTitle,
      text: AdminTourDataProvider.localized_data.ConfigureManualByWeightText,
      attachTo: {
        element: '.onoffswitch',
        on: 'bottom'
      },
      buttons: [backButton, nextButton]
    });


    //'Shipping methods' step
    tour.addStep({
      title: AdminTourDataProvider.localized_data.ConfigureManualMethodsTitle,
      text: AdminTourDataProvider.localized_data.ConfigureManualMethodsText,
      attachTo: {
        element: '#shipping-rate-grid_wrapper',
        on: 'bottom'
      },
      buttons: [backButton, nextButton]
    });

    //'Edit rate' step
    var firstEditButtonId = "buttonEdit_shipping_rate_grid1";

    if ($('#' + firstEditButtonId).length) {
      tour.addStep({
        title: AdminTourDataProvider.localized_data.ConfigureManualEditTitle,
        text: AdminTourDataProvider.localized_data.ConfigureManualEditText,
        attachTo: {
          element: '#' + firstEditButtonId,
          on: 'bottom'
        },
        buttons: [backButton, nextButton]
      });
    }

    //'Manage shipping methods' step
    tour.addStep({
      title: AdminTourDataProvider.localized_data.ConfigureManualManageTitle,
      text: AdminTourDataProvider.localized_data.ConfigureManualManageText,
      attachTo: {
        element: '#manage-shipping-methods-button',
        on: 'bottom'
      },
      buttons: [backButton, nextPageButton]
    });

    tour.start();
  });
})