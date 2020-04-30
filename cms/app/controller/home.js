'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const res = { abc: 123 };
    // ctx.body = 'hi, egg';
    ctx.helper.success({ ctx, res });
  }
}

module.exports = HomeController;
