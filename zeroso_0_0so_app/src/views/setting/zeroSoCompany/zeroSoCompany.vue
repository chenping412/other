<template>
    <div class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>设置</el-breadcrumb-item>
                    <el-breadcrumb-item>零搜公司设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <el-card>
                <h3 slot="header">零搜公司设置</h3>
                <div>
                    <el-table :data="listData" border v-loading="loading">
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column label="公司名称">
                            <template slot-scope="scope">
                                <SelectPartnerCompanyOnly
                                        v-if="scope.row.isEdit"
                                        :partner-id.sync="scope.row.account_company_id"
                                        :partner.sync="scope.row.account_company"
                                        :option="scope.row.account_company_id?[scope.row.account_company]:null">
                                </SelectPartnerCompanyOnly>
                                <span v-else>
                                    {{scope.row.account_company ? scope.row.account_company.company_name : null}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="默认供应链">
                            <template slot-scope="scope">
                                <el-checkbox :disabled="!scope.row.isEdit" v-model="scope.row.is_default_logistics"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div v-if="scope.row.isEdit">
                                    <el-button size="mini" type="success" @click="clickSaveDate(scope.row)">保存</el-button>
                                    <el-button size="mini" @click="getListData">取消</el-button>
                                </div>
                                <div v-else>
                                    <el-button size="mini" type="primary" @click="scope.row.isEdit=true">编辑</el-button>
                                    <el-button size="mini" type="danger" @click="clickDelete(scope.row.id)">删除</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="padding-10">
                        <el-button type="primary" @click="clickAdd">添加</el-button>
                    </div>
                </div>
            </el-card>
        </div>
    </div>

</template>

<script>

    export default {
        data() {
            return {

                isEdit:false,

                listData:[],

                loading: false,

            }
        },
        created() {
            this.getListData();
        },
        methods: {
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_v5_zeroso_company,
                    success: function (data) {
                        self.loading = false;
                        if(data.msg && data.msg.items) {
                            for(let i=0;i<data.msg.items.length;i++){
                                data.msg.items[i].isEdit = false;
                                data.msg.items[i].account_company_id = data.msg.items[i].account_company.account_company_id;
                            }
                            self.listData = data.msg.items;
                        }
                    }
                })
            },


            clickSaveDate(row) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: row.id ? self.$api.partner_v5_zeroso_company + '/' +row.id : self.$api.partner_v5_zeroso_company,
                    type: row.id ? 'PUT' : 'POST',
                    requestBody: true,
                    data: {
                        account_company_id: row.account_company_id,
                        is_default_logistics: row.is_default_logistics,
                        id: row.id,
                    },
                    success: function () {
                        self.loading = false;
                        row.isEdit = false;
                        self.getListData();
                        self.$message({
                            showClose: true,
                            message: '保存成功！',
                            type: 'success'
                        });
                    }
                });
            },


            clickAdd(){
                this.listData.push({
                    isEdit:true,
                    account_company_id:null,
                    account_company:{},
                    is_default_logistics:false,
                })
            },

            //删除
            clickDelete(id) {
                let self = this;
                self.$confirm('确认删除吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.partner_v5_zeroso_company + '/' + id,
                                type: 'DELETE',
                                success: function () {
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '删除成功！',
                                        type: 'success'
                                    });
                                    self.getListData();
                                }
                            });
                        }
                    }
                })
            },

        }
    }
</script>

<style lang="scss">


</style>
