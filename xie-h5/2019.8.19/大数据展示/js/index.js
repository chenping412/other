//时钟
function setTime() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    if (m < 10) m = '0' + m;
    var d = now.getDate();
    if (d < 10) d = '0' + d;

    var hh = now.getHours();
    if (hh < 10) hh = '0' + hh;
    var MM = now.getMinutes();
    if (MM < 10) MM = '0' + MM;
    var ss = now.getSeconds();
    if (ss < 10) ss = '0' + ss;

    var w = now.getDay();
    var weekList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var week = weekList[w];

    if(MM == '30' || MM == '00'){
        getWeatherData();
        console.log(y,m,d,hh,MM,ss,week);
    }

    return y + ' / ' + m + ' / ' + d + '   ' + week + '     ' + hh + ' : ' + MM + ' : ' + ss;
}
document.getElementById('time').innerHTML = setTime();
setInterval(function () {
    document.getElementById('time').innerHTML = setTime();
}, 1000);


//标题等文字展示
var echartText = echarts.init(document.getElementById('echart-text'));
var _zr = echartText.getZr();
var xCenter = _zr.getWidth() / 2;
var yCenter = _zr.getHeight() / 2;

function drawText(text, x, y, color, size, postiton) {
    _zr.add(new echarts.graphic.Text({
            style: {
                text: text,
                x: x,
                y: y,
                textFill: color,
                textAlign: postiton || 'left',
                font: size + 'px Microsoft Yahei'
            }
        }
    ));
}


drawText('数 据 可 视 化 大 屏', xCenter, 77, '#fff', 38, 'center');

drawText('产业优势', xCenter - 853, 182, '#00D7FB', 19);
drawText('产业增长', xCenter - 853, 454, '#00D7FB', 19);
drawText('民生关注', xCenter - 853, 732, '#00D7FB', 19);
drawText('游客趋势分析', xCenter - 372, 732, '#00D7FB', 19);
drawText('三塘', xCenter + 470, 182, '#00D7FB', 19);
drawText('五塘', xCenter + 470, 454, '#00D7FB', 19);
drawText('地铁线路', xCenter + 470, 732, '#00D7FB', 19);

drawText(diqu, xCenter - 478, 75, '#fff', 11);


drawText('室外温度', xCenter + 550, 75, '#fff', 9);

drawText('室内温度', xCenter + 665, 75, '#fff', 9);
document.getElementById('wendu-shinei').innerHTML=shineiwendu;

function getWeatherData(){
    //当天天气查询
    $.ajax({
        url: "http://api.yytianqi.com/forecast7d?city="+cityCode+"&key="+weatherKey,
        type: 'GET',
        dataType:'json',
        success: function (data) {
            console.log(data)
            if(data.code == 1 && data.data && data.data.list && data.data.list[0]){
                tianqi=data.data.list[0].tq1 + " / "+data.data.list[0].qw2+"-"+data.data.list[0].qw1 +"℃";
            }
            document.getElementById('weather').innerHTML=tianqi;
        },error:function(){
            document.getElementById('weather').innerHTML=tianqi;
        }
    });
    //室外温度查询
    $.ajax({
        url: "http://api.yytianqi.com/observe?city="+cityCode+"&key="+weatherKey,
        type: 'GET',
        dataType:'json',
        success: function (data) {
            console.log(data)
            if(data.code == 1 && data.data){
                shiwaiwendu=data.data.qw+"℃";
            }
            document.getElementById('wendu-shiwai').innerHTML=shiwaiwendu;
        },error:function(){
            document.getElementById('wendu-shiwai').innerHTML=shiwaiwendu;
        }
    });
}
getWeatherData();

