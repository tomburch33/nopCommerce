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
    action() { window.location = '/Admin/Store/Edit/' + AdminTourDataProvider.next_button_entity_id + '?showtour=True' },
  };

  //'Welcome' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.PersonalizeStoreIntroTitle,
    text: AdminTourDataProvider.localized_data.PersonalizeStoreIntroText,
    buttons: [nextButton]
  });

  //'Basic/Advanced mode' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.PersonalizeStoreBasicAdvancedTitle,
    text: AdminTourDataProvider.localized_data.PersonalizeStoreBasicAdvancedText,
    attachTo: {
      element: '.onoffswitch',
      on: 'auto'
    },
    buttons: [backButton, nextButton]
  });

  //'Choose a theme' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.PersonalizeStoreThemeTitle,
    text: AdminTourDataProvider.localized_data.PersonalizeStoreThemeText,
    attachTo: {
      element: '#theme-area',
      on: 'auto'
    },
    buttons: [backButton, nextButton]
  });

  //'Upload your logo' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.PersonalizeStoreLogoTitle,
    text: AdminTourDataProvider.localized_data.PersonalizeStoreLogoText,
    attachTo: {
      element: '#logo-area',
      on: 'auto'
    },
    buttons: [backButton, nextPageButton]
  });

  tour.start();
})