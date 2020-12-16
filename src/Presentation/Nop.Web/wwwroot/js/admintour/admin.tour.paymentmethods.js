$(document).ready(function () {
  $('#paymentmethods-grid').on('draw.dt', function () {
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
      action() { window.location = '/Admin/Tax/Providers?showtour=True' }
    };

    var checkMoneyMethodRowId = 'row_paymentscheckmoneyorder';
    var manualMethodRowId = 'row_paymentsmanual';
    var paypalButtonsMethodRowId = 'row_paymentspaypalsmartpaymentbuttons';

    var checkMoneyMethodExists = $('#' + checkMoneyMethodRowId).length;
    var manualMethodExists = $('#' + manualMethodRowId).length;
    var paypalButtonsMethodExists = $('#' + paypalButtonsMethodRowId).length;

    //'Payment methods' step
    var paymentMethodsStepButtons = [];
    if (!checkMoneyMethodExists && !manualMethodExists && paypalButtonsMethodExists) {
      paymentMethodsStepButtons = [nextPageButton]
    } else {
      paymentMethodsStepButtons = [nextButton]
    }

    tour.addStep({
      title: AdminTourDataProvider.localized_data.PaymentMethodsPaymentMethodsTitle,
      text: AdminTourDataProvider.localized_data.PaymentMethodsPaymentMethodsText,
      attachTo: {
        element: '#payment-methods-area',
        on: 'bottom'
      },
      buttons: paymentMethodsStepButtons
    });

    //'Check/Money Order' step
    if (checkMoneyMethodExists) {
      tour.addStep({
        title: AdminTourDataProvider.localized_data.PaymentMethodsCheckMoneyTitle,
        text: AdminTourDataProvider.localized_data.PaymentMethodsCheckMoneyText,
        attachTo: {
          element: '#' + checkMoneyMethodRowId,
          on: 'bottom'
        },
        buttons: [backButton, nextButton]
      });
    }

    //'Manual' step
    if (manualMethodExists) {
      tour.addStep({
        title: AdminTourDataProvider.localized_data.PaymentMethodsManualTitle,
        text: AdminTourDataProvider.localized_data.PaymentMethodsManualText,
        attachTo: {
          element: '#' + manualMethodRowId,
          on: 'bottom'
        },
        buttons: [backButton, nextButton]
      });
    }

    //'PayPal Smart Payment Buttons' step
    if (paypalButtonsMethodExists) {
      tour.addStep({
        title: AdminTourDataProvider.localized_data.PaymentMethodsPayPalTitle,
        text: AdminTourDataProvider.localized_data.PaymentMethodsPayPalText,
        attachTo: {
          element: '#' + paypalButtonsMethodRowId,
          on: 'bottom'
        },
        buttons: [backButton, nextButton]
      });
    }

    //'Configure a payment method' step
    tour.addStep({
      title: AdminTourDataProvider.localized_data.PaymentMethodsConfigureTitle,
      text: AdminTourDataProvider.localized_data.PaymentMethodsConfigureText,
      attachTo: {
        element: '#' + paypalButtonsMethodRowId + ' .column-configure .btn-default',
        on: 'bottom'
      },
      buttons: [backButton, nextPageButton]
    });

    tour.start();
  });
})