/**
 * Created by chenp on 2019/7/5.
 */
var vm = new Vue({
    el: '#app',
    data: function () {
        return {
            apiHost:'http://www.myqsl.cn',

            id:'',






            companyContentShow:false,
            textDetailShow:false,
            companyPosition:{
                lng:113.960415,
                lat:22.534457
            },
            companyAddressComponents:{},
            myPosition:{
                lng:'',
                lat:''
            },
        }
    },
    created: function () {
        this.inti();
    },
    mounted:function(){
        this.mapInit();
    },
    methods: {
        inti:function(){
          var self=this;
            var obj = self.searchOjb();
            console.log(obj);
            if(obj.id) {
                self.id = obj.id;
                self.getCompanyInfo();
            }
        },

        getCompanyInfo:function(){
            var self = this;
            $.ajax({
                url:self.apiHost + "/MM2/register/queryEntInfoByIdH5.json",
                type:'POST',
                data:{
                    id:self.id
                },
                contentType:'application/json; charset=utf-8',
                dataType:'json',
                success:function(data){
                    console.log(data)
                }
            })
        },




        mapInit:function(){
            var self =this;
            var map = new BMap.Map("map");    // 创建Map实例
            var new_point = new BMap.Point(self.companyPosition.lng,self.companyPosition.lat);
            map.centerAndZoom(new_point, 16);  // 初始化地图,设置中心点坐标和地图级别
            map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            var marker = new BMap.Marker(new_point);  // 创建标注
            map.addOverlay(marker);
            map.panTo(new_point);

            var myGeo = new BMap.Geocoder();
            // 根据坐标得到地址描述
            myGeo.getLocation(new_point, function(result){
                if (result && result.addressComponents){
                    self.companyAddressComponents = result.addressComponents;
                }
            });
        },
        openMap:function(){
            var self =this;
            //获取当前位置经纬度
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    self.myPosition = r.point;
                   var url = "http://api.map.baidu.com/direction?origin=" + self.myPosition.lat + "," + self.myPosition.lng +
                        "&destination=" + self.companyPosition.lat + "," + self.companyPosition.lng +
                        "&mode=driving&region="+self.companyAddressComponents.city+"&output=html";
                    console.log(url);
                    location.href =url;
                }
                else {
                    alert('failed'+this.getStatus());
                }
            },{enableHighAccuracy: true});

        },

        searchOjb:function () {
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
    }
});