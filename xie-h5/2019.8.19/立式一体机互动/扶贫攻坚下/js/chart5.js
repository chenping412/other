function makeOpt5() {
    var data = [{
        name: '养老保险',
        value: 100
    },
    {
        name: '医疗保险',
        value: 100
    },
    {
        name: '住院报销',
        value: 92.68
    },
    {
        name: '慢性病报销',
        value: 83.85
    }]

    var titleArr = [{
        text: '扶 贫 医 疗 保 障',
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
    colors = [['#54bde5', '#7fcae5', 'rgba(83,189,228,.2)'], ['#05a6e3', '#2eb0e1', 'rgba(16,170,226,.2)'], ['#f4f076', '#edeba7', 'rgba(232,233,121,.2)'], ['#ff2a5c', '#f991a9', 'rgba(255,42,92,.2)'], ['#a181fc', '#e3d9fe']];
    data.forEach(function(item, index) {
        titleArr.push({
            text: item.name,
            left: index * 25 + 10 + '%',
            bottom: 20,
            textAlign: 'center',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 10,
                color: '#ffffff',
                textAlign: 'center'
            },
        });
        seriesArr.push({
            name: item.name,
            type: 'pie',
            clockWise: false,
            radius: [22, 22],
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
            center: [index * 25 + 12 + '%', '56%'],
            data: [{
                value: item.value,
                itemStyle: {
                    normal: {
                        color: colors[index][0],
                        borderColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: colors[index][0]
                        },
                        {
                            offset: 1,
                            color: colors[index][1]
                        }]),
                        borderWidth: 7
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
                            fontSize: 9,
                            fontWeight: 'normal',
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
                        borderColor: colors[index][2],
                        borderWidth: 7
                    },
                    emphasis: {
                        borderColor: colors[index][2],
                        borderWidth: 7
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