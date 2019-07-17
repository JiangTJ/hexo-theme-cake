/* global hexo */

'use strict';

const path = require('path');

const priority = hexo.config.inject_priority_reward || 120;

// add to postBodyEnd
hexo.extend.filter.register('theme_inject', function(injects) {
  injects.postBodyEnd.raw('reward', `
  {% if page.reward === undefined and theme.reward_settings.enable %}
  {% set reward_able = true %}
  {% else %}
    {% set reward_able = page.reward %}
  {% endif %}
  {% if reward_able and not is_index %}
    {{ partial( '_partials/post/reward.swig') }}
  {% endif %}
  `, {}, {cache: true});
}, priority);

// add to reward style
hexo.extend.filter.register('theme_inject', function(injects) {
  Object.keys(hexo.theme.config.reward).forEach((reward_name) => {
    let reward_item = hexo.theme.config.reward[reward_name];
    let layout = reward_item.layout;
    injects.reward.file(reward_name, layout || path.join(hexo.theme_dir, 'layout/_partials/post/reward/simple.swig'), {
      reward_name,
      reward_item
    }, {cache: true});
  })
});
