import ClickOutside from './click-away.js';

export function registerDirectives(app) {
  app.directive('click-away', ClickOutside);
}
