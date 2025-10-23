class ProdiCard extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  _prodiName = '';
  _dataLink = {
    jadwal: '#/',
    kelompok: '#/',
    modul: '#/',
    logbook: '#/',
    asistensi: '#/',
  };

  static get observerAttributes() {
    return ['prodiname', 'datalink'];
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._style = document.createElement('style');
  }

  set prodiName(value) {
    this._prodiName = value;
    this.render();
  }

  get prodiName() {
    return this._prodiName;
  }

  set dataLink(value) {
    this._dataLink = value;
    this.render();
  }

  get dataLink() {
    return this._dataLink;
  }

  _updateStyle() {
    this._style.textContent = `
      .card {
        display: flex;
        flex-direction: column;

        color: var(--dongker-fisika);
        border: 2px solid var(--abu-abu);
        border-radius: 8px;
        background-color: transparent;
        overflow: hidden; 
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        cursor: pointer;
        user-select: none; /* Biar teks judul tidak terseleksi saat diklik */
      }

      .card-title {
        margin: 0;
        font-size: 1.2rem;
      }

      .card-toggle {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        transition: transform 0.3s ease; /* Animasi panah berputar */
      }

      .card-content {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.3s ease;
      }

      .card-body {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-height: 0;
        padding-inline: 1rem;
      }

      .card.expanded .card-content {
        grid-template-rows: 1fr;
      }

      .card.expanded .card-body {
        padding-bottom: 1rem;
      }

      .card.expanded .card-toggle {
        transform: rotate(180deg);
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
        <div class="card-header">
          <h3 class="card-title">${this.prodiName}</h3>
          <button class="card-toggle" aria-label="Expand card">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 9L12 15L6 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="card-content">
          <div class="card-body">
            <a href=${this.dataLink.jadwal} class="btn btn-primary">Jadwal</a>
            <a href=${this.dataLink.kelompok} class="btn btn-primary">Kelompok</a>
            <a href=${this.dataLink.modul} class="btn btn-primary">Modul</a>
            <a href=${this.dataLink.logbook} class="btn btn-primary">Logbook</a>
            <a href=${this.dataLink.asistensi} class="btn btn-primary">Asistensi</a>
          </div>
        </div>
      </div>
    `;

    this._skrip()
  }

  _skrip() {
    const card = this._shadowRoot.querySelector('.card')
    const cardHeader = card.querySelector('.card-header');
    cardHeader.addEventListener('click', () => {
      card.classList.toggle('expanded');
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'prodiname':
        this.prodiName = newValue;
        break;
      case 'datalink':
        this.dataLink = newValue;
        break;
    }
    this.render();
  }
}

customElements.define('prodi-card', ProdiCard);