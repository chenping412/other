<template>
    <el-button size="mini" @click="clickPreview">官网预览</el-button>
</template>

<script>
    import Mustache from 'mustache'
    import hostConfig from '../../../../config/host-config'
    export default {
        props: ['brandDetail'],
        data() {
            return {

            }
        },
        created() {
        },
        methods: {
            clickPreview(){
                let self = this;
                self.loading = true;
                self.$.ajax({
                    url: './static/preview/BrandDetail.html',
                    success: function (result) {
                        self.loading = false;
                        let brandDetail = JSON.parse(JSON.stringify(self.brandDetail));
                        brandDetail.hostConfig = hostConfig.wwwHost;

                        self.$store.state.country.forEach((item) => {
                            if (item.code2 === brandDetail.country) {
                                brandDetail.countryChineseName = item.chinese_name;
                            }
                        });
                        brandDetail.usingAreaList=[];
                        if(brandDetail.using_area){
                            brandDetail.using_area.forEach((item) => {
                                brandDetail.usingAreaList.push({
                                    name:item
                                })
                            });
                        }
                        if(brandDetail.manufactruer_company){
                            brandDetail.manufactruerCompanyName = brandDetail.manufactruer_company.company_name
                        }

                        //异步取数据
                        let resultPromise = [];
                        resultPromise.push(self.getLogoUrl().then((imageUrl)=>{
                            brandDetail.logoUrl=imageUrl;
                        }));
                        resultPromise.push(self.getAdvertiseUrl().then((urlList)=>{
                            brandDetail.advertiseUrlList=urlList;
                        }));
                        resultPromise.push(self.getCertificationList().then((certificationList)=>{
                            brandDetail.certificationList=certificationList;
                        }));
                        resultPromise.push(self.getNewsList().then((newsList)=>{
                            brandDetail.newsList=newsList;
                        }));

                        Promise.all(resultPromise).then(function () {
                            console.log(brandDetail);
                            let html = Mustache.render(result, {brandDetail: brandDetail});
                            let popupWin = window.open('', '_blank');
                            popupWin.document.write(html);
                            popupWin.document.getElementById('short_description').innerHTML = brandDetail.short_description;
                            popupWin.document.getElementById('description').innerHTML = brandDetail.description;
                            popupWin.document.getElementById('brand_history').innerHTML = brandDetail.brand_history;
                        });
                    }
                })
            },
            getLogoUrl() {
                let self = this;
                return new Promise((resolve, reject) => {
                    self.$http({
                        url: self.$api.oss_file + '/' + self.brandDetail.uid,
                        data:{
                            object_id:self.brandDetail.uid,
                            file_type:'brand_logo',
                            entity_uid:self.brandDetail.uid,
                        },
                        success: function (data) {
                            let imageUrl;
                            if (data.msg && data.msg && data.msg.length>0) {
                                imageUrl = self.$api.oss_file + '/' + data.msg[0].entity_uid + '/' + data.msg[0].id;
                            }
                            resolve(imageUrl)
                        },error(){
                            resolve(null);
                            reject(null);
                        }
                    });
                })
            },
            getAdvertiseUrl() {
                let self = this;
                return new Promise((resolve, reject) => {
                    self.$http({
                        url: self.$api.oss_file + '/' + self.brandDetail.uid,
                        data:{
                            object_id:self.brandDetail.uid,
                            file_type:'brand_advertise',
                            entity_uid:self.brandDetail.uid,
                        },
                        success: function (data) {
                            let urlList=[];
                            if (data.msg && data.msg && data.msg.length>0) {
                                data.msg.forEach((item)=>{
                                    urlList.push({
                                        url:self.$api.oss_file + '/' + item.entity_uid + '/' + item.id,
                                        file_name:item.file_name
                                    });
                                })
                            }
                            resolve(urlList)
                        },error(){
                            resolve([]);
                            reject(null);
                        }
                    })
                })
            },
            getNewsList() {
                let self = this;
                return new Promise((resolve, reject) => {
                    self.$http({
                        url: self.$api.new_product_basic_product_brand + '/' + self.brandDetail.uid + '/news',
                        success: function (data) {
                            let list = data.msg;
                            if(list && list.length>0){
                                let resultPromise = [];
                                for(let i=0;i<list.length;i++){
                                    resultPromise.push(self.getMinioFileListData(list[i].id,'brand_news_banner',self.brandDetail.uid).then((urlList)=>{
                                        if(urlList.length>0) list[i].imageUrl = urlList[0].url;
                                    }))
                                }
                                Promise.all(resultPromise).then(function () {
                                    resolve(list)
                                });
                            }else {
                                resolve([])
                            }
                        },error(){
                            resolve([]);
                            reject(null);
                        }
                    })
                })
            },
            getCertificationList() {
                let self = this;
                return new Promise((resolve, reject) => {
                    self.$http({
                        url: self.$api.new_product_basic_product_brand + '/' + self.brandDetail.uid + '/certification',
                        success: function (data) {
                            let list = data.msg;
                            if(list && list.length>0){
                                let resultPromise = [];
                                for(let i=0;i<list.length;i++){
                                    resultPromise.push(self.getMinioFileListData(list[i].id,'brand_certification',self.brandDetail.uid).then((urlList)=>{
                                        list[i].fileList = urlList;
                                    }))
                                }
                                Promise.all(resultPromise).then(function () {
                                    resolve(list)
                                });
                            }else {
                                resolve([])
                            }
                        },error(){
                            resolve([]);
                            reject(null);
                        }
                    })
                })
            },
            getMinioFileListData(module_id,module_name,subsystem) {
                let self = this;
                return new Promise((resolve, reject) => {
                    self.$http({
                        url: self.$api.oss_file + '/' + subsystem,
                        data:{
                            object_id:module_id,
                            file_type:module_name,
                            entity_uid:subsystem,
                        },
                        success: function (data) {
                            let list = data.msg;
                            let urlList=[];
                            if(list && list.length>0){
                                list.forEach((item)=>{
                                    urlList.push({
                                        url:self.$api.oss_file + '/' + item.entity_uid + '/' + item.id,
                                        file_name: item.file_name
                                    })
                                });
                            }
                            resolve(urlList)
                        },error(){
                            resolve([]);
                            reject(null);
                        }
                    })
                })
            },
        },
    }
</script>

<style lang="scss">

</style>