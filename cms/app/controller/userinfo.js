'use strict';
const secretkKey = '120312@#0.';
const Controller = require('egg').Controller;
const md5 = require('md5');

class UserinfoController extends Controller {
  async index() {
    let { ctx } = this;
    let { email } = ctx.state.user;
    const user = await this.checkEmail(email);
    return ctx.helper.success({ ctx, res: user });
  }

  // 这一层只写逻辑
  async captcha() {
    const { ctx, service } = this;
    const captcha = service.tools.captcha();
    console.log('图形验证码' + captcha.text);
    ctx.session.captcha = captcha.text;
    ctx.type = 'image/svg+xml';
    ctx.body = captcha.data;
  }

  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email });
    return user;
  }

  async register() {
    const { ctx } = this;
    const { captcha, email, password, nickname } = ctx.request.body;
    if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {

      // 邮箱验证
      if (await this.checkEmail(email)) {
        return ctx.helper.error({ ctx, msg: '邮箱重复了' });
      }
      // 新增用户  数据库里面增加数据
      let ret = await ctx.model.User.create({
        email, password: md5(password + secretkKey), nickname,
      });
      if (ret._id) {
        return ctx.helper.success({ ctx, res: { userId: ret._id }, msg: '注册成功' });
      }
      // ctx.helper.success({ ctx, res: '注册成功' });
    } else {
      return ctx.helper.error({ ctx, msg: '验证码错误' });
    }
  }

  async login() {
    const { ctx, app } = this;
    const { email, password } = ctx.request.body;
    let user = await ctx.model.User.findOne({
      email, password: md5(password + secretkKey),
    });
    if (user) {
      let { nickname, avatar } = user;
      const token = app.jwt.sign({
        nickname, email, _id: user._id, avatar,
      }, app.config.jwt.secret, {
        expiresIn: '1h',
      });
      ctx.state.email = email;
      return ctx.helper.success({ ctx, msg: '验证成功，正在登陆', res: { nickname, email, token } });
    } else {
      return ctx.helper.error({ ctx, msg: '账号密码错误' });
    }
  }

  async isFollow() {
    const { ctx } = this;
    const { user } = ctx.state;
    const author = await ctx.model.User.findById(user._id);
    const follow = !!author.following.find(item => item.toString() === ctx.params.id);
    return ctx.helper.success({ ctx, msg: '查询成功', res: { isFollow: follow } });
  }

  async follow() {
    // 把关注的用户id 放在following字段李
    const { ctx } = this;
    let me = await ctx.model.User.findById(ctx.state.user._id);
    const isFollow = !!me.following.find(v => v.toString() === ctx.params.id);
    if (!isFollow) {
      me.following.push(ctx.params.id);
      me.save();
      return ctx.helper.success({ ctx, msg: '关注成功' });
    }
  }

  async unfollow() {
    // 取消关注
    const { ctx } = this;
    let me = await ctx.model.User.findById(ctx.state.user._id);
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id);
    if (index > -1) {
      me.following.splice(index, 1);
      me.save();
      return ctx.helper.success({ ctx, msg: '取消成功' });
    }
  }

  // 获取关注的人
  async getAttention() {
    const { ctx } = this;
    const res = await ctx.model.User.findById(ctx.params.id)
        .populate('following');
    return ctx.helper.success({ ctx, msg: '获取关注成功', res: res.following });
  }

  // 获取粉丝
  async getFollows() {
    const { ctx } = this;
    const res = await ctx.model.User.find({ following: ctx.params.id });
    return ctx.helper.success({ ctx, msg: '获取粉丝成功', res });
  }

  // 获取 喜欢与不喜欢的信息
  async getArticleStatus() {
    const { ctx } = this;
    console.log(ctx.state)
    console.log(ctx.params)
    const me = await ctx.model.User.findById(ctx.state.user._id);
    let like = !!me.likeArticle.find(id => id.toString() === ctx.params.id);
    let dislike = !!me.disLikeArticle.find(id => id.toString() === ctx.params.id);
    return ctx.helper.success({ ctx, msg: '获取喜欢与否成功', res: { like, dislike } });
  }

  // 点赞文章
  async likeArticle() {
    // 数组新增
    const { ctx } = this
    const me = await ctx.model.User.findById(ctx.state.user._id)
    if (!me.likeArticle.find(id => id.toString() === ctx.params.id)) {
      me.likeArticle.push(ctx.params.id)
      me.save()
      await ctx.model.Article.findByIdAndUpdate(ctx.params.id, { $inc: { like: 1 } })
      return ctx.helper.success({ ctx, msg: '点赞成功' })
    }
    return ctx.helper.success({ ctx, msg: '已经点过赞了哦' })
  }

  // 取消点赞
  async disLikeArticle() {
    // 数组新增
    const { ctx } = this;
    const me = await ctx.model.User.findById(ctx.state.user._id);
    if (me.likeArticle.find(id => id.toString() === ctx.params.id)) {
      me.likeArticle.remove(ctx.params.id)
      me.save()
      await ctx.model.Article.findByIdAndUpdate(ctx.params.id, { $inc: { like: -1 } })
      return ctx.helper.success({ ctx, msg: '取消成功' })
    }
    return ctx.helper.success({ ctx, msg: '已经取消赞了哦' })
  }
}

module.exports = UserinfoController;
