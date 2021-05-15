<template>
    <div>
        <el-button type="primary" plain @click="edit">关联邮箱</el-button>

        <el-dialog :title="actionDialogTitle || '关联邮箱'" :visible.sync="dialogShow" width="550px" :close-on-click-modal="false"
                   append-to-body  v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="80px">
                <el-form-item label="关联邮箱">
                    <table>
                        <tbody>
                        <tr v-for="(item,$index) in addForm.relations" :key="$index">
                            <td>
                                <el-checkbox v-model="item.is_active">{{item.email_address}}</el-checkbox>
                            </td>
                            <td>
                                <el-radio v-model="defaultRadio" :label="item.email_id"
                                          @change="defaultRadioChange(item)">默认
                                </el-radio>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: ['queryId', 'userId','actionDialogTitle'],
        data() {
            return {
                loading: false,
                dialogShow: false,
                addForm: {
                    relations: [],
                },
                addFormRule: {},

                defaultRadio: null,
            }
        },
        watch: {},
        created() {

        },
        methods: {

            edit() {
                let self = this;
                self.$http({
                    url: self.$api.message_v5 + '/' + self.queryId + '/' + self.userId + '/user_bind_email',
                    success: function (data) {
                        self.dialogShow = true;
                        if (data.msg && data.msg.relations) {
                            self.addForm.relations = data.msg.relations;
                            self.addForm.relations.forEach((item) => {
                                if (item.is_default) {
                                    self.defaultRadio = item.email_id
                                }
                            })
                        }
                    }
                })
            },
            defaultRadioChange(item) {
                let relations = this.addForm.relations;
                for (let i = 0; i < relations.length; i++) {
                    relations[i].is_default = false;
                }
                item.is_default = true;
                item.is_active = true;
            },

            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                         self.loading = true;
                         self.$http({
                             url: self.$api.message_v5 + '/' + self.queryId + '/' + self.userId + '/user_bind_email',
                             type:'PUT',
                             requestBody:true,
                             data: self.addForm,
                             success: function () {
                                 self.loading = false;
                                 self.$message({
                                     showClose: true,
                                     message: '保存成功！',
                                     type: 'success'
                                 });
                                 self.dialogShow=false;
                                 self.$emit('update');
                             }
                         });
                    }
                });
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>