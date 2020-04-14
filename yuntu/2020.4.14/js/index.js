/**
 * Created by Administrator on 2020/4/14.
 */
var type = 0;

/* echart 加载光明街道地图 */
function echartMap() {
    var gridValue = echarts.getMap("光明网格");
    var partyValue = echarts.getMap("光明街道党支部");
    var gridData = [];
    var partyData = [];
    var features = gridValue.geoJson.features;
    var partyFeatures = partyValue.geoJson.features;

    var markPoint = {
        symbol: 'image://images/u56.png',
        symbolSize: 30,
        z: 3,
        data: [
            {
                communityId: 17,
                name: "光明",
                coord: [113.938320846230113, 22.75257111906194],
                symbolOffset: ['-100%', 0]
            },
            {
                communityId: 18,
                name: "东周",
                coord: [113.924196831618588, 22.763780004643536],
                symbolOffset: ['-100%', 0]
            },
            {
                communityId: 19,
                name: "翠湖",
                coord: [113.941601562262349, 22.767267787778223],
                symbolOffset: ['-100%', 0]
            },
            {
                communityId: 20,
                name: "迳口",
                coord: [113.965782326593171, 22.765447546467158],
                symbolOffset: ['-100%', 0]
            },
            {
                communityId: 21,
                name: "白花",
                coord: [113.981946816592426, 22.74159470373263],
                symbolOffset: ['-100%', 0]
            },
            {
                communityId: 22,
                name: "碧眼",
                coord: [113.956205896684878, 22.750474519683394],
                symbolOffset: ['-100%', 0]
            },
        ]
    };

    for (var i = 0; i < features.length; i++) {
        gridData.push(features[i].properties);
    }

    for (var j = 0; j < partyFeatures.length; j++) {
        partyFeatures[j].properties["value"] = j + 1;
        partyData.push(partyFeatures[j].properties);
    }

    var option = {
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter: function (params) {
                return params.name;
            }
        },
        visualMap: {
            left: 'right',
            min: 1,
            max: 50,
            inRange: {
                color: ["#ffd861", "#fef89a", "#8ebbd0", "#febd4d", "#96d4c4", "#8bc95d",
                    "#FFCCFF", "#FFCCCC", "#FFCC99", "#FFCC66", "#FFCC33", "#FFCC00",
                    "#FF99FF", "#FF99CC", "#FF9999", "#FF9966", "#FF9933", "#FF9900",
                    "#E8FFC4", "#DEFFAC", "#D3FF93", "#CCFF80", "#C2FF68", "#B7FF4A",
                    "#E6E6F2", "#D8D8EB", "#C7C7E2", "#B8B8DC", "#A6A6D2", "#9999CC",
                    "#E8E8D0", "#DEDEBE", "#D6D6AD", "#CDCD9A", "#C2C287", "#B9B973",
                    "#D1E9E9", "#C4E1E1", "#B3D9D9", "#A3D1D1", "#95CACA", "#81C0C0",
                    "#FFF4C1", "#FFF0AC", "#FFED97", "#FFE66F", "#FFE153", "#FFDC35",
                    "red", "#FFDC35"
                ]
            },
            calculable: false,
            show: false
        },
        geo: {
            map: '光明区',
            zoom: 1,
            roam: false, //是否允许缩放
        },
        series: [
            {
                id: 1,
                name: '光明地图',
                type: 'map',
                roam: true,
                map: '光明区',
                zoom: 1,
                scaleLimit: {//最大最小缩放级别
                    min: 1,
                    max: 5
                },
                z: 2,
                roam: false,//是否允许拖动
                label: {//地图文字标签
                    show: true,
                    textStyle: {
                        color: 'black', //地图初始化区域字体颜色
                        fontSize: 14,
                        opacity: 1,
                        backgroundColor: 'rgba(0,23,11,0)'
                    },
                },
                emphasis: false,
                /* 					                itemStyle:{
                 emphasis:{label:{show:true}}
                 }, */
                data: [
                    {name: '光明', value: 1, communityId: 17},
                    {name: '东周', value: 2, communityId: 18},
                    {name: '翠湖', value: 3, communityId: 19},
                    {name: '迳口', value: 4, communityId: 20},
                    {name: '白花', value: 5, communityId: 21},
                    {name: '碧眼', value: 6, communityId: 22}
                ],
                markPoint: markPoint,
            },
            {
                id: 2,
                name: '光明网格',
                type: 'map',
                roam: true,
                map: '光明网格',
                scaleLimit: {//最大最小缩放级别
                    min: 1,
                    max: 5
                },
                z: 3,
                roam: false,//是否允许拖动
                itemStyle: {
                    areaColor: 'rgba(0,0,0,0)',
                    borderWidth: 1,
                    borderColor: 'rgb(255,255,255,0.8)',
                },
                emphasis: false,
                data: gridData,
            },
            {
                id: 3,
                name: '光明街道党支部',
                type: 'map',
                roam: true,
                map: '',
                scaleLimit: {//最大最小缩放级别
                    min: 1,
                    max: 5
                },
                z: 1,
                emphasis: false,
                roam: false,//是否允许拖动
                itemStyle: {
                    areaColor: 'rgba(0,0,0,0.5)',
                    borderWidth: 1,
                    borderColor: 'white',
                },
                emphasis: false,
                data: partyData,
            },
            {
                type: 'lines',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 4, //箭头指向速度，值越小速度越快
                    trailLength: 0.1, //特效尾迹长度[0,1]值越大，尾迹越长重
                    symbol: 'arrow', //箭头图标
                    symbolSize: 10, //图标大小
                },
                lineStyle: {
                    normal: {
                        width: 3, //尾迹线条宽度
                        opacity: 0.1, //尾迹线条透明度
                        curveness: .5, //尾迹线条曲直度,
                    }
                },
                "data": [
                    [{
                        "coord": [113.94160156226235, 22.76467787778223],
                        value: 49
                    }, {
                        "coord": [113.93832084623011, 22.75257111906194],
                    }],
                    [{
                        "coord": [113.94160156226235, 22.76467787778223],
                        value: 49
                    }, {
                        "coord": [113.94160156226235, 22.767267787778223],
                    }],
                    [{
                        "coord": [113.94160156226235, 22.76467787778223],
                        value: 49
                    }, {
                        "coord": [113.92419683161859, 22.763780004643536],
                    }],
                    [{
                        "coord": [113.94160156226235, 22.76467787778223],
                        value: 49
                    }, {
                        "coord": [113.96578232659317, 22.765447546467158],
                    }],
                    [{
                        "coord": [113.94160156226235, 22.76467787778223],
                        value: 49
                    }, {
                        "coord": [113.98194681659243, 22.74159470373263],
                    }],
                    [{
                        "coord": [113.94160156226235, 22.76467787778223],
                        value: 49
                    }, {
                        "coord": [113.95620589668488, 22.750474519683394],
                    }]
                ]
            }
        ]
    };
    var mychar = echarts.init(document.getElementById('mapDiv'));
    mychar.setOption(option);

    mychar.on("click", function (params) {
        if (type == 2) {
            $.ajax({
                method: "post",
                async: true,
                url: contextPath + "/partyDp/getPartyBranch",
                data: {"id": params.data.communityId},
                dataType: "json",
                success: function (result) {
                    if (result.rows[0] != "" && result.rows[0] != null) {
                        var data = result.rows[0];
                        var name = data.name.substring(0, 2);
                        var id = data.id;
                        var gridId = params.data.id;
                        var gridName = params.data.name;
                        gridSkip(id, name, gridId, gridName);
                    }
                }
            });
        } else {
            var id = params.data.communityId;
            var name = params.data.name.substring(0, 2);
            communitySkip(id, name);
        }
    });

    //icheck
    $(':checkBox').on('change', function () {
        console.log(this.checked)
        if ($(this).val() == '1') {
            if(this.checked){
                option.series[1].map = '光明网格';
                option.series[1].z = 3;
            }else {
                option.series[1].map = '';
            }
        }
        if ($(this).val() == '2') {
            if(this.checked){
                option.series[2].map = '光明街道党支部';
                option.series[2].z = 3;
                type = 2;
            }else {
                option.series[2].map = '';
                type = 0;
            }
        }
        mychar.setOption(option);
    })
}