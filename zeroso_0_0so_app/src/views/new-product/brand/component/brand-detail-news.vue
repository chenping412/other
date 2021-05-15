<template>
    <div class="clearfix" v-loading="loading">
        <el-table :data="listData" border>
            <el-table-column label="新闻图片" prop="banner_image">
                <template slot-scope="scope">
                    <FileListShow
                            :isMinio="true"
                            :module_id="scope.row.id"
                            module_name="brand_news_banner"
                            :subsystem="queryId">
                    </FileListShow>
                </template>
            </el-table-column>
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="内容" prop="content">
                <template slot-scope="scope">
                    <div style="max-height: 200px;overflow: hidden;" v-html="scope.row.content"></div>
                </template>
            </el-table-column>
            <el-table-column label="摘自" prop="quoted_from"></el-table-column>
            <el-table-column label="原始链接" prop="origin_url"></el-table-column>
            <el-table-column label="翻译作者">
                <template slot-scope="scope" v-if="scope.row.author">
                    <div v-html="scope.row.author.nick_name"></div>
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
            <el-button type="primary" @click="clickAdd()">新增品牌新闻</el-button>

            <i class="el-icon-refresh-right el-icon-normal cursor-pointer margin-left-20" @click="getListData"></i>
        </div>

        <el-dialog title="品牌新闻" :visible.sync="dialogShow" width="1000px" top="30px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="110px">
                <el-form-item label="新闻图片" prop="banner_image">
                    <FileListShow
                            ref="fileListShow"
                            :isMinio="true"
                            :module_id="addForm.id"
                            module_name="brand_news_banner"
                            :subsystem="queryId"
                            :showDelete="true">
                    </FileListShow>
                    <FileUpload
                            ref="fileUpdate"
                            :isMinio="true"
                            :accept="['image/gif','image/jpeg','image/png']"
                            fileNamePrefix="brand_news_banner-"
                            :module_id.sync="addForm.id"
                            module_name="brand_news_banner"
                            :subsystem="queryId">
                    </FileUpload>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input v-model="addForm.title"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <WangEditor
                            ref="brandNewsEditor"
                            :contentHtml.sync="addForm.content"
                            index="brand_news_content"
                            module_id="0"
                            module_name="brand_news_content"
                            :subsystem="queryId"
                            :isMinio="true">
                    </WangEditor>
                </el-form-item>
                <el-form-item label="摘自" prop="quoted_from">
                    <el-input v-model="addForm.quoted_from"></el-input>
                </el-form-item>
                <el-form-item label="原始链接" prop="origin_url">
                    <el-input v-model="addForm.origin_url" placeholder="格式例如：https://0so.com"></el-input>
                </el-form-item>
                <el-form-item label="翻译作者" prop="author_id" v-if="addForm.id">
                    <SelectLoginUser
                            :userId.sync="addForm.author_id"
                            :user="addForm.author"
                            :option="addForm.author ? [addForm.author] : null">
                    </SelectLoginUser>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="clickCancel()">取 消</el-button>
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
                    title: [
                        {required: true, message: '请输入标题！'}
                    ],content: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value || !value.replace(/<[^>]+>/g, "")) {
                                    callback(new Error('请输入内容！'));
                                } else {
                                    callback();
                                }
                            }
                        }
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
                self.listData= [];
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/news',
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
                    brand_uid: this.queryId,
                    banner_image: [],
                    title: '',
                    content: '',
                    quoted_from: '',
                    origin_url: '',
                    author_id: '',
                };
                this.$nextTick(()=>{
                    this.$refs.brandNewsEditor.updateContent();
                    this.$refs.fileListShow.update();
                })
            },
            //编辑
            clickEdit(item) {
                this.dialogShow = true;
                this.addForm = JSON.parse(JSON.stringify(item));
                this.$nextTick(()=>{
                    this.$refs.brandNewsEditor.updateContent();
                    this.$refs.fileListShow.update();
                })
            },
            clickCancel(){
                this.dialogShow = false;
                this.getListData();
            },
            //保存
            clickSaveDate() {
                let self = this;
                console.log(self.addForm)
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        if(self.addForm.banner_image){
                            for(let i=0;i<self.addForm.banner_image.length;i++){
                                if(!self.addForm.banner_image[i]){
                                    self.$message({
                                        showClose: true,
                                        message: '请选择新闻图片！',
                                        type: 'error'
                                    });
                                    return
                                }
                            }
                        }
                        self.loading = true;
                        self.$http({
                            url: self.addForm.id ? self.$api.new_product_basic_product_brand + '/' + self.queryId + '/news/'+ self.addForm.id : self.$api.new_product_basic_product_brand + '/' + self.queryId + '/news',
                            type: self.addForm.id ? 'PUT' : 'POST',
                            requestBody: true,
                            data: self.addForm,
                            success (data) {
                                self.$refs.fileUpdate.submitUpload(data.msg.id || self.addForm.id,()=>{
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.dialogShow = false;
                                    self.getListData();
                                });
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
                                url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/news/'+ id,
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
