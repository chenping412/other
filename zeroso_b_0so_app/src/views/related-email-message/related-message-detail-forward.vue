<template>
    <el-dialog title="消息转发" :visible.sync="dialogShow" width="800px" top="50px" :close-on-click-modal="false"
               v-loading="loading">
        <el-form label-width="80px">
            <el-form-item label="预览：">
                <el-input type="textarea" rows="14" :readonly="true" v-model="previewMessage"></el-input>

                <div style="line-height: 20px;" v-if="forwardFileList">
                    <FileListShow :fileList="forwardFileList"></FileListShow>
                </div>
            </el-form-item>
            <el-form-item label="转发至：">
                <el-select v-model="sendToUserId" filterable placeholder="可输入关键词检索人名">
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
            </el-form-item>
            <el-form-item label="留言：">
                <el-input type="textarea" rows="8" v-model="comment"></el-input>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="clickSendMessage()">发 送</el-button>
            <el-button @click="dialogShow = false">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        props: ['forwardCompanyIds'],
        data() {
            return {
                loading: false,
                dialogShow: false,

                oldMessage: '',
                comment: '',



                sendToUserList: [],
                sendToUserId: null,

                forwardFileList:null,
            }
        },
        computed: {
            previewMessage() {
                let str = this.oldMessage;
                if (this.comment) {
                    str += '\n\n' +
                            this.$store.state.currentCompany.company_name + '，' +
                            this.$store.state.currentCompany.name +
                            '，留言：\n' + this.comment
                }
                return str
            },
            sendToCompanyId(){
                let companyId=null;
                for(let i=0;i<this.sendToUserList.length;i++){
                    if(this.sendToUserList[i].id === this.sendToUserId){
                        companyId = this.sendToUserList[i].account_company_id;
                    }
                }
                return companyId
            }
        },
        created() {

        },
        methods: {
            forwardMessage(param) {
                console.log(param)
                this.oldMessage = param.oldMessage;
                this.comment = '';
                this.sendToUserId = null;
                this.dialogShow = true;
                this.getSendToUserList();

                this.getForwardFileList(param.oldId);
            },
            //获取附件列表信息，转发时需要将附件copy一份
            getForwardFileList(module_id){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.file_files_list,
                    data:{
                        module_id:module_id,
                        module_name:"little_message",
                        subsystem:"message",
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg && data.msg.items && data.msg.items.length>0) {
                            self.forwardFileList=data.msg.items;
                        }
                    }
                })
            },



            clickSendMessage() {
                if (!this.sendToUserId) {
                    this.$message({
                        showClose: true,
                        message: '请选择转发至！',
                        type: 'error'
                    });
                    return
                }
                this.$parent.clickSendMessage({
                    message: this.previewMessage,
                    to_user_id: this.sendToUserId,
                    to_company_id: this.sendToCompanyId,
                },(data)=>{
                    if (data.msg && data.msg.id) {
                        this.dialogShow = false;

                        if(this.forwardFileList && this.forwardFileList.length>0){
                            let arr = [];
                            this.forwardFileList.forEach((item)=>{
                               arr.push(item.id)
                            });
                            this.copyForwardFileList(data.msg.id,arr.join(','));
                        }

                    }
                });

            },

            copyForwardFileList(module_id,relation_ids) {
                let self = this;
                self.$http({
                    url: self.$api.file_files_list,
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        module_id: module_id.toString(),
                        module_name: 'little_message',
                        subsystem: 'message',
                        relation_ids: relation_ids,
                        mode: "copy",
                    }
                });
            },


            //获取转发至人员列表
            getSendToUserList() {
                let self = this;
                let company_ids=[];
                if (self.$store.state.system === '0') {
                    company_ids = [9428,39567];
                }
                if(self.forwardCompanyIds){
                    self.forwardCompanyIds.forEach((companyId)=>{
                       if(company_ids.indexOf(companyId)===-1){
                           company_ids.push(companyId)
                       }
                    });
                }
                if(company_ids){
                    self.$http({
                        url: self.$api.partner_v4_self_multi_users,
                        data: {
                            company_ids: company_ids.join(',')
                        },
                        success: function (data) {
                            if (data.msg) {
                                self.sendToUserList = data.msg;
                            }
                        }
                    })
                }
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>