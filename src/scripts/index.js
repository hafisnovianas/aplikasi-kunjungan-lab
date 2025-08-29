import UrlParser from './routes/url-parser.js';
import routes from './routes/routes.js';

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  if (hash === 'home') return;
  renderPage();
})

window.addEventListener('load', async () => {
  renderPage();
});

async function renderPage() {
  const url = UrlParser.parseActiveUrlWithCombiner();
  const page = routes[url];

  document.getElementById('maincontent').innerHTML = await page.render();

  await page.afterRender();
};