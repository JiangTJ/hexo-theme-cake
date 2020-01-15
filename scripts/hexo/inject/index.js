/* global hexo */

'use strict';

const Injector = require('./injector');
const {resolve} = require('path');
const {Cache} = require('hexo-util');
const {helper, filter} = hexo.extend;
const cache = new Cache();

const injector = new Injector();
hexo.extend.injector2 = injector;
hexo.on('generateBefore', () => {
  injector.clean();
});


helper.register('inject_list', function(point) { return injector.get(point).list(); });
helper.register('inject_bind', function(point) { return injector.get(point).bind(this); });
helper.register('inject_rendered', function(point) { return injector.get(point).rendered(this); });
helper.register('inject_text', function(point) {
  cache.set(`${injector.formatKey(point)}`, true);
  return injector.get(point).text(this);
});
filter.register('after_route_render', require('./filter')(hexo, cache));

/**
 * Compatible with next theme injector
 */
const points = require('../../events/lib/injects-point');
filter.register('theme_inject', injects => {
  // stylus
  points.styles.forEach(type => {
    injects[type].files.forEach(file => injector.register(type, file, () => true, 10, true));
  });
  // view
  points.views.forEach(type => {
    injects[type].raws
      .map((injectObj, index) => {
        let name = injectObj.name;
        let layout = `inject/${type}/${name}`;
        let locals = injectObj.args[0];
        let options = injectObj.args[1];
        let order = injectObj.args[2] || index;
        let value = ctx => ctx.partial(layout, locals, options);
        return {value, priority: order, name, layout, locals, options, isRun: true};
      })
      .sort((a, b) => b.priority - a.priority)
      .forEach(data => injector.register(type, data));
  });
}, Number.MAX_VALUE);
