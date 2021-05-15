<template>
    <div class="inline-block">
        <el-button type="primary" @click="add">{{title ? title : boxDetail ? '修改箱子': '新建箱'}}</el-button>

        <el-dialog :title="title ? title : boxDetail ? '修改箱子': '新建箱'" :visible.sync="dialogShow" width="800px"
                   :close-on-click-modal="false" v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="120px">
                <div style="width: 500px;">
                <el-form-item label="品牌" prop="brand_id">
                    <SelectBrand
                            :disabled="isOrderBox"
                            :brand.sync="addForm.brand"
                            :brandId.sync="addForm.brand_id"
                            :option="addForm.brand ? [addForm.brand] : null" @change="brandChange">
                    </SelectBrand>
                </el-form-item>
                <el-form-item label="所在仓" prop="belong_to_company_id">
                    <SelectInternalCompany
                            :disabled="isOrderBox"
                            :internalCompanyId.sync="addForm.belong_to_company_id">
                    </SelectInternalCompany>
                </el-form-item>
                <el-form-item label="毛重(kg)" prop="weight">
                    <InputNumber :value.sync="addForm.weight"></InputNumber>
                </el-form-item>
                </div>

                <div>
                    <el-table :data="addForm.box_lines" v-if="addForm.box_lines" border>
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column label="型号/订货号">
                            <template slot-scope="scope">
                                <el-form-item label-width="0" :prop="'box_lines.'+scope.$index+'.product_id'"
                                              :rules="addFormRule.product_id">
                                    <SelectProductSingle
                                            :disabled="isOrderBox"
                                            :key="scope.$index"
                                            :product.sync="scope.row.product"
                                            :productId.sync="scope.row.product_id"
                                            :option="scope.row.product&&scope.row.product.id ? [scope.row.product] : null"
                                            :data="{brand_name: addForm.brand ? addForm.brand.name : undefined}">
                                    </SelectProductSingle>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量">
                            <template slot-scope="scope">
                                <el-form-item label-width="0" :prop="'box_lines.'+scope.$index+'.quantity'"
                                              :rules="addFormRule.quantity">
                                    <InputNumber
                                            :value.sync="scope.row.quantity"
                                            :integer="true"
                                            :disabled="isOrderBox"
                                            :min="1">
                                    </InputNumber>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope" v-if="!scope.row.id">
                                <el-button type="danger" size="mini" @click="clickDeleteRow(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="padding-top-10" v-if="!isOrderBox">
                        <el-button :disabled="!addForm.brand_id" @click="clickAddRow">添加产品</el-button>
                    </div>
                </div>

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
        props: ['title', 'boxDetail'],
        data() {
            return {
                loading: false,
                dialogShow: false,
                addForm: {
                    box_lines: [],
                },
                addFormRule: {
                    brand_id: [
                        {required: true, message: '请选择品牌！'}
                    ], belong_to_company_id: [
                        {required: true, message: '请选择所在仓！'}
                    ], weight: [
                        {required: true, message: '请输入毛重(kg)！'}
                    ],
                    product_id: [
                        {required: true, message: '请选择产品型号/订货号！'}
                    ],
                    quantity: [
                        {required: true, message: '请填写数量！'}
                    ],
                },

                isOrderBox:false,

            }
        },
        watch: {
            boxDetail(){
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                this.isOrderBox = this.boxDetail && this.boxDetail.box_type==='order';
            },
            add() {
                if (this.boxDetail) {
                    let box_lines = [];
                    for(let i=0;i<this.boxDetail.box_lines.length;i++){
                        box_lines.push({
                            id: this.boxDetail.box_lines[i].id,
                            product_id: this.boxDetail.box_lines[i].product_info ? this.boxDetail.box_lines[i].product_info.id : null,
                            product: this.boxDetail.box_lines[i].product_info,
                            quantity: this.boxDetail.box_lines[i].quantity,
                        })
                    }
                    this.addForm = {
                        box_id: this.boxDetail.id,
                        brand_id: this.boxDetail.brand.id,
                        brand: this.boxDetail.brand,
                        belong_to_company_id: this.boxDetail.belong_to_company ? this.boxDetail.belong_to_company.account_company_id : null,
                        weight: this.boxDetail.weight,
                        box_lines: box_lines,
                    };
                } else {
                    this.addForm = {
                        brand_id: null,
                        brand: null,
                        belong_to_company_id: null,
                        weight: null,
                        box_lines: [],
                    };
                }
                this.dialogShow = true;
                this.$nextTick(() => {
                    this.$refs.form.clearValidate();
                })
            },


            clickAddRow() {
                this.addForm.box_lines.push({
                    product_id: null,
                    product: null,
                    quantity: null,
                })
            },
            clickDeleteRow(row) {
                this.addForm.box_lines.splice(this.addForm.box_lines.indexOf(row), 1);
            },

            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.order_boxes + (self.addForm.box_id ? '/' + self.addForm.box_id : ''),
                            type: self.addForm.box_id ? 'PUT' : 'POST',
                            requestBody: true,
                            data: self.addForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg && data.msg.id) {
                                    self.$message({
                                        showClose: true,
                                        message: '操作成功！',
                                        type: 'success'
                                    });
                                    self.dialogShow = false;

                                    if(self.addForm.box_id){
                                        self.$emit('update')
                                    }else {
                                        self.$router.push({
                                            path: '/logistics/box/stock/detail',
                                            query: {
                                                id: data.msg.id
                                            }
                                        });
                                    }
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

            brandChange(){
                this.addForm.box_lines=[];
            },


        },
    }
</script>

<style lang="scss" scoped>

</style>