//echart-pie1
if (document.getElementById('echart-pie1')) {

    var echartPie1 = echarts.init(document.getElementById('echart-pie1'));

    var optionPie1 = {
        title: {
            text: '兴宁区贸易第三产业\n占GDP的80%',
            left: 'center',
            top: 168,
            textStyle: {
                color: '#fff',
                fontSize: 9,
                lineHeight: 16
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {d}%"
        },
        series: [
            {
                name: 'GDP占比',
                type: 'pie',
                center: ['50%', '45%'],
                radius: ['45%', '60%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: xingningqudisanchanye.qita, name: '其他产业', itemStyle: {color: "rgba(102,102,102,0.3)"}},
                    {value: xingningqudisanchanye.disan, name: '第三产业', itemStyle: {color: "#00FFCE"}},
                ]
            }
        ]
    }
    echartPie1.setOption(optionPie1);
    setInterval(function () {
        echartPie1.clear();
        echartPie1.setOption(optionPie1);
    }, 240000);


    var echartPie1_zr = echartPie1.getZr();
    echartPie1_zr.add(new echarts.graphic.Text({
            style: {
                x: 100,
                y: 88,
                textFill: '#fff',
                text: xingningqudisanchanye.disan + '%',
                textAlign: 'center',
                textFont: '16px verdana'
            }
        }
    ));
}


//echart-pie2
if (document.getElementById('echart-pie2')) {

    var echartPie2 = echarts.init(document.getElementById('echart-pie2'));
    var optionPie2 = {
        title: {
            text: '第三产业全市居首\n占比20%',
            left: 'center',
            top: 168,
            textStyle: {
                color: '#fff',
                fontSize: 9,
                lineHeight: 16
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {d}%"
        },
        legend: {
            orient: 'vertical',
            left: 158,
            top: '40%',
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
            data: ['兴宁区', '其他区'],
            textStyle: {
                fontSize: 11,
                color: '#fff',
                lineHeight: 18
            },
            formatter: function (name) {
                return "" + name + ""
            },
            padding: [2, 2]
        },
        series: [
            {
                name: '第三产业占比',
                type: 'pie',
                center: ['35%', '45%'],
                radius: '58%',
                avoidLabelOverlap: false,
                //roseType: 'radius',
                label: {
                    normal: {
                        position: 'inner',
                        formatter: '{d}%',
                        textStyle: {
                            color: '#fff',
                            fontSize: 13
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {
                        value: disanxingningquzhanbi.qita,
                        name: '其他区',
                        itemStyle: {
                            normal: {
                                color: "rgba(0,201,255,0.6)",
                                borderWidth: '2',
                                borderColor: '#57deff',
                            },
                        }
                    },
                    {
                        value: disanxingningquzhanbi.xingningqu,
                        name: '兴宁区',
                        selected: true,
                        itemStyle: {
                            normal: {
                                color: "rgba(0,255,133,0.6)",
                                borderWidth: '2',
                                borderColor: '#13f393',
                            },
                        }
                    },
                ]
            }
        ]
    }
    echartPie2.setOption(optionPie2);
    setInterval(function () {
        echartPie2.clear();
        echartPie2.setOption(optionPie2);
    }, 280000);
}


//echart-pie3
if (document.getElementById('echart-pie3')) {
    var echartPie3 = echarts.init(document.getElementById('echart-pie3'));
    var optionPie3 = {
        title: {
            text: '规划用地（亩）',
            left: 40,
            top: 20,
            textStyle: {
                color: '#fff',
                fontSize: 15,
                lineHeight: 16
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}：{c}亩（{d}%）"
        },
        legend: {
            orient: 'vertical',
            left: 178,
            top: '30%',
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
            data: ['工业净用地', '物流用地', '道路用地', '绿化及其他'],
            textStyle: {
                fontSize: 11,
                color: '#fff',
                lineHeight: 18
            },
            formatter: function (name) {
                return "" + name + ""
            },
            padding: [2, 2]
        },
        series: [
            {
                name: '规划用地',
                type: 'pie',
                center: ['32%', '60%'],
                radius: '55%',
                avoidLabelOverlap: false,
                //roseType: 'radius',
                label: {
                    normal: {
                        position: 'inner',
                        formatter: '{c}',
                        textStyle: {
                            color: '#fff',
                            fontSize: 11
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {
                        value: guihuayongdi.gongye,
                        name: '工业净用地',
                        itemStyle: {
                            normal: {
                                color: "rgba(0,201,255,0.6)",
                                borderWidth: '2',
                                borderColor: '#57deff',
                            },
                        }
                    },
                    {
                        value: guihuayongdi.wuliu,
                        name: '物流用地',
                        selected: true,
                        itemStyle: {
                            normal: {
                                color: "rgba(255,255,0,0.4)",
                                borderWidth: '2',
                                borderColor: '#FFFF00',
                            },
                        }
                    },
                    {
                        value: guihuayongdi.daolu,
                        name: '道路用地',
                        selected: true,
                        itemStyle: {
                            normal: {
                                color: "rgba(73,234,215,0.6)",
                                borderWidth: '2',
                                borderColor: '#49EAD7',
                            },
                        }
                    },
                    {
                        value: guihuayongdi.lvhuaqita,
                        name: '绿化及其他',
                        selected: true,
                        itemStyle: {
                            normal: {
                                color: "rgba(255,149,69,0.6)",
                                borderWidth: '2',
                                borderColor: '#FF9545',
                            },
                        }
                    },
                ]
            }
        ]
    }
    echartPie3.setOption(optionPie3);

    setInterval(function () {
        echartPie3.clear();
        echartPie3.setOption(optionPie3);
    }, 260000);
}


//echart-bar1
if (document.getElementById('echart-bar1')) {

    var dataListBar1 = chanyezengzhang;
    var xAxisDataBar1 = ['地区生产总值', '财政收入', '固定资产投资', '社会消费零售总额'];

    var echartBar1 = echarts.init(document.getElementById('echart-bar1'));
    var optionBar1 = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985',
                },
            }
        },
        legend: {
            orient: 'vertical',
            right: 15,
            top: 50,
            icon: 'circle',
            selectedMode: false,
            itemWidth: 10,
            itemHeight: 10,
            data: ['2016', '2017', '2018'],
            textStyle: {
                fontSize: 11,
                color: '#fff',
                lineHeight: 18
            },
        },
        grid: {
            left: 25,
            right: 80,
            bottom: 25,
            top: 25,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: xAxisDataBar1,
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            },
            axisLabel: {
                interval: 0,
                // rotate: -30,
                textStyle: {
                    color: '#fff',
                    fontSize: 8,
                }
            },
        },
        yAxis: {
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            max: 'dataMax'
        },
        series: [{
            name: dataListBar1[0].name,
            type: 'bar',
            barWidth: 16,
            data: dataListBar1[0].data,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#00FFFF'
                    }, {
                        offset: 1,
                        color: '#08457c'
                    }]),
                },
            },
        }, {
            name: dataListBar1[1].name,
            type: 'bar',
            barWidth: 16,
            data: dataListBar1[1].data,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#00FFCC'
                    }, {
                        offset: 1,
                        color: '#08457c'
                    }]),
                },
            },
        }, {
            name: dataListBar1[2].name,
            type: 'bar',
            barWidth: 16,
            data: dataListBar1[2].data,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#4AA3FF'
                    }, {
                        offset: 1,
                        color: '#08457c'
                    }]),
                },
            },
        }]
    };
    echartBar1.setOption(optionBar1);
    setInterval(function () {
        echartBar1.clear();
        echartBar1.setOption(optionBar1);
    }, 250000);


    var maxData = 1;
    for (var i = 0; i < dataListBar1.length; i++) {
        for (var j = 0; j < dataListBar1[i].data.length; j++) {
            if (dataListBar1[i].data[j] > maxData) maxData = dataListBar1[i].data[j];
        }
    }
    var echartBar1Height = 152;
    console.log(maxData, echartBar1Height);

    var rateListBar1 = [
        {
            rate: Math.round((dataListBar1[1].data[0] - dataListBar1[0].data[0]) / dataListBar1[0].data[0] * 1000) / 10 + '%',
            x: 50,
            y: dataListBar1[0].data[0] / maxData * echartBar1Height
        }, {
            rate: Math.round((dataListBar1[2].data[0] - dataListBar1[1].data[0]) / dataListBar1[1].data[0] * 1000) / 10 + '%',
            x: 75,
            y: dataListBar1[1].data[0] / maxData * echartBar1Height
        }, {
            rate: Math.round((dataListBar1[1].data[1] - dataListBar1[0].data[1]) / dataListBar1[0].data[1] * 1000) / 10 + '%',
            x: 133,
            y: dataListBar1[0].data[1] / maxData * echartBar1Height
        }, {
            rate: Math.round((dataListBar1[2].data[1] - dataListBar1[1].data[1]) / dataListBar1[1].data[1] * 1000) / 10 + '%',
            x: 158,
            y: dataListBar1[1].data[1] / maxData * echartBar1Height
        }, {
            rate: Math.round((dataListBar1[1].data[2] - dataListBar1[0].data[2]) / dataListBar1[0].data[2] * 1000) / 10 + '%',
            x: 213,
            y: dataListBar1[0].data[2] / maxData * echartBar1Height
        }, {
            rate: Math.round((dataListBar1[2].data[2] - dataListBar1[1].data[2]) / dataListBar1[1].data[2] * 1000) / 10 + '%',
            x: 237,
            y: dataListBar1[1].data[2] / maxData * echartBar1Height
        }, {
            rate: Math.round((dataListBar1[1].data[3] - dataListBar1[0].data[3]) / dataListBar1[0].data[3] * 1000) / 10 + '%',
            x: 295,
            y: dataListBar1[0].data[3] / maxData * echartBar1Height
        }, {
            rate: Math.round((dataListBar1[2].data[3] - dataListBar1[1].data[3]) / dataListBar1[1].data[3] * 1000) / 10 + '%',
            x: 320,
            y: dataListBar1[1].data[3] / maxData * echartBar1Height
        },
    ]
    console.log(rateListBar1);


    function echartBar1DrawText(text, x, y) {
        echartBar1.getZr().add(new echarts.graphic.Text({
                style: {
                    text: text,
                    x: x,
                    y: 222 - y - 75,
                    textFill: '#fff',
                    textAlign: 'center',
                    font: '8px Microsoft Yahei'
                }
            }
        ));
    }

    var echartBar1UpImgs = $('.echart-bar1-up-img');

    for (var i = 0; i < rateListBar1.length; i++) {
        echartBar1DrawText(rateListBar1[i].rate, rateListBar1[i].x, rateListBar1[i].y);
        echartBar1UpImgs.eq(i).css({
            left: rateListBar1[i].x - 6,
            bottom: rateListBar1[i].y + 55
        })
    }
}


