<template>
    <div class="detail-pagination" v-if="queryId && detailIndex>-1">
        <span class="page-index">{{ (detailPagination.pageNum-1)*detailPagination.pageSize +detailIndex + 1}} / {{detailPagination.total}}</span>
        <el-button type="primary" size="mini"
                   icon="el-icon-arrow-left"
                   :disabled="detailIndex<=0 && detailPagination.pageNum<=1"
                   @click="clickSwitchOtherDetail(detailIndex-1)"></el-button>
        <el-button type="primary" size="mini"
                   icon="el-icon-arrow-right"
                   :disabled="detailIndex>=parentListData.length-1 && detailPagination.pageNum>=detailPagination.pages"
                   @click="clickSwitchOtherDetail(detailIndex+1)"></el-button>
    </div>
</template>

<script>
    export default {
        props:['listApi','apiKey','listData','isNewSystem','noResellerCompanyId','requestType'],
        data() {
            return {
                queryId:'',
                detailIndex: -1,
                parentListData:[],
                detailPagination:{
                    list: [],
                    total: 0,
                    pageSize: this.$store.state.paginationPageSize,
                    pageNum: 1,
                    pages:1,
                },

            }
        },
        watch: {
            listData() {
                this.getList()
            },
            '$route'() {
                this.getList()
            },
        },
        created() {
            this.getList()
        },
        methods: {
            getList(pageNum,callback){
                if(this.listData){
                    this.detailPagination = {
                        list: this.listData,
                        total: this.listData.length,
                        pageSize: this.listData.length,
                        pageNum: 1,
                        pages: 1,
                    };
                    this.detailPaginationInit();
                }else {
                    if(this.listApi){
                        if(this.isNewSystem){
                            this.getNewSystemAllList(pageNum,callback)
                        }else {
                            this.getAllList(pageNum,callback)
                        }
                    }
                }
            },
            detailPaginationInit() {
                let self = this;
                self.detailIndex = -1
                if(self.detailPagination.list) self.parentListData=self.detailPagination.list;
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.parentListData.forEach((item, index) => {
                        if (item.id == self.queryId) {
                            self.detailIndex =  index;
                        }
                    })
                }
            },

            //处理总列表上下条切换问题
            getAllList(pageNum,callback) {
                let self = this;
                let parentQuery = '';
                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    parentQuery = self.$route.query.parentQuery;
                }
                let query = JSON.parse(JSON.stringify(self.$route.query));
                parentQuery.split("&").forEach(function (v) {
                    let param = v.split('=');
                    query[param[0]] = param[1];
                });
                if (query.filter) {
                    query.filter = JSON.parse(decodeURIComponent(decodeURIComponent(query.filter)));
                }else {
                    query.filter=[];
                }
                query.filter = self.$utils.formatSearchFilter(query.filter);
                query.page = pageNum || (query.pageNum ? query.pageNum*1 : 1);
                query.per_page = query.pageSize ? query.pageSize*1 : self.$store.state.paginationPageSize;
                query.key = query.key || self.apiKey;

                try {
                    if(query.order_by) query.order_by = [JSON.parse(decodeURIComponent(decodeURIComponent(query.order_by)))]
                }catch (e) {
                    console.log(e)
                }

                query.pageNum = undefined;
                query.pageSize = undefined;
                query.parentQuery = undefined;
                query.id = undefined;
                query.group_by = undefined;
                self.$http({
                    url: self.listApi,
                    type: 'POST',
                    requestBody:true,
                    data: query,
                    success: function (data) {
                        if(callback){
                            callback(data);
                            return
                        }
                        if (data.msg && data.msg.items) {
                            if(data.msg.items.relations) data.msg.items=data.msg.items.relations;//部分接口出现多一层嵌套
                            for(let i=0;i<data.msg.items.length;i++){
                                if(!data.msg.items[i].id){
                                    data.msg.items[i].id = data.msg.items[i].account_company_id;
                                }
                            }
                            self.detailPagination = {
                                list: data.msg.items,
                                total: data.msg.total,
                                pageSize: data.msg.per_page,
                                pageNum: data.msg.page,
                                pages: data.msg.pages||data.msg.page,
                            };
                        } else {
                            self.detailPagination = {
                                list: [],
                                total: 0,
                                pageSize: 50,
                                pageNum: 1,
                                pages: 1,
                            }
                        }
                        self.detailPaginationInit();
                    }
                });
            },

            getNewSystemAllList(pageNum,callback) {
                let self = this;
                let parentQuery = '';
                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    parentQuery = self.$route.query.parentQuery;
                }
                let query = JSON.parse(JSON.stringify(self.$route.query));
                parentQuery.split("&").forEach(function (v) {
                    var param = v.split('=');
                    query[param[0]] = param[1];
                });
                if (query.filter) {
                    query.filter = JSON.parse(decodeURIComponent(decodeURIComponent(query.filter)));
                }else {
                    query.filter=[];
                }
                Object.assign(query,self.$utils.formatSearchFilterV6(query.filter))

                query['pageRequest.page'] = query.page = pageNum || (query.pageNum ? query.pageNum*1 : 1);
                query['pageRequest.perPage'] =  query.per_page = query.pageSize ? query.pageSize*1 : self.$store.state.paginationPageSize;
                if(!self.noResellerCompanyId) {
                    query.resellerCompanyId = self.$store.state.currentCompany.account_company_id;
                }

                try {
                    if(query.order_by) {
                        Object.assign(query, self.$utils.formatSearchSortV6(JSON.parse(decodeURIComponent(decodeURIComponent(query.order_by)))) )
                    }
                }catch (e) {
                    console.log(e)
                }

                query.pageNum = undefined;
                query.pageSize = undefined;
                query.parentQuery = undefined;
                query.id = undefined;
                query.order_by = undefined;
                query.filter = undefined;
                self.$http({
                    url: self.listApi,
                    type: self.requestType || 'GET',
                    data: query,
                    success: function (data) {
                        if(callback){
                            callback(data);
                            return
                        }
                        if(data.msg && data.msg.items) {
                            for(let i=0;i<data.msg.items.length;i++){
                                //部分接口唯一标识用的uid，例如新产品库
                                if(data.msg.items[i].uid) data.msg.items[i].id = data.msg.items[i].uid;
                            }
                            self.detailPagination = {
                                list: data.msg.items,
                                total: data.msg.total,
                                pageSize: data.msg.per_page,
                                pageNum: data.msg.page,
                                pages: data.msg.pages||data.msg.page,
                            };
                        }else if (data.item) {
                            self.detailPagination = {
                                list: data.item,
                                total: data.page.total,
                                pageSize: data.page.page_size,
                                pageNum: data.page.page_num,
                                pages: Math.ceil(data.page.total/data.page.page_size),
                            };
                        } else {
                            self.detailPagination = {
                                list: [],
                                total: 0,
                                pageSize: 50,
                                pageNum: 1,
                                pages: 1,
                            }
                        }
                        self.detailPaginationInit();
                    }
                });
            },

            //点击切换到上一条或者下一条详情页
            clickSwitchOtherDetail(index,noNextCallBack) {
                if(index<0 || index>this.parentListData.length-1 ){
                    this.getList( index<0 ? this.detailPagination.pageNum-1 : this.detailPagination.pageNum+1,(data)=>{
                        if (data.msg && data.msg.items && data.msg.items.length>0) {
                            for(let i=0;i<data.msg.items.length;i++){
                                if(!data.msg.items[i].id){
                                    data.msg.items[i].id = data.msg.items[i].account_company_id;
                                }
                                //部分接口唯一标识用的uid，例如新产品库
                                if(data.msg.items[i].uid) data.msg.items[i].id = data.msg.items[i].uid;
                            }
                            let nextId = data.msg.items[(index<0 ? data.msg.items.length-1 : 0)].id;
                            let query = JSON.parse(JSON.stringify(this.$route.query));
                            query.id = nextId;
                            if(query.parentQuery){
                                let str = 'pageNum='+this.detailPagination.pageNum;
                                if(query.parentQuery.indexOf(str)>-1){
                                    query.parentQuery = query.parentQuery.replace(str,'pageNum='+data.msg.page);
                                }else {
                                    query.parentQuery = query.parentQuery + '&pageNum='+data.msg.page;
                                }
                            }else {
                                query.parentQuery = 'pageNum='+data.msg.page;
                            }
                            this.$router.push({
                                path: this.$route.path,
                                query: query
                            })
                        }else {
                            if(noNextCallBack) noNextCallBack();
                        }
                    })
                }else {
                    if (this.parentListData[index] && this.parentListData[index].id) {
                        let query = JSON.parse(JSON.stringify(this.$route.query));
                        query.id = this.parentListData[index].id;
                        this.$router.push({
                            path: this.$route.path,
                            query: query
                        })
                    }else {
                        if(noNextCallBack) noNextCallBack();
                    }
                }
            },

            switchNextPage(noNextCallBack){
                this.clickSwitchOtherDetail(this.detailIndex+1,noNextCallBack)
            },
        },
    }
</script>

<style lang="scss" scoped>
.detail-pagination{
    display: inline-block;
    vertical-align: middle;
    line-height: 0;
    .page-index{
        margin-right: 10px;
        vertical-align: middle;
    }
}
</style>