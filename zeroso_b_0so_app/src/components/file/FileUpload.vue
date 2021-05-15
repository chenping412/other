<template>
    <div class="file-upload-component">
        <el-upload
                :disabled="disabled || loading"
                ref="fileUploadComponent"
                :action="actionUrl"
                :on-remove="handleRemove"
                :on-change="fileChange"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :file-list.sync="fileList"
                :show-file-list="showFileList!==false"
                :auto-upload="autoUpload || false"
                :with-credentials="true"
                :http-request="fileUpdateRequest"
                :accept="accept? accept.join(',') : null"
                :multiple="multiple!==false"
                :limit="limit">
            <el-button slot="trigger" size="mini" type="primary" :loading="loading">{{loading ? '上传中' : autoUpload ? '上传' : '选择文件'}}</el-button>
        </el-upload>
    </div>
</template>

<script>
    export default {
        props: ['module_id', 'module_name', 'subsystem','isOnlyOne' ,'disabled', 'autoUpload', 'showFileList', 'selectFileList', 'updateFileList', 'fileNamePrefix','accept','maxSizeMB','multiple','limit'],
        data() {
            return {
                actionUrl: '',
                fileList: [],

                alreadyUpdateFileListLength: 0,

                fileListLength: 0,
                uploadSuccessNum: 0,

                loading:false,
            }
        },
        watch: {
            module_id() {
                this.init(this.module_id)
            },
            updateFileList() {
                this.alreadyUpdateFileListLength = this.updateFileList.length;
            },
        },
        created() {
            this.init(this.module_id)
        },
        methods: {
            init(module_id) {
                let self = this;
                let url = (self.isOnlyOne ? self.$api.file_unique_file : self.$api.file_files_list) + '?subsystem=' + self.subsystem + '&module_name=' + self.module_name + '&module_id=' + module_id;
                self.actionUrl = self.$utils.setCurrentCompanyToSearchParam(url);

                if (self.updateFileList) {
                    self.alreadyUpdateFileListLength = self.updateFileList.length;
                }
            },
            fileChange(file, fileList) {
                if (this.fileNamePrefix) {
                    for (let i = 0; i < fileList.length; i++) {
                        let fileName = this.fileNamePrefix + (this.alreadyUpdateFileListLength + i);
                        let arr = fileList[i].name.split('.');
                        let fileExtensions= '.' + arr[arr.length-1];
                        fileList[i].name=fileName + fileExtensions;
                        fileList[i].raw = new File([fileList[i].raw], fileName + fileExtensions, {type: fileList[i].raw.type});
                    }
                }
                this.fileList = fileList;
                console.log('fileChange', this.fileList, file);
                this.$emit('update:selectFileList', this.fileList);
            },
            handleRemove(file, fileList) {
                this.fileList = fileList;
                this.$emit('update:selectFileList', this.fileList);
                console.log(this.fileList);
            },
            submitUpload(module_id, callback) {
                let self = this;
                if (module_id) this.init(module_id);
                if (this.fileList && this.fileList.length > 0) {
                    this.fileListLength = this.fileList.length;
                    this.uploadSuccessNum = 0;
                    this.$nextTick(() => {
                        self.$refs.fileUploadComponent.submit();
                        if (self.timer) clearInterval(self.timer);
                        self.timer = setInterval(() => {
                            if (self.uploadSuccessNum === self.fileListLength && callback) {
                                clearInterval(self.timer);
                                callback(self.uploadSuccessNum);
                            }
                        }, 200)
                    })
                }else {
                    //当无上传文件时直接callback
                    if(callback) callback(0);
                }
            },

            fileUpdateRequest(params) {
                let self = this;
                let file = params.file;
                if (this.fileNamePrefix && this.autoUpload) {
                    let fileName = this.fileNamePrefix + (this.alreadyUpdateFileListLength+1);
                    this.alreadyUpdateFileListLength++;
                    let arr = params.file.name.split('.');
                    let fileExtensions= '.' + arr[arr.length-1];
                    file = new File([params.file], fileName + fileExtensions, {type: params.file.type});
                }

                if(this.accept && this.accept.indexOf(file.type)===-1){
                    this.$message({
                        showClose: true,
                        message: '不允许上传该格式文件，允许格式：' + this.accept.join('，'),
                        type: 'error'
                    });
                    return
                }

                let maxSizeMB = Number(this.maxSizeMB) || 100;
                if(file.size > maxSizeMB*1024*1024){
                    this.$message({
                        showClose: true,
                        message: '上传文件大小超过限制，允许最大：' + maxSizeMB + 'MB',
                        type: 'error'
                    });
                    return
                }
                self.loading=true;
                self.$utils.updateFile({
                    url: params.action,
                    file: file,
                    success(data){
                        self.uploadSuccess(data,file)
                    },
                    error(data){
                        self.uploadError(data, file)
                    },
                })
            },
            uploadSuccess(data) {
                this.loading=false;
                this.uploadSuccessNum++;
                this.$emit('uploadSuccess', data);
                if (data.msg && data.msg.items) {
                    let updateFileList = this.updateFileList ? JSON.parse(JSON.stringify(this.updateFileList)) : [];
                    updateFileList.push(data.msg.items);
                    this.$emit('update:updateFileList', updateFileList);
                    this.clearFiles();
                }
            },
            uploadError(data, file) {
                this.loading=false;
                this.uploadSuccessNum++;
                this.$message({
                    showClose: true,
                    message: '上传失败：' + file.name,
                    type: 'error'
                });
            },
            clearFiles(){
                this.$refs.fileUploadComponent.clearFiles();
                this.$nextTick(() => {
                    this.fileList = [];
                    this.$emit('update:selectFileList', this.fileList);
                })
            },
        },
    }
</script>

<style lang="scss">
    .file-upload-component {
        max-width: 500px;
        /*background-color: #fff;*/
        /*border: 1px solid #dddddd;*/
        /*border-radius: 6px;*/
        /*padding: 10px;*/
    }
</style>