/**
 * Created by Administrator on 2019/7/28.
 */

//时钟
function setTime() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth()+1;
    if(m<10) m='0'+m;
    var d=now.getDate();
    if(d<10) d='0'+d;

    var hh=now.getHours();
    if(hh<10) hh='0'+hh;
    var MM=now.getMinutes();
    if(MM<10) MM='0'+MM;
    var ss=now.getSeconds();
    if(ss<10) ss='0'+ss;

    var w=now.getDay();
    var weekList=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    var week=weekList[w];

    //console.log(y,m,d,hh,MM,ss,week);
    return y+' / '+m+' / '+d + '   '+week+'     '+hh+' : '+MM+' : '+ss;
}
document.getElementById('time').innerHTML=setTime();
setInterval(function(){
    document.getElementById('time').innerHTML=setTime();
},1000);


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

drawText('南宁市兴宁区', xCenter - 478, 75, '#fff', 11);

drawText('小雨 / 11-25℃', xCenter + 430, 75, '#fff', 11);
drawText('室外温度', xCenter + 550, 75, '#fff', 9);
drawText('26℃', xCenter + 597, 75, '#fff', 11);
drawText('室内温度', xCenter + 665, 75, '#fff', 9);
drawText('21℃', xCenter + 710, 75, '#fff', 11);

$.ajax({
    url: "http://www.myqsl.cn/MM2/register/queryNanNingList.json",
    type: 'POST',
    data: JSON.stringify({
        id: 1
    }),
    contentType: 'application/json; charset=utf-8',
    success: function (data) {
        console.log(data)
    }
});





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
                    {value: 20, name: '其他产业', itemStyle: {color: "rgba(102,102,102,0.3)"}},
                    {value: 80, name: '第三产业', itemStyle: {color: "#00FFCE"}},
                ]
            }
        ]
    }
    echartPie1.setOption(optionPie1);
    setInterval(function () {
        echartPie1.clear();
        echartPie1.setOption(optionPie1);
    }, 5000);


    var echartPie1_zr = echartPie1.getZr();
    echartPie1_zr.add(new echarts.graphic.Text({
            style: {
                x: 100,
                y: 88,
                textFill: '#fff',
                text: '80%',
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
                        value: 80,
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
                        value: 20,
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
    }, 4000);
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
                        value: 2609.2,
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
                        value: 592.8,
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
                        value: 464,
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
                        value: 530.9,
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
    }, 4500);
}


//echart-bar1
if (document.getElementById('echart-bar1')) {

    var dataListBar1 = [
        {
            name: '2016',
            data: [371.5, 38.6, 251.4, 415.5],
        }, {
            name: '2017',
            data: [401.22, 41.15, 274, 461.5],
        }, {
            name: '2018',
            data: [425.29, 44.5, 317.8, 498.4],
        },
    ];
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
            data: ['2016','2017', '2018'],
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
    }, 5500);


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
                    y: 222 - y - 70,
                    textFill: '#fff',
                    textAlign: 'center',
                    font: '8px Microsoft Yahei'
                }
            }
        ));
    }

    for (var i = 0; i < rateListBar1.length; i++) {
        echartBar1DrawText(rateListBar1[i].rate, rateListBar1[i].x, rateListBar1[i].y)
    }
}


//echart-pie3
if (document.getElementById('echart-line1')) {
    var echartLine1 = echarts.init(document.getElementById('echart-line1'));
    var dataIPSxAxis = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'];
    var dataIPS = [190.61, 380.21, 171.18, 297.57, 541.61, 554.92, 688.17, 774.47];
    var dataIPS2 = [26.3, 80.02, 46.46, 64.65, 95.77, 220.12, 370.67, 483.52];
    var dataIPS3 = [];
    for(var i=0;i<dataIPS.length;i++){
        dataIPS3.push(Math.round((dataIPS[i]+dataIPS2[i])*100)/100);
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
            right: 100,
            top: 80,
            bottom: 10,
            containLabel: true
        },
        legend: {
            orient: 'vertical',
            right: 5,
            top: 80,
            icon: 'circle',
            selectedMode: false,
            itemWidth: 10,
            itemHeight: 10,
            data: ['总和','本地一日游', '外地一日游'],
            textStyle: {
                fontSize: 11,
                color: '#fff',
                lineHeight: 18
            },
        },
        xAxis: [{
            name: '年',
            nameTextStyle: {
                color: "#fff"
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
            },
            axisLine: {
                lineStyle: {
                    color: '#4CBDE5',
                }
            }
        }],
        yAxis: [{
            name: '人数（万人次）',
            nameTextStyle: {
                color: "#fff"
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
                }
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
                name: '总和',
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
                name: '本地一日游',
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
                name: '外地一日游',
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
    }, 6000);
}


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
















