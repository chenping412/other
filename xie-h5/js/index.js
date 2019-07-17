var vm = new Vue({
    el: '#app',
    data: function () {
        return {
            urlSearch:location.search,
            imgHost: imgHost,
            pdfHost: pdfHost,

            id: '',
            customerid: '',
            companyInfo: {},
            tags: [],
            collectInfo: {},
            bannerList: [],
            videoList: [],
            vrUrl: '',
            childrenCompanyList: [],

            groupstatusName:'企业',

            companyContentShow: false,

            bookList: [],
            bookDetail: {},
            bookSwiperIndex:0,

            companyPosition: {
                lng: 113.960415,
                lat: 22.534457
            },
            companyAddressComponents: {},
            myPosition: {
                lng: '',
                lat: ''
            },

            loading: false
        }
    },
    watch:{
        companyContentShow:function(val){
            this.bodyChange(val);
        },
        bannerList:function(){
            var self = this;
            self.$nextTick(function() {
                if (!self.bannerSwiper) {
                    self.bannerSwiper = new Swiper('#swiper-banner', {
                        autoplay: 4000,
                        autoplayDisableOnInteraction: false,
                        loop: true,
                        pagination: '.swiper-pagination',
                        paginationClickable: true
                    });
                } else {
                    self.bannerSwiper.update(true);
                }
            })
        }
    },
    created: function () {
        this.inti();
    },
    mounted: function () {

    },
    methods: {
        inti: function () {
            var self = this;
            var obj = self.searchOjb();
            console.log(obj);
            if (obj.id) {
            if (obj.id) self.customerid = obj.customerid;
                self.id = obj.id;
                self.getCompanyInfo();
                self.getCollectInfo();
                self.getBannerList();
                self.getVideoList();
                self.getBookList();
                self.getVrList();
                self.getChildrenCompanyList();
            }
        },

        getCompanyInfo: function () {
            var self = this;
            self.loading = true;
            $.ajax({
                url: apiHost + "/MM2/register/queryEntInfoByIdH5.json",
                type: 'POST',
                data: JSON.stringify({
                    id: self.id
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    self.loading = false;

                    if (data.code == 200 && data.data && data.data[0]) {
                        self.companyInfo = data.data[0];
                        if (self.companyInfo.coordinate) {
                            var positon = self.companyInfo.coordinate.split(',');
                            self.companyPosition = {
                                lng: positon[0],
                                lat: positon[1]
                            };
                            self.mapInit();
                        }
                        if (self.companyInfo.labelname)self.tags = self.companyInfo.labelname.split(',');
                        if (self.companyInfo.entDesc) {
                            self.companyInfo.entDesc = self.companyInfo.entDesc.replace(/ /g, '');
                            self.companyInfo.entDescArr = self.companyInfo.entDesc.split('\n');
                            self.companyInfo.summary = self.companyInfo.entDescArr[0];
                        }
                        if (self.companyInfo.groupstatus) self.groupstatusName='集团'


                    }
                }, error: function () {
                    self.loading = false;
                }
            })
        },
        getCollectInfo: function () {
            var self = this;
            $.ajax({
                url: apiHost + "/MM2/register/iscollectH5.json",
                type: 'POST',
                data: JSON.stringify({
                    entid: self.id,
                    customerid: self.customerid,
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data.code == 200 && data.data && data.data.length > 0) {
                        self.collectInfo = data.data[0];
                    }
                }
            })
        },

        getBannerList: function () {
            var self = this;
            $.ajax({
                url: apiHost + "/MM2/register/getEntLoGoListH5.json",
                type: 'POST',
                data: JSON.stringify({
                    id: self.id,
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data.code == 200 && data.data && data.data.length > 0) {
                        self.bannerList = data.data;
                    }else {
                        self.getBannerList2();
                    }
                },error:function(){
                    self.getBannerList2();
                }
            })

        },
        getBannerList2: function () {
            var self = this;
            $.ajax({
                url: apiHost + "/MM2/register/queryAdvInfoImgH5.json",
                type: 'POST',
                data: JSON.stringify({
                    "advType":"1",
                    "positionId":"1"
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data.code == 200 && data.data && data.data.length > 0) {
                        var arr = [];
                        for(var i=0;i<data.data.length;i++){
                            arr.push(data.data[i].picPath)
                        }
                        self.bannerList =arr;
                    }
                }
            })
        },

        getVideoList: function () {
            var self = this;
            $.ajax({
                url: apiHost + "/MM2/register/getEntFileListH5.json",
                type: 'POST',
                data: JSON.stringify({
                    entid: self.id,
                    id: self.id,
                    filetype: '001'
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data.code == 200 && data.data && data.data.length > 0) {
                        self.videoList = data.data;
                    }
                }
            })
        },
        getBookList: function () {
            var self = this;
            $.ajax({
                url: apiHost + "/MM2/register/getEntFileListH5.json",
                type: 'POST',
                data: JSON.stringify({
                    entid: self.id,
                    filetype: '002'
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data.code == 200 && data.data && data.data.length > 0) {
                        self.bookList = data.data;
                        if(self.bookList.length>2) self.bookSwiperIndex=1;

                        self.$nextTick(function() {
                            if (!self.bookSwiper) {
                                var bookSwiper = new Swiper('#book-swiper', {
                                    initialSlide :self.bookSwiperIndex,
                                    slidesPerView: 3,
                                    spaceBetween: 0,
                                    centeredSlides: true,
                                    onSlideChangeEnd: function(swiper){
                                        console.log(swiper.activeIndex)
                                        self.bookSwiperIndex=swiper.activeIndex;
                                    }
                                });

                            } else {
                                self.bookSwiper.update(true);
                            }
                        })
                    }
                }
            })
        },



        openBook: function (item) {
            this.bookDetail=item;
            window.open('http://www.myqsl.cn/MM2/generic/web/viewer.html?file=/MM2/img/'+this.bookDetail.filetypeurl)
        },
        getVrList: function () {
            var self = this;
            $.ajax({
                url: apiHost + "/MM2/register/getEntFileListH5.json",
                type: 'POST',
                data: JSON.stringify({
                    entid: self.id,
                    filetype: '003'
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data.code == 200 && data.data && data.data[0] && data.data[0].filetypeurl) {
                        self.vrUrl = data.data[0].filetypeurl;
                    }
                }
            })
        },
        getChildrenCompanyList: function () {
            var self = this;
            $.ajax({
                url: apiHost + "/MM2/register/queryBelongGroupList.json",
                type: 'POST',
                data: JSON.stringify({
                    id: self.id,
                    page:1,
                    size:5
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data.code == 200 && data.data && data.data.length>0) {
                        self.childrenCompanyList = data.data;
                    }
                }
            })
        },


        mapInit: function () {
            var self = this;
            self.$nextTick(function () {
                var map = new BMap.Map("map");    // 创建Map实例
                map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
                // 初始化地图,设置中心点坐标和地图级别
                var new_point = new BMap.Point(self.companyPosition.lng, self.companyPosition.lat);
                map.centerAndZoom(new_point, 16);
                // 创建标注
                var marker = new BMap.Marker(new_point);
                map.addOverlay(marker);
                map.panTo(new_point);



                // 根据坐标得到地址描述
                var myGeo = new BMap.Geocoder();
                myGeo.getLocation(new_point, function (result) {
                    if (result && result.addressComponents) {
                        self.companyAddressComponents = result.addressComponents;
                    }
                });
            })
        },
        openMap: function () {
            var self = this;
            //获取当前位置经纬度
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    self.myPosition = r.point;
                    var url = "http://api.map.baidu.com/direction?origin=" + self.myPosition.lat + "," + self.myPosition.lng +
                        "&destination=" + self.companyPosition.lat + "," + self.companyPosition.lng +
                        "&mode=driving&region=" + self.companyAddressComponents.city + "&output=html";
                    console.log(url);
                    location.href = url;
                }
                else {
                    alert('failed' + this.getStatus());
                }
            }, {enableHighAccuracy: true});

        },

        bodyChange:function(val){
            var self = this;
            self.$nextTick(function(){
                if(val){
                    $('body').css('overflow','hidden');
                }else {
                    $('body').css('overflow','auto');
                }
            })
        },

        searchOjb: function () {
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