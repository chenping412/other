<template>
    <div class="border-bottom margin-bottom-20">
        <el-form label-width="175px">
            <el-form-item label="产品价格：">
                <table class="table table-border">
                    <thead>
                    <tr>
                        <th>供应商</th>

                        <th>最小起订量</th>
                        <th>价格</th>
                        <th>折扣</th>
                        <th>折扣系列</th>
                        <th>货期</th>
                        <th>来源</th>
                        <th>独立销售</th>
                        <th>创建时间</th>
                        <th>过期时间</th>
                        <th>备注</th>
                    </tr>
                    </thead>
                    <tbody v-for="(parentItem,parentIndex) in productPriceList" :key="parentIndex">
                    <tr v-for="(item,$index) in parentItem.tiered_price_list" :key="$index">
                        <td :rowspan="parentItem.tiered_price_list.length" v-if="$index===0">
                            <router-link
                                    class="blue"
                                    :to="'/partner/detail?id='+parentItem.vendor_company.account_company_id"
                                    v-if="parentItem.vendor_company.account_company_id">
                                {{parentItem.vendor_company ? parentItem.vendor_company.company_name : ''}}
                            </router-link>
                        </td>

                        <td>{{item.min_qty | defaultStr}}</td>
                        <td>{{item.price | isoCurrency(item.currency)}}</td>
                        <td>{{item.discount | tenthsToPercent}}</td>
                        <td>
                            <span v-if="item.discount_serie">
                                {{item.discount_serie.name}}
                                ({{item.discount_serie.discount | tenthsToPercent}})
                            </span>
                        </td>
                        <td>{{item.shipment_period | defaultStr}}</td>
                        <td>
                            <span>{{item.source | productPriceSource}}</span>
                            <template v-if="item.sheet_id">
                                <span>号：</span>
                                <router-link class="blue" v-if="item.source === 'inquiry_sheet'" :to="'/inquiry-price/all/detail?id='+ item.sheet_id">
                                    {{item.sheet_id}}
                                </router-link>
                                <router-link class="blue" v-if="item.source === 'quote_sheet'" :to="'/inquiry-quotation/ALL/detail?id='+ item.sheet_id">
                                    {{item.sheet_id}}
                                </router-link>
                            </template>
                        </td>
                        <td>{{item.unit_sellable ? '是' : '否'}}</td>
                        <td>{{item.create_time | zerosoCompanyTime}}</td>
                        <td>{{item.expire_time | zerosoCompanyDate}}</td>
                        <td :rowspan="parentItem.tiered_price_list.length" v-if="$index===0">
                            {{item.price_description}}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div class="padding-top-10">
                    <el-popover placement="top-start" trigger="click">
                        <div class="product-detail scroll" style="max-height:600px;">
                            <table class="table table-border">
                                <thead>
                                <tr>
                                    <th>供应商</th>
                                    <th>最小起订量</th>
                                    <th>价格</th>
                                    <th>折扣</th>
                                    <th>折扣系列</th>
                                    <th>货期</th>
                                    <th>来源</th>
                                    <th>独立销售</th>
                                    <th>创建时间</th>
                                    <th>过期时间</th>
                                    <th>备注</th>
                                </tr>
                                </thead>
                                <tbody v-for="(parentItem,parentIndex) in productHistoryPriceList" :key="parentIndex">
                                <tr v-for="(item,$index) in parentItem.tiered_price_list" :key="$index">
                                    <td :rowspan="parentItem.tiered_price_list.length" v-if="$index===0">
                                        <router-link
                                                class="blue"
                                                :to="'/partner/detail?id='+parentItem.vendor_company.account_company_id"
                                                v-if="parentItem.vendor_company.account_company_id">
                                            {{parentItem.vendor_company ? parentItem.vendor_company.company_name : ''}}
                                        </router-link>
                                    </td>

                                    <td>{{item.min_qty | defaultStr}}</td>
                                    <td>
                                        <span :class="{'delete':item.isExpired}">{{item.price | isoCurrency(item.currency)}}</span>
                                    </td>
                                    <td>{{item.discount | tenthsToPercent}}</td>
                                    <td>
                                        <span v-if="item.discount_serie">
                                            {{item.discount_serie.name}}
                                            ({{item.discount_serie.discount | tenthsToPercent}})
                                        </span>
                                    </td>
                                    <td>{{item.shipment_period | defaultStr}}</td>
                                    <td>
                                        <span>{{item.source | productPriceSource}}</span>
                                        <template v-if="item.sheet_id">
                                            <span>号：</span>
                                            <router-link class="blue" v-if="item.source === 'inquiry_sheet'" :to="'/inquiry-price/all/detail?id='+ item.sheet_id">
                                                {{item.sheet_id}}
                                            </router-link>
                                            <router-link class="blue" v-if="item.source === 'quote_sheet'" :to="'/inquiry-quotation/ALL/detail?id='+ item.sheet_id">
                                                {{item.sheet_id}}
                                            </router-link>
                                        </template>
                                    </td>
                                    <td>{{item.unit_sellable ? '是' : '否'}}</td>
                                    <td>{{item.create_time | zerosoCompanyTime}}</td>
                                    <td>
                                        <span :class="{'red':item.isExpired}">{{item.expire_time | zerosoCompanyDate}}</span>
                                    </td>
                                    <td :rowspan="parentItem.tiered_price_list.length" v-if="$index===0">
                                        {{item.price_description}}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <el-button slot="reference" size="mini" type="primary" plain>
                            查看历史价格记录
                        </el-button>
                    </el-popover>
                </div>
            </el-form-item>

            <el-form-item label="报价备注：">
                <div v-if="detailForm.quotation_comment">
                    <table class="table table-all-border">
                        <thead>
                        <tr>
                            <th>操作类型</th>
                            <th>备注内容</th>
                            <th>时间</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{{detailForm.quotation_comment.comment_type | productQuotationCommentType}}
                            </td>
                            <td style="max-width: 500px;">{{detailForm.quotation_comment.comment_no |
                                productQuotationComment(detailForm.quotation_comment.comment_type,detailForm.quotation_comment.comment)}}
                            </td>
                            <td>{{detailForm.quotation_comment.create_time | zerosoCompanyTime}}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="padding-top-10">
                        <el-button size="mini" type="primary" plain @click="clickEditQuotationComment">
                            编辑报价备注
                        </el-button>
                        <el-button size="mini" type="danger" plain @click="deleteQuotationComment">
                            删除报价备注
                        </el-button>
                    </div>
                </div>
            </el-form-item>
        </el-form>

        <el-dialog title="编辑报价备注" :visible.sync="editQuotationCommentShow" width="550px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="editQuotationCommentForm" :rules="editQuotationCommentFormRule"
                     ref="editQuotationCommentForm" label-width="100px">
                <el-form-item label="备注内容" prop="comment_no">
                    <el-select class="margin-bottom-10"
                               v-model="editQuotationCommentForm.comment_no"
                               v-if="$store.state.productQuotationComment[editQuotationCommentForm.comment_type]"
                               @change="editQuotationCommentForm.comment=null">
                        <el-option
                                v-for="(item,$index) in $store.state.productQuotationComment[editQuotationCommentForm.comment_type].children"
                                :key="$index"
                                :value="item.code"
                                :label="item.label">
                        </el-option>
                    </el-select>
                    <el-input type="textarea" :rows="5"
                              v-model="editQuotationCommentForm.comment"
                              v-if="editQuotationCommentForm.comment_no===0"
                              placeholder="当选择其他时，需填写备注内容">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveEditQuotationComment()">保 存</el-button>
                <el-button @click="editQuotationCommentShow = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props: ['queryId', 'detailForm'],
        data() {
            let self = this;
            return {
                productPriceList: [],

                productHistoryPriceList: [],

                editQuotationCommentForm: {
                    "comment": null,
                    "comment_no": null,
                    "comment_type": null,
                    "productBaseId": null,
                },
                editQuotationCommentFormRule: {
                    comment_no: [
                        {
                            required: true, validator: function (rule, value, callback) {
                                if (!value && value !== 0) {
                                    callback(new Error('请选择备注内容！'));
                                } else if (value === 0 && !self.editQuotationCommentForm.comment) {
                                    callback(new Error('当选择其他时，需填写备注内容！'));
                                } else {
                                    callback();
                                }
                            }, trigger: 'blur'
                        }
                    ],
                },
                editQuotationCommentShow: false,


                loading: false,

            }
        },
        watch: {
            queryId() {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                this.getProductPriceList();
                this.getProductHistoryPriceList();
                this.editQuotationCommentShow = false;
            },
            //获取产品价格表
            getProductPriceList() {
                let self = this;
                self.productPriceList = [];
                self.$http({
                    url: self.$api.product_product_manage_product + '/' + self.queryId + '/price',
                    type: 'GET',
                    success: function (data) {
                        if (data.msg && data.msg.length > 0) {
                            self.productPriceList = data.msg;
                        }
                    }
                })
            },
            //获取产品价格历史记录
            getProductHistoryPriceList() {
                let self = this;
                self.productHistoryPriceList = [];
                self.$http({
                    url: self.$api.product_product_manage_product + '/' + self.queryId + '/history_price',
                    type: 'GET',
                    success: function (data) {
                        if (data.msg && data.msg.length > 0) {
                            let productHistoryPriceList = data.msg;
                            for(let i=0;i<productHistoryPriceList.length;i++){
                                if(productHistoryPriceList[i].tiered_price_list){
                                    for(let k=0;k<productHistoryPriceList[i].tiered_price_list.length;k++){
                                        if(productHistoryPriceList[i].tiered_price_list[k].expire_time){
                                            let expireTime = new Date(productHistoryPriceList[i].tiered_price_list[k].expire_time + ' 23:59:59').getTime();
                                            let nowTime = new Date().getTime();
                                            if(expireTime < nowTime){
                                                productHistoryPriceList[i].tiered_price_list[k].isExpired = true;
                                            }
                                        }else {
                                            productHistoryPriceList[i].tiered_price_list[k].isExpired = true;
                                        }
                                    }
                                }
                            }
                            self.productHistoryPriceList = data.msg;
                        }
                    }
                })
            },



            //点击编辑报价备注
            clickEditQuotationComment() {
                let editQuotationCommentForm = JSON.parse(JSON.stringify(this.detailForm.quotation_comment));
                if (!editQuotationCommentForm.comment) editQuotationCommentForm.comment = '';

                this.editQuotationCommentForm = editQuotationCommentForm;
                this.editQuotationCommentShow = true;
                this.$nextTick(() => {
                    this.$refs.editQuotationCommentForm.clearValidate();
                })
            },
            clickSaveEditQuotationComment() {
                let self = this;
                self.$refs.editQuotationCommentForm.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.product_product_manage_product + '/' + self.queryId + '/quotationComment',
                            type: 'PUT',
                            requestBody: true,
                            data: self.editQuotationCommentForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    self.editQuotationCommentShow = false;
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.$emit('update');
                                } else {
                                    self.$message({
                                        showClose: true,
                                        message: '保存失败！',
                                        type: 'error'
                                    });
                                }
                            }
                        });
                    } else {
                        console.log('error submit!!');
                    }
                });
            },
            deleteQuotationComment() {
                let self = this;
                self.$confirm('确定删除报价备注吗？', '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.product_product_manage_product + '/' + self.queryId + '/quotationComment',
                                type: 'DELETE',
                                requestBody: true,
                                success: function () {
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '操作成功！',
                                        type: 'success'
                                    });
                                    self.$emit('update');
                                }
                            });
                        }
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>