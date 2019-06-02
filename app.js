require('./build/check-versions')()

var config = require('./config')
var express = require('express');
var path = require('path');
var history = require('connect-history-api-fallback');
var proxyMiddleware = require('http-proxy-middleware');
var webpack = require('webpack');

// 创建一个express实例
var app = express();

console.log('环境变量：'+app.get('env'));

if(app.get('env') == 'sit'){

    var proxyTable = config.sit.proxyTable

    Object.keys(proxyTable).forEach(function (context) {
        var options = proxyTable[context]
        if (typeof options === 'string') {
          options = { target: options }
        }
        app.use(proxyMiddleware(options.filter || context, options))
      })
	
	app.use(express.static(path.join(__dirname, 'dist')));
	
}else if(app.get('env') == 'production'){

    var proxyTable = config.prod.proxyTable
    
    Object.keys(proxyTable).forEach(function (context) {
        var options = proxyTable[context]
        if (typeof options === 'string') {
            options = { target: options }
        }
        app.use(proxyMiddleware(options.filter || context, options))
    })

    app.use(express.static(path.join(__dirname, 'dist')));

}else if(app.get('env') == 'zc'){
    
        var proxyTable = config.zc.proxyTable
        
        Object.keys(proxyTable).forEach(function (context) {
            var options = proxyTable[context]
            if (typeof options === 'string') {
                options = { target: options }
            }
            app.use(proxyMiddleware(options.filter || context, options))
        })
    
        app.use(express.static(path.join(__dirname, 'dist')));
    
}else{

    app.use(express.static(path.join(__dirname, 'dist')));

}


module.exports = app;