const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function parseEndAt(node) {
  const date = `${node?.dataset?.countdownDate ?? ''}`.trim();
  const time = `${node?.dataset?.countdownTime ?? ''}`.trim();

  if (date === '' || time === '') return null;

  const endDate = new Date(`${date}T${time}`);
  const timestamp = endDate.getTime();

  return Number.isNaN(timestamp) ? null : timestamp;
}

function setCountdownValue(node, part, value) {
  const element = node.querySelector(`[data-countdown-part="${part}"]`);

  if (element) {
    element.textContent = String(value).padStart(2, '0');
  }
}

function setExpired(node) {
  node.hidden = true;
  node.setAttribute('aria-hidden', 'true');
}

function renderCountdown(node, endAt) {
  const remaining = endAt - Date.now();

  if (remaining <= 0) {
    setExpired(node);
    return;
  }

  const days = Math.floor(remaining / DAY_MS);
  const hours = Math.floor((remaining % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((remaining % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((remaining % MINUTE_MS) / SECOND_MS);

  setCountdownValue(node, 'days', days);
  setCountdownValue(node, 'hours', hours);
  setCountdownValue(node, 'minutes', minutes);
  setCountdownValue(node, 'seconds', seconds);
}

class AnnouncementCountdown extends HTMLElement {
  static get observedAttributes() {
    return ['data-countdown-date', 'data-countdown-time'];
  }

  #timerId;
  #endAt;

  connectedCallback() {
    this.#start();
  }

  disconnectedCallback() {
    this.#stop();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.#start();
    }
  }

  #start() {
    this.#stop();
    this.#endAt = parseEndAt(this);

    if (!this.#endAt) {
      this.setAttribute('data-announcement-countdown-invalid', 'true');
      return;
    }

    this.removeAttribute('data-announcement-countdown-invalid');
    this.hidden = false;
    this.setAttribute('aria-hidden', 'false');
    this.#render();
    this.#timerId = window.setInterval(() => this.#render(), SECOND_MS);
  }

  #stop() {
    if (this.#timerId) {
      window.clearInterval(this.#timerId);
      this.#timerId = undefined;
    }
  }

  #render() {
    if (!this.#endAt || this.#endAt <= Date.now()) {
      setExpired(this);
      this.#stop();
      return;
    }

    renderCountdown(this, this.#endAt);
  }
}

if (!customElements.get('announcement-countdown')) {
  customElements.define('announcement-countdown', AnnouncementCountdown);
}
