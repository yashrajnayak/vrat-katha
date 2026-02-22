import { parseHash } from './router-utils.mjs';

let currentRoute = null;
let routeHandler = null;

export function initRouter(handler) {
  routeHandler = handler;
  window.addEventListener('hashchange', () => handleRoute());
  handleRoute();
}

function handleRoute() {
  currentRoute = parseHash(window.location.hash || '#/');
  if (routeHandler) routeHandler(currentRoute);
}

export function navigate(route) {
  window.location.hash = route;
}

export function goBack() {
  window.location.hash = '#/';
}

export function getCurrentRoute() {
  return currentRoute;
}

export { parseHash };
