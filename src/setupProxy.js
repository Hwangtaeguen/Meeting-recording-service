const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        createProxyMiddleware('/recog/v1',{
          target: 'https://naveropenapi.apigw.ntruss.com',
          changeOrigin: true,
        })
      );

  app.use(
    createProxyMiddleware('/text-summary/v1',{
      target: 'https://naveropenapi.apigw.ntruss.com',
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware('/sentiment-analysis/v1',{
      target: 'https://naveropenapi.apigw.ntruss.com',
      changeOrigin: true,
    })
  );


  app.use(
    createProxyMiddleware('/external/v1',{
      target: 'https://clovaspeech-gw.ncloud.com/',
      changeOrigin: true,
    })
  );


  app.use(
    createProxyMiddleware('/nmt/v1',{
      target: 'https://naveropenapi.apigw.ntruss.com/',
      changeOrigin: true,
    })
  );


};

