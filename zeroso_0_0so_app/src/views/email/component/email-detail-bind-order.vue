<template>
    <div class="inline-block">
        <el-button size="mini" plain @click="add">订单绑定</el-button>

        <el-dialog title="选择关联订单" :visible.sync="dialogShow" width="1000px" :close-on-click-modal="false">

            <div class="content">
                <el-input class="margin-bottom-10" placeholder="搜索订单号" v-model="searchKeyword"
                          @keyup.enter.native="searchListData" @input="searchInput">
                    <el-button slot="prepend" icon="el-icon-search" @click="searchListData"></el-button>
                </el-input>

                <el-table :data="listData" v-loading="loading" height="500px">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column prop="name" label="订单号" width="120"></el-table-column>
                    <el-table-column label="品牌" width="150">
                        <template slot-scope="scope" v-if="scope.row.brand">
                            <span>{{scope.row.brand.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="客户">
                        <template slot-scope="scope">
                            <p v-if="scope.row.customer">
                                <span>{{scope.row.customer.company_name | mainCompanyAbbreviationCode(scope.row.customer.account_company_id)}}</span>
                            </p>
                            <p v-else>{{'' | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="供应商">
                        <template slot-scope="scope">
                            <p v-if="scope.row.supplier">
                                <span>{{scope.row.supplier.company_name | mainCompanyAbbreviationCode(scope.row.supplier.account_company_id)}}</span>
                            </p>
                            <p v-else>{{'' | defaultStr}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="clickBind(scope.row)">绑定</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogShow = false">关 闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['queryId'],
        data() {
            return {
                loading: false,
                dialogShow: false,

                searchKeyword: '',
                listData: [],

            }
        },
        watch: {},
        created() {
        },
        methods: {
            add() {
                this.dialogShow = true;
                this.searchListData();
            },
            searchInput(){
              if(this.timer) clearTimeout(this.timer);
              this.timer=setTimeout(()=>{
                  this.searchListData();
              },500)
            },
            searchListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_order_search,
                    type:'POST',
                    requestBody: true,
                    data: {
                        filter:[["name","=",self.searchKeyword]],
                        per_page: self.$store.state.paginationPageSize,
                        page: 1,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
                            self.listData = data.msg.items;
                        } else {
                            self.listData = [];
                        }
                    }
                });
            },
            clickBind(row) {
                this.loading=true;
                this.$emit('updateEmaiData','/module',{
                    subsystem: "platform",
                    module_name: "order",
                    module_id: row.name,
                })
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>