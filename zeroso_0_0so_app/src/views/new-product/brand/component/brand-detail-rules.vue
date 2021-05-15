<template>
    <div class="clearfix" v-loading="loading">
        <el-table :data="listData" border>
            <el-table-column label="型号/订货号" prop="product_field">
                <template slot-scope="scope">
                    {{productKeyListFilter(scope.row.product_field)}}
                </template>
            </el-table-column>
            <el-table-column label="编码规则" prop="naming_convention">
                <template slot-scope="scope">
                    <pre>{{scope.row.naming_convention | defaultStr}}</pre>
                </template>
            </el-table-column>
            <el-table-column label="最后操作时间">
                <template slot-scope="scope">
                    <span>{{(scope.row.write_time || scope.row.create_time) | zerosoCompanyTime}}</span>
                </template>
            </el-table-column>
            <el-table-column width="150px">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="clickEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="clickDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="padding-top-10">
            <el-button type="primary" @click="clickAdd()">新增品牌规则</el-button>

            <i class="el-icon-refresh-right el-icon-normal cursor-pointer margin-left-20" @click="getListData"></i>
        </div>

        <el-dialog title="品牌规则" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="110px">
                <el-form-item label="型号/订货号" prop="product_field">
                    <el-select v-model="addForm.product_field">
                        <el-option
                                v-for="item in productKeyList"
                                :key="item.code"
                                :value="item.code"
                                :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="编码规则" prop="naming_convention">
                    <el-input type="textarea" :rows="4" v-model="addForm.naming_convention"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
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

                listData: [],

                dialogShow: false,
                addForm: {},
                addFormRule: {
                    product_field: [
                        {required: true, message: '请选择型号/订货号！'}
                    ],naming_convention: [
                        {required: true, message: '请输入编码规则！'}
                    ],
                },


                productKeyList:[
                    {
                        label:"型号",
                        code:'type_no',
                    },{
                        label:"订货号",
                        code:'order_no',
                    },
                ],

            }
        },
        watch: {
            queryId () {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.queryId) {
                    this.getListData();
                }
            },
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/rules',
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.listData = data.msg;
                        }
                    }
                })
            },

            //新建
            clickAdd() {
                this.dialogShow = true;
                this.addForm = {
                    brand_uid: this.queryId,
                    product_field: '',
                    naming_convention: '',
                    regular_expression: '',
                };
            },
            //编辑
            clickEdit(item) {
                this.dialogShow = true;
                this.addForm = JSON.parse(JSON.stringify(item));
            },
            //保存
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.addForm.id ? self.$api.new_product_basic_product_brand + '/' + self.queryId + '/rules/'+ self.addForm.id : self.$api.new_product_basic_product_brand + '/' + self.queryId + '/rules',
                            type: self.addForm.id ? 'PUT' : 'POST',
                            requestBody: true,
                            data: self.addForm,
                            success () {
                                self.loading = false;
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                self.dialogShow = false;
                                self.getListData();
                            }
                        });
                    }
                });
            },



            //删除
            clickDelete(id){
                let self = this;
                self.$confirm('确定删除？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/rules/'+ id,
                                type: 'DELETE',
                                success () {
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '操作成功！',
                                        type: 'success'
                                    });
                                    self.getListData();
                                }
                            });
                        }
                    }
                })
            },


            productKeyListFilter(value){
                let str = '';
                this.productKeyList.forEach((item) => {
                    if (item.code === value) {
                        str = item.label;
                    }
                });
                return str ? str : value;
            },
        }
    }
</script>

<style lang="scss">

</style>
