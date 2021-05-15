<template>
    <div class="border-bottom margin-bottom-20">
        <el-form label-width="175px">
            <el-form-item label="产品关联关系：">
                <table class="table table-all-border">
                    <thead>
                    <tr>
                        <th>关联类型</th>
                        <th>关联产品</th>
                        <th>关联备注</th>
                        <th>关联时间</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody v-for="(parentItem,parentKey) in productCorrectList" :key="parentKey">
                    <tr v-for="(item,$index) in parentItem" :key="$index">
                        <td :rowspan="parentItem.length" v-if="$index===0">
                            {{parentKey==='main_relation' ? '主件' : correctTypeMap[item.type] || item.type}}
                        </td>
                        <td>
                            <router-link class="blue" v-if="item.from_product" :to="'/product/product/detail?id='+item.from_product.id">
                                <span>{{item.from_product.product_name}}</span>
                                <span>，{{item.from_product.product_order_no}}</span>
                            </router-link>
                        </td>
                        <td>{{item.comment}}</td>
                        <td>{{item.create_time | zerosoCompanyTime}}</td>
                        <td>
                            <span class="cursor-pointer red" @click="clickDelete(item.id)">删除</span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="padding-top-10 padding-bottom-10">
                    <el-button type="primary" size="mini" @click="clickAdd">新增关联</el-button>
                </div>
            </el-form-item>

        </el-form>

        <el-dialog :title="editForm.id?'编辑':'新增'"
                   :visible.sync="editDialogShow"
                   width="550px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="editForm" :rules="editFormRule" ref="editForm" label-width="100px">
                <el-form-item label="关联类型" prop="type">
                    <el-select v-model="editForm.type">
                        <el-option
                                v-for="(value,key) in correctTypeMap"
                                :key="key"
                                :value="key"
                                :label="value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关联产品" prop="from_product_id">
                   <SelectProductSingle
                           :productId.sync="editForm.from_product_id"
                           :product="editForm.from_product"
                           :option="editForm.from_product ? [editForm.from_product] : null"
                           :data="{brand_name: detailForm.brand ? detailForm.brand.name : undefined}">
                   </SelectProductSingle>
                </el-form-item>
                <el-form-item label="关联备注：" prop="comment">
                    <el-input
                            type="textarea"
                            rows="5"
                            v-model="editForm.comment">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveEditQuotationComment()">保 存</el-button>
                <el-button @click="editDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: ['queryId','detailForm'],
        data() {
            return {
                productCorrectList: [],

                correctTypeMap:{
                    valid:'正确产品',
                    replace:'替代产品',
                    parts:'配件',
                },

                editForm: {

                },
                editFormRule: {
                    from_product_id: [
                        {required: true, message: '请选择关联产品！'}
                    ],type: [
                        {required: true, message: '请选择关联类型！'}
                    ],
                },
                editDialogShow: false,


                loading: false,
            }
        },
        watch: {
            queryId() {
                this.getProductCorrectList();
                this.editDialogShow = false;
            },
        },
        created() {
            this.getProductCorrectList();
        },
        methods: {
            //获取产品价格表
            getProductCorrectList() {
                let self = this;
                self.productCorrectList = [];
                self.$http({
                    url: self.$api.product_product_manage_product + '/' + self.queryId + '/relations',
                    type: 'GET',
                    success: function (data) {
                        if (data.msg) {
                            self.productCorrectList = data.msg;
                        }
                    }
                })
            },

            //点击新增
            clickAdd() {
                this.editForm = {
                    from_product_id:null,
                    from_product:null,
                    type:'parts',
                    comment:null,
                };
                this.editDialogShow = true;
            },
            clickSaveEditQuotationComment() {
                let self = this;
                self.$refs.editForm.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.product_product_manage_product + '/' + self.queryId + '/relations',
                            type: 'POST',
                            requestBody: true,
                            data: self.editForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    self.editDialogShow = false;
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.getProductCorrectList();
                                }
                            }
                        });
                    }
                });
            },
            clickDelete(id) {
                let self = this;
                self.$confirm('确定删除该关联吗？', '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.product_product_manage_product + '/' + self.queryId + '/relations/'+id+'/invalid',
                                type: 'DELETE',
                                requestBody: true,
                                success: function () {
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '操作成功！',
                                        type: 'success'
                                    });
                                    self.getProductCorrectList();
                                }
                            });
                        }
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>