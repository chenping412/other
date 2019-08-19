

//天气接口调用限制： 15次/小时
var weatherKey="s8dvwdhmb99c74qe";
var cityCode="CH300101";



/*以下配置，均改 "" 引号之间的内容即可正确配置*/
/*如果是文字，一定要被引号包含，如果是数字，可以不需要引号*/


var diqu = "南宁市兴宁区";   //位置地区
var tianqi = "小雨 / 11-25℃";   //天气
var shiwaiwendu = "32℃";   //室外温度
var shineiwendu = "25℃";   //室内温度
var zongmianji = 751;   //总面积


//兴宁区贸易第三产业占GDP比例
var xingningqudisanchanye = {
    disan: 80,  //第三产业
    qita: 20,  //其他产业
};


//第三产业，兴宁区占全市比例
var disanxingningquzhanbi = {
    xingningqu: 20,  //兴宁区
    qita: 80,  //其他区
};


//规划用地
var guihuayongdi = {
    gongye: 2609.2,    //工业净用地
    wuliu: 592.8,    //物流用地
    daolu: 464,    //道路用地
    lvhuaqita: 530.9,    //绿化及其他
};


//产业增长数据
//各年份中 data:[] 中的数值，分别对应：['地区生产总值', '财政收入', '固定资产投资', '社会消费零售总额']
var chanyezengzhang = [
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


//游客趋势分析，年份和人数，一一对应
var youkequshifenxi = {
    nianfen: ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'],   //年份
    bendi: [190.61, 380.21, 171.18, 297.57, 541.61, 554.92, 688.17, 774.47],   //本地一日游人数
    waidi: [26.3, 80.02, 46.46, 64.65, 95.77, 220.12, 370.67, 483.52],   //外地一日游人数
};

var jingqu4A = 6;         //4A景区个数
var jingqu3A = 3;         //3A景区个数
var jingquxiuxian = 10;   //休闲景区个数