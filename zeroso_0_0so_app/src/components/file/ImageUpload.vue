<template>
    <div class="avatar-uploader-component"
         :class="{'disabled':disabled}"
         :style="{'width':width?width+'px':null,'height':height?height+'px':null}">
        <el-upload
                class="avatar-uploader"
                :action="$api.file_unique_file"
                :disabled="disabled"
                :show-file-list="false"
                :auto-upload="false"
                accept="image/gif,image/jpeg,image/png,image/svg+xml"
                :on-change="fileChange">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-if="!imageUrl" class="el-icon-plus avatar-uploader-icon"></i>
            <i v-if="imageUrl && cropperImgFileBlob && !autoUpload" class="el-icon-close" @click.stop="clearFile()"></i>
        </el-upload>


        <el-dialog class="avatar-uploader-dialog" title="图片裁剪" :visible.sync="dialogShow" width="900px" :close-on-click-modal="false" append-to-body>

            <div class="clearfix">
                <div class="cropper-box">
                    <VueCropper
                            :img="cropperImgUrl"
                            ref="cropper"
                            :canScale="false"
                            autoCrop
                            autoCropWidth="400"
                            autoCropHeight="400"
                            fixed
                            :fixedNumber="fixedNumber"
                            full
                            :canMove="false"
                            :centerBox="false"
                            infoTrue
                            outputType="png"
                            @realTime="realTime"
                    ></VueCropper>
                </div>
                <div class="img-preview">
                    <div class="show-preview" :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden'}">
                        <div :style="previews.div">
                            <img :src="previews.url" :style="previews.img">
                        </div>
                    </div>
                </div>

            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickCropper()">裁 剪</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['module_id','module_name','subsystem','disabled','width','height','showImage','autoUpload','isMinio','fileNotRemove'],
        data() {
            return {
                imageUrl:'',
                imageId:null,

                loading:false,

                dialogShow:false,
                cropperImgUrl:'',
                fixedNumber:[1,1],
                cropperImgFileBlob:null,
                cropperImgFileBase64:null,

                previews :'',

            }
        },
        watch:{
            module_id(){
                this.init();
            }
        },
        created() {
            if(this.width && this.height){
                this.fixedNumber = [this.width*1 , this.height*1];
            }
            this.init();
        },
        methods: {

            init(){
                this.imageId = null;
                this.imageUrl = '';
                if(this.isMinio){
                    this.getMinioImageListData();
                }else{
                    this.getImageListData();
                }
            },
            getImageListData() {
                let self = this;
                if(this.showImage && this.module_id && this.module_name && this.subsystem) {
                    self.loading = true;
                    self.$http({
                        url: self.$api.file_files_list,
                        data: {
                            module_id: self.module_id,
                            module_name: self.module_name,
                            subsystem: self.subsystem,
                        },
                        success: function (data) {
                            self.loading = false;
                            if (data.err_code.length === 0 && data.msg && data.msg.items && data.msg.items.length > 0) {
                                self.imageId = data.msg.items[0].id;
                                self.imageUrl = self.$api.file_file + '/' + data.msg.items[0].id;
                            } else {
                                self.imageId = null;
                                self.imageUrl = '';
                            }
                        }
                    })
                }
            },
            getMinioImageListData() {
                let self = this;
                if(self.showImage && self.module_id && self.module_name && self.subsystem){
                    self.loading = true;
                    self.$http({
                        url: self.$api.oss_file + '/' + self.subsystem,
                        data:{
                            object_id:self.module_id,
                            file_type:self.module_name,
                            entity_uid:self.subsystem,
                        },
                        success: function (data) {
                            self.loading = false;
                            if (data.msg && data.msg && data.msg.length>0) {
                                self.imageId = data.msg[0].id;
                                self.imageUrl = self.$api.oss_file + '/' + self.subsystem + '/' + data.msg[0].id;
                            }else {
                                self.imageId = null;
                                self.imageUrl = '';
                            }
                        }
                    })
                }
            },

            fileChange(file){
                console.log(file)
                this.cropperImgUrl = URL.createObjectURL(file.raw);
                this.dialogShow = true;
            },
            clearFile(){
                this.cropperImgFileBlob = null;
                this.imageUrl = '';
                this.imageId = null;
            },

            realTime(data) {
                this.previews  = data;
            },
            clickCropper(){
              let self = this;
                self.$refs.cropper.getCropBlob((data) => {
                    self.cropperImgFileBlob = data;
                    console.log(self.cropperImgFileBlob)
                    if(self.autoUpload && self.module_id){
                        self.submitUpload(self.module_id);
                    }
                });
                if(!self.autoUpload){
                    self.$refs.cropper.getCropData((data) => {
                        self.imageUrl = data;
                        self.dialogShow = false;
                    })
                }
            },
            //提交上传
            submitUpload(module_id,callback){
                if(this.isMinio){
                    this.minioSubmitFc(module_id,callback)
                } else {
                    this.normalSubmitFc(module_id,callback)
                }
            },
            normalSubmitFc(module_id,callback){
                let self = this;
                self.loading = true;
                if(self.cropperImgFileBlob && module_id && self.module_name && self.subsystem){
                    let url = self.$api.file_unique_file + '?subsystem='+self.subsystem+'&module_name='+self.module_name+'&module_id='+module_id;
                    url = self.$utils.setCurrentCompanyToSearchParam(url);
                    let file = new File([self.cropperImgFileBlob], self.subsystem + '_' + self.module_name + '_' + module_id + '.png');
                    self.loading=true;
                    self.$utils.updateFile({
                        url: url,
                        file: file,
                        success(data){
                            if (data.msg && data.msg.items) {
                                self.dialogShow = false;
                                self.cropperImgFileBlob = null;
                                self.imageUrl = self.$api.file_file + '/' + data.msg.items.id;
                                self.imageId = data.msg.items.id;
                                self.$message({
                                    showClose: true,
                                    message: '图片上传成功！',
                                    type: 'success'
                                });
                                callback && callback('success');
                            } else {
                                self.$message({
                                    showClose: true,
                                    message: '图片上传失败,请重试！',
                                    type: 'error'
                                });
                            }
                        },
                        error(){
                            self.$message({
                                showClose: true,
                                message: '图片上传失败,请重试！',
                                type: 'error'
                            });
                            callback && callback('error');
                        },
                    })
                }else {
                    callback && callback('notUpload');
                }
            },
            minioSubmitFc(module_id,callback){
                let self = this;
                self.loading = true;
                if(self.cropperImgFileBlob && module_id && self.module_name && self.subsystem){
                    let url = self.$api.oss_file + '/' + self.subsystem;
                    url = self.$utils.setCurrentCompanyToSearchParam(url);
                    let file = new File([self.cropperImgFileBlob], self.module_name + '-' + self.subsystem + '-' + new Date().getTime() + '.png',{type:self.cropperImgFileBlob.type});
                    self.loading=true;
                    self.$utils.updateFile({
                        url: url,
                        data:{
                            enctype:"multipart/form-data",
                            object_id:module_id,
                            file_type:self.module_name,
                            entity_uid:self.subsystem,
                            first_delete_after_save:!self.fileNotRemove,//上传文件会删除之前的旧文件
                            files:file,
                        },
                        success(data){
                            self.loading=false;
                            if (data.msg && data.msg[0]) {
                                self.dialogShow = false;
                                self.cropperImgFileBlob = null;
                                self.imageUrl = self.$api.oss_file + '/' + self.subsystem + '/' + data.msg[0].id;
                                self.imageId = data.msg[0].id;
                                self.$message({
                                    showClose: true,
                                    message: '图片上传成功！',
                                    type: 'success'
                                });
                                callback && callback('success');
                            } else {
                                self.$message({
                                    showClose: true,
                                    message: '图片上传失败,请重试！',
                                    type: 'error'
                                });
                            }
                        },
                        error(){
                            self.$message({
                                showClose: true,
                                message: '图片上传失败,请重试！',
                                type: 'error'
                            });
                            callback && callback('error');
                        },
                    })
                }else {
                    callback && callback('notUpload');
                }
            },
        },
    }
</script>

<style lang="scss">
    @import "../../assets/css/config";
    .avatar-uploader-component {
        display: inline-block;
        line-height: inherit;
        overflow: hidden;
        vertical-align: middle;
        width: 150px;
        height: 150px;
        &.disabled{
            .el-upload{
                cursor: not-allowed;
            }
            .el-upload:hover {
                border-color: #d9d9d9;
            }
        }
        .avatar-uploader{
            width: 100%;
            height: 100%;
        }
        .el-upload {
            border: 1px dashed #d9d9d9;
            cursor: pointer;
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border-radius: 4px;
        }
        .el-upload:hover {
            border-color: $color-main;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
        }
        .avatar {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: contain;
        }
        .el-icon-close {
            position: absolute;
            right: 2px;
            top: 2px;
            cursor: pointer;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #808080;
            font-size: 12px;
            color: #ffffff;
            text-align: center;
            line-height: 16px;
        }
    }
    .avatar-uploader-dialog{
        .cropper-box{
            width: 400px;
            height: 400px;
            float: left;
        }
        .img-preview{
            float: left;
            padding-left: 20px;
            img{
                max-width: none;
            }
        }
    }
</style>