<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>海关信息</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch filterKey="product_customs_info"
                           :allowFilterFieldsUrl="$api.product_common_search_customs_info"
                           @clickSearch="init()"></ControlSearch>

            <div class="table-control clearfix">
                <div class="control-btns">
                    <el-button type="primary" @click="clickAddRow">新增海关信息</el-button>
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
                        <el-table-column label="中国海关编码" width="120">
                            <template slot-scope="scope">
                                <el-form-item prop="customs_cn_code" v-if="scope.row.isEdit">
                                    <el-input v-model="editRowForm.customs_cn_code"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.customs_cn_code | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="中国商品名称及备注">
                            <template slot-scope="scope">
                                <el-form-item prop="customs_cn_description" v-if="scope.row.isEdit">
                                    <el-input type="textarea" rows="2" v-model="editRowForm.customs_cn_description"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.customs_cn_description | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="德国海关编码" width="140">
                            <template slot-scope="scope">
                                <el-form-item prop="customs_de_code" v-if="scope.row.isEdit">
                                    <el-input v-model="editRowForm.customs_de_code"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.customs_de_code | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="德国海关描述">
                            <template slot-scope="scope">
                                <el-form-item prop="customs_de_description" v-if="scope.row.isEdit">
                                    <el-input type="textarea" rows="2" v-model="editRowForm.customs_de_description"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.customs_de_description | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="中国进口关税" width="140" align="right">
                            <template slot-scope="scope">
                                <el-form-item prop="import_cn_tariffs" v-if="scope.row.isEdit">
                                    <InputNumber :value.sync="editRowForm.import_cn_tariffs"></InputNumber>
                                </el-form-item>
                                <span v-else>{{scope.row.import_cn_tariffs | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="中国监管条件" width="120">
                            <template slot-scope="scope">
                                <el-form-item prop="customs_cn_conditions" v-if="scope.row.isEdit">
                                    <el-input v-model="editRowForm.customs_cn_conditions"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.customs_cn_conditions | defaultStr}}</span>
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
                    customs_cn_code: [
                        {required: true, message: '请输入中国海关编码！'}
                    ], customs_cn_description: [
                        {required: true, message: '请输入中国商品名称及备注！'}
                    ], customs_de_code: [
                        {required: true, message: '请输入德国海关编码！'}
                    ], customs_de_description: [
                        {required: true, message: '请输入德国海关描述！'}
                    ], import_cn_tariffs: [
                        {required: true, message: '请输入中国进口关税！'}
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
                    url: self.$api.product_common_search_customs_info,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        key: "product_customs_info"
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
                            url: self.$api.product_product_manage_product_customs_info + (self.editRowForm.id ? '/'+self.editRowForm.id : ''),
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
