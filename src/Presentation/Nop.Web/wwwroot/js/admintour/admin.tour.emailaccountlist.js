$(document).ready(function () {
  $('#email-accounts-grid').on('draw.dt', function () {
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
      action() { window.location = '/Admin/EmailAccount/Edit/' + AdminTourDataProvider.next_button_entity_id + '?showtour=True' },
    };

    //'Email accounts' step
    tour.addStep({
      title: AdminTourDataProvider.localized_data.EmailAccountListEmailAccounts1Title,
      text: AdminTourDataProvider.localized_data.EmailAccountListEmailAccounts1Text,
      attachTo: {
        element: '#email-accounts-area',
        on: 'bottom'
      },
      buttons: [nextButton]
    });


    //'Email accounts' step
    tour.addStep({
      title: AdminTourDataProvider.localized_data.EmailAccountListEmailAccounts2Title,
      text: AdminTourDataProvider.localized_data.EmailAccountListEmailAccounts2Text,
      attachTo: {
        element: '#email-accounts-area',
        on: 'bottom'
      },
      buttons: [backButton, nextButton]
    });

    var defaultEmailAccountRowId = 'row_testmailcom';

    //'Default email account' step
    tour.addStep({
      title: AdminTourDataProvider.localized_data.EmailAccountListDefaultEmailAccountTitle,
      text: AdminTourDataProvider.localized_data.EmailAccountListDefaultEmailAccountText,
      attachTo: {
        element: '#' + defaultEmailAccountRowId + ' .column-default .btn',
        on: 'bottom'
      },
      buttons: [backButton, nextButton]
    });

    //'Edit an email account' step
    tour.addStep({
      canClickTarget: true,
      title: AdminTourDataProvider.localized_data.EmailAccountListEditTitle,
      text: AdminTourDataProvider.localized_data.EmailAccountListEditText,
      attachTo: {
        element: '#' + defaultEmailAccountRowId + ' .column-edit .btn',
        on: 'bottom'
      },
      buttons: [backButton, nextPageButton]
    });

    tour.start();
  });
})