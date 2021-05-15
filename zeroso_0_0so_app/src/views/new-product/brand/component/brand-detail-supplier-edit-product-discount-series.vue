<template>
    <div class="clearfix" v-loading="loading">
        <div class="clearfix">
            <i class="el-icon-edit-outline el-icon-normal cursor-pointer right margin-top-5" @click="clickEdit"></i>
            <template v-if="brandSupplierRow.product_series">
                <p v-for="(item,$index) in brandSupplierRow.product_series" :key="$index">
                    <span>{{$index+1}}、{{item.name}}</span>
                </p>
            </template>

        </div>

        <el-dialog :title="brandSupplierRow.supplier_company ? brandSupplierRow.supplier_company.company_name : ''"
                   :visible.sync="dialogShow" width="700px" :close-on-click-modal="false"
                   append-to-body v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="0px">
                <table class="brand-detail-supplier-edit-product-discount-series">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>产品系列（必选）</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(row,$index) in addForm.product_series" :key="$index">
                        <td>{{$index+1}}</td>
                        <td>
                            <el-form-item  :prop="'product_series.'+$index+'.serie_id'" :rules="addFormRule.serie_id">
                                <el-select v-model="row.serie_id" clearable>
                                    <el-option
                                            v-for="item in productSeriesList"
                                            :key="item.id"
                                            :value="item.id"
                                            :label="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </td>
                        <td>
                            <el-form-item>
                                <span class="red cursor-pointer" @click="clickDeleteRow(row)">
                                    删除
                                </span>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">

                        </td>
                        <td>
                             <span class="blue cursor-pointer" @click="clickAddRow()">
                                 添加
                             </span>
                        </td>
                    </tr>
                    </tbody>
                </table>
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
        props: ['brandUid','brandSupplierRow'],
        data() {
            return {
                loading: false,

                dialogShow: false,
                addForm: {
                    "product_series": []
                },
                addFormRule: {
                    serie_id: [
                        {required: true, message: '请选择产品系列！'}
                    ],
                },

                productSeriesList:[],
                productDiscountSeriesList:[],

            }
        },
        methods: {
            //编辑地址
            clickEdit() {
                this.dialogShow = true;
                let product_series = [];
                if(this.brandSupplierRow.product_series){
                    this.brandSupplierRow.product_series.forEach((item)=>{
                        product_series.push({
                            "serie_id": item.id,
                        })
                    })
                }
                this.addForm = {
                    "product_series": product_series,
                };
                if(product_series.length===0) this.clickAddRow();
                this.getProductSeriesList();
            },
            clickAddRow() {
                this.addForm.product_series.push({
                    "serie_id": '',
                });
            },
            clickDeleteRow(row) {
                this.addForm.product_series.splice(this.addForm.product_series.indexOf(row), 1)
            },
            //保存地址
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        let product_series_id_list = [];
                        self.addForm.product_series.forEach((item)=>{
                            product_series_id_list.push(item.serie_id)
                        })
                        self.loading = true;
                        self.$http({
                            url: self.$api.new_product_basic_product_brand + '/' + self.brandUid + '/supplier/'+self.brandSupplierRow.id+'/series/bind',
                            type: 'POST',
                            requestBody: true,
                            data: {
                                product_series_id_list:product_series_id_list
                            },
                            success () {
                                self.loading = false;
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                self.dialogShow = false;
                                self.$emit('update');
                            }
                        });
                    }
                });
            },

            getProductSeriesList() {
                let self = this;
                if(self.brandUid){
                    self.$http({
                        url: self.$api.new_product_basic_product_brand + '/' + self.brandUid + '/series',
                        type: 'GET',
                        success: function (data) {
                            if (data.msg) {
                                self.productSeriesList = data.msg;
                            }
                        }
                    });
                }
            },
        }
    }
</script>

<style lang="scss">
    .brand-detail-supplier-edit-product-discount-series {
        border-collapse: collapse;
        width: 100%;
        table-layout: fixed;
        th, td {
            width: 40%;
            padding: 5px 10px;
            text-align: left;
            border: 1px solid #dddddd;
            background-color: #ffffff !important;
        }
        th:first-child,
        td:first-child{
            width: 40px;
            padding: 0;
            text-align: center;
        }
        th:last-child,
        td:last-child {
            width: 40px;
        }
    }
</style>
