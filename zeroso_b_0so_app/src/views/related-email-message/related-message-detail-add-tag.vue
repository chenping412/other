<template>
    <el-dialog title="加入书签"
               :visible.sync="dialogShow"
               width="500px"
               :close-on-click-modal="false"
               v-loading="loading">
        <el-form label-width="80px">
            <el-form-item label="书签：">
                <el-select v-model="messageTagCode">
                    <el-option
                            v-for="(item,$index) in $store.state.messageTagList"
                            :key="$index"
                            :value="item.code"
                            :label="item.label">
                        <span>{{item.label}}</span>
                        <MessageTag :lever="item.code"></MessageTag>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="success" @click="clickSaveData()">保 存</el-button>
            <el-button @click="dialogShow = false">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>

    export default {
        props: ['markType'],
        data() {
            return {
                loading: false,
                dialogShow: false,
                messageTagCode:'',

                related_id: null,
            }
        },
        created() {

        },
        methods: {
            messageAddTag(message){
                this.related_id = message.id;
                this.dialogShow = true;
            },
            emailAddTag(email){
                this.related_id = email.id;
                this.dialogShow = true;
            },
            clickSaveData() {
                let self = this;
                if(!self.messageTagCode){
                    self.$message({
                        showClose: true,
                        message: '请选择书签！',
                        type: 'error'
                    });
                    return
                }
                self.loading=true;
                self.$http({
                    url: self.$api.message_book_mark_messages,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        mark_type: self.markType,
                        related_id: self.related_id,
                        mark_level: self.messageTagCode,
                    },
                    success(){
                        self.loading=false;
                        self.dialogShow=false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.$emit('update')
                    }
                });
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>