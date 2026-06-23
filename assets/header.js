import { Component } from '@theme/component';
import { onDocumentLoaded, changeMetaThemeColor, setHeaderMenuStyle } from '@theme/utilities';

const NAVIGATION_FEEDBACK_DELAY = 115;
const NAVIGATION_FEEDBACK_ARM_CLEAR_DELAY = 700;
const NAVIGATION_FEEDBACK_SELECTOR =
  '.menu-list__link[href], .menu-drawer__menu-item[href], .header-logo[href], .header__heading-link[href]';
const HOME_ARTLY_AI_TRANSITION_TYPE = 'artly-home-ai-navigation';
const CUSTOM_TRANSITION_STORAGE_KEY = 'custom-transition-type';
const CUSTOM_TRANSITION_STORAGE_AT_KEY = 'custom-transition-type-at';

/**
 * @typedef {Object} HeaderComponentRefs
 * @property {HTMLDivElement} headerDrawerContainer - The header drawer container element
 * @property {HTMLElement} headerMenu - The header menu element
 * @property {HTMLElement} headerRowTop - The header top row element
 */

/**
 * @typedef {CustomEvent<{ minimumReached: boolean }>} OverflowMinimumEvent
 */

/**
 * A custom element that manages the site header.
 *
 * @extends {Component<HeaderComponentRefs>}
 */

class HeaderComponent extends Component {
  requiredRefs = ['headerDrawerContainer', 'headerMenu', 'headerRowTop'];

  /**
   * Width of window when header drawer was hidden
   * @type {number | null}
   */
  #menuDrawerHiddenWidth = null;

  /**
   * An intersection observer for monitoring sticky header position
   * @type {IntersectionObserver | null}
   */
  #intersectionObserver = null;

  /**
   * Whether the header has been scrolled offscreen, when sticky behavior is 'scroll-up'
   * @type {boolean}
   */
  #offscreen = false;

  /**
   * The last recorded scrollTop of the document, when sticky behavior is 'scroll-up
   * @type {number}
   */
  #lastScrollTop = 0;

  /**
   * A timeout to allow for hiding animation, when sticky behavior is 'scroll-up'
   * @type {number | null}
   */
  #timeout = null;

  /**
   * RAF ID for scroll handler throttling
   * @type {number | null}
   */
  #scrollRafId = null;

  /**
   * Timeout used to let pending nav feedback paint before same-site navigation.
   * @type {number | null}
   */
  #pendingNavigationTimer = null;

  /**
   * Timeout used to clear pointer-armed feedback when no click follows.
   * @type {number | null}
   */
  #armedNavigationTimer = null;

  /**
   * Header link that was visually armed on pointerdown/touchstart.
   * @type {HTMLAnchorElement | null}
   */
  #armedNavigationLink = null;

  /**
   * Timeout used to clear the short-lived rail feedback state.
   * @type {number | null}
   */
  #railFeedbackTimer = null;

  /**
   * Timeout used to clear page feedback if navigation is interrupted.
   * @type {number | null}
   */
  #pageFeedbackTimer = null;

  /**
   * Header links that have direct keyboard feedback listeners.
   * @type {Set<HTMLAnchorElement>}
   */
  #navigationFeedbackLinks = new Set();

  handleNavigationFeedbackEvent = (event) => {
    this.#handleNavigationFeedback(event);
  };

  handleNavigationFeedbackPointerdownEvent = (event) => {
    this.#handleNavigationFeedbackPointerdown(event);
  };

  handleNavigationFeedbackTouchstartEvent = (event) => {
    this.#handleNavigationFeedbackTouchstart(event);
  };

  handleNavigationFeedbackKeydownEvent = (event) => {
    this.#handleNavigationFeedbackKeydown(event);
  };

  /**
   * Keeps the global `--header-height` custom property up to date,
   * which other theme components can then consume
   */
  #resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry || !entry.borderBoxSize[0]) return;

    // The initial height is calculated using the .offsetHeight property, which returns an integer.
    // We round to the nearest integer to avoid unnecessaary reflows.
    const roundedHeaderHeight = Math.round(entry.borderBoxSize[0].blockSize);
    document.body.style.setProperty('--header-height', `${roundedHeaderHeight}px`);

