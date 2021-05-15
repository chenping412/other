<template>
    <div class="brand-detail-brand_description clearfix" v-loading="loading">
        <div class="padding-left-20 padding-bottom-10">
            <div v-if="!isEdit">
                <el-button type="primary" @click="isEdit=true">编辑</el-button>
            </div>
            <div v-if="isEdit">
                <el-button type="success" @click="clickSaveEdit()">保存</el-button>
                <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
            </div>
        </div>
        <el-form class="clearfix" label-width="150px" style="width: 90%;">
                <el-form-item label="logo：">
                    <ImageUpload
                            v-if="isEdit"
                            :showImage="true"
                            :autoUpload="true"
                            :module_id="brandDescriptionData.id"
                            module_name="brand_logo"
                            subsystem="product"
                            :width="360"
                            :height="160"
                    ></ImageUpload>
                    <ImageShow v-else :module_id="brandDescriptionData.id" module_name="brand_logo" subsystem="product"></ImageShow>
                </el-form-item>
                <el-form-item label="官网截图：">
                    <ImageUpload
                            v-if="isEdit"
                            :showImage="true"
                            :autoUpload="true"
                            :module_id="brandDescriptionData.id"
                            module_name="brand_homepage_snapshot"
                            subsystem="product"
                            :width="360"
                            :height="180"
                    ></ImageUpload>
                    <ImageShow v-else :module_id="brandDescriptionData.id" module_name="brand_homepage_snapshot" subsystem="product"></ImageShow>
                </el-form-item>
                <el-form-item label="应用领域：">
                    <TagsListEdit :tags.sync="brandDescriptionData.using_area" :isEdit="isEdit"></TagsListEdit>
                    <span v-if="(!brandDescriptionData.using_area || brandDescriptionData.using_area.length===0) && !isEdit">{{'' | defaultStr}}</span>
                </el-form-item>
                <el-form-item label="主要品类：">
                    <TagsListEdit :tags.sync="brandDescriptionData.category" :isEdit="isEdit"></TagsListEdit>
                    <span v-if="(!brandDescriptionData.category || brandDescriptionData.category.length===0) && !isEdit">{{'' | defaultStr}}</span>
                </el-form-item>
                <el-form-item label="产品品类：">
                    <TagsListEdit :tags.sync="brandDescriptionData.main_products" :isEdit="isEdit"></TagsListEdit>
                    <span v-if="(!brandDescriptionData.main_products || brandDescriptionData.main_products.length===0) && !isEdit">{{'' | defaultStr}}</span>
                </el-form-item>
                <el-form-item label="品牌简介：">
                    <el-input type="textarea" rows="6" v-if="isEdit" v-model="brandDescriptionData.short_description"></el-input>
                    <span v-else>{{brandDescriptionData.short_description | defaultStr}}</span>
                </el-form-item>
                <el-form-item label="品牌详情：">
                    <el-input type="textarea" rows="6" v-if="isEdit" v-model="brandDescriptionData.description"></el-input>
                    <span v-else>{{brandDescriptionData.description | defaultStr}}</span>
                </el-form-item>
        </el-form>

    </div>
</template>

<script>
    export default {
        props: ['queryId'],
        data() {
            return {
                loading: false,
                isEdit:false,

                brandDescriptionData: {},

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
                    this.getDetailData();
                }
            },
            getDetailData() {
                let self = this;
                self.brandDescriptionData= {};
                self.loading = true;
                self.$http({
                    url: self.$api.product_products_brands + '/' + self.queryId + '/brand_description',
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            data.msg.brand_id=data.msg.id;
                            self.brandDescriptionData = data.msg;
                        }
                    }
                })
            },

            clickSaveEdit(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.product_products_brands + '/' + self.queryId + '/brand_description',
                    type:'PUT',
                    requestBody:true,
                    data:self.brandDescriptionData,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.getDetailData();
                            self.isEdit=false;
                        } else {
                            self.$message({
                                showClose: true,
                                message: '保存失败！',
                                type: 'error'
                            });
                        }
                    }
                })
            },
            clickCancelEdit(){
                this.isEdit=false;
                this.getDetailData();
            },

        }
    }
</script>

<style lang="scss">

</style>
