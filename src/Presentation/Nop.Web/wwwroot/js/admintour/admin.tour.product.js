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
    action() { window.location = '/Admin/EmailAccount/List?showtour=True' },
  };

  //'Settings button' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.ProductSettingsButtonTitle,
    text: AdminTourDataProvider.localized_data.ProductSettingsButtonText,
    attachTo: {
      element: '#product-editor-settings',
      on: 'bottom'
    },
    buttons: [nextButton]
  });

  //'Product details' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.ProductDetailsTitle,
    text: AdminTourDataProvider.localized_data.ProductDetailsText,
    attachTo: {
      element: '#product-details-area',
      on: 'bottom'
    },
    classes: 'step-with-image',
    buttons: [backButton, nextButton]
  });

  //'Product price' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.ProductPriceTitle,
    text: AdminTourDataProvider.localized_data.ProductPriceText,
    attachTo: {
      element: '#product-price-area',
      on: 'bottom'
    },
    buttons: [backButton, nextButton]
  });

  //'Product tax category' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.ProductTaxTitle,
    text: AdminTourDataProvider.localized_data.ProductTaxText,
    attachTo: {
      element: '#product-tax-area',
      on: 'bottom'
    },
    buttons: [backButton, nextButton]
  });

  //'Product shipping info' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.ProductShippingTitle,
    text: AdminTourDataProvider.localized_data.ProductShippingText,
    attachTo: {
      element: '#product-shipping-area',
      on: 'bottom'
    },
    buttons: [backButton, nextButton]
  });

  //'Product inventory' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.ProductInventoryTitle,
    text: AdminTourDataProvider.localized_data.ProductInventoryText,
    attachTo: {
      element: '#product-inventory-area',
      on: 'bottom'
    },
    buttons: [backButton, nextButton]
  });

  //'Product pictures' step
  tour.addStep({
    title: AdminTourDataProvider.localized_data.ProductPicturesTitle,
    text: AdminTourDataProvider.localized_data.ProductPicturesText,
    attachTo: {
      element: '#product-pictures-area',
      on: 'bottom'
    },
    buttons: [backButton, nextPageButton]
  });

  tour.start();
})