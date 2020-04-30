'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/userinfo', app.jwt, controller.userinfo.index);
  router.get('/user/captcha', controller.userinfo.captcha);
  router.post('/user/register', controller.userinfo.register);
  router.post('/user/login', controller.userinfo.login);
  router.get('/user/follow/:id', app.jwt, controller.userinfo.isFollow);

  router.get('/user/:id/follows', app.jwt, controller.userinfo.getFollows);
  router.get('/user/:id/attention', app.jwt, controller.userinfo.getAttention);

  router.put('/user/follow/:id', app.jwt, controller.userinfo.follow);
  router.delete('/user/follow/:id', app.jwt, controller.userinfo.unfollow);

  router.post('/article/creat', app.jwt, controller.article.create);
  router.get('/article/:id', controller.article.detail);
  router.get('/article', controller.article.list);

  router.get('/user/article/:id', app.jwt, controller.userinfo.getArticleStatus);

  router.put('/user/likeArticle/:id', app.jwt, controller.userinfo.likeArticle);
  router.delete('/user/likeArticle/:id', app.jwt, controller.userinfo.disLikeArticle);
};
