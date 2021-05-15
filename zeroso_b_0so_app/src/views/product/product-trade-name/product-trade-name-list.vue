<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>品名信息</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch filterKey="product_product_trade_name" :allowFilterFieldsUrl="$api.product_common_search_product_trade_name" @clickSearch="init()"></ControlSearch>

            <div class="table-control clearfix">
                <div class="control-btns">
                    <el-button type="primary" @click="clickAddRow">新增品名信息</el-button>
                </div>
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="container-table">
                <el-form :model="editRowForm" :rules="editRowFormRule" ref="editRowForm" label-width="0">
                    <el-table :data="listData" border v-loading="loading">
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column label="中国报关品名">
                            <template slot-scope="scope">
                                <el-form-item prop="product_cn_name" v-if="scope.row.isEdit">
                                    <el-input v-model="editRowForm.product_cn_name"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.product_cn_name | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="英文报关品名">
                            <template slot-scope="scope">
                                <el-form-item prop="product_en_name" v-if="scope.row.isEdit">
                                    <el-input v-model="editRowForm.product_en_name"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.product_en_name | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="中国纳税编码">
                            <template slot-scope="scope">
                                <el-form-item prop="product_cn_tax_code" v-if="scope.row.isEdit">
                                    <el-input v-model="editRowForm.product_cn_tax_code"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.product_cn_tax_code | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isEdit">
                                    <el-button type="success" @click="clickSaveEdit(scope.row)">保存</el-button>
                                    <el-button type="primary" plain @click="getListData()">取消</el-button>
                                </div>
                                <div v-else>
                                    <ButtonEdit @click="clickEditRow(scope.row)"></ButtonEdit>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>

            </div>
        </div>




    </div>
</template>

<script>
    export default {
        components: {

        },
        data() {
            return {
                filter: {},

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,


                editRowForm: {},
                editRowFormRule: {
                    product_cn_name: [
                        {required: true, message: '请输入中国报关品名！'}
                    ],product_en_name: [
                        {required: true, message: '请输入英文报关品名！'}
                    ],
                },



                listDataSelection: [],

                loading: false,
            }
        },
        watch: {
            '$route'() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : {};
                this.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum * 1 : 1;
                this.pageSize = this.$route.query.pageSize ? this.$route.query.pageSize * 1 : this.$store.state.paginationPageSize;
                this.getListData();
            },
            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.product_common_search_product_trade_name,
                    type: 'POST',
                    requestBody:true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        key: "product_product_trade_name"
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            for(let i=0;i<data.msg.items.length;i++){
                                data.msg.items[i].isEdit = false;
                            }
                            self.listData = data.msg.items;
                            self.totalCount = data.msg.total;
                        } else {
                            self.listData = [];
                            self.totalCount = 0;
                        }
                    }
                })
            },



            //点击新增行
            clickAddRow() {
                for(let i=0;i<this.listData.length;i++){
                    if(this.listData[i].isEdit){
                        this.$message({
                            showClose: true,
                            message: '新增行之前，请先保存正在修改行！',
                            type: 'warning'
                        });
                        return
                    }
                }
                let row = {
                    isEdit:true,
                };
                this.editRowForm = JSON.parse(JSON.stringify(row));
                this.listData.unshift(row);
            },
            //点击编辑行
            clickEditRow(row) {
                for(let i=0;i<this.listData.length;i++){
                    if(this.listData[i].isEdit){
                        this.$message({
                            showClose: true,
                            message: '只允许同时修改一行信息，请先保存正在修改行！',
                            type: 'warning'
                        });
                        return
                    }
                }
                row.isEdit = true;
                this.editRowForm = JSON.parse(JSON.stringify(row));
            },
            //保存编辑
            clickSaveEdit(row) {
                let self = this;
                self.$refs.editRowForm.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.product_product_manage_product_trade_name + (self.editRowForm.id ? '/'+self.editRowForm.id : ''),
                            type:self.editRowForm.id?'PUT':'POST',
                            requestBody:true,
                            data: self.editRowForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg && data.msg.id) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    row.isEdit = false;
                                    self.getListData();
                                } else {
                                    self.$message({
                                        showClose: true,
                                        message: '保存失败！',
                                        type: 'error'
                                    });
                                }
                            }
                        });
                    } else {
                        console.log('error submit!!');
                    }
                });
            },

        }
    }
</script>

<style>

</style>
