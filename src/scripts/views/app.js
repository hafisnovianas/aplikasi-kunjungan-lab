import DrawerInitiator from '../utils/drawer-initiator.js';
import UrlParser from '../routes/url-parser.js';
import routes from '../routes/routes.js';

class App {
  constructor({ button, drawer, content}) {
    this._button = button;
    this._drawer = drawer;
    this._content = content;

    this._initialAppShell();
  }

  _initialAppShell() {
    DrawerInitiator.init({
      button: this._button,
      drawer: this._drawer,
      content: this._content
    })
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();

    if (localStorage.getItem('kunjunganLabToken')) {
      this._button.style.display= "flex";
      document.getElementById('loginButton').style.display = "none";
      if (url === '/login') {
        window.location.hash = '#/dashboard';
        return;
      }
    }

    const page = routes[url];
    const content = await page.render();

    if (content !== false) {
      this._content.innerHTML = content;
      await page.afterRender();
    }

    if (localStorage.getItem('lastUsedName')) {
      this._drawer.querySelector('.nav-title').textContent = 'Hai ' + localStorage.getItem('lastUsedName').split(' ')[0] + '!';
    }
  };
}

export default App