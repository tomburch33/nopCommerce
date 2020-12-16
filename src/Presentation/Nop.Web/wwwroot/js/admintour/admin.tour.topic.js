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

  var doneButton = {
    classes: 'button-done',
    text: AdminTourDataProvider.localized_data.Done,
    action() { return tour.cancel(); }
  };

  //'Title and content' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.TopicTitleContentTitle,
    text: AdminTourDataProvider.localized_data.TopicTitleContentText,
    attachTo: {
      element: '#info-area',
      on: 'bottom'
    },
    buttons: [nextButton]
  });

  //'Preview the page' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.TopicPreviewTitle,
    text: AdminTourDataProvider.localized_data.TopicPreviewText,
    attachTo: {
      element: '#preview-topic-button',
      on: 'bottom'
    },
    buttons: [backButton, doneButton]
  });

  tour.start();
})