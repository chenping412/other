/*
 * created by cdp on 2017/11/21
 */
'use strict';

var apiHost = "http://writer.giiso.com";

if(location.host != "writer.giiso.com") {
  apiHost = "http://172.16.21.22:9092";//开发环境
  //apiHost = "http://172.16.1.31:9092";//本机
}

