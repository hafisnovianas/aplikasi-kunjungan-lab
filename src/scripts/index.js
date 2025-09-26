import App from "./views/app.js";
import Helper from "./utils/helper.js";
import './views/components/components.js';

const app = new App ({
  hero: document.getElementById('hero'),
  menuButton: document.getElementById("menuButton"),
  authButton: document.getElementById('authButton'),
  navContainer: document.getElementById('navContainer'),
  drawer: document.getElementById("drawer"),
  content: document.getElementById("maincontent")
})

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  if (hash === 'home') return;
  app.renderPage();
})

window.addEventListener('load', async () => {
  app.renderPage();
});

document.getElementById('logoutButton').addEventListener('click', () => {
  Helper.destroyUserToken('kunjunganLabToken');
  window.location.hash = '/login';
})