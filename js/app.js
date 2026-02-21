import { initRouter } from './router.js';
import { loadKathas } from './data.js';
import { renderHome } from './views/home.js';
import { renderKatha } from './views/katha.js';

let kathas = [];

async function init() {
  kathas = await loadKathas();

  initRouter((route) => {
    switch (route.name) {
      case 'katha':
        renderKatha(kathas, route.params.day);
        break;
      case 'home':
      default:
        renderHome(kathas);
        break;
    }
  });
}

init();
