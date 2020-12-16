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
    action() { window.location = '/Admin/Shipping/Providers?showtour=True' },
  };

  //'Your store name' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.StoreNameTitle,
    text: AdminTourDataProvider.localized_data.StoreNameText,
    attachTo: {
      element: '#store-name-area',
      on: 'bottom'
    },
    buttons: [nextButton]
  });

  //'Your store URL' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.StoreUrlTitle,
    text: AdminTourDataProvider.localized_data.StoreUrlText,
    attachTo: {
      element: '#store-url-area',
      on: 'bottom'
    },
    buttons: [backButton, nextButton]
  });

  //'Enable SSL' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.StoreSslTitle,
    text: AdminTourDataProvider.localized_data.StoreSslText,
    attachTo: {
      element: '#ssl-area',
      on: 'bottom'
    },
    buttons: [backButton, nextPageButton]
  });

  tour.start();
})