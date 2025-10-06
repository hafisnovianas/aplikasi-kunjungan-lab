import HomePage from '../views/pages/home.js';
import LoginPage from '../views/pages/login.js';
import DashboardPage from '../views/pages/dashboard.js';
import VisitPage from '../views/pages/visit.js';
import RegisterPage from '../views/pages/register.js';
import GatePage from '../views/pages/gate.js';
import VisitGuestPage from '../views/pages/visit-guest.js';

const routes = {
  '/': HomePage,
  '/home': HomePage,
  '/login': LoginPage,
  '/dashboard': DashboardPage,
  '/visit': VisitPage,
  '/visitguest': VisitGuestPage,
  '/gate': GatePage,
  '/register': RegisterPage,
};

export default routes;