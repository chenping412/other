<template>
    <div class="clearfix" v-loading="loading">
        <div class="clearfix">
            <i class="el-icon-edit-outline el-icon-normal cursor-pointer right margin-top-5" @click="clickEdit"></i>
            <template v-if="brandSupplier.serie_discounts">
                <p v-for="(item,$index) in brandSupplier.serie_discounts" :key="$index">
                    <span v-if="item.product_serie">{{$index+1}}、{{item.product_serie.name}}</span>
                    <!--<span> &ndash;&gt; </span>
                    <span>
                        <span v-if="item.discount_serie">{{item.discount_serie.name}} ({{item.discount_serie.discount | tenthsToPercent}})</span>
                        <span v-else>无</span>
                    </span>-->
                </p>
            </template>

        </div>

        <el-dialog :title="brandSupplier.company_info_with_follower ? brandSupplier.company_info_with_follower.company_name : ''"
                   :visible.sync="dialogShow" width="700px" :close-on-click-modal="false"
                   append-to-body v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="0px">
                <table class="brand-detail-supplier-edit-product-discount-series">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>产品系列（必选）</th>
<!--                        <th>折扣系列（非必选）</th>-->
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(row,$index) in addForm.serie_and_discounts" :key="$index">
                        <td>{{$index+1}}</td>
                        <td>
                            <el-form-item  :prop="'serie_and_discounts.'+$index+'.serie_id'" :rules="addFormRule.serie_id">
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
                        <!--<td>
                            <el-form-item  :prop="'serie_and_discounts.'+$index+'.discount_id'" :rules="addFormRule.discount_id">
                                <el-select v-model="row.discount_id" clearable>
                                    <el-option
                                            v-for="item in productDiscountSeriesList"
                                            :key="item.id"
                                            :value="item.id"
                                            :label="item.name">
                                        <span>{{item.name}}</span>
                                        <span> ({{item.discount | tenthsToPercent}})</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </td>-->
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
        props: ['brandId','brandSupplier'],
        data() {
            return {
                loading: false,

                dialogShow: false,
                addForm: {
                    "brand_supplier_id": '',
                    "serie_and_discounts": []
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
                let serie_and_discounts = [];
                if(this.brandSupplier.serie_discounts){
                    this.brandSupplier.serie_discounts.forEach((item)=>{
                        serie_and_discounts.push({
                            "serie_id": item.product_serie ? item.product_serie.id : '',
                            "discount_id": item.discount_serie ? item.discount_serie.id : '',
                        })
                    })
                }
                this.addForm = {
                    "brand_supplier_id": this.brandSupplier.id,
                    "serie_and_discounts": serie_and_discounts,
                };
                if(serie_and_discounts.length===0) this.clickAddRow();
                this.getProductSeriesList();
                this.getProductDiscountSeriesList();
            },
            clickAddRow() {
                this.addForm.serie_and_discounts.push({
                    "serie_id": '',
                    "discount_id": '',
                });
            },
            clickDeleteRow(row) {
                this.addForm.serie_and_discounts.splice(this.addForm.serie_and_discounts.indexOf(row), 1)
            },
            //保存地址
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.product_v5 + '/' + self.brandId + '/brand_suppliers/'+self.brandSupplier.id+'/series_discounts',
                            type: 'POST',
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
                                self.$emit('update');
                            }
                        });
                    }
                });
            },

            getProductSeriesList() {
                let self = this;
                if(self.brandId){
                    self.$http({
                        url: self.$api.product_brands + '/' + self.brandId + '/product_series',
                        type: 'GET',
                        success: function (data) {
                            if (data.msg) {
                                self.productSeriesList = data.msg;
                            }
                        }
                    });
                }
            },
            getProductDiscountSeriesList() {
                let self = this;
                if(self.brandId){
                    self.$http({
                        url: self.$api.product_v5 + '/' +self.brandId+ '/brand_suppliers/'+self.brandSupplier.id+'/discount_series',
                        type: 'GET',
                        success: function (data) {
                            if (data.msg) {
                                self.productDiscountSeriesList = data.msg;
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
