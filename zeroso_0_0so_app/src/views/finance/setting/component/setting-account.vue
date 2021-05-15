<template>
    <div >
        <div class="padding-bottom-10">
            <el-radio-group v-model="accountType" @change="getListData">
                <el-radio-button v-for="(item,$index) in accountTypeList"
                                 :key="$index"
                                 :label="item.id">
                    {{item.name}}
                </el-radio-button>
            </el-radio-group>
        </div>

        <el-table :data="listData" border v-loading="loading">
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column label="编号">
                <template slot-scope="scope">
                    <el-input v-if="scope.row.isEdit" v-model="scope.row.code"></el-input>
                    <span v-else>{{scope.row.code}}</span>
                </template>
            </el-table-column>
            <el-table-column label="科目">
                <template slot-scope="scope">
                    <el-input v-if="scope.row.isEdit" v-model="scope.row.name"></el-input>
                    <span v-else>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="类型">
                <template slot-scope="scope">
                    <el-select v-if="scope.row.isEdit" v-model="scope.row.account_category">
                        <el-option value="bank" label="银行科目"></el-option>
                        <el-option value="other" label="非银行科目"></el-option>
                    </el-select>
                    <span v-else>{{scope.row.account_category==='bank' ? '银行科目' : '非银行科目'}}</span>
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
                        <el-button size="mini" type="danger" @click="clickDelete(scope.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <div class="padding-10">
            <el-button type="primary" @click="clickAddRow">新增</el-button>
        </div>

    </div>
</template>

<script>

    export default {
        data() {
            return {
                accountTypeList: [],
                accountType: null,

                listData: [],

                loading: false,
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.getAccountTypeList();
            },
            //获取列表
            getAccountTypeList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_account_type,
                    success: function (data) {
                        self.loading = false;
                        self.accountTypeList = data.msg.items;
                        if( self.accountTypeList.length>0){
                            self.accountType = self.accountTypeList[0].id;
                            self.getListData();
                        }
                    }
                })
            },

            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_account,
                    type: 'GET',
                    data: {
                        account_type_id: self.accountType,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            for(let i=0;i<data.msg.items.length;i++){
                                data.msg.items[i].isEdit=false;
                            }
                            self.listData = data.msg.items;
                        } else {
                            self.listData = [];
                        }
                    }
                })
            },

            clickAddRow(){
                this.listData.push({
                    isEdit:true,
                    account_type_id:this.accountType,
                    code: "",
                    is_reconcile: false,
                    name: "",
                    account_category: "other",
                })
            },


            clickSaveDate(row) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: !row.id ? self.$api.bank_account : self.$api.bank_account+'/'+row.id,
                    type: !row.id ? 'POST' :'PUT',
                    requestBody: true,
                    data: row,
                    success: function () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '保存成功！',
                            type: 'success'
                        });
                        self.getListData();
                    }
                });
            },

            //删除
            clickDelete(row) {
                let self = this;
                self.$confirm('确认删除该科目【 '+row.code+' 】？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.bank_account + '/' + row.id,
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

<style>

</style>
