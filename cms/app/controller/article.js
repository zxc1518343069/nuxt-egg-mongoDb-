'use strict';
const marked = require('marked');
const Controller = require('egg').Controller;

class ArticleController extends Controller {
  async list() {
    const { ctx } = this;
    let res = await ctx.model.Article.find().populate('author');
    ctx.helper.success({ ctx, res, msg: '查询成功' });
  }
  async detail() {
    const { ctx } = this;
    const { id } = ctx.params;
    console.log(ctx)
    let info = await ctx.model.Article.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } }) // 更改views 数据 每次+1
      .populate('author') // 把数据author数据也返回
    ctx.helper.success({ ctx, res: { info }, msg: '查询成功' });
  }

  async create() {
    const { ctx } = this;
    let { user } = ctx.state;
    console.log(user._id);
    const { content, title } = ctx.request.body;
    let obj = {
      title,
      article: content,
      article_html: marked(content),
      author: user._id,
    };
    let res = await ctx.model.Article.create(obj);
    console.log(res);
    if (res._id) {
      ctx.helper.success({ ctx, res: { id: res._id }, msg: '创建成功' });
    }
  }


}

module.exports = ArticleController;