//echart-pie3
if (document.getElementById('echart-line1')) {
    var echartLine1 = echarts.init(document.getElementById('echart-line1'));
    var dataIPSxAxis = youkequshifenxi.nianfen;
    var dataIPS = youkequshifenxi.bendi;
    var dataIPS2 = youkequshifenxi.waidi;
    var dataIPS3 = [];
    for (var i = 0; i < dataIPS.length; i++) {
        dataIPS3.push(Math.round((dataIPS[i] + dataIPS2[i]) * 100) / 100);
    }
    var optionLine1 = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985',
                },
            }
        },
        color: ["#00CBFE", "#00FFCC", "#4AA3FF"],
        grid: {
            left: 30,
            right: 140,
            top: 80,
            bottom: 10,
            containLabel: true
        },
        legend: {
            orient: 'vertical',
            right: 15,
            top: 80,
            icon: 'circle',
            selectedMode: false,
            itemWidth: 10,
            itemHeight: 10,
            data: ['总人数', '本地一日游人数', '外地一日游人数'],
            textStyle: {
                fontSize: 11,
                color: '#fff',
                lineHeight: 18
            },
        },
        xAxis: [{
            name: ' \n \n 年',
            nameTextStyle: {
                color: "#fff",
                fontSize: 11,
                lineHeight: 19,
            },
            type: 'category',
            boundaryGap: false,
            data: dataIPSxAxis,
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff',
                    fontSize: 11,
                },
                margin: 15,
            },
            axisLine: {
                lineStyle: {
                    color: '#4CBDE5',
                }
            }
        }],
        yAxis: [{
            name: '万人次                  ',
            nameTextStyle: {
                color: "#fff",
                fontSize: 11,
            },
            type: 'value',
            axisLine: {
                show: false
            },
            axisLabel: {
                show: true,
                textStyle: {
                    color: '#fff',
                    fontSize: 11,
                },
                margin: 15,
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255,255,255,0.3)',
                    width: 0.5
                }

            },
            //max: 'dataMax'
        }],
        series: [
            {
                name: '总人数',
                type: 'line',
                smooth: true,
                symbol: "none",
                lineStyle: {
                    width: 1,
                    color: "#4AA3FF"
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(74,163,255,0.15)'
                    },
                },
                data: dataIPS3,
            },
            {
                name: '本地一日游人数',
                type: 'line',
                smooth: true,
                symbol: "none",
                lineStyle: {
                    width: 1,
                    color: "#4CBDE5"
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(0,179,234,0.15)'
                    },
                },
                data: dataIPS,
            },

            {
                name: '外地一日游人数',
                type: 'line',
                smooth: true,
                symbol: "none",
                lineStyle: {
                    width: 1,
                    color: "#00FFCC"
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(76,189,229,0.15)'
                    },
                },
                data: dataIPS2,
            },


        ]
    };
    echartLine1.setOption(optionLine1);

    setInterval(function () {
        echartLine1.clear();
        echartLine1.setOption(optionLine1);
    }, 270000);
}


document.getElementById('jingqu-4a').innerHTML = jingqu4A + '个';
document.getElementById('jingqu-3a').innerHTML = jingqu3A + '个';
document.getElementById('jingqu-xiuxian').innerHTML = jingquxiuxian + '个';


var zongmianjiHtml = '';
var zongmianjiStr = zongmianji.toString();
for (var i = 0; i < zongmianjiStr.length; i++) {
    zongmianjiHtml += '<i>' + zongmianjiStr[i] + '</i>'
}
document.getElementById('zongmianji').innerHTML = zongmianjiHtml;


/*var wutangMapImages=document.getElementById('wutang-map').getElementsByTagName('img');

 var wutangMapImagesIndex=0;
 setInterval(function(){
 for(var i=0;i<wutangMapImages.length;i++){
 wutangMapImages[i].className='';
 }
 wutangMapImages[wutangMapImagesIndex].className='active';
 wutangMapImagesIndex++;
 if(wutangMapImagesIndex>=wutangMapImages.length) wutangMapImagesIndex=0;
 },1500);*/
















