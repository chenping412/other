/**
 * Created by Administrator on 2019/7/28.
 */


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
//drawText('据', xCenter - 100, 75, '#fff', 38);
//drawText('可', xCenter - 50, 75, '#fff', 38);
//drawText('视', xCenter, 75, '#fff', 38);
//drawText('化', xCenter + 50, 75, '#fff', 38);
//drawText('大', xCenter + 100, 75, '#fff', 38);
//drawText('屏', xCenter + 150, 75, '#fff', 38);


drawText('产业优势', xCenter - 853, 182, '#00D7FB', 19);
drawText('产业增长', xCenter - 853, 454, '#00D7FB', 19);
drawText('民生关注', xCenter - 853, 732, '#00D7FB', 19);
drawText('游客趋势分析', xCenter - 372, 732, '#00D7FB', 19);
drawText('三塘', xCenter + 470, 182, '#00D7FB', 19);
drawText('五塘', xCenter + 470, 454, '#00D7FB', 19);
drawText('地铁线路', xCenter + 470, 732, '#00D7FB', 19);


drawText('2018 / 07 / 11   星期日    13 : 15 : 45', xCenter - 746, 75, '#fff', 13);
drawText('南宁市兴宁区', xCenter - 478, 75, '#fff', 11);

drawText('小雨 / 11-25℃', xCenter + 430, 75, '#fff', 11);
drawText('室外温度', xCenter + 550, 75, '#fff', 9);
drawText('26℃', xCenter + 597, 75, '#fff', 11);
drawText('室内温度', xCenter + 665, 75, '#fff', 9);
drawText('21℃', xCenter + 710, 75, '#fff', 11);

//echart-pie1
if (document.getElementById('echart-pie1')) {

    var echartPie1 = echarts.init(document.getElementById('echart-pie1'));
    echartPie1.setOption({
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
    });


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
    echartPie2.setOption({
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
            top:'40%',
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
            data: ['兴宁区','其他区'],
            textStyle: {
                fontSize: 11,
                color: '#fff',
                lineHeight: 18
            },
            formatter: function(name) {
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
    });
}



//echart-pie3
if (document.getElementById('echart-pie3')) {

    var echartPie3 = echarts.init(document.getElementById('echart-pie3'));
    echartPie3.setOption({
        title: {
            text: '规划用地',
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
            top:'30%',
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
            data: ['工业净用地','物流用地','道路用地','绿化及其他'],
            textStyle: {
                fontSize: 11,
                color: '#fff',
                lineHeight: 18
            },
            formatter: function(name) {
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
                        formatter: '{c}亩',
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
                        value: 30,
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
                        value: 25,
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
                        value: 20,
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
    });
}



//echart-bar1
if (document.getElementById('echart-bar1')) {
    var echartBar1 = echarts.init(document.getElementById('echart-bar1'));
    echartBar1.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            orient: 'vertical',
            right: 20,
            top:50,
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
            data: ['2017', '2018', '2019'],
            textStyle: {
                fontSize: 11,
                color: '#fff',
                lineHeight: 18
            },
        },
        grid: {
            left:25,
            right: 95,
            bottom: 10,
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            data: ['地区生产总值', '财政收入', '固定资产投资', '社会消费零售总额']
        }],
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#F1F3F5',
                    type: 'solid'
                },
                interval: 2
            },
            splitNumber: 4,
        },
        series: [{
            name: '2017',
            type: 'bar',
            data: [800,300,600,1000]
        }, {
            name: '2018',
            type: 'bar',
            data: [900,400, 800,1200]
        }, {
            name: '2019',
            type: 'bar',
            data: [1000, 500, 1000,1400]
        }]
    });
}







function mainScale() {
    console.log(window.outerWidth);
    var windowWidth = window.outerWidth;
    var offsetWidth = document.documentElement.clientWidth;
    var offsetHeight = document.documentElement.clientHeight;
    console.log(offsetWidth);
    console.log(offsetHeight);
    document.getElementById('main').style.transform = "scale(" + offsetWidth / windowWidth + ")";
}
mainScale();
window.onresize = function () {
    mainScale()
}