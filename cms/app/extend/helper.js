'use strict';
// 处理理成功响应
exports.success = ({ ctx, res = null, msg = '请求成功' }) => {
  ctx.body = { code: 0, data: res, msg };
  ctx.status = 200;
};
exports.error = ({ ctx, res = null, msg = '请求失败' }) => {
  ctx.body = { code: 1, data: res, msg };
  ctx.status = 200;
};
