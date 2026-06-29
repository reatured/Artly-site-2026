import { Component } from '@theme/component';
import { onDocumentLoaded, changeMetaThemeColor, setHeaderMenuStyle } from '@theme/utilities';

const NAVIGATION_FEEDBACK_CLEAR_DELAY = 520;
const NAVIGATION_FEEDBACK_SELECTOR =
  '.menu-list__link[href], .menu-drawer__menu-item[href], .header-logo[href], .header__heading-link[href]';
const PAGE_FADE_STORAGE_KEY = 'artlyNavPending';
const PAGE_FADE_PENDING_VALUE = 'fade';
const PAGE_FADE_OVERLAY_SELECTOR = '.artly-page-fade-overlay';

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
   * Timeout used to clear pending navigation feedback state.
   * @type {number | null}
   */
  #feedbackClearTimer = null;

  /**
   * Header links that have direct keyboard feedback listeners.
   * @type {Set<HTMLAnchorElement>}
   */
  #navigationFeedbackLinks = new Set();

  /**
   * Whether a fade-out navigation is currently in progress.
   * @type {boolean}
   */
  #isFadeNavigationPending = false;

  /**
   * Bound handler for pageshow events (bfcache restoration cleanup).
   * @type {((event: Event) => void) | null}
   */
  #pageshowHandler = null;

  /**
   * Bound handler for pagehide events (bfcache storage cleanup).
   * @type {((event: Event) => void) | null}
   */
  #pagehideHandler = null;

  handleNavigationFeedbackEvent = (event) => {
    this.#handleNavigationFeedback(event);
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
   * Adds instant feedback for ordinary same-site header navigation by setting
   * a short-lived is-nav-pending highlight on the clicked link, then triggers
   * a fade-to-white transition before the browser navigates.
   * @param {MouseEvent} event
   */
  #handleNavigationFeedback = (event) => {
    if (event.defaultPrevented || !(event.target instanceof Element)) return;

    const link = event.target.closest(NAVIGATION_FEEDBACK_SELECTOR);
    if (!(link instanceof HTMLAnchorElement) || !this.contains(link)) return;
    if (!isEligibleNavigationEvent(event, link)) return;

    this.#setPendingLinkFeedback(link);
    this.#handleFadeNavigation(link, event);
  };

  /**
   * Adds the same accepted navigation feedback for keyboard-activated links,
   * then triggers a fade-to-white transition before navigation.
   * @param {KeyboardEvent} event
   */
  #handleNavigationFeedbackKeydown = (event) => {
    if (event.defaultPrevented || event.repeat || !isKeyboardActivationKey(event) || !(event.target instanceof Element)) {
      return;
    }

    const link = event.target.closest(NAVIGATION_FEEDBACK_SELECTOR);
    if (!(link instanceof HTMLAnchorElement) || !this.contains(link)) return;
    if (!isEligibleKeyboardNavigationEvent(event, link)) return;

    this.#setPendingLinkFeedback(link);
    this.#handleFadeNavigation(link, event);
  };

  /**
   * Applies the is-nav-pending highlight to the given link and schedules an
   * automatic clear. Navigation proceeds natively via the browser.
   * @param {HTMLAnchorElement} link
   */
  #setPendingLinkFeedback(link) {
    this.querySelectorAll('[data-artly-nav-pending="true"]').forEach((element) => {
      element.classList.remove('is-nav-pending');
      if (element instanceof HTMLElement) {
        delete element.dataset.artlyNavPending;
      }
    });

    link.classList.add('is-nav-pending');
    link.dataset.artlyNavPending = 'true';

    if (this.#feedbackClearTimer !== null) {
      clearTimeout(this.#feedbackClearTimer);
    }

    this.#feedbackClearTimer = window.setTimeout(() => {
      this.querySelectorAll('[data-artly-nav-pending="true"]').forEach((element) => {
        element.classList.remove('is-nav-pending');
        if (element instanceof HTMLElement) {
          delete element.dataset.artlyNavPending;
        }
      });
      this.#feedbackClearTimer = null;
    }, NAVIGATION_FEEDBACK_CLEAR_DELAY);
  }

  #clearPendingLinkFeedback() {
    if (this.#feedbackClearTimer !== null) {
      clearTimeout(this.#feedbackClearTimer);
      this.#feedbackClearTimer = null;
    }

    this.querySelectorAll('[data-artly-nav-pending="true"]').forEach((element) => {
      element.classList.remove('is-nav-pending');
      if (element instanceof HTMLElement) {
        delete element.dataset.artlyNavPending;
      }
    });
  }

  /**
   * Cleans up stale page-fade artifacts when a page is restored from bfcache.
   * Removes any leftover .artly-page-fade-overlay, clears data-artly-fade on
   * #MainContent, clears sessionStorage artlyNavPending, and resets the
   * fade-navigation re-entrancy guard so header links work again.
   * Does not touch is-nav-pending highlight state.
   * @param {PageTransitionEvent} event
   */
  #handlePageshow = (event) => {
    if (!isHistoryRestoreEvent(event)) return;

    this.#isFadeNavigationPending = false;
    schedulePageFadeRestoreCleanup({ clearSession: true });
  };

  #handlePagehide = () => {
    this.#isFadeNavigationPending = false;
    cleanupPageFadeArtifacts({ clearSession: false });
  };

  /**
   * Triggers a fade-to-white transition on #MainContent before navigating.
   * When prefers-reduced-motion is active, skips the fade and lets the
   * browser navigate immediately.
   * @param {HTMLAnchorElement} link
   * @param {Event} event
   */
  #handleFadeNavigation(link, event) {
    if (
      this.#isFadeNavigationPending &&
      !hasPageFadeArtifacts() &&
      getPageFadeStorageValue() !== PAGE_FADE_PENDING_VALUE
    ) {
      this.#isFadeNavigationPending = false;
    }

    if (this.#isFadeNavigationPending) return;

    const targetUrl = link.href;

    if (prefersReducedMotion()) {
      event.preventDefault();
      cleanupPageFadeArtifacts({ clearSession: true });
      window.location.assign(targetUrl);
      return;
    }

    this.#isFadeNavigationPending = true;
    event.preventDefault();
    setPageFadeStorageValue(PAGE_FADE_PENDING_VALUE);

    const mainContent = document.getElementById('MainContent');
    if (!mainContent) {
      this.#isFadeNavigationPending = false;
      removePageFadeStorageValue();
      window.location.assign(targetUrl);
      return;
    }

    const overlay = document.createElement('div');
    overlay.className = PAGE_FADE_OVERLAY_SELECTOR.slice(1);
    mainContent.appendChild(overlay);

    mainContent.setAttribute('data-artly-fade', 'out');

    const cleanup = () => {
      overlay.removeEventListener('transitionend', onTransitionEnd);
      window.location.assign(targetUrl);
    };

    const onTransitionEnd = (e) => {
      if (e.propertyName !== 'opacity') return;
      clearTimeout(settleTimer);
      cleanup();
    };

    overlay.addEventListener('transitionend', onTransitionEnd);
    const settleTimer = setTimeout(cleanup, 320);
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

    this.#pageshowHandler = (event) => this.#handlePageshow(event);
    this.#pagehideHandler = (event) => this.#handlePagehide(event);
    window.addEventListener('pageshow', this.#pageshowHandler);
    window.addEventListener('pagehide', this.#pagehideHandler);

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
    if (this.#pageshowHandler) {
      window.removeEventListener('pageshow', this.#pageshowHandler);
    }
    if (this.#pagehideHandler) {
      window.removeEventListener('pagehide', this.#pagehideHandler);
    }
    if (this.#scrollRafId !== null) {
      cancelAnimationFrame(this.#scrollRafId);
      this.#scrollRafId = null;
    }
    this.#clearPendingLinkFeedback();
    document.body.style.setProperty('--header-height', '0px');
  }
}

if (!customElements.get('header-component')) {
  customElements.define('header-component', HeaderComponent);
}

document.addEventListener('click', routeDocumentNavigationFeedback, { capture: true });
document.addEventListener('keydown', routeDocumentNavigationFeedbackKeydown, { capture: true });

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
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Module-level safety-net for bfcache restoration.
 * Runs regardless of whether a HeaderComponent instance is connected.
 * Strips any stale .artly-page-fade-overlay, data-artly-fade attribute,
 * and artlyNavPending session key when a page is restored from history.
 * Does not touch is-nav-pending highlight state.
 */
window.addEventListener('pagehide', () => {
  cleanupPageFadeArtifacts({ clearSession: false });
});

window.addEventListener('pageshow', (event) => {
  if (!isHistoryRestoreEvent(event)) return;

  schedulePageFadeRestoreCleanup({ clearSession: true });
});

function initPageFadeIn() {
  if (getPageFadeStorageValue() !== PAGE_FADE_PENDING_VALUE) return;
  removePageFadeStorageValue();

  if (prefersReducedMotion()) {
    cleanupPageFadeArtifacts({ clearSession: true });
    return;
  }

  const mainContent = document.getElementById('MainContent');
  if (!mainContent) return;

  const overlay = mainContent.querySelector(PAGE_FADE_OVERLAY_SELECTOR);
  if (!overlay) {
    mainContent.removeAttribute('data-artly-fade');
    return;
  }

  mainContent.setAttribute('data-artly-fade', 'in');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      mainContent.removeAttribute('data-artly-fade');
    });
  });

  const removeOverlay = () => {
    overlay.removeEventListener('transitionend', removeOverlay);
    overlay.remove();
  };
  overlay.addEventListener('transitionend', removeOverlay);
  setTimeout(() => {
    if (overlay.parentNode) overlay.remove();
  }, 400);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageFadeIn);
} else {
  initPageFadeIn();
}

