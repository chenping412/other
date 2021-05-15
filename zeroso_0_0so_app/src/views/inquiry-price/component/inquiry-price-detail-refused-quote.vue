<template>
    <div>
        <el-dialog title="标记不报价" :visible.sync="markAsRefusedQuoteShow" width="550px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="markAsRefusedQuoteForm" :rules="markAsRefusedQuoteFormRule"
                     ref="markAsRefusedQuoteForm" label-width="60px">
                <el-form-item label="备注" prop="comment_no">
                    <el-select class="margin-bottom-10"
                               v-model="markAsRefusedQuoteForm.comment_no"
                               v-if="$store.state.productQuotationComment[markAsRefusedQuoteForm.comment_type]"
                               @change="markAsRefusedQuoteForm.comment=null">
                        <el-option
                                v-for="(item,$index) in $store.state.productQuotationComment[markAsRefusedQuoteForm.comment_type].children"
                                :key="$index"
                                :value="item.code"
                                :label="item.label">
                        </el-option>
                    </el-select>
                    <el-input type="textarea" :rows="5"
                              v-model="markAsRefusedQuoteForm.comment"
                              v-if="markAsRefusedQuoteForm.comment_no===0"
                              placeholder="当选择其他时，需填写备注内容">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickMarkAsRefusedQuote()">保 存</el-button>
                <el-button @click="markAsRefusedQuoteShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    export default {
        components: {},
        props: [],
        data() {
            let self = this;
            return {
                markAsRefusedQuoteForm: {
                    "comment": null,
                    "comment_no": null,
                    "comment_type": 2,
                },
                markAsRefusedQuoteFormRule: {
                    comment_no: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value && value !== 0) {
                                    callback(new Error('请选择备注内容！'));
                                } else if (value === 0 && !self.markAsRefusedQuoteForm.comment) {
                                    callback(new Error('当选择其他时，需填写备注内容！'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ],
                },
                markAsRefusedQuoteShow: false,

                loading: false,
            }
        },
        watch: {},
        created() {

        },
        methods: {
            init(param) {
                this.markAsRefusedQuoteForm = {
                    product:param && param.product ? param.product : null,
                    requestData:param && param.requestData ? param.requestData : null,
                    "comment": null,
                    "comment_no": null,
                    "comment_type": 2,  //1：无效；2：不报价；3：替代
                };
                if(!this.$store.state.productQuotationComment[this.markAsRefusedQuoteForm.comment_type]){
                    this.markAsRefusedQuoteForm.comment_no = 0;
                }
                this.markAsRefusedQuoteShow = true;
                this.$nextTick(()=>{
                    this.$refs.markAsRefusedQuoteForm.clearValidate();
                })
            },

            //标记为不报价
            clickMarkAsRefusedQuote() {
                let self = this;
                self.$refs.markAsRefusedQuoteForm.validate(function (valid) {
                    if (valid) {
                        self.$confirm('请注意：标记不报价，是在已经确定所有供应商均不报价时，才进行此操作，此操作不可逆！！！  如果只是当前供应商不报价，而需要更换供应商继续询价时，请点击”催价->再询价”后更换供应商，并继续询价！', '提示', {
                            confirmButtonText: '确定执行',
                            cancelButtonText: '取消',
                            type: 'warning',
                            callback: function (action) {
                                if (action === 'confirm') {
                                    self.markAsRefusedQuoteShow = false;
                                    self.$emit('refusedQuoteSubmit',{
                                        "comment": self.markAsRefusedQuoteForm.comment,
                                        "comment_no": self.markAsRefusedQuoteForm.comment_no,
                                        "comment_type": self.markAsRefusedQuoteForm.comment_type,
                                        ...self.markAsRefusedQuoteForm.requestData
                                    })
                                }
                            }
                        })
                    }
                });
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>