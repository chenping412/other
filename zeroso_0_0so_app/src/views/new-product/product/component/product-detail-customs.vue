<template>
    <div class="clearfix" v-loading="loading">
        <el-table :data="listData" border>
            <el-table-column label="国家">
                <template slot-scope="scope" v-if="scope.row.hs_base">
                    <span>{{scope.row.hs_base.country | country | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="海关编码">
                <template slot-scope="scope" v-if="scope.row.hs_base">
                    <span>{{scope.row.hs_base.hs_code | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="海关商品描述">
                <template slot-scope="scope" v-if="scope.row.hs_base">
                    <span>{{scope.row.hs_base.hs_description | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="监管条件">
                <template slot-scope="scope" v-if="scope.row.hs_base">
                    <span>{{scope.row.hs_base.regulatory_condition | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="关税税率">
                <template slot-scope="scope" v-if="scope.row.hs_base">
                    <span>{{scope.row.hs_base.tariff | percent | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="中国海关产品描述">
                <template slot-scope="scope">
                    <pre>{{scope.row.customs_description | defaultStr}}</pre>
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
            <el-button type="primary" @click="clickAdd()">新增</el-button>

            <i class="el-icon-refresh-right el-icon-normal cursor-pointer margin-left-20" @click="getListData"></i>
        </div>

        <el-dialog title="海关编码" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="130px">
                <el-form-item label="海关编码" prop="hs_id">
                   <SelectNewCustoms
                           :customsId.sync="addForm.hs_id"
                           :customs.sync="addForm.hs_base"
                           :option="addForm.hs_id ? [addForm.hs_base] :null">
                   </SelectNewCustoms>
                </el-form-item>
                <el-form-item label="中国海关产品描述" prop="customs_description">
                    <el-input type="textarea" :rows="5" v-model="addForm.customs_description"></el-input>
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
                    hs_id: [
                        {required: true, message: '请选择海关编码！'}
                    ],
                },

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
                    url: self.$api.new_product_price_product_product + '/' + self.queryId + '/customs',
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
                    product_uid: this.queryId,
                    hs_id: null,
                    hs_base: {},
                    customs_description:'',
                };
            },
            //编辑
            clickEdit(item) {
                this.dialogShow = true;
                this.addForm = {
                    id: item.id,
                    product_uid: item.product_uid,
                    hs_id: item.hs_id,
                    hs_base: JSON.parse(JSON.stringify(item.hs_base)),
                    customs_description:item.customs_description
                };
            },
            //保存
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.addForm.id ? self.$api.new_product_price_product_product + '/' + self.queryId + '/customs/'+ self.addForm.id : self.$api.new_product_price_product_product + '/' + self.queryId + '/customs',
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
                                url: self.$api.new_product_price_product_product + '/' + self.queryId + '/customs/'+ id,
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

        }
    }
</script>

<style lang="scss">

</style>
