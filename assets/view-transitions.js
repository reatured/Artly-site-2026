(function () {
  const viewTransitionRenderBlocker = document.getElementById('view-transition-render-blocker');
  // Do not hold ordinary navigation rendering behind view-transition consistency work.
  viewTransitionRenderBlocker?.remove();

  const idleCallback = typeof requestIdleCallback === 'function' ? requestIdleCallback : setTimeout;

  window.addEventListener('pageswap', async (event) => {
    const { viewTransition } = /** @type {PageSwapEvent} */ (event);

    if (shouldSkipViewTransition(viewTransition)) {
      /** @type {ViewTransition | null} */ (viewTransition)?.skipTransition();
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

    const transitionTriggered = document.querySelector('[data-view-transition-triggered]');
    const transitionType = transitionTriggered?.getAttribute('data-view-transition-type');

    if (transitionType) {
      idleCallback(() => {
        document
          .querySelectorAll('[data-view-transition-type]:not([data-view-transition-triggered])')
          .forEach((element) => {
            element.removeAttribute('data-view-transition-type');
          });
      });

      viewTransition.types.clear();
      viewTransition.types.add(transitionType);
      sessionStorage.setItem('custom-transition-type', transitionType);
    } else {
      viewTransition.types.clear();
      viewTransition.types.add('page-navigation');
      sessionStorage.removeItem('custom-transition-type');
    }
  });

  window.addEventListener('pagereveal', async (event) => {
    const { viewTransition } = /** @type {PageRevealEvent} */ (event);

    if (shouldSkipViewTransition(viewTransition)) {
      /** @type {ViewTransition | null} */ (viewTransition)?.skipTransition();
      return;
    }

    const customTransitionType = sessionStorage.getItem('custom-transition-type');

    if (customTransitionType) {
      viewTransition.types.clear();
      viewTransition.types.add(customTransitionType);

      viewTransition.finished
        .catch(() => {})
        .finally(() => {
          viewTransition.types.clear();
          viewTransition.types.add('page-navigation');

          idleCallback(() => {
            sessionStorage.removeItem('custom-transition-type');
            document.querySelectorAll('[data-view-transition-type]').forEach((element) => {
              element.removeAttribute('data-view-transition-type');
            });
          });
        });
    } else {
      viewTransition.types.clear();
      viewTransition.types.add('page-navigation');
    }
  });

  /**
   * @param {ViewTransition | null} viewTransition
   * @returns {viewTransition is null}
   */
  function shouldSkipViewTransition(viewTransition) {
    return !(viewTransition instanceof ViewTransition) || isLowPowerDevice();
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
