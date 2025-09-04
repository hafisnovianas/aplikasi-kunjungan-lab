import DrawerInitiator from '../utils/drawer-initiator.js';
import UrlParser from '../routes/url-parser.js';
import routes from '../routes/routes.js';

class App {
  constructor({ loginButton, menuButton, drawer, content}) {
    this._loginButton = loginButton;
    this._menuButton = menuButton;
    this._drawer = drawer;
    this._content = content;

    this._initialAppShell();
  }

  _initialAppShell() {
    DrawerInitiator.init({
      menuButton: this._menuButton,
      drawer: this._drawer,
      content: this._content
    })
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const token = localStorage.getItem('kunjunganLabToken');

    if (token) {
      this._menuButton.style.display= "flex";
      this._loginButton.style.display = "none";

      if (url === '/login' || url === '/register') {
        window.location.hash = '#/dashboard';
        return;
      }

      const lastUsedName = localStorage.getItem('lastUsedName');
      if (lastUsedName) {
        const navTitle = 'Hai ' + localStorage.getItem('lastUsedName').split(' ')[0] + '!';
        this._drawer.querySelector('.nav-title').textContent = navTitle;
      }
    } else {
      this._menuButton.style.display= "none";
      this._loginButton.style.display = "flex";

      if (url === '/login') {
        this._loginButton.style.display = 'none';
      } 
      
      const publicPages = ['/login','/register','/home','/']
      if (!publicPages.includes(url)) {
        window.location.hash = '#/login';
        return
      }
    }

    const page = routes[url];
    const content = await page.render();
    this._content.innerHTML = content;
    await page.afterRender();
  };
}

export default App