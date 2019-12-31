/* global hexo */

'use strict';

// If not use this md render, some feature will break.
if (hexo.config.disable_cake_marked) return;

const { highlight } = require('hexo-util');

hexo.extend.filter.register('marked:renderer', function(renderer) {
  renderer.code = (code, infostring, escaped) => {
    return '{% raw %}'
      + highlight(code, {
        lang  : infostring,
        gutter: hexo.config.highlight.line_number,
        tab   : hexo.config.highlight.tab_replace,
        wrap  : hexo.config.highlight.wrap
      })
      + '{% endraw %}';
  };
}, 99);
