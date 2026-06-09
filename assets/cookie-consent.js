(function () {
  const root = document.querySelector('[data-cookie-consent]');
  const STORAGE_KEY = 'artly_cookie_consent';
  const COOKIE_NAME = 'artly_cookie_consent';
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

  if (!root) return;

  const version = root.getAttribute('data-cookie-consent-version') || '1';
  const form = root.querySelector('[data-cookie-consent-form]');
  const categoryInputs = [...root.querySelectorAll('[data-cookie-category]')];

  function readStoredConsent() {
    const localConsent = readLocalStorage();
    if (localConsent) return localConsent;

    return readCookie();
  }

  function readLocalStorage() {
    try {
      const rawConsent = window.localStorage.getItem(STORAGE_KEY);
      return rawConsent ? JSON.parse(rawConsent) : null;
    } catch (_error) {
      return null;
    }
  }

  function readCookie() {
    const cookie = document.cookie
      .split('; ')
      .find((item) => item.startsWith(`${COOKIE_NAME}=`));

    if (!cookie) return null;

    try {
      return JSON.parse(decodeURIComponent(cookie.split('=').slice(1).join('=')));
    } catch (_error) {
      return null;
    }
  }

  function getCurrentChoices() {
    return categoryInputs.reduce(
      (choices, input) => {
        const category = input.getAttribute('data-cookie-category');
        if (category) choices[category] = input.checked;
        return choices;
      },
      { essential: true }
    );
  }

  function applyChoices(choices) {
    categoryInputs.forEach((input) => {
      const category = input.getAttribute('data-cookie-category');
      input.checked = Boolean(category && choices[category]);
    });
  }

  function createConsent(choices, source) {
    return {
      version,
      source,
      choices: {
        essential: true,
        analytics: Boolean(choices.analytics),
        marketing: Boolean(choices.marketing),
      },
      updatedAt: new Date().toISOString(),
    };
  }

  function saveConsent(choices, source) {
    const consent = createConsent(choices, source);
    const encodedConsent = encodeURIComponent(JSON.stringify(consent));

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch (_error) {
      // The cookie below is the fallback for browsers that block localStorage.
    }

    document.cookie = `${COOKIE_NAME}=${encodedConsent}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
    document.documentElement.dataset.cookieConsent = source;
    root.hidden = true;
    root.setAttribute('aria-hidden', 'true');

    window.dispatchEvent(new CustomEvent('artly:cookie-consent', { detail: consent }));
    return consent;
  }

  function showConsent() {
    const storedConsent = readStoredConsent();

    if (storedConsent?.choices) {
      applyChoices(storedConsent.choices);
    }

    root.hidden = false;
    root.removeAttribute('aria-hidden');
  }

  function rejectOptional() {
    categoryInputs.forEach((input) => {
      input.checked = false;
    });

    saveConsent(getCurrentChoices(), 'rejected');
  }

  function acceptAll() {
    categoryInputs.forEach((input) => {
      input.checked = true;
    });

    saveConsent(getCurrentChoices(), 'accepted');
  }

  function resetConsent() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (_error) {
      // Ignore storage failures.
    }

    document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
    showConsent();
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      saveConsent(getCurrentChoices(), 'customized');
    });
  }

  root.querySelector('[data-cookie-consent-reject]')?.addEventListener('click', rejectOptional);
  root.querySelector('[data-cookie-consent-accept]')?.addEventListener('click', acceptAll);

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const trigger = target.closest('[data-cookie-consent-open]');
    if (!trigger) return;

    event.preventDefault();
    showConsent();
  });

  const storedConsent = readStoredConsent();
  if (storedConsent?.version === version) {
    applyChoices(storedConsent.choices || {});
    document.documentElement.dataset.cookieConsent = storedConsent.source || 'saved';
    root.hidden = true;
  } else {
    showConsent();
  }

  window.ArtlyCookieConsent = {
    acceptAll,
    get: readStoredConsent,
    open: showConsent,
    rejectOptional,
    reset: resetConsent,
    save: (choices) => saveConsent(choices, 'customized'),
  };
})();
