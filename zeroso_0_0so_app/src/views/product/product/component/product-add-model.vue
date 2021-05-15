<template>
    <div class="inline-block">
        <el-button type="primary" @click="add">{{title || '新增产品'}}</el-button>

        <el-dialog :title="title ? title : addForm.id ? '编辑产品': '新增产品'" :visible.sync="dialogShow" width="650px" :close-on-click-modal="false" append-to-body v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="100px">
                <el-form-item label="品牌名">
                    <span v-if="addForm.brand">
                        {{addForm.brand.name}}
                    </span>
                </el-form-item>
                <el-form-item label="型号：" prop="product_name">
                    <el-input v-model="addForm.product_name"></el-input>
                </el-form-item>
                <el-form-item label="订货号：" prop="product_order_no">
                    <el-input v-model="addForm.product_order_no"></el-input>
                </el-form-item>
                <el-form-item label="产品系列：" prop="product_serie_id">
                    <SelectBrandProductSeries
                            :disabled="!addForm.brand || !addForm.brand.id"
                            :brandId="addForm.brand.id"
                            :brandProductSeriesId.sync="addForm.product_serie_id">
                    </SelectBrandProductSeries>
                </el-form-item>
                <el-form-item label="参数：" prop="product_parameter">
                    <el-input type="textarea" rows="5" v-model="addForm.product_parameter"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props:['title','brand'],
        data() {
            return {
                loading:false,
                dialogShow:false,
                addForm: {
                    brand:{},
                },
                addFormRule: {
                    product_name: [
                        {required: true, message: '请输入型号，若产品只有订货号，则此项也填写订货号！'}
                    ],
                    product_order_no: [
                        {required: true, message: '请输入订货号，若产品只有型号，则此项也填写型号！'}
                    ],
                },
            }
        },
        watch: {},
        created() {
        },
        methods: {
            add(){
                this.addForm ={
                    brand:this.brand,
                    brand_id: this.brand.id,
                    source: 'inquiry_sheet',
                    type:0,
                };
                this.dialogShow=true;
            },
            edit(item){
                this.addForm = JSON.parse(JSON.stringify(item));
                this.dialogShow=true;
            },
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.product_product_manage_product + (self.addForm.id ? '/'+self.addForm.id : ''),
                            type:self.addForm.id?'PUT':'POST',
                            requestBody:true,
                            data: self.addForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg && data.msg.id) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.dialogShow=false;
                                    self.addForm.id = data.msg.id;
                                    self.$emit('update',self.addForm);
                                }
                            }
                        });
                    }
                });
            },
        },
    }
</script>
