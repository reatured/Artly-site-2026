(function () {
  const viewTransitionRenderBlocker = document.getElementById('view-transition-render-blocker');
  // Do not hold ordinary navigation rendering behind view-transition consistency work.
  viewTransitionRenderBlocker?.remove();

  const idleCallback = typeof requestIdleCallback === 'function' ? requestIdleCallback : setTimeout;
  const reducedMotionMedia =
    typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const CUSTOM_TRANSITION_STORAGE_KEY = 'custom-transition-type';
  const CUSTOM_TRANSITION_STORAGE_AT_KEY = 'custom-transition-type-at';
  const STORED_TRANSITION_TTL = 1000;
  const STORED_TRANSITION_CLEANUP_DELAY = 1500;

  window.addEventListener('pageswap', async (event) => {
    const { viewTransition } = /** @type {PageSwapEvent} */ (event);

    if (shouldSkipViewTransition(viewTransition)) {
      viewTransition?.skipTransition?.();
      clearCustomTransitionState();
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
    const transitionType =
      transitionTriggered?.getAttribute('data-view-transition-type') ||
      sessionStorage.getItem(CUSTOM_TRANSITION_STORAGE_KEY);

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
      sessionStorage.setItem(CUSTOM_TRANSITION_STORAGE_KEY, transitionType);
      sessionStorage.setItem(CUSTOM_TRANSITION_STORAGE_AT_KEY, Date.now().toString());
    } else {
      viewTransition.types.clear();
      viewTransition.types.add('page-navigation');
      sessionStorage.removeItem(CUSTOM_TRANSITION_STORAGE_KEY);
      sessionStorage.removeItem(CUSTOM_TRANSITION_STORAGE_AT_KEY);
    }
  });

  window.addEventListener('pagereveal', async (event) => {
    const { viewTransition } = /** @type {PageRevealEvent} */ (event);

    if (shouldSkipViewTransition(viewTransition)) {
      viewTransition?.skipTransition?.();
      clearCustomTransitionState();
      return;
    }

    const customTransitionType = sessionStorage.getItem(CUSTOM_TRANSITION_STORAGE_KEY);

    if (customTransitionType) {
      viewTransition.types.clear();
      viewTransition.types.add(customTransitionType);

      viewTransition.finished
        .catch(() => {})
        .finally(() => {
          viewTransition.types.clear();
          viewTransition.types.add('page-navigation');

          idleCallback(() => {
            sessionStorage.removeItem(CUSTOM_TRANSITION_STORAGE_KEY);
            document.querySelectorAll('[data-view-transition-type], [data-view-transition-triggered]').forEach((element) => {
              element.removeAttribute('data-view-transition-type');
              element.removeAttribute('data-view-transition-triggered');
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

  function clearCustomTransitionState() {
    sessionStorage.removeItem(CUSTOM_TRANSITION_STORAGE_KEY);
    sessionStorage.removeItem(CUSTOM_TRANSITION_STORAGE_AT_KEY);
    document.querySelectorAll('[data-view-transition-type], [data-view-transition-triggered]').forEach((element) => {
      element.removeAttribute('data-view-transition-type');
      element.removeAttribute('data-view-transition-triggered');
    });
  }

  function clearStaleStoredTransitionType() {
    const storedAt = Number(sessionStorage.getItem(CUSTOM_TRANSITION_STORAGE_AT_KEY) || 0);

    if (!storedAt || Date.now() - storedAt > STORED_TRANSITION_TTL) {
      sessionStorage.removeItem(CUSTOM_TRANSITION_STORAGE_KEY);
      sessionStorage.removeItem(CUSTOM_TRANSITION_STORAGE_AT_KEY);
      return;
    }

    setTimeout(clearStaleStoredTransitionType, STORED_TRANSITION_TTL);
  }

  setTimeout(clearStaleStoredTransitionType, STORED_TRANSITION_CLEANUP_DELAY);

  /*
   * We can't import this logic from utilities.js here, but we should keep them in sync.
   */
  function isLowPowerDevice() {
    /* Skip ESLint compatibility check. Number(undefined) <= 2 is always false anyway. */
    /* eslint-disable-next-line compat/compat */
    return Number(navigator.hardwareConcurrency) <= 2 || Number(navigator.deviceMemory) <= 2;
  }
})();
