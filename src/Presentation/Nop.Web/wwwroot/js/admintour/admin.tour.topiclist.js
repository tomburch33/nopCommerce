$(document).ready(function () {
  $('#topics-grid').on('draw.dt', function () {
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
      action() { window.location = '/Admin/Topic/Edit/' + AdminTourDataProvider.next_button_entity_id + '?showtour=True' }
    };

    //'Topics (pages)' step
    tour.addStep({
      title: AdminTourDataProvider.localized_data.TopicListTopics1Title,
      text: AdminTourDataProvider.localized_data.TopicListTopics1Text,
      attachTo: {
        element: '#topics-area',
        on: 'bottom'
      },
      buttons: [nextButton]
    });

    //'Topics (pages)' step
    tour.addStep({
      title: AdminTourDataProvider.localized_data.TopicListTopics2Title,
      text: AdminTourDataProvider.localized_data.TopicListTopics2Text,
      attachTo: {
        element: '#topics-area',
        on: 'bottom'
      },
      buttons: [backButton, nextButton]
    });

    var shippingTopicRowId = 'row_shippinginfo';

    //'Shipping info' step
    tour.addStep({
      title: AdminTourDataProvider.localized_data.TopicListShippingTitle,
      text: AdminTourDataProvider.localized_data.TopicListShippingText,
      attachTo: {
        element: '#' + shippingTopicRowId,
        on: 'bottom'
      },
      buttons: [backButton, nextButton]
    });

    //'Link location' step
    tour.addStep({
      title: AdminTourDataProvider.localized_data.TopicListLocationTitle,
      text: AdminTourDataProvider.localized_data.TopicListLocationText,
      attachTo: {
        element: '#' + shippingTopicRowId + ' .column-footer-column1',
        on: 'bottom'
      },
      buttons: [backButton, nextButton]
    });

    //'Edit the page' step
    tour.addStep({
      canClickTarget: true,
      title: AdminTourDataProvider.localized_data.TopicListEditTitle,
      text: AdminTourDataProvider.localized_data.TopicListEditText,
      attachTo: {
        element: '#' + shippingTopicRowId + ' .column-edit .btn',
        on: 'bottom'
      },
      buttons: [backButton, nextPageButton]
    });

    tour.start();
  });
})