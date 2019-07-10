 var  express = require("express");
var  request = require("request");
var  proxyUrl = "http://www.myqsl.cn";
// var proxyUrl = 'https://api-panov2.720yun.com';
var  proxy = express();
proxy.use("/", function(req, res){
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    var url =proxyUrl+ req.url;
    req.pipe(request(url)).pipe(res);
    console.log(url)
}).listen(8090,function(){
	console.log('HTTP Server is running on: http://localhost:8090');
});