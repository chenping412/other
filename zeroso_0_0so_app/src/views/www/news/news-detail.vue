<template>
    <div class="flex-box-column brand-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">官网 / 新闻管理</el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId ? '新闻详情' : '新增新闻'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <div class="detail-control clearfix">
                        <div class="control-btns">
                            <div v-if="!queryId">
                                <el-button type="success" @click="clickSaveDate()">保存</el-button>
                                <el-button type="primary" plain @click="$router.back()">取消</el-button>
                            </div>
                            <div v-if="queryId">
                                <div v-if="!isEdit">
                                    <el-button v-for="(item,$index) in thisStateActions"
                                               :type="item.type"
                                               :key="$index"
                                               size="mini"
                                               @click="clickAction(item.action)">
                                        {{item.name}}
                                    </el-button>

                                    <el-button type="primary" :disabled="!canEditState" @click="clickEdit()">编辑</el-button>
                                    <el-button type="danger" :disabled="!canDeleteState" @click="clickDelete()">删除</el-button>
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
                                :listApi="$api.www_0_news_list">
                        </DetailPagination>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form" label-width="120px">
                    <el-row :gutter="30" class="margin-bottom-10">
                        <el-col :span="14">
                            <el-form-item label="标题：" prop="title">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.title"></el-input>
                                <h3 v-else class="form-border-bottom">{{detailForm.title}}</h3>
                            </el-form-item>
                            <el-form-item label="正文：" prop="content">
                                <WangEditor
                                        v-if="!queryId || isEdit"
                                        :contentHtml.sync="detailForm.content"
                                        index="1"
                                        :module_id="queryId"
                                        module_name="www_news_content"
                                        :subsystem="queryId"
                                        :isMinio="true">
                                </WangEditor>
                                <pre class="form-border-bottom" v-else v-html="detailForm.content"> </pre>
                            </el-form-item>
                            <el-form-item label="摘自" prop="quoted_from">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.quoted_from"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.quoted_from}}</span>
                            </el-form-item>
                            <el-form-item label="原始链接" prop="origin_url">
                                <el-input v-if="!queryId || isEdit" v-model="detailForm.origin_url" placeholder="格式例如：https://0so.com"></el-input>
                                <span v-else class="form-border-bottom">{{detailForm.origin_url}}</span>
                            </el-form-item>
                            <el-form-item label="新闻类型" prop="type">
                                <el-select v-if="!queryId || isEdit" v-model="detailForm.type" clearable>
                                    <el-option v-for="(item,$index) in $store.state.wwwNewsType"
                                               :key="$index"
                                               :label="item.label"
                                               :value="item.code">
                                    </el-option>
                                </el-select>
                                <span v-else class="form-border-bottom">{{detailForm.type | wwwNewsType}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <template v-if="queryId">
                                <el-form-item label="新闻主图：">
                                    <ImageListShow
                                            :urlList.sync="detailForm.images"
                                            :showDelete="isEdit"
                                            width="100"
                                            height="100">
                                    </ImageListShow>
                                    <FileUpload
                                            v-if="isEdit"
                                            :isMinio="true"
                                            :autoUpload="true"
                                            :showFileList="false"
                                            :accept="['image/gif','image/jpeg','image/png','image/svg+xml']"
                                            :module_id.sync="detailForm.id"
                                            module_name="www_news_banner"
                                            :subsystem="detailForm.id"
                                            @uploadSuccess="uploadSuccess">
                                    </FileUpload>
                                </el-form-item>
                                <el-form-item label="状态：">
                                    <div class="form-border-bottom clearfix">
                                        <WwwNewsState :state="detailForm.state"></WwwNewsState>
                                        <span class="margin-left-10" v-if="['audit_refuse','refuse_publish','offline'].indexOf(detailForm.state)>-1">
                                            原因：{{detailForm.reason}}
                                        </span>
                                    </div>
                                </el-form-item>
                                <el-form-item label="审核人：">
                                    <div class="form-border-bottom">
                                        <span v-if="detailForm.auditor">
                                            {{detailForm.auditor.name}}
                                        </span>
                                    </div>
                                </el-form-item>
                                <el-form-item label="发布人：">
                                    <div class="form-border-bottom">
                                        <span v-if="detailForm.publisher">
                                            {{detailForm.publisher.name}}
                                        </span>
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


        </div>


    </div>
</template>

<script>

    export default {
        components: {

        },
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',

                detailForm: {},
                detailFormRule: {
                    title: [
                        {required: true, message: '请输入标题！'}
                    ],content: [
                        {required: true, message: '请输入内容！'}
                    ],type: [
                        {required: true, message: '请选择新闻类型！'}
                    ],
                },

                loading: false,

                thisStateActions:[],

            }
        },
        computed: {
            canEditState(){
                return ['draft','auditing','audited','audit_refuse','publishing','refuse_publish','offline'].indexOf(this.detailForm.state)>-1
            },
            canDeleteState(){
                return ['draft','auditing','audited','audit_refuse','publishing','refuse_publish','offline'].indexOf(this.detailForm.state)>-1
            },
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
                    url: self.$api.www_0_news + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.detailForm = data.msg;
                            self.$store.state.wwwNewsState.forEach((item)=>{
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
                        self.saveDataSubmit();
                    }
                });
            },
            saveDataSubmit(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.queryId ? self.$api.www_0_news + '/' + self.queryId : self.$api.www_0_news,
                    type: self.queryId ? 'PUT' : 'POST',
                    requestBody: true,
                    data: self.detailForm,
                    success: function (data) {
                        if (data.msg) {
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

            uploadSuccess(result){
                let self=this;
                console.log(result);
                let images = JSON.parse(JSON.stringify(self.detailForm.images));
                if(result.msg){
                    let list = result.msg;
                    for(let i=0;i<list.length;i++){
                        images.push(self.$api.oss_file + '/' + list[i].entity_uid + '/' + list[i].id);
                    }
                }
                self.detailForm.images = images;
            },


            clickAction(action){
                let self = this;
                if(action === 'published' || action === 'restore'){
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
                if(action==='audit_refuse' || action==='refuse_publish' || action==='offline'){
                    self.$prompt('请输入原因', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
                        self.actionSubmit(action,value);
                    });
                    return;
                }
                self.actionSubmit(action);
            },
            actionSubmit(action,reason){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.www_0_news + '/' + self.queryId + '/action',
                    type: 'PUT',
                    data:{
                        "action": action,
                        "reason": reason,
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


            //删除
            clickDelete() {
                let self = this;
                self.$confirm('确定删除吗？，删除后将不可恢复', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.www_0_news + '/' + self.queryId,
                                type: 'DELETE',
                                success (){
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '操作成功！',
                                        type: 'success'
                                    });
                                    self.$router.push({
                                        path: self.parentQuery ? 'list?'+self.parentQuery : 'list',
                                    });
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
