$(document).ready(function () {
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
    action() { window.location = '/Admin/Topic/List?showtour=True' },
  };

  //'Email address' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.EmailAccountEmailAddressTitle,
    text: AdminTourDataProvider.localized_data.EmailAccountEmailAddressText,
    attachTo: {
      element: '#email-area',
      on: 'bottom'
    },
    buttons: [nextButton]
  });

  //'Email display name' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.EmailAccountDisplayNameTitle,
    text: AdminTourDataProvider.localized_data.EmailAccountDisplayNameText,
    attachTo: {
      element: '#display-name-area',
      on: 'bottom'
    },
    buttons: [backButton, nextButton]
  });

  //'Host' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.EmailAccountHostTitle,
    text: AdminTourDataProvider.localized_data.EmailAccountHostText,
    attachTo: {
      element: '#host-area',
      on: 'bottom'
    },
    buttons: [backButton, nextButton]
  });

  //'Port' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.EmailAccountPortTitle,
    text: AdminTourDataProvider.localized_data.EmailAccountPortText,
    attachTo: {
      element: '#port-area',
      on: 'bottom'
    },
    buttons: [backButton, nextButton]
  });

  //'Username' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.EmailAccountUsernameTitle,
    text: AdminTourDataProvider.localized_data.EmailAccountUsernameText,
    attachTo: {
      element: '#username-area',
      on: 'bottom'
    },
    buttons: [backButton, nextButton]
  });

  //'Password' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.EmailAccountPasswordTitle,
    text: AdminTourDataProvider.localized_data.EmailAccountPasswordText,
    attachTo: {
      element: '#password-area',
      on: 'bottom'
    },
    buttons: [backButton, nextButton]
  });

  //'SSL' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.EmailAccountUseSslTitle,
    text: AdminTourDataProvider.localized_data.EmailAccountUseSslText,
    attachTo: {
      element: '#ssl-area',
      on: 'bottom'
    },
    buttons: [backButton, nextButton]
  });

  //'Use default credentials' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.EmailAccountDefaultCredentialsTitle,
    text: AdminTourDataProvider.localized_data.EmailAccountDefaultCredentialsText,
    attachTo: {
      element: '#default-area',
      on: 'bottom'
    },
    buttons: [backButton, nextButton]
  });

  //'Send test email' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.EmailAccountTestEmailTitle,
    text: AdminTourDataProvider.localized_data.EmailAccountTestEmailText,
    attachTo: {
      element: '#test-email-area',
      on: 'bottom'
    },
    buttons: [backButton, nextPageButton]
  });

  tour.start();
})