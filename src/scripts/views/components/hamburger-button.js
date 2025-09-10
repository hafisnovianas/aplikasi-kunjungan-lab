class HamburgerButton extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _isActive = false;
  _button = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();

    this._button = this._shadowRoot.querySelector('button');
  }

  connectedCallback() {
    this._button.addEventListener('click', this._toggle)
  }

  disconnectedCallback() {
    this._button.removeEventListener('click', this._toggle)
  }

  _toggle = () => {
    this.active = !this.active;
  }

  set active(isActive) {
    this._isActive = !!isActive;
    if (this._isActive) {
      this._button.classList.add('active');
    } else {
      this._button.classList.remove('active');
    }

    this.dispatchEvent(new CustomEvent('toggle', {
      detail: {
        active: this._isActive
      },
      bubbles: true
    }))
  }

  get active() {
    return this._isActive;
  }

  _updateStyle() {
    this._style.textContent = `
      button {
        width: 40px;
        height: 40px;
        position: relative;
        cursor: pointer;

        background: none;
        border: none;
      }

      span {
        display: block;
        position: absolute;
        left: 10%;
        right: 10%;
        height: 2px;
        background-color: #333;
        border-radius: 4px;

        transition: all 0.3s ease-in-out;
      }

      span:nth-child(1) {
        top: 20%;
      }

      span:nth-child(2) {
        top: 50%;
        transform: translateY(-50%);
        transition: none;
      }

      span:nth-child(3) {
        bottom: 20%;
      }

      .active span:nth-child(1) {
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
      }

      .active span:nth-child(2) {
        opacity: 0;
      }

      .active span:nth-child(3) {
        top: 50%;
        transform: translateY(-50%) rotate(-45deg);
      }
    `;
  }

  render() {
    this._shadowRoot.innerHTML = '';
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <button>
        <span></span>
        <span></span>
        <span></span>
      </button>
    `;
  }
}

customElements.define('hamburger-button', HamburgerButton);