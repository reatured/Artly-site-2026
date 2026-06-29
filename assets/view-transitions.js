(function () {
  const reducedMotionMedia =
    typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  window.addEventListener('pageswap', async (event) => {
    const { viewTransition } = /** @type {PageSwapEvent} */ (event);

    if (shouldSkipViewTransition(viewTransition)) {
      viewTransition?.skipTransition?.();
      return;
    }

    // Cancel view transition on user interaction to improve INP (Interaction to Next Paint)
    ['pointerdown', 'keydown'].forEach((eventName) => {
      document.addEventListener(
        eventName,
        () => {
          viewTransition.skipTransition();
        },
        { once: true }
      );
    });

    // Derive the transition type from DOM attributes set by feature-specific
    // code (e.g. product-image-transition on product cards). Falls back to the
    // default page-navigation type when nothing is declared.
    const transitionTriggered = document.querySelector('[data-view-transition-type]');
    const transitionType = transitionTriggered?.getAttribute('data-view-transition-type') || 'page-navigation';

    viewTransition.types.clear();
    viewTransition.types.add(transitionType);
  });

  window.addEventListener('pagereveal', async (event) => {
    const { viewTransition } = /** @type {PageRevealEvent} */ (event);

    if (shouldSkipViewTransition(viewTransition)) {
      viewTransition?.skipTransition?.();
      return;
    }

    viewTransition.types.clear();
    viewTransition.types.add('page-navigation');
  });

  /**
   * @param {ViewTransition | null} viewTransition
   * @returns {boolean}
   */
  function shouldSkipViewTransition(viewTransition) {
    return !isViewTransition(viewTransition) || prefersReducedMotion() || isLowPowerDevice();
  }

  /**
   * @param {ViewTransition | null} viewTransition
   * @returns {boolean}
   */
  function isViewTransition(viewTransition) {
    return typeof ViewTransition === 'function' && viewTransition instanceof ViewTransition;
  }

  function prefersReducedMotion() {
    return reducedMotionMedia?.matches === true;
  }

  /*
   * We can't import this logic from utilities.js here, but we should keep them in sync.
   */
  function isLowPowerDevice() {
    /* Skip ESLint compatibility check. Number(undefined) <= 2 is always false anyway. */
    /* eslint-disable-next-line compat/compat */
    return Number(navigator.hardwareConcurrency) <= 2 || Number(navigator.deviceMemory) <= 2;
  }
})();
