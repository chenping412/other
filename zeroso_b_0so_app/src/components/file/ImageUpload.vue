<template>
    <div class="avatar-uploader-component" :class="{'disabled':disabled}">
        <el-upload
                class="avatar-uploader"
                :action="$api.file_unique_file"
                :disabled="disabled"
                :show-file-list="false"
                :auto-upload="false"
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
                            centerBox
                            infoTrue
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
        props: ['module_id','module_name','subsystem','disabled','width','height','showImage','autoUpload'],
        data() {
            return {
                imageUrl:'',

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
                if(this.showImage && this.module_id && this.module_name && this.subsystem){
                    this.getImageListData();
                }
            },
            getImageListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.file_files_list,
                    data:{
                        module_id:self.module_id,
                        module_name:self.module_name,
                        subsystem:self.subsystem,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg && data.msg.items && data.msg.items.length>0) {
                            self.imageUrl = self.$api.file_file + '/' + data.msg.items[0].id;
                        }else {
                            self.imageUrl = '';
                        }
                    }
                })
            },

            fileChange(file){
                this.cropperImgUrl = URL.createObjectURL(file.raw);
                this.dialogShow = true;
            },
            clearFile(){
                this.cropperImgFileBlob = null;
                this.imageUrl = '';
                console.log(this.cropperImgFileBlob)
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
                let self = this;
                self.loading = true;
                if(self.cropperImgFileBlob && module_id && self.module_name && self.subsystem){
                    let formData = new FormData();
                    formData.append("file", self.cropperImgFileBlob);
                    let request = new XMLHttpRequest();
                    request.withCredentials = true;
                    let url = self.$api.file_unique_file + '?subsystem='+self.subsystem+'&module_name='+self.module_name+'&module_id='+module_id;
                    url = self.$utils.setCurrentCompanyToSearchParam(url);

                    request.open("POST", url);
                    request.send(formData);
                    request.onreadystatechange = function () {
                        if (request.readyState == 4) {
                            self.loading = false;
                            if (request.status == 200) {
                                let data = JSON.parse(request.response);
                                if (data.msg && data.msg.items) {
                                    self.dialogShow = false;
                                    self.imageUrl = self.$api.file_file + '/' + data.msg.items.id;
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
                            } else {
                                self.$message({
                                    showClose: true,
                                    message: '图片上传失败,请重试！',
                                    type: 'error'
                                });
                            }
                        }
                    };
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