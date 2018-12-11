
//计算时间格式
const formatTime= function (downdTime) {
  var str = '';
  var attr = downdTime.split(' ');
  var date = attr[0].split("-");
  var time = attr[1].split(':');

  var thatTime = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]).getTime();
  var today = new Date().getTime();

  var aa = (today - thatTime) / 1000 / 60;//相差分钟数
  if (aa < 5) {
    str = "刚刚";
  } else if (aa < 60) {
    str = parseInt(aa) + "分钟前";
  } else if (aa < 60 * 24) {
    str = parseInt(aa / 60) + "小时前";
  } else if (aa < 60 * 48) {
    str = parseInt(aa / 60 / 24) + "天前";
  } else {
    str = downdTime.slice(5, 16);
  }
  return str;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const apiHost = 'https://app.allcitysz.com/quanc-core';
// const apiHost ='http://172.16.25.12:9091/quanc-core';
// const apiHost = 'http://172.16.1.162:8070/quanc-core';

module.exports = {
  formatTime: formatTime,
  apiHost: apiHost
}
