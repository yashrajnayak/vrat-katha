let currentRoute = null;
let routeHandler = null;

export function initRouter(handler) {
  routeHandler = handler;
  window.addEventListener('hashchange', () => handleRoute());
  handleRoute();
}

function handleRoute() {
  const hash = window.location.hash || '#/';
  const [path, ...params] = hash.slice(1).split('/').filter(Boolean);

  if (!path || path === '') {
    currentRoute = { name: 'home', params: {} };
  } else if (path === 'katha') {
    currentRoute = { name: 'katha', params: { day: params[0] || '0' } };
  } else {
    currentRoute = { name: 'home', params: {} };
  }

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
