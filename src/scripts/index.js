import App from "./views/app.js";
import Helper from "./utils/helper.js";

const app = new App ({
  loginButton: document.getElementById('loginButton'),
  menuButton: document.getElementById("menuButton"),
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
  console.log('hapus')
  Helper.destroyUserToken('kunjunganLabToken');
  window.location.hash = '/login';
})