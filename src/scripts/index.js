import App from "./views/app.js";

const app = new App ({
  button: document.getElementById("menuButton"),
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
