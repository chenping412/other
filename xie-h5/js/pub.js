/**
 * Created by Administrator on 2019/7/7.
 */

var searchStr=location.search;

$('#nav').find('a').each(function(){

    var href = $(this).attr('href')
    if(href && href!=''){
        $(this).attr('href', href+searchStr)
    }
});


 function searchOjb() {
    var str = location.search.slice(1);
    var res = {};
    if (!str) {
        return res;
    }
    str.split("&").forEach(function (v, k, arr) {
        var param = v.split('=');
        res[param[0]] = param[1];
    });
    return res;
}
//var apiHost='http://www.myqsl.cn';
var apiHost= 'http://localhost:8090';
var imgHost= 'http://www.myqsl.cn/MM2/img/';
var pdfHost= 'http://www.myqsl.cn/MM2/img/';