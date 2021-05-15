<template>
    <div class="clearfix" v-loading="loading">
        <el-table :data="listData" border>
            <el-table-column label="资质中文名称" prop="chinese_name"></el-table-column>
            <el-table-column label="资质英文名称" prop="english_name"></el-table-column>
            <el-table-column label="资质文件" prop="file_urls">
                <template slot-scope="scope">
                    <FileListShow
                            :isMinio="true"
                            :module_id="scope.row.id"
                            module_name="brand_certification"
                            :subsystem="queryId">
                    </FileListShow>
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
            <el-button type="primary" @click="clickAdd()">新增资质</el-button>

            <i class="el-icon-refresh-right el-icon-normal cursor-pointer margin-left-20" @click="getListData"></i>
        </div>

        <el-dialog title="品牌资质" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="110px">
                <el-form-item label="资质中文名称" prop="chinese_name">
                    <el-input v-model="addForm.chinese_name"></el-input>
                </el-form-item>
                <el-form-item label="资质英文名称" prop="english_name">
                    <el-input v-model="addForm.english_name"></el-input>
                </el-form-item>
                <el-form-item label="资质文件" prop="file_urls">
                    <FileListShow
                            ref="fileListShow"
                            :isMinio="true"
                            :module_id="addForm.id"
                            module_name="brand_certification"
                            :subsystem="queryId"
                            :showDelete="true">
                    </FileListShow>
                    <FileUpload
                            ref="fileUpdate"
                            :disabled="!addForm.chinese_name || !addForm.english_name"
                            :isMinio="true"
                            :fileNamePrefix="addForm.chinese_name+'-'+addForm.english_name+'-'"
                            :module_id.sync="addForm.id"
                            module_name="brand_certification"
                            :subsystem="queryId">
                    </FileUpload>
                    <p>请先填写：资质中文名称、资质英文名称，再上传资质文件</p>
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
                    chinese_name: [
                        {required: true, message: '请输入资质中文名称！'}
                    ],english_name: [
                        {required: true, message: '请输入资质英文名称！'}
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
                    url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/certification',
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
                    chinese_name: '',
                    english_name: '',
                    file_urls: [],
                };
                this.$nextTick(()=>{
                    this.$refs.fileListShow.update();
                })
            },
            //编辑
            clickEdit(item) {
                this.dialogShow = true;
                this.addForm = JSON.parse(JSON.stringify(item));
                this.$nextTick(()=>{
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
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.addForm.id ? self.$api.new_product_basic_product_brand + '/' + self.queryId + '/certification/'+ self.addForm.id : self.$api.new_product_basic_product_brand + '/' + self.queryId + '/certification',
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
                                url: self.$api.new_product_basic_product_brand + '/' + self.queryId + '/certification/'+ id,
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
