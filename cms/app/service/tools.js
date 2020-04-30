'use strict';

const Service = require('egg').Service;
const captcha = require('svg-captcha');

class ToolsService extends Service {
  captcha() {
    const capt = captcha.create({
      size: 4,
      width: 100,
      height: 40,
      fontSize: 50,
      noise: 4,
    });
    return capt;
  }
}

module.exports = ToolsService;
