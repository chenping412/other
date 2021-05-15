<template>
    <div class="inline-block">
        <el-button
                :disabled="!sendMessage && sendFileList.length===0"
                @click="showDialog">
            多人发送
        </el-button>

        <el-dialog title="多人发送" :visible.sync="dialogShow" width="700px" v-loading="loading">
            <el-form label-width="120px">
                <el-form-item label="发送至(可多选)：">
                    <el-select v-model="sendToUserIds" multiple filterable placeholder="可输入关键词检索人名，可多选">
                        <el-option
                                v-for="(item,$index) in sendToUserList"
                                :key="$index"
                                :value="item.id"
                                :label="item.company_name + ',' + item.name">
                            <span>{{item.company_name}}</span>
                            <span>，{{item.name}}</span>
                            <CompanyType :type="item.company_type"></CompanyType>
                        </el-option>
                    </el-select>
                    <p>注意：多人发送将会给所选的每个人单独发送一条消息</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSendMessage()">发 送</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: ['forwardCompanyIds','sendMessage','sendFileList','sendToUserList','sendBrandId','module_id','module_name','subsystem'],
        data() {
            return {
                loading: false,
                dialogShow: false,
                sendToUserIds: [],
                selectSendToUserList: [],
                index:0,
            }
        },
        methods: {
            showDialog(){
                this.dialogShow=true;
            },
            clickSendMessage() {
                let self=this;
                if (!this.sendToUserIds || this.sendToUserIds.length===0) {
                    this.$message({
                        showClose: true,
                        message: '请选择发送至！',
                        type: 'error'
                    });
                    return
                }
                self.$confirm('确定多人发送吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.sendMessageToManySubmit();
                        }
                    }
                });
            },
            sendMessageToManySubmit(){
                let self=this;
                if(self.sendToUserIds && self.sendToUserIds.length>0){
                    self.selectSendToUserList=[];
                    for(let i=0;i<self.sendToUserList.length;i++){
                        if(self.sendToUserIds.indexOf(self.sendToUserList[i].id)>-1){
                            self.selectSendToUserList.push(self.sendToUserList[i])
                        }
                    }
                    self.index=0;
                    self.submitItem();
                }
            },
            submitItem() {
                if (this.selectSendToUserList[this.index]) {
                    this.loading=true;
                    this.sendMessageToSingle(this.selectSendToUserList[this.index]).then(()=>{
                        this.index++;
                        this.submitItem()
                    });
                }else{
                    this.loading=false;
                    this.dialogShow=false;
                    this.$message({
                        showClose: true,
                        message: '多人发送成功！',
                        type: 'success'
                    });
                    this.$emit('update');
                }
            },

            sendMessageToSingle(item){
                let self=this;
                return new Promise((resolve, reject) => {
                    self.$http({
                        url: self.$api.message_v4_message,
                        type: 'POST',
                        requestBody: true,
                        data: {
                            "module_id": self.module_id,
                            "module_name": self.module_name,
                            "subsystem": self.subsystem,
                            "from_company_id": self.$store.state.currentCompany.account_company_id,
                            "from_user_id": self.$store.state.currentCompany.user_id,
                            "message": self.sendMessage,
                            "to_user_id": item.id,
                            "to_company_id": item.account_company_id,
                            "brand_id": self.sendBrandId || undefined,
                        },
                        success(data) {
                            if (data.msg && data.msg.id && self.sendFileList && self.sendFileList.length>0) {
                                self.upLoadFile(data.msg.id).then(()=>{
                                    resolve()
                                }).catch(()=>{
                                    resolve()
                                })
                            }else {
                                resolve()
                            }

                        },error(){
                            reject()
                        }
                    })
                })
            },
            upLoadFile(module_id){
                let self=this;
                return new Promise((resolve, reject) => {
                    let url = self.$api.file_files_list + '?subsystem=message&module_name=little_message&module_id=' + module_id;
                    url = self.$utils.setCurrentCompanyToSearchParam(url);
                    self.sendFileList.forEach((file)=>{
                        self.$utils.updateFile({
                            url: url,
                            file: file.raw,
                            success() {
                                resolve()
                            },error(){
                                reject()
                            }
                        })
                    })
                })
            },



        },
    }
</script>

<style lang="scss" scoped>

</style>