import HomePage from '../views/pages/home.js';
import LoginPage from '../views/pages/login.js';
import DashboardPage from '../views/pages/dashboard.js';
import VisitPage from '../views/pages/visit.js';

const routes = {
  '/': HomePage,
  '/home': HomePage,
  '/login': LoginPage,
  '/dashboard': DashboardPage,
  '/visit': VisitPage,
};

export default routes;