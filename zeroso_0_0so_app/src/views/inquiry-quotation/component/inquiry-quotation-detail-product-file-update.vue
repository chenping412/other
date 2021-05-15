<template>
    <div>
        <el-button size="mini"  plain @click="dialogShow=true">上传附件</el-button>
        <el-dialog title="上传附件" :visible.sync="dialogShow" width="550px" :close-on-click-modal="false" v-loading="loading">
            <div>
                <FileListShow
                        :showDelete="true"
                        :fileList.sync="updateFileList">
                </FileListShow>

                <FileUpload
                        :autoUpload="true"
                        :updateFileList.sync="updateFileList"
                        :show-file-list="true"
                        :fileNamePrefix="brandName+'-'+index+'-'"
                        :accept="['image/gif','image/jpeg','image/png']"
                        module_id="0"
                        module_name="order_line"
                        subsystem="inquiry"
                        ref="order_line">
                </FileUpload>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" @click="clickSaveData()">提 交</el-button>
                <el-button @click="dialogShow = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: ['queryId','productId','file_id_list','brandName','index'],
        data() {
            return {
                dialogShow: false,
                updateFileList:[],
                loading: false,
            }
        },
        watch:{
            file_id_list(){
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                this.dialogShow = false;
                this.updateFileList = JSON.parse(JSON.stringify(this.file_id_list));
            },
            clickSaveData() {
                console.log(this.updateFileList)
                let self = this;
                let file_id_list = [];
                for (let i = 0; i < this.updateFileList.length; i++) {
                    file_id_list.push(JSON.stringify(this.updateFileList[i]));
                }
                self.loading = true;
                self.$http({
                    url: self.$api.inquiry_v6_0_quotations + '/' + self.queryId + '/products/'+ self.productId +'/attachments',
                    type: 'PUT',
                    requestBody: true,
                    data:{
                        "attachments": {
                            "file_id_list": file_id_list
                        },
                        "product_id": self.productId
                    },
                    success: function () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '上传成功！',
                            type: 'success'
                        });
                        self.dialogShow = false;
                        self.$emit('update');
                    }
                });
            },


        }
    }
</script>
