function makeOpt1() {
    var data = [{
        name: '农村网络',
        value: 100
    },
    {
        name: '农商服务站点',
        value: 89.19
    }]

    var titleArr = [{
        text: '布 局 农 村 电 商',
        top: 10,
        left: 10,
        textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#ffffff',
            textAlign: 'center'
        }
    }],
    seriesArr = [],
    colors = [['#00a8f2', '#00f29f'], ['#6773ff', '#b27cff'], ['#ffc257', '#ffedcc'], ['#fd6f97', '#fed4e0'], ['#a181fc', '#e3d9fe']];
    
    data.forEach(function(item, index) {
        titleArr.push({
            text: item.name,
            left: index * 50 + 22 + '%',
            bottom: 10,
            textAlign: 'center',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 16,
                color: '#ffffff',
                textAlign: 'center'
            },
        });
        seriesArr.push(
            {
            name: item.name,
            type: 'pie',
            clockWise: false,
            radius: [38, 38],
            itemStyle: {
                normal: {
                    color: colors[index][0],
                    shadowColor: colors[index][0],
                    shadowBlur: 0,
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    },
                }
            },
            hoverAnimation: false,
            center: [index * 50 + 25 + '%', '50%'],
            data: [{
                value: item.value,
                itemStyle: {
                    normal: {
                        "color": colors[index][0],
                        "borderColor": new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: colors[index][0]
                        },
                        {
                            offset: 1,
                            color: colors[index][1]
                        }]),
                        "borderWidth": 6,
                        shadowColor: colors[index][0],
                        shadowBlur: 20
                    }
                },
                label: {
                    normal: {
                        formatter: function(params) {
                            return params.value + '%';
                        },
                        position: 'center',
                        show: true,
                        textStyle: {
                            fontSize: 12,
                            fontWeight: 'bold',
                            color: colors[index][0]
                        }
                    }
                },
            },
            {
                value: 100 - item.value,
                name: 'invisible',
                itemStyle: {
                    normal: {
                        borderColor: '#bdbdbd',
                        borderWidth: 6
                    },
                    emphasis: {
                        borderColor: '#bdbdbd',
                        borderWidth: 6
                    }
                }
            }]
        })
    });

    option = {
        title: titleArr,
        series: seriesArr
    }
    return option;
}