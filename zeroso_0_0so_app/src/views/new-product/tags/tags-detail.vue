<template>
    <div class="flex-box-column brand-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">官网 / 标签管理</el-breadcrumb-item>
                    <el-breadcrumb-item>标签详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <div v-if="!isEdit">
                                <el-button v-for="(item,$index) in thisStateActions"
                                           :type="item.type"
                                           :key="$index"
                                           size="mini"
                                           @click="clickAction(item.action)">
                                    {{item.name}}
                                </el-button>
                                <el-button type="primary" @click="clickEdit()">编辑</el-button>
                            </div>
                            <div v-if="isEdit">
                                <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                            </div>
                        </div>
                        <DetailPagination
                                v-if="queryId"
                                :isNewSystem="true"
                                :noResellerCompanyId="true"
                                requestType="POST"
                                :listApi="$api.new_product_basic_product_label_normal_list">
                        </DetailPagination>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form" label-width="120px">
                    <el-row :gutter="30" class="margin-bottom-10">
                        <el-col :span="14">
                            <el-form-item label="标签名称：" prop="name">
                                <h3 class="form-border-bottom">{{detailForm.name}}</h3>
                            </el-form-item>
                            <el-form-item label="父标签">
                                <SelectNewProductTags
                                        v-if="isEdit"
                                        :tagId.sync="detailForm.parent_label_id"
                                        :tag="detailForm.parent"
                                        :option="detailForm.parent_label_id ? [detailForm.parent] : null">
                                </SelectNewProductTags>
                                <div v-else class="form-border-bottom">
                                    <router-link class="blue" :to="{path:'detail',query:{id:detailForm.parent.id,parentQuery:parentQuery}}" v-if="detailForm.parent">
                                        {{detailForm.parent.name}}
                                    </router-link>
                                </div>
                            </el-form-item>
                            <el-form-item label="替代标签">
                                <div class="form-border-bottom">
                                    <router-link class="blue" :to="{path:'detail',query:{id:detailForm.canonical_label.id,parentQuery:parentQuery}}" v-if="detailForm.canonical_label">
                                        {{detailForm.canonical_label.name}}
                                    </router-link>
                                </div>
                            </el-form-item>
                            <el-form-item label="替代操作人：">
                                <div class="form-border-bottom">
                                    <span v-if="detailForm.normalizater">
                                        {{detailForm.normalizater.nick_name}}
                                    </span>
                                </div>
                            </el-form-item>
                            <el-form-item label="替代时间：">
                                <div class="form-border-bottom">
                                    {{detailForm.normalization_time | zerosoCompanyTime}}
                                </div>
                            </el-form-item>
                            <el-form-item label="发布操作人：">
                                <div class="form-border-bottom">
                                    <span v-if="detailForm.publisher">
                                        {{detailForm.publisher.nick_name}}
                                    </span>
                                </div>
                            </el-form-item>
                            <el-form-item label="发布时间：">
                                <div class="form-border-bottom">
                                    {{detailForm.publish_time | zerosoCompanyTime}}
                                </div>
                            </el-form-item>
                            <el-form-item label="标签描述：" prop="description">
                                <WangEditor
                                        v-if="isEdit"
                                        :contentHtml.sync="detailForm.description"
                                        index="1"
                                        :module_id="queryId"
                                        module_name="www_news_content"
                                        :subsystem="queryId"
                                        :isMinio="true">
                                </WangEditor>
                                <pre class="form-border-bottom" v-else v-html="detailForm.description"> </pre>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <template v-if="queryId">
                                <el-form-item label="标签图片：">
                                    <FileListShow
                                            ref="labelBannerShow"
                                            :isMinio="true"
                                            :updateFileList.sync="updateFileList"
                                            :module_id="detailForm.id"
                                            module_name="label_banner"
                                            :subsystem="detailForm.id"
                                            :showDelete="isEdit">
                                    </FileListShow>
                                    <FileUpload
                                            v-if="isEdit"
                                            ref="labelBanner"
                                            :isMinio="true"
                                            :disabled="updateFileList.length>=3"
                                            :accept="['image/gif','image/jpeg','image/png','image/svg+xml']"
                                            :module_id.sync="detailForm.id"
                                            module_name="label_banner"
                                            :subsystem="detailForm.id">
                                    </FileUpload>
                                </el-form-item>
                                <el-form-item label="状态：">
                                    <div class="form-border-bottom clearfix">
                                        <NewProductTagsState :state="detailForm.state"></NewProductTagsState>
                                    </div>
                                </el-form-item>

                                <el-form-item label="创建时间：">
                                    <div class="form-border-bottom">
                                        {{detailForm.create_time | zerosoCompanyTime}}
                                    </div>
                                </el-form-item>
                                <el-form-item label="修改时间：">
                                    <div class="form-border-bottom">
                                        {{detailForm.write_time | zerosoCompanyTime}}
                                    </div>
                                </el-form-item>
                            </template>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <el-tabs type="card" class="car-box" v-if="!(!queryId || isEdit)">
                <el-tab-pane label="已标记品牌" lazy>
                    <tags-detail-brands :queryId="queryId"></tags-detail-brands>
                </el-tab-pane>
                <el-tab-pane label="已标记产品" lazy>
                    <tags-detail-products :queryId="queryId"></tags-detail-products>
                </el-tab-pane>
            </el-tabs>

        </div>

        <el-dialog title="选择规范化标签" :visible.sync="normalizeDialogShow" width="600px" :close-on-click-modal="false"
                   v-loading="loading">
            <SelectNewProductTags
                    :tagId.sync="normalizeForm.id"
                    :option="normalizeForm.id ? [normalizeForm] : null">
            </SelectNewProductTags>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitNormalizeData()">保 存</el-button>
                <el-button @click="normalizeDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    import TagsDetailBrands from "./component/tags-detail-brands";
    import TagsDetailProducts from "./component/tags-detail-products";
    export default {
        components: {
            TagsDetailProducts,
            TagsDetailBrands

        },
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                detailForm: {},
                detailFormRule: {
                    name: [
                        {required: true, message: '请输入标签名称！'}
                    ],
                },

                loading: false,

                thisStateActions:[],

                normalizeDialogShow: false,
                normalizeForm:{},

                updateFileList:[],

            }
        },
        computed: {

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
                let self = this;
                self.isEdit = false;
                self.normalizeDialogShow = false;
                self.thisStateActions=[];
                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id;
                    self.getDetailData();
                } else {
                    self.queryId = '';
                    self.detailForm = {};
                }
            },
            getDetailData() {
                let self = this;
                self.isEdit = false;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_label_normal + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.detailForm = data.msg;
                            self.$store.state.newProductTagsState.forEach((item)=>{
                                if(item.code === self.detailForm.state){
                                    self.thisStateActions = item.actions
                                }
                            })
                        }
                    }
                })
            },

            //点击编辑
            clickEdit() {
                this.isEdit = true;
            },
            //取消编辑
            clickCancelEdit() {
                this.isEdit = false;
                this.getDetailData()
            },
            //保存
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        if(self.detailForm.parent_label_id === self.detailForm.id){
                            self.$message({
                                showClose: true,
                                message: '父标签不能是自己！',
                                type: 'error'
                            });
                            return
                        }
                        self.saveDataSubmit();
                    }
                });
            },
            saveDataSubmit(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_label_normal + '/' + self.queryId,
                    type: 'PUT',
                    requestBody: true,
                    data: self.detailForm,
                    success: function (data) {
                        if (data.msg) {
                            let tagId=null;
                            if (!self.queryId && data.msg.id) {
                                tagId = data.msg.id
                            } else {
                                tagId = self.queryId;
                            }
                            self.detailForm.id = tagId;
                            setTimeout(()=>{
                                if(tagId){
                                    self.$refs.labelBanner.submitUpload(tagId, () => {
                                        self.loading = false;
                                        self.$refs.labelBannerShow.update();
                                        if (!self.queryId && data.msg.id) {
                                            self.$router.push({
                                                path: 'detail',
                                                query: {
                                                    id: data.msg.id,
                                                }
                                            });
                                        } else {
                                            self.getDetailData();
                                        }
                                        self.isEdit = false;
                                        self.$message({
                                            showClose: true,
                                            message: '保存成功！',
                                            type: 'success'
                                        });
                                    });
                                }
                            },100)
                        } else {
                            self.loading = false;
                            self.$message({
                                showClose: true,
                                message: '保存失败！',
                                type: 'error'
                            });
                        }
                    }
                });
            },


            clickAction(action){
                let self = this;
                if(action === 'label_finish_publish'){
                    self.$confirm('确定发布吗？发布后内容将同步至官网！', '提示', {
                        confirmButtonText: '确认发布',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback: function (confirmAction) {
                            if (confirmAction === 'confirm') {
                                self.actionSubmit(action);
                            }
                        }
                    });
                    return;
                }
                if(action==='label_mark_normal'){
                    self.normalizeDialogShow=true;
                    return;
                }
                self.actionSubmit(action);
            },
            actionSubmit(action,canonical_label_id){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_label_normal + '/' + self.queryId + '/action',
                    type: 'PUT',
                    data:{
                        "action": action,
                        "canonical_label_id": canonical_label_id,
                    },
                    success (){
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.getDetailData();
                    }
                });
            },
            submitNormalizeData(){
                let self = this;
                if(!self.normalizeForm.id){
                    self.$message({
                        showClose: true,
                        message: '请选择规范化标签！',
                        type: 'error'
                    });
                    return
                }
                if(self.normalizeForm.id === self.detailForm.id){
                    self.$message({
                        showClose: true,
                        message: '不能选择自己！',
                        type: 'error'
                    });
                    return
                }

                self.normalizeDialogShow=false;
                self.actionSubmit('label_mark_normal',self.normalizeForm.id)
            }

        }
    }
</script>

<style lang="scss">

</style>
