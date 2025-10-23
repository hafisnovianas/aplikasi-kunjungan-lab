class InfoCard extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
    this.render();
  }

  _updateStyle() {
    this._style.textContent = `
      .card {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 20px;
        min-height: 200px;

        color: var(--dongker-fisika);
        border: 2px solid var(--abu-abu);
        border-radius: 8px;
        background-color: transparent;
      }

      .card__content {
        display: flex;
        justify-content: space-between;
        height: 300px;
      }

      .card__text {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        flex: 3;
        min-width: 0;
      }

      .card__text h2 {
        font-size: 2.3rem;
        margin: 0;
      }

      .card__image {
        overflow: hidden;
        flex: 2;
        height: 100%;
      }

      .card__image img {
        height: 100%;
        object-fit: cover;
        filter: drop-shadow(0 0px 4px rgba(0, 0, 0, 0.2));
      }

      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;

        padding: var(--btn-padding);
        font-size: var(--btn-font-size);
        font-weight: var(--btn-font-weight); 
        border-style: solid;
        border-radius: var(--btn-border-radius);
        border-width: var(--btn-border-width);
        transition: var(--btn-transition);
      }

      .btn-primary {
        color: var(--btn-primary-color);
        background-color: var(--btn-primary-bg);
        border-color: var(--btn-primary-border-color);
      }

      .btn-primary:hover, .btn-primary:active {
        background-color: var(--btn-primary-hover-bg);
        border-color: var(--btn-primary-hover-border-color);
        cursor: pointer;
      }
    `;
  }

  render() {
    this._shadowRoot.innerHTML = '';
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
      <div class="card">
        <div class="card__content">
          <div class="card__text">
            <h2>INFO PRAKTIKUM 2025</h2>
            <p>Informasi terbaru seputar jadwal, modul, dan ketentuan praktikum.</p>
          </div>
          <div class="card__image">
            <img src="src/public/asisten2.png">
          </div>
        </div>
        <a href="#/infopraktikum" class="btn btn-primary">
          Klik disini!
        </a>
      </div>
    `;
  }
}

customElements.define('info-card', InfoCard);