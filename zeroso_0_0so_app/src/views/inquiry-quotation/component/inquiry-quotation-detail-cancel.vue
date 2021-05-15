<template>
    <div>
        <el-button size="mini" type="danger" plain @click="cancelQuotationShow=true">关闭询报价单</el-button>
        <el-dialog title="关闭询报价单" :visible.sync="cancelQuotationShow" width="550px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="cancelQuotationForm" :rules="cancelQuotationFormRule"
                     ref="cancelQuotationForm" label-width="100px">
                <el-form-item label="关闭原因" prop="comment_no">
                    <el-select class="margin-bottom-10" v-model="cancelQuotationForm.comment_no">
                        <el-option
                                v-for="(item,$index) in cancelQuotationCommentList"
                                :key="$index"
                                :value="item.code"
                                :label="item.label">
                        </el-option>
                    </el-select>
                    <el-input type="textarea" :rows="5"
                              v-model="cancelQuotationForm.comment"
                              v-if="cancelQuotationForm.comment_no===0"
                              placeholder="当选择其他时，需填写关闭原因">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="success" @click="clickCancelQuotation()">提 交</el-button>
                <el-button @click="cancelQuotationShow = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    export default {
        props: ['queryId'],
        data() {
            let self=this;
            return {
                cancelQuotationCommentList:[
                    {
                        label:'报价慢',
                        code:1,
                    },{
                        label:'价格高',
                        code:2,
                    },{
                        label:'货期长',
                        code:3,
                    },{
                        label:'起订量高',
                        code:4,
                    },{
                        label:'已经报价给客户，暂未反馈',
                        code:5,
                    },{
                        label:'其他',
                        code:0,
                    },
                ],
                cancelQuotationForm: {
                    "comment_no": 1,
                    "comment": null,
                },
                cancelQuotationFormRule: {
                    comment_no: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value && value !== 0) {
                                    callback(new Error('请选择取消原因！'));
                                } else if (value === 0 && !self.cancelQuotationForm.comment) {
                                    callback(new Error('当选择其他时，需填写取消原因！'));
                                } else {
                                    callback();
                                }
                            }
                        }
                    ],
                },
                cancelQuotationShow: false,


                loading: false,


            }
        },
        created() {

        },
        methods: {

            clickCancelQuotation() {
                let self = this;
                self.$refs.cancelQuotationForm.validate(function (valid) {
                    if (valid) {
                        self.$confirm('确定取消该询报价单吗？', '提示', {
                            confirmButtonText: '确定执行',
                            cancelButtonText: '取消',
                            type: 'warning',
                            callback: function (action) {
                                if (action == 'confirm') {

                                    let comment='';
                                    if(self.cancelQuotationForm.comment_no===0){
                                        comment = self.cancelQuotationForm.comment
                                    }else {
                                        self.cancelQuotationCommentList.forEach((item)=>{
                                            if(item.code === self.cancelQuotationForm.comment_no){
                                                comment = item.label;
                                            }
                                        })
                                    }


                                    self.loading = true;
                                    self.$http({
                                        url: self.$api.inquiry_v6_0_quotations + '/' + self.queryId + '/cancel',
                                        type: 'PUT',
                                        requestBody: true,
                                        data:{
                                            "comment": comment,
                                            "sheet_id": self.queryId
                                        },
                                        success: function () {
                                            self.loading = false;
                                            self.$message({
                                                showClose: true,
                                                message: '操作成功！',
                                                type: 'success'
                                            });
                                            self.cancelQuotationShow = false;
                                            self.$emit('update');
                                        }
                                    });
                                }
                            }
                        })
                    }
                });
            },


        }
    }
</script>