    // Check if the menu drawer should be hidden in favor of the header menu
    if (this.#menuDrawerHiddenWidth && window.innerWidth > this.#menuDrawerHiddenWidth) {
      this.#updateMenuVisibility(false);
    }
  });

  /**
   * Observes the header while scrolling the viewport to track when its actively sticky
   * @param {Boolean} alwaysSticky - Determines if we need to observe when the header is offscreen
   */
  #observeStickyPosition = (alwaysSticky = true) => {
    if (this.#intersectionObserver) return;

    const config = {
      threshold: alwaysSticky ? 1 : 0,
    };

    this.#intersectionObserver = new IntersectionObserver(([entry]) => {
      if (!entry) return;

      const { isIntersecting } = entry;

      if (alwaysSticky) {
        this.dataset.stickyState = isIntersecting ? 'inactive' : 'active';
        if (this.dataset.themeColor) changeMetaThemeColor(this.dataset.themeColor);
      } else {
        this.#offscreen = !isIntersecting || this.dataset.stickyState === 'active';
      }
    }, config);

    this.#intersectionObserver.observe(this);
  };

  /**
   * Handles the overflow minimum event from the header menu
   * @param {OverflowMinimumEvent} event
   */
  #handleOverflowMinimum = (event) => {
    this.#updateMenuVisibility(event.detail.minimumReached);
  };

  /**
   * Updates the visibility of the menu and drawer
   * @param {boolean} hideMenu - Whether to hide the menu and show the drawer
   */
  #updateMenuVisibility(hideMenu) {
    if (hideMenu) {
      this.#menuDrawerHiddenWidth = window.innerWidth;
    } else {
      this.#menuDrawerHiddenWidth = null;
    }
    setHeaderMenuStyle();
  }

  #handleWindowScroll = () => {
    if (this.#scrollRafId !== null) return;

    this.#scrollRafId = requestAnimationFrame(() => {
      this.#scrollRafId = null;
      this.#updateScrollState();
    });
  };

  #updateScrollState = () => {
    const stickyMode = this.getAttribute('sticky');
    if (!this.#offscreen && stickyMode !== 'always') return;

    const scrollTop = document.scrollingElement?.scrollTop ?? 0;
    const headerTop = this.getBoundingClientRect().top;
    const isScrollingUp = scrollTop < this.#lastScrollTop;
    const isAtTop = headerTop >= 0;

    if (this.#timeout) {
      clearTimeout(this.#timeout);
      this.#timeout = null;
    }

    if (stickyMode === 'always') {
      if (isAtTop) {
        this.dataset.scrollDirection = 'none';
      } else if (isScrollingUp) {
        this.dataset.scrollDirection = 'up';
      } else {
        this.dataset.scrollDirection = 'down';
      }

      this.#lastScrollTop = scrollTop;
      return;
    }

    if (isScrollingUp) {
      if (isAtTop) {
        // reset sticky state when header is scrolled up to natural position
        this.#offscreen = false;
        this.dataset.stickyState = 'inactive';
        this.dataset.scrollDirection = 'none';
      } else {
        // show sticky header when scrolling up
        this.dataset.stickyState = 'active';
        this.dataset.scrollDirection = 'up';
      }
    } else if (this.dataset.stickyState === 'active') {
      this.dataset.scrollDirection = 'none';

      this.dataset.stickyState = 'idle';
    } else {
      this.dataset.scrollDirection = 'none';
      this.dataset.stickyState = 'idle';
    }

    this.#lastScrollTop = scrollTop;
  };

  /**
   * Adds instant feedback for ordinary same-site header navigation.
   * @param {MouseEvent} event
   */
  #handleNavigationFeedback = (event) => {
    if (event.defaultPrevented || !(event.target instanceof Element)) return;

    const link = event.target.closest(NAVIGATION_FEEDBACK_SELECTOR);
    if (!(link instanceof HTMLAnchorElement) || !this.contains(link)) return;
    if (!isEligibleNavigationEvent(event, link)) return;

    event.preventDefault();
    this.#commitNavigationFeedback(link);
  };

  /**
   * Arms visual feedback as soon as a primary pointer starts the Home <-> Artly AI navigation.
   * Click still commits navigation so cancelled taps and modified clicks keep browser defaults.
   * @param {PointerEvent} event
   */
  #handleNavigationFeedbackPointerdown = (event) => {
    if (event.defaultPrevented || !(event.target instanceof Element)) return;

    const link = event.target.closest(NAVIGATION_FEEDBACK_SELECTOR);
    if (!(link instanceof HTMLAnchorElement) || !this.contains(link)) return;
    if (!isEligiblePointerNavigationEvent(event, link) || !isHomeArtlyAiNavigation(link)) return;

    this.#armNavigationFeedback(link);
  };

  /**
   * Fallback for touch browsers that do not dispatch PointerEvent early enough.
   * @param {TouchEvent} event
   */
  #handleNavigationFeedbackTouchstart = (event) => {
    if (event.defaultPrevented || !(event.target instanceof Element)) return;

    const link = event.target.closest(NAVIGATION_FEEDBACK_SELECTOR);
    if (!(link instanceof HTMLAnchorElement) || !this.contains(link)) return;
    if (!isEligibleTouchNavigationEvent(event, link) || !isHomeArtlyAiNavigation(link)) return;

    this.#armNavigationFeedback(link);
  };

  /**
   * Adds the same accepted navigation feedback for keyboard-activated links.
   * @param {KeyboardEvent} event
   */
  #handleNavigationFeedbackKeydown = (event) => {
    if (event.defaultPrevented || event.repeat || !isKeyboardActivationKey(event) || !(event.target instanceof Element)) {
      return;
    }

    const link = event.target.closest(NAVIGATION_FEEDBACK_SELECTOR);
    if (!(link instanceof HTMLAnchorElement) || !this.contains(link)) return;
    if (!isEligibleKeyboardNavigationEvent(event, link)) return;

    event.preventDefault();
    this.#commitNavigationFeedback(link);
  };

  /**
   * @param {HTMLAnchorElement} link
   */
  #armNavigationFeedback(link) {
    if (this.#pendingNavigationTimer !== null) return;

    this.#applyNavigationFeedbackState(link, NAVIGATION_FEEDBACK_ARM_CLEAR_DELAY);
    this.#armedNavigationLink = link;

    if (this.#armedNavigationTimer !== null) {
      clearTimeout(this.#armedNavigationTimer);
    }

    this.#armedNavigationTimer = window.setTimeout(() => {
      if (this.#pendingNavigationTimer === null && this.#armedNavigationLink === link) {
        this.#clearNavigationFeedbackState({ clearStoredTransition: true });
      }
      this.#armedNavigationLink = null;
      this.#armedNavigationTimer = null;
    }, NAVIGATION_FEEDBACK_ARM_CLEAR_DELAY);
  }

  /**
   * @param {HTMLAnchorElement} link
   */
  #commitNavigationFeedback(link) {
    if (this.#pendingNavigationTimer !== null) {
      clearTimeout(this.#pendingNavigationTimer);
      this.#pendingNavigationTimer = null;
    }
    if (this.#armedNavigationTimer !== null) {
      clearTimeout(this.#armedNavigationTimer);
      this.#armedNavigationTimer = null;
    }
    if (this.#railFeedbackTimer !== null) {
      clearTimeout(this.#railFeedbackTimer);
      this.#railFeedbackTimer = null;
    }
    if (this.#pageFeedbackTimer !== null) {
      clearTimeout(this.#pageFeedbackTimer);
      this.#pageFeedbackTimer = null;
    }
    this.#armedNavigationLink = null;

    this.#applyNavigationFeedbackState(link);

    this.#railFeedbackTimer = window.setTimeout(() => {
      this.classList.remove('is-transition-committing');
      if (this.dataset.artlyTransitionState === 'committing') {
        delete this.dataset.artlyTransitionState;
      }
      this.#railFeedbackTimer = null;
    }, 180);

    const targetUrl = link.href;
    this.#pendingNavigationTimer = window.setTimeout(() => {
      window.location.assign(targetUrl);
    }, NAVIGATION_FEEDBACK_DELAY);
  }

  /**
   * @param {HTMLAnchorElement} link
   * @param {number} clearDelay
   */
  #applyNavigationFeedbackState(link, clearDelay = 240) {
    this.querySelectorAll('[data-artly-nav-pending="true"]').forEach((element) => {
      element.classList.remove('is-nav-pending');
      if (element instanceof HTMLElement) {
        delete element.dataset.artlyNavPending;
      }
    });
    this.querySelectorAll('[data-view-transition-triggered="true"]').forEach((element) => {
      element.removeAttribute('data-view-transition-triggered');
      element.removeAttribute('data-view-transition-type');
    });

    this.classList.add('is-transition-committing');
    this.dataset.artlyTransitionState = 'committing';
    link.classList.add('is-nav-pending');
    link.dataset.artlyNavPending = 'true';
    if (isHomeArtlyAiNavigation(link)) {
      link.setAttribute('data-view-transition-triggered', 'true');
      link.setAttribute('data-view-transition-type', HOME_ARTLY_AI_TRANSITION_TYPE);
      sessionStorage.setItem(CUSTOM_TRANSITION_STORAGE_KEY, HOME_ARTLY_AI_TRANSITION_TYPE);
      sessionStorage.setItem(CUSTOM_TRANSITION_STORAGE_AT_KEY, Date.now().toString());
    } else {
      sessionStorage.removeItem(CUSTOM_TRANSITION_STORAGE_KEY);
      sessionStorage.removeItem(CUSTOM_TRANSITION_STORAGE_AT_KEY);
    }
    this.#applyPageTransitionFeedback(clearDelay);
  }

  /**
   * @param {{ clearStoredTransition?: boolean }} [options]
   */
  #clearNavigationFeedbackState(options = {}) {
    if (this.#railFeedbackTimer !== null) {
      clearTimeout(this.#railFeedbackTimer);
      this.#railFeedbackTimer = null;
    }
    if (this.#pageFeedbackTimer !== null) {
      clearTimeout(this.#pageFeedbackTimer);
      this.#pageFeedbackTimer = null;
    }

    this.classList.remove('is-transition-committing');
    if (this.dataset.artlyTransitionState === 'committing') {
      delete this.dataset.artlyTransitionState;
    }

    this.querySelectorAll('[data-artly-nav-pending="true"]').forEach((element) => {
      element.classList.remove('is-nav-pending');
      if (element instanceof HTMLElement) {
        delete element.dataset.artlyNavPending;
      }
    });
    this.querySelectorAll('[data-view-transition-triggered="true"]').forEach((element) => {
      element.removeAttribute('data-view-transition-triggered');
      element.removeAttribute('data-view-transition-type');
    });

    const main = document.querySelector('#MainContent');
    document.body.classList.remove('artly-page-transition-out');
    if (main instanceof HTMLElement) {
      main.classList.remove('artly-page-transition-out');
      if (main.dataset.artlyPageTransition === 'leaving') {
        delete main.dataset.artlyPageTransition;
      }
    }

    if (options.clearStoredTransition) {
      sessionStorage.removeItem(CUSTOM_TRANSITION_STORAGE_KEY);
      sessionStorage.removeItem(CUSTOM_TRANSITION_STORAGE_AT_KEY);
    }
  }

  /**
   * @param {number} clearDelay
   */
  #applyPageTransitionFeedback(clearDelay = 240) {
    const main = document.querySelector('#MainContent');
    if (!(main instanceof HTMLElement)) return;

    if (this.#pageFeedbackTimer !== null) {
      clearTimeout(this.#pageFeedbackTimer);
      this.#pageFeedbackTimer = null;
    }

    document.body.classList.add('artly-page-transition-out');
    main.classList.add('artly-page-transition-out');
    main.dataset.artlyPageTransition = 'leaving';

    this.#pageFeedbackTimer = window.setTimeout(() => {
      document.body.classList.remove('artly-page-transition-out');
      main.classList.remove('artly-page-transition-out');
      if (main.dataset.artlyPageTransition === 'leaving') {
        delete main.dataset.artlyPageTransition;
      }
      this.querySelectorAll('[data-view-transition-triggered="true"]').forEach((element) => {
        element.removeAttribute('data-view-transition-triggered');
        element.removeAttribute('data-view-transition-type');
      });
      this.#pageFeedbackTimer = null;
    }, clearDelay);
  }

  #bindNavigationFeedbackLinks() {
    this.querySelectorAll(NAVIGATION_FEEDBACK_SELECTOR).forEach((element) => {
      if (!(element instanceof HTMLAnchorElement) || this.#navigationFeedbackLinks.has(element)) return;

      element.addEventListener('click', this.#handleNavigationFeedback, { capture: true });
      element.addEventListener('keydown', this.#handleNavigationFeedbackKeydown, { capture: true });
      this.#navigationFeedbackLinks.add(element);
    });
  }

  #unbindNavigationFeedbackLinks() {
    this.#navigationFeedbackLinks.forEach((link) => {
      link.removeEventListener('click', this.#handleNavigationFeedback, { capture: true });
      link.removeEventListener('keydown', this.#handleNavigationFeedbackKeydown, { capture: true });
    });
    this.#navigationFeedbackLinks.clear();
  }

  connectedCallback() {
    super.connectedCallback();
    this.#resizeObserver.observe(this);
    this.addEventListener('overflowMinimum', this.#handleOverflowMinimum);
    this.addEventListener('click', this.#handleNavigationFeedback);
    this.#bindNavigationFeedbackLinks();

    const stickyMode = this.getAttribute('sticky');
    if (stickyMode) {
      this.#observeStickyPosition(stickyMode === 'always');

      if (stickyMode === 'scroll-up' || stickyMode === 'always') {
        document.addEventListener('scroll', this.#handleWindowScroll);
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#resizeObserver.disconnect();
    this.#intersectionObserver?.disconnect();
    this.removeEventListener('overflowMinimum', this.#handleOverflowMinimum);
    this.removeEventListener('click', this.#handleNavigationFeedback);
    this.#unbindNavigationFeedbackLinks();
    document.removeEventListener('scroll', this.#handleWindowScroll);
    if (this.#scrollRafId !== null) {
      cancelAnimationFrame(this.#scrollRafId);
      this.#scrollRafId = null;
    }
    if (this.#pendingNavigationTimer !== null) {
      clearTimeout(this.#pendingNavigationTimer);
      this.#pendingNavigationTimer = null;
    }
    if (this.#armedNavigationTimer !== null) {
      clearTimeout(this.#armedNavigationTimer);
      this.#armedNavigationTimer = null;
    }
    this.#armedNavigationLink = null;
    if (this.#railFeedbackTimer !== null) {
      clearTimeout(this.#railFeedbackTimer);
      this.#railFeedbackTimer = null;
    }
    if (this.#pageFeedbackTimer !== null) {
      clearTimeout(this.#pageFeedbackTimer);
      this.#pageFeedbackTimer = null;
    }
    document.body.style.setProperty('--header-height', '0px');
  }
}

if (!customElements.get('header-component')) {
  customElements.define('header-component', HeaderComponent);
}

document.addEventListener('pointerdown', routeDocumentNavigationFeedbackPointerdown, { capture: true });
document.addEventListener('touchstart', routeDocumentNavigationFeedbackTouchstart, { capture: true, passive: true });
document.addEventListener('click', routeDocumentNavigationFeedback, { capture: true });
document.addEventListener('keydown', routeDocumentNavigationFeedbackKeydown, { capture: true });

/**
 * Capture early pointer intent before click handlers can move the browser on.
 * @param {PointerEvent} event
 */
function routeDocumentNavigationFeedbackPointerdown(event) {
  const header = getNavigationFeedbackHeader(event);
  header?.handleNavigationFeedbackPointerdownEvent(event);
}

/**
 * @param {TouchEvent} event
 */
function routeDocumentNavigationFeedbackTouchstart(event) {
  const header = getNavigationFeedbackHeader(event);
  header?.handleNavigationFeedbackTouchstartEvent(event);
}

/**
 * Capture click navigation before nested header menu handlers can move the browser on.
 * @param {MouseEvent} event
 */
function routeDocumentNavigationFeedback(event) {
  const header = getNavigationFeedbackHeader(event);
  header?.handleNavigationFeedbackEvent(event);
}

/**
 * @param {KeyboardEvent} event
 */
function routeDocumentNavigationFeedbackKeydown(event) {
  const header = getNavigationFeedbackHeader(event);
  header?.handleNavigationFeedbackKeydownEvent(event);
}

/**
 * @param {Event} event
 * @returns {HeaderComponent | null}
 */
function getNavigationFeedbackHeader(event) {
  if (!(event.target instanceof Element)) return null;

  const header = event.target.closest('header-component');
  if (!(header instanceof HeaderComponent)) return null;

  return header;
}

onDocumentLoaded(() => {
  const header = document.querySelector('header-component');
  const headerGroup = document.querySelector('#header-group');

  // Note: Initial header heights are set via inline script in theme.liquid
  // This ResizeObserver handles dynamic updates after page load

  // Update header group height on resize of any child
  if (headerGroup) {
    const resizeObserver = new ResizeObserver((entries) => {
      const headerGroupHeight = entries.reduce((totalHeight, entry) => {
        if (
          entry.target !== header ||
          (header.hasAttribute('transparent') && header.parentElement?.nextElementSibling)
        ) {
          return totalHeight + (entry.borderBoxSize[0]?.blockSize ?? 0);
        }
        return totalHeight;
      }, 0);
      // The initial height is calculated using the .offsetHeight property, which returns an integer.
      // We round to the nearest integer to avoid unnecessaary reflows.
      const roundedHeaderGroupHeight = Math.round(headerGroupHeight);
      document.body.style.setProperty('--header-group-height', `${roundedHeaderGroupHeight}px`);
    });

    if (header instanceof HTMLElement) {
      resizeObserver.observe(header);
    }

    // Observe all children of the header group
    const children = headerGroup.children;
    for (let i = 0; i < children.length; i++) {
      const element = children[i];
      if (element instanceof HTMLElement) {
        resizeObserver.observe(element);
      }
    }

    // Also observe the header group itself for child changes
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Re-observe all children when the list changes
          const children = headerGroup.children;
          for (let i = 0; i < children.length; i++) {
            const element = children[i];
            if (element instanceof HTMLElement) {
              resizeObserver.observe(element);
            }
          }
        }
      }
    });

    mutationObserver.observe(headerGroup, { childList: true });
  }
});

/**
 * @param {MouseEvent} event
 * @param {HTMLAnchorElement} link
 * @returns {boolean}
 */
function isEligibleNavigationEvent(event, link) {
  const isPrimaryActivation = event.button === 0 || event.detail === 0;

  if (!isPrimaryActivation || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  return isEligibleNavigationLink(link);
}

/**
 * @param {PointerEvent} event
 * @param {HTMLAnchorElement} link
 * @returns {boolean}
 */
function isEligiblePointerNavigationEvent(event, link) {
  if (event.button !== 0 || event.isPrimary === false) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  return isEligibleNavigationLink(link);
}

/**
 * @param {TouchEvent} event
 * @param {HTMLAnchorElement} link
 * @returns {boolean}
 */
function isEligibleTouchNavigationEvent(event, link) {
  if (event.touches.length > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  return isEligibleNavigationLink(link);
}

/**
 * @param {KeyboardEvent} event
 * @param {HTMLAnchorElement} link
 * @returns {boolean}
 */
function isEligibleKeyboardNavigationEvent(event, link) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  return isEligibleNavigationLink(link);
}

/**
 * @param {KeyboardEvent} event
 * @returns {boolean}
 */
function isKeyboardActivationKey(event) {
  return event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar';
}

/**
 * @param {HTMLAnchorElement} link
 * @returns {boolean}
 */
function isEligibleNavigationLink(link) {
  // HeaderMenu temporarily sets aria-expanded on ordinary links during hover/focus.
  if (link.matches('[aria-haspopup="true"], [aria-controls]')) return false;
  if (link.target && link.target !== '_self') return false;
  if (link.hasAttribute('download')) return false;

  const url = new URL(link.href, window.location.href);
  const currentUrl = new URL(window.location.href);
  const isHttpNavigation = url.protocol === 'http:' || url.protocol === 'https:';
  const isSameOrigin = url.origin === currentUrl.origin;
  const isSameDocument = url.pathname === currentUrl.pathname && url.search === currentUrl.search;

  if (!isHttpNavigation || !isSameOrigin) return false;
  if (isSameDocument) return false;

  return true;
}

/**
 * @param {HTMLAnchorElement} link
 * @returns {boolean}
 */
function isHomeArtlyAiNavigation(link) {
  const targetPath = normalizeTransitionPath(new URL(link.href, window.location.href).pathname);
  const currentPath = normalizeTransitionPath(window.location.pathname);
  const isHomeToArtlyAi = currentPath === '/' && targetPath === '/pages/artly-ai';
  const isArtlyAiToHome = currentPath === '/pages/artly-ai' && targetPath === '/';

  return isHomeToArtlyAi || isArtlyAiToHome;
}

/**
 * @param {string} pathname
 * @returns {string}
 */
function normalizeTransitionPath(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname || '/';
}
