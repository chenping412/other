<template>
    <div class="inline-block">
        <el-button @click="showDialog">快捷回复模板</el-button>

        <el-dialog title="快捷回复模板" :visible.sync="dialogShow" top="80px" width="1100px">
                <el-table :data="messageTemplateList" border v-loading="loading" height="600px">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column>
                        <template slot-scope="scope">
                            <pre>{{scope.row.label}}</pre>
                        </template>
                    </el-table-column>
                    <el-table-column width="100">
                        <template slot-scope="scope">
                           <el-button type="primary" size="mini" @click="clickSelectTemplate(scope.row.label)">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: [],
        data() {
            return {
                loading: false,
                dialogShow: false,

                messageTemplateList: [],
            }
        },
        methods: {
            showDialog(){
                this.dialogShow=true;
                this.getMessageTemplateList();
            },
            //获取消息模板内容
            getMessageTemplateList() {
                let self = this;
                self.loading=true;
                self.$http({
                    url: self.$api.product_dict_message_template,
                    success: function (data) {
                        self.loading=false;
                        if (data.msg) {
                            self.messageTemplateList = data.msg;
                        }else {
                            self.messageTemplateList = [];
                        }
                    }
                })
            },

            clickSelectTemplate(message){
                this.$emit('addMessageText',message);
                this.dialogShow=false;
            },

        },
    }
</script>

<style lang="scss" scoped>

</style>