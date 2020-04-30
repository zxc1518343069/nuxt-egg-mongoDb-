'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  mongoose: { enable: true, package: 'egg-mongoose' },
  // {app_root}/config/plugin.js
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
}
;
