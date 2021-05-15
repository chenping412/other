<template>
    <div class="flex-box-column brand-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">产品中心 / 品牌</el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId ? '品牌详情' : '新增品牌'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status" v-if="queryId">
                        <span :class="{'delete':detailForm.state=== 'inactive' || detailForm.state=== 'invalid'}">{{detailForm.name}}</span>
                        <span class="margin-left-20">品牌ID:{{detailForm.uid}}</span>
                        <span class="margin-left-10"
                              v-if="detailForm.correct_brand && (detailForm.state=== 'inactive' || detailForm.state=== 'invalid')">
                            ({{detailForm.correct_brand.name}})
                        </span>
                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <div v-if="!queryId">
                                <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                <el-button type="primary" plain @click="$router.back()">取消</el-button>
                            </div>
                            <div v-if="queryId">
                                <div v-if="!isEdit">
                                    <a class="margin-right-10" :href="detailForm.www_url" v-if="detailForm.www_url" target="_blank">
                                        <el-button size="mini">打开官网</el-button>
                                    </a>

                                    <brandDetailWwwPreview :brandDetail="detailForm"></brandDetailWwwPreview>


                                    <el-button type="warning" size="mini" v-if="detailForm.publish_state==='draft'" @click="actionSubmit('publishing')">申请发布</el-button>

                                    <el-button type="warning" size="mini"
                                               v-if="['published','offline_brand_and_product','offline_brand'].indexOf(detailForm.publish_state)>-1"
                                               @click="actionSubmit('publishing')">
                                        再次申请发布
                                    </el-button>

                                    <el-button type="success" size="mini" v-if="detailForm.publish_state==='publishing'" @click="clickPublished()">正式发布</el-button>

                                    <brand-detail-cancel-publish
                                            class="margin-left-10 margin-right-10"
                                            v-if="['published','publishing'].indexOf(detailForm.publish_state)>-1"
                                            :queryId="queryId"
                                            @update="init">
                                        下架
                                    </brand-detail-cancel-publish>

                                    <el-button type="primary" @click="clickEdit()">编辑</el-button>
                                </div>
                                <div v-if="isEdit">
                                    <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                    <el-button type="primary" plain @click="clickCancelEdit()">取消</el-button>
                                </div>
                            </div>
                        </div>
                        <DetailPagination
                                v-if="queryId"
                                :isNewSystem="true"
                                :noResellerCompanyId="true"
                                requestType="POST"
                                :listApi="$api.new_product_basic_product_brand_list">
                        </DetailPagination>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form"
                         label-width="120px">
                    <el-row :gutter="30" class="border-bottom margin-bottom-10">
                        <el-col :span="9">
                            <el-form-item label="品牌名：" prop="name">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.name" :disabled="detailForm.publish_state==='published'"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.name}}</span>
                            </el-form-item>
                            <el-form-item label="中文名：" prop="chinese_name">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.chinese_name"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.chinese_name}}</span>
                            </el-form-item>
                            <el-form-item label="品牌等级：" prop="state">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.state">
                                    <el-option v-for="(item,$index) in $store.state.brandLever2"
                                               :key="$index"
                                               :label="item.label"
                                               :value="item.code">
                                    </el-option>
                                </el-select>
                                <div v-else class="form-border-bottom clearfix">
                                    <BrandLever class="left brand-lever" :state="detailForm.state"></BrandLever>
                                </div>
                            </el-form-item>
                            <el-form-item label="国家：" prop="country">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.country">
                                    <el-option
                                            v-for="item in $store.state.country"
                                            :key="item.code2"
                                            :label="item.chinese_name"
                                            :value="item.code2">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">{{detailForm.country | country}}</span>
                            </el-form-item>
                            <el-form-item label="制造商：" prop="manufactruer_id">
                                <SelectPartnerCompanyOnly
                                        v-if="!queryId || isEdit"
                                        :partnerId.sync="detailForm.manufactruer_id"
                                        :partner="detailForm.manufactruer_company"
                                        :option="detailForm.manufactruer_id ? [detailForm.manufactruer_company] : null">
                                </SelectPartnerCompanyOnly>
                                <p v-else class="form-border-bottom">
                                    <router-link v-if="detailForm.manufactruer_company"
                                                 :to="'/partner/detail?id='+detailForm.manufactruer_company.account_company_id">
                                        {{detailForm.manufactruer_company.company_name}}
                                    </router-link>
                                </p>
                            </el-form-item>
                            <el-form-item label="官网：" prop="website">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.website"></el-input>
                                <div class="form-border-bottom" v-else>
                                    <a target="_blank" :href="detailForm.website">{{detailForm.website}}</a>
                                </div>
                            </el-form-item>
                            <el-form-item label="产品唯一性规则" prop="identity_rule">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.identity_rule" clearable :disabled="canNotEditIdentityRule">
                                    <el-option v-for="(item,$index) in $store.state.newBrandIdentityRule"
                                               :key="$index"
                                               :label="item.label"
                                               :value="item.code">
                                    </el-option>
                                </el-select>
                                <div v-else class="form-border-bottom">
                                   {{detailForm.identity_rule | newBrandIdentityRule}}
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="9">

                            <el-form-item label="跟进人：" v-if="queryId">
                                <div class="form-border-bottom clearfix">
                                    <div class="left">
                                        <span class="margin-right-20" v-if="detailForm.follower">{{detailForm.follower.nick_name}}</span>
                                    </div>
                                    <el-button type="warning" size="mini" plain class="right"
                                               v-if="allowChangeAllRelatedLoginUser || (!alreadyHasRelatedLoginUser && thisUserIsInMerchandiserList) || 1===1"
                                               @click="clickEditMerchandiser">
                                        变更跟进人
                                    </el-button>
                                </div>
                            </el-form-item>

                            <el-form-item label="发布状态：" v-if="queryId">
                                <div class="form-border-bottom clearfix">
                                    <div class="left">
                                        <BrandPublishState :state="detailForm.publish_state"></BrandPublishState>
                                        <span class="margin-left-10" v-if="['offline_brand_and_product','offline_brand'].indexOf(detailForm.publish_state)>-1">
                                            原因：{{detailForm.offline_cause}}
                                        </span>
                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item label="最后发布人：" v-if="queryId">
                                <div class="form-border-bottom clearfix">
                                    <span v-if="detailForm.publisher">
                                        <span>{{detailForm.publisher.nick_name}}</span>
                                        <span class="margin-left-10">{{detailForm.publish_date | zerosoCompanyTime}}</span>
                                    </span>
                                </div>
                            </el-form-item>
                            <el-form-item label="审核状态：" v-if="queryId">
                                <div class="form-border-bottom clearfix">
                                    <div class="left">
                                        <BrandAuditState :state="detailForm.audit_state"></BrandAuditState>
                                    </div>
                                    <div class="right">
                                        <el-button size="mini" v-if="detailForm.audit_state==='draft' || !detailForm.audit_state" @click="actionSubmit('auditing')">提交审核</el-button>
                                        <el-button size="mini" v-if="detailForm.audit_state==='audited'" @click="actionSubmit('auditing')">再次提交审核</el-button>
                                        <el-button type="success" size="mini" v-if="detailForm.audit_state==='auditing'" @click="actionSubmit('audit')">通过审核</el-button>
                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item label="最后审核人：" v-if="queryId">
                                <div class="form-border-bottom clearfix">
                                    <span v-if="detailForm.auditor">
                                        <span>{{detailForm.auditor.nick_name}}</span>
                                        <span class="margin-left-10">{{detailForm.audit_date | zerosoCompanyTime}}</span>
                                    </span>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="logo：">
                                <ImageUpload
                                        v-if="!queryId || isEdit"
                                        ref="brandLogo"
                                        :showImage="true"
                                        :autoUpload="false"
                                        :module_id="detailForm.uid"
                                        module_name="brand_logo"
                                        :subsystem="detailForm.uid"
                                        :isMinio="true"
                                        :width="121"
                                        :height="75">
                                </ImageUpload>
                                <ImageShow
                                        v-else
                                        ref="brandLogoShow"
                                        :isMinio="true"
                                        :module_id="detailForm.uid"
                                        module_name="brand_logo"
                                        :subsystem="detailForm.uid"
                                        :width="121"
                                        :height="75">
                                </ImageShow>
                            </el-form-item>

                            <el-form-item label="宣传图片：">
                                <FileListShow
                                        ref="brandAdvertiseShow"
                                        :isMinio="true"
                                        :module_id="detailForm.uid"
                                        module_name="brand_advertise"
                                        :subsystem="detailForm.uid"
                                        :showDelete="!queryId || isEdit">
                                </FileListShow>
                                <ImageUpload
                                        v-if="!queryId || isEdit"
                                        ref="brandAdvertise"
                                        :showImage="false"
                                        :autoUpload="false"
                                        :module_id="detailForm.uid"
                                        module_name="brand_advertise"
                                        :subsystem="detailForm.uid"
                                        :isMinio="true"
                                        :fileNotRemove="true"
                                        :width="121"
                                        :height="75">
                                </ImageUpload>

                            </el-form-item>
                        </el-col>
                    </el-row>

                    <brandDetailComment :queryId="queryId" :isEdit="isEdit" :comment.sync="detailForm.comment"></brandDetailComment>

                </el-form>
            </div>


            <el-card class="margin-bottom-20">
                <h3 slot="header" class="clearfix">
                    品牌简介
                </h3>
                <div>
                    <WangEditor
                            v-if="!queryId || isEdit"
                            :contentHtml.sync="detailForm.short_description"
                            index="1"
                            module_id="1"
                            module_name="brand_description"
                            :subsystem="queryId"
                            :isMinio="true"
                            width="850px">
                    </WangEditor>
                    <pre style="width: 813px;" v-else v-html="detailForm.short_description"></pre>
                </div>
            </el-card>
            <el-card class="margin-bottom-20">
                <h3 slot="header" class="clearfix">
                    品牌介绍
                </h3>
                <div>
                    <WangEditor
                            v-if="!queryId || isEdit"
                            :contentHtml.sync="detailForm.description"
                            index="2"
                            module_id="2"
                            module_name="brand_description"
                            :subsystem="queryId"
                            :isMinio="true"
                            width="850px">
                    </WangEditor>
                    <pre style="width: 813px;" v-else v-html="detailForm.description"></pre>
                </div>
            </el-card>

            <el-card class="margin-bottom-20">
                <h3 slot="header">应用领域</h3>
                <div>
                    <TagsListEdit :tags.sync="detailForm.using_area" :isEdit="!queryId || isEdit"></TagsListEdit>
                </div>
            </el-card>

            <el-card class="margin-bottom-20">
                <h3 slot="header">发展历程</h3>
                <div>
                    <WangEditor
                            v-if="!queryId || isEdit"
                            :contentHtml.sync="detailForm.brand_history"
                            index="3"
                            module_id="3"
                            module_name="brand_description"
                            :subsystem="queryId"
                            :isMinio="true"
                            width="850px">
                    </WangEditor>
                    <pre style="width: 813px;" v-else v-html="detailForm.brand_history"></pre>
                </div>
            </el-card>

            <el-card class="margin-bottom-20" v-if="queryId">
                <h3 slot="header">品牌标签</h3>
                <newProductAddTags :queryId="queryId" type="brand"></newProductAddTags>
            </el-card>

            <el-tabs type="card" class="car-box" v-if="!(!queryId || isEdit)">

                <el-tab-pane label="供应商" lazy>
                    <brandDetailSupplier :queryId="queryId"></brandDetailSupplier>
                </el-tab-pane>
                <el-tab-pane label="产品系列" lazy>
                    <BrandDetailProductSeries :queryId="queryId"></BrandDetailProductSeries>
                </el-tab-pane>
                <el-tab-pane label="折扣系列" lazy>
                    <brand-detail-discount-series :queryId="queryId"></brand-detail-discount-series>
                </el-tab-pane>
                <el-tab-pane label="品牌品类" lazy>
                    <BrandDetailCategory :queryId="queryId"></BrandDetailCategory>
                </el-tab-pane>
                <el-tab-pane label="品牌资质" lazy>
                    <BrandDetailCertification :queryId="queryId"></BrandDetailCertification>
                </el-tab-pane>
                <el-tab-pane label="品牌规则" lazy>
                    <BrandDetailRules :queryId="queryId"></BrandDetailRules>
                </el-tab-pane>
                <el-tab-pane label="代理信息" lazy>
                    <BrandDetailAgency :queryId="queryId" :manufactruerId="detailForm.manufactruer_id"></BrandDetailAgency>
                </el-tab-pane>
                <el-tab-pane label="品牌新闻" lazy>
                    <BrandDetailNews :queryId="queryId"></BrandDetailNews>
                </el-tab-pane>
            </el-tabs>

        </div>


        <el-dialog :title="'品牌名：'+detailForm.name" :visible.sync="editBrandLeverDialogShow" width="700px"
                   :close-on-click-modal="false"
                   v-loading="loading">
            <div class="edit-brand-lever-dialog clearfix">
                <div class="check-box" style="width: auto;">
                    <el-radio-group v-model="editBrandLeverForm.new_state"
                                    size="medium">
                        <el-radio
                                v-for="(item,$index) in $store.state.brandLever2"
                                :key="$index"
                                :label="item.code"
                                border>
                            {{item.label}}
                        </el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editBrandLeverSave()">保 存</el-button>
                <el-button @click="editBrandLeverDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>
        
        

        <el-dialog title="绑定跟进人" :visible.sync="editMerchandiserDialogShow" width="500px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="editMerchandiserForm" label-width="120px">
                <el-form-item label="跟进人：">
                    <el-select
                            v-model="editMerchandiserForm.login_id"
                            placeholder="请选择"
                            :disabled="!allowChangeAllRelatedLoginUser"
                            filterable
                            clearable>
                        <el-option v-for="item in merchandiserList"
                                   :key="item.id"
                                   :value="item.id"
                                   :label="item.nick_name">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editMerchandiserSave()">保 存</el-button>
                <el-button @click="editMerchandiserDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    import HostConfig from '../../../config/host-config'
    import BrandDetailAgency from "./component/brand-detail-agency";
    import BrandDetailProductSeries from "./component/brand-detail-product-series";
    import BrandDetailCategory from "./component/brand-detail-category";
    import BrandDetailCertification from "./component/brand-detail-certification";
    import BrandDetailRules from "./component/brand-detail-rules";
    import BrandDetailNews from "./component/brand-detail-news";
    import BrandDetailComment from "./component/brand-detail-comment";
    import brandDetailWwwPreview from "./component/brand-detail-www-preview";
    import BrandDetailCancelPublish from "./component/brand-detail-cancel-publish";
    import BrandDetailSupplier from "./component/brand-detail-supplier";
    import BrandDetailDiscountSeries from "./component/brand-detail-discount-series";
    import NewProductAddTags from "../tags/component/newProductAddTags";

    export default {
        components: {
            NewProductAddTags,
            BrandDetailDiscountSeries,
            BrandDetailSupplier,
            BrandDetailCancelPublish,
            brandDetailWwwPreview,
            BrandDetailComment,
            BrandDetailNews,
            BrandDetailRules,
            BrandDetailCertification,
            BrandDetailCategory,
            BrandDetailAgency,
            BrandDetailProductSeries,
        },
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                detailForm: {},
                detailFormRule: {
                    name: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value) {
                                    callback(new Error('请输入品牌名称！'));
                                } else if (/[\u4E00-\u9FA5\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF]+/g.test(value)) {
                                    callback(new Error('品牌名称不能输入中文！'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ], country: [
                        {required: true, message: '请选择国家！'}
                    ], state: [
                        {required: true, message: '请选择品牌等级！'}
                    ],
                },


                editBrandLeverDialogShow: false,
                editBrandLeverForm: {},


                editMerchandiserDialogShow: false,
                editMerchandiserForm: {},
                merchandiserList: [],

                loading: false,

                alreadyHasRelatedLoginUser: false,


                canNotEditIdentityRule: false,

            }
        },
        computed: {
            allowChangeAllRelatedLoginUser() {
                //允许修改跟进人为所有人的登录账号ID,根据host-config文件中不同环境的不同配置取值
                let loginUserIds = HostConfig.brandAllowChangeAllRelatedLoginUserId;
                return loginUserIds.indexOf(this.$store.state.userInfo.id) > -1
            },
            thisUserIsInMerchandiserList() {
                let yes = false;
                this.merchandiserList.forEach((item) => {
                    if (item.id === this.$store.state.userInfo.id) {
                        yes = true;
                    }
                });
                return yes
            },
        },
        watch: {
            '$route'() {
                this.init()
            }
        },
        created() {
            this.init();
            this.getMerchandiserList();
        },
        methods: {
            init() {
                let self = this;
                self.canNotEditIdentityRule = false;
                self.isEdit = false;
                self.alreadyHasRelatedLoginUser = false;
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
                self.canNotEditIdentityRule = false;
                self.isEdit = false;
                self.alreadyHasRelatedLoginUser = false;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_brand + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.detailForm = data.msg;
                            if (self.detailForm.follower && self.detailForm.follower) {
                                self.alreadyHasRelatedLoginUser = true;
                            }
                            if (self.detailForm.identity_rule) {
                                self.canNotEditIdentityRule = true;
                            }
                        }
                    }
                })
            },

            //点击编辑
            clickEdit() {
                this.isEdit = true;
            },
            //保存
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.saveDataSubmit();
                    }
                });
            },
            saveDataSubmit(){
                let self = this;
                if(!self.detailForm.identity_rule) self.detailForm.identity_rule = null;
                self.loading = true;
                self.$http({
                    url: self.queryId ? self.$api.new_product_basic_product_brand + '/' + self.queryId : self.$api.new_product_basic_product_brand,
                    type: self.queryId ? 'PUT' : 'POST',
                    requestBody: true,
                    data: self.detailForm,
                    success: function (data) {
                        if (data.msg) {
                            let brandUid=null;
                            if (!self.queryId && data.msg.uid) {
                                brandUid = data.msg.uid
                            } else {
                                brandUid = self.queryId;
                            }
                            self.detailForm.uid = brandUid;
                            setTimeout(()=>{
                                if(brandUid && self.$refs.brandLogo){
                                    self.$refs.brandLogo.submitUpload(brandUid, () => {
                                        self.$refs.brandAdvertise.submitUpload(brandUid, () => {
                                            self.loading = false;
                                            self.$refs.brandAdvertiseShow.update();
                                            if (!self.queryId && data.msg.uid) {
                                                self.$router.push({
                                                    path: 'detail',
                                                    query: {
                                                        id: data.msg.uid,
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


            //正式发布
            clickPublished() {
                let self = this;
                self.$confirm('确定正式发布吗？，确认后将同步信息至官网，正式发布前请检查信息是否有误', '提示', {
                    confirmButtonText: '确认发布',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.actionSubmit('publish');
                        }
                    }
                })
                
            },
            actionSubmit(action){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/' + action,
                    type: 'PUT',
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



            //取消编辑
            clickCancelEdit() {
                this.isEdit = false;
                this.getDetailData()
            },
            //点击标记品牌等级
            clickEditBrandLever() {
                this.editBrandLeverDialogShow = true;
                this.editBrandLeverForm = {
                    uid: this.detailForm.uid,
                    new_state: this.detailForm.state,
                };
            },
            editBrandLeverSave() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/state',
                    type: 'PUT',
                    requestBody: true,
                    data: self.editBrandLeverForm,
                    success (){
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '保存成功！',
                            type: 'success'
                        });
                        self.editBrandLeverDialogShow = false;
                        self.getDetailData();
                    }
                });
            },

            

            getMerchandiserList() {
                let self = this;
                self.$http({
                    url: self.$api.partner_companies_v5 + '/9428/login_users',
                    data: {
                        account_company_id: 9428
                    },
                    success: function (data) {
                        if (data.msg) {
                            self.merchandiserList = data.msg;
                        }
                    }
                });
            },
            clickEditMerchandiser() {
                if (this.detailForm.follower) {
                    this.editMerchandiserForm = {
                        uid: this.detailForm.uid,
                        login_id: this.detailForm.follower.id,
                    };
                } else {
                    if (!this.alreadyHasRelatedLoginUser && !this.allowChangeAllRelatedLoginUser) {
                        this.editMerchandiserForm = {
                            uid: this.detailForm.uid,
                            login_id: this.$store.state.userInfo.id,
                        };
                    } else {
                        this.editMerchandiserForm = {
                            uid: this.detailForm.uid,
                            login_id: null,
                        };
                    }
                }
                this.editMerchandiserDialogShow = true;
            },
            editMerchandiserSave() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/follower',
                    type: 'PUT',
                    requestBody: true,
                    data: self.editMerchandiserForm,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.editMerchandiserDialogShow = false;
                            self.getDetailData();
                        } else {
                            self.$message({
                                showClose: true,
                                message: '保存失败！',
                                type: 'error'
                            });
                        }
                    }
                });
            },

        }
    }
</script>

<style lang="scss">
    @import "../../../assets/css/config";

    .edit-brand-lever-dialog {
        .check-box {
            width: 460px;
            float: left;

            .el-radio {
                margin: 5px !important;
                width: 140px;
                height: 80px;
                padding-top: 30px;

                &.is-checked {
                    background-color: $color-main;

                    .el-radio__label {
                        color: #ffffff;
                    }

                    .el-radio__input.is-checked .el-radio__inner {
                        border-color: #ffffff;
                        background-color: #ffffff;
                    }

                    .el-radio__inner::after {
                        background-color: $color-main;
                    }
                }
            }
        }

        .el-form {
            width: 380px;
            float: right;
        }
    }
</style>
