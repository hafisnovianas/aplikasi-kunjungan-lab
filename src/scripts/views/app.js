import DrawerInitiator from '../utils/drawer-initiator.js';
import UrlParser from '../routes/url-parser.js';
import routes from '../routes/routes.js';

class App {
  constructor({ hero, menuButton, authButton, navContainer, drawer, content}) {
    this._hero = hero;
    this._menuButton = menuButton;
    this._authButton = authButton;
    this._navContainer = navContainer;
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

    this._hero.style.height = '64px';
    if (url === '/home' || url === '/') {
      this._hero.style.height = '';
    }
    
    const token = localStorage.getItem('kunjunganLabToken');

    if (token) {
      console.log('has token')
      this._authButton.style.display = "none";
      this._navContainer.style.display = "";

      const authPage = ['/login', '/register', '/gate', '/visitguest']
      if (authPage.includes(url)) {
        console.log('auth page')
        window.location.hash = '#/dashboard';
        return;
      }

      const lastUsedName = localStorage.getItem('lastUsedName');
      if (lastUsedName) {
        const navTitle = 'Hai ' + localStorage.getItem('lastUsedName').split(' ')[0] + '!';
        this._drawer.querySelector('.nav-title').textContent = navTitle;
      }
    } else {
      console.log('no token')
      this._authButton.style.display = "";
      this._navContainer.style.display = "none";
      
      const privatePages = ['/dashboard','/visit']
      if (privatePages.includes(url)) {
        console.log('no auth page')
        window.location.hash = '#/gate';
        return
      }
    }

    console.log(url)

    const page = routes[url];
    const content = await page.render();
    this._content.innerHTML = content;
    await page.afterRender();
  };
}

export default App