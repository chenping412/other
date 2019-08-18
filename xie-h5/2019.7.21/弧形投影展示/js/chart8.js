function makeOpt8() {
    var data = [{
        name: '6个贫困村收入',
        value: 58.27,
        money: '31.1万元'

    },
    {
        name: '村集体收入',
        value: 44.85,
        money: '191.5万元'
    }]

    var titleArr = [{
        text: '发展产业、带贫增收',
        top: 10,
        left: 0,
        textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#ffffff',
            textAlign: 'center'
        }
    },
    {
        text: '投入资金：2439万+',
        top: 12,
        right: 0,
        textStyle: {
            fontWeight: 'normal',
            fontSize: 12,
            color: '#ffffff',
            textAlign: 'center'
        }
    }],
    seriesArr = [],
    colors = [['#ff2a5c', '#00f29f'], ['#fff100', '#b27cff'], ['#ffc257', '#ffedcc'], ['#fd6f97', '#fed4e0'], ['#a181fc', '#e3d9fe']];
    
    data.forEach(function(item, index) {
        titleArr.push({
            text: item.name,
            left: index * 50 + 25 + '%',
            bottom: 10,
            textAlign: 'center',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 11,
                color: '#ffffff'
            }
            
        },{
            text: ['{a|○ }', item.money].join(''),
            left: index * 50 + 22 + '%',
            bottom: 20,
            textAlign: 'center',
            textStyle: {
                fontWeight: 'bold',
                fontSize: 12,
                color: colors[index][0],
                rich: {
                    a: {
                        fontSize: 25
                    }
                }
            }
        });
        seriesArr.push({
            name: item.name,
            type: 'pie',
            clockWise: false,
            radius: [29, 30], 
            itemStyle: {
                normal: {
                    color: '#64d9f4',
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }                
            },
            hoverAnimation: false,
            center: [index * 50 + 25 + '%', '50%'],          
            data: [{
                value: 100,
                
                label: {
                    normal: {
                        formatter: [
                            '{a|同比增长    }',
                            '{b|'+ data[index].value + '%}'
                        ].join('\n'),
                        position: 'center',
                        show: true,
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: colors[index][0],
                        rich: {
                            a: {
                                color: '#eee',
                                fontSize: 8,
                                lineHeight: 12
                            },
                            b: {
                                color: colors[index][0]
                            }
                        }
                    },
                    
                },
            }]
        })
        seriesArr.push({
            name: item.name,
            type: 'pie',
            clockWise: false,
            radius: [41, 42], 
            itemStyle: {
                normal: {
                    color: '#64d9f4',
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }                
            },
            hoverAnimation: false,
            center: [index * 50 + 25 + '%', '50%'],          
            data: [{value: 100}]
        })
        seriesArr.push({
            name: "",
            type: "gauge",
            radius: 39,
            center: [index * 50 + 25 + '%', '50%'],
            startAngle: 0,
            endAngle: 359.9,
            splitNumber: 50,
            axisTick: {
                show: false
            },
            splitLine: {
                length: 70,
                lineStyle: {
                    width: 2,
                    color: "#1d6bc5"
                }
            },
            axisLabel: {
                show: false
            },
            pointer: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    opacity: 0
                }
            },
            detail: {
                show: false
            },
            data: [{
                value: 0,
                name: ""
            }]
        },
        {
            name: "",
            type: "pie",
            radius: [32, 39],
            center: [index * 50 + 25 + '%', '50%'],
            silent: true,
            clockwise: false,
            startAngle: 90,
            z: 0,
            zlevel: 0,
            label: {
                normal: {
                    position: "center"
                }
            },
            data: [{
                    value: data[index].value,
                    name: "",
                    
                    itemStyle: {
                        normal: {
                            color: colors[index][0],
                        }
                    }
                },
                {
                    value: 100-data[index].value,
                    name: "",
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#1c84cd"
                        }
                    }
                }
            ]
        })
    });

    option = {
        title: titleArr,
        series: seriesArr
    }
    return option;
}