/**
 * Removes only the page-fade overlay/state. Header is-nav-pending feedback is
 * intentionally left alone because it is separate navigation feedback.
 * @param {{ clearSession?: boolean }} [options]
 */
function cleanupPageFadeArtifacts(options = {}) {
  const { clearSession = true } = options;

  document.querySelectorAll(PAGE_FADE_OVERLAY_SELECTOR).forEach((el) => el.remove());

  const mainContent = document.getElementById('MainContent');
  if (mainContent) {
    mainContent.removeAttribute('data-artly-fade');
  }

  if (clearSession) {
    removePageFadeStorageValue();
  }
}

/**
 * Runs cleanup more than once because browser history restoration can replay
 * styles and DOM state around the first pageshow frame.
 * @param {{ clearSession?: boolean }} [options]
 */
function schedulePageFadeRestoreCleanup(options = {}) {
  cleanupPageFadeArtifacts(options);
  requestAnimationFrame(() => cleanupPageFadeArtifacts(options));
  window.setTimeout(() => cleanupPageFadeArtifacts(options), 80);
}

/**
 * @returns {boolean}
 */
function hasPageFadeArtifacts() {
  const mainContent = document.getElementById('MainContent');
  return (
    document.querySelector(PAGE_FADE_OVERLAY_SELECTOR) !== null ||
    mainContent?.hasAttribute('data-artly-fade') === true
  );
}

/**
 * @param {Event} event
 * @returns {boolean}
 */
function isHistoryRestoreEvent(event) {
  if ('persisted' in event && event.persisted === true) return true;

  if (typeof performance === 'undefined' || typeof performance.getEntriesByType !== 'function') return false;

  const [navigationEntry] = performance.getEntriesByType('navigation');
  return navigationEntry?.type === 'back_forward';
}

/**
 * @returns {string | null}
 */
function getPageFadeStorageValue() {
  try {
    return sessionStorage.getItem(PAGE_FADE_STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

/**
 * @param {string} value
 */
function setPageFadeStorageValue(value) {
  try {
    sessionStorage.setItem(PAGE_FADE_STORAGE_KEY, value);
  } catch (e) {
    /* sessionStorage unavailable */
  }
}

function removePageFadeStorageValue() {
  try {
    sessionStorage.removeItem(PAGE_FADE_STORAGE_KEY);
  } catch (e) {
    /* sessionStorage unavailable */
  }
}
