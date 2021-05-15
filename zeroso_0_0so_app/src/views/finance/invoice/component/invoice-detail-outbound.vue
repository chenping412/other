<template>
    <el-card class="margin-bottom-20"  v-loading="loading">
        <h3 slot="header">
            <span>已核销付款</span>
            <span class="margin-left-20">付款方:{{accountCompany.company_name}}</span>
            <span class="margin-left-20">收款方:{{partnerCompany.company_name}}</span>
        </h3>
        <table class="table">
            <tbody>
            <tr>
                <td>含税总额</td>
                <td>{{currency}}</td>
                <td>{{accountReceivableAndPayableTotal | zerosoAbs | isoCurrency(currency)}}</td>
            </tr><tr>
                <td>可申请</td>
                <td>{{currency}}</td>
                <td>{{(accountReceivableAndPayableTotal - accountReceiptAndPaidTotal) | zerosoAbs | isoCurrency(currency)}}</td>
            </tr>
            </tbody>
        </table>

        <el-divider></el-divider>

        <h3 class="padding-bottom-10">付款记录</h3>
        <el-table :data="outboundData.relations" border>
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column label="类型">
                <template slot-scope="scope">
                    <el-tag type="warning">
                        <span v-if="scope.row.module_name==='order'">订单</span>
                        <span v-if="scope.row.module_name==='invoice'">发票</span>
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="记账金额">
                <template slot-scope="scope">
                    <InputNumber v-if="scope.row.isEdit" :value.sync="scope.row.book_money" @change="changeBookMoney(scope.row)" placeholder="请输入记账金额"></InputNumber>
                    <div v-else>
                        <router-link class="blue" :to="'/finance/prepaid/detail?id='+ scope.row.id">
                            {{scope.row.book_money | zerosoAbs | isoCurrency(scope.row.currency) | defaultStr}}
                        </router-link>

                        <el-popover  v-if="scope.row.state!=='draft' && !scope.row.isEdit && accountCompany && $store.state.currentCompany.account_company_id === accountCompany.account_company_id && $store.state.permissionsMap['BookMoneyAdminNeed']"
                                     placement="top" width="280" trigger="click" v-model="scope.row.popover">
                            <ButtonEdit slot="reference"></ButtonEdit>
                            <div>
                                <InputNumber :value.sync="scope.row.book_money_copy" style="width: 200px;"></InputNumber>
                                <el-button type="success" class="margin-left-10" @click="saveRelations(scope.row)">保存</el-button>
                            </div>
                        </el-popover>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="申请金额">
                <template slot-scope="scope">
                    <InputNumber v-if="scope.row.isEdit" :value.sync="scope.row.money" @change="changeMoney(scope.row)" placeholder="请输入申请金额"></InputNumber>
                    <div v-else>
                        <router-link class="blue" :to="'/finance/prepaid/detail?id='+ scope.row.id">
                            {{scope.row.money | zerosoAbs | isoCurrency(scope.row.currency) | defaultStr}}
                        </router-link>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="折扣率(%)" v-if="isEurope">
                <template slot-scope="scope">
                    <InputNumber v-if="scope.row.isEdit" :value.sync="scope.row.discount_rate" :max="100" @change="changeDiscountRate(scope.row)" placeholder="请输入折扣率"></InputNumber>
                    <span v-else>{{scope.row.discount_rate | percent | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="due_date" label="付款日期">
                <template slot-scope="scope">
                    <el-date-picker
                            v-if="scope.row.isEdit"
                            v-model="scope.row.due_date"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="付款日期">
                    </el-date-picker>
                    <div v-else>{{scope.row.due_date | defaultStr}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="comment" label="附言">
                <template slot-scope="scope">
                    <el-input type="textarea" v-if="scope.row.isEdit" v-model="scope.row.comment" placeholder="请输入备注"></el-input>
                    <div v-else>{{scope.row.comment | defaultStr}}</div>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.state | zerosoBillActionState}}</span>
                </template>
            </el-table-column>
            <el-table-column label="已在银行流水核销">
                <template slot-scope="scope">
                    <span>{{scope.row.is_bank_statement_line_reconsiled ? '是' : '否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="已在发票核销">
                <template slot-scope="scope">
                    <span>{{scope.row.is_invoice_reconsiled ? '是' : '否'}}</span>
                    <span>（{{scope.row.id}}）</span>
                </template>
            </el-table-column>
            <el-table-column label="附件">
                <template slot-scope="scope">
                    <div v-if="scope.row.id">
                        <FileListShow
                                :ref="'accountingFileShow'+scope.$index"
                                :show-delete="true"
                                :module_id="scope.row.id"
                                module_name="bank_statement_relation"
                                subsystem="accounting">
                        </FileListShow>
                        <FileUpload
                                @uploadSuccess="productFileUploadSuccess(scope.$index)"
                                :auto-upload="true"
                                :module_id="scope.row.id"
                                module_name="bank_statement_relation"
                                subsystem="accounting">
                        </FileUpload>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <div v-if="scope.row.id && scope.row.state==='draft' && !scope.row.isEdit">
                        <el-button size="mini" type="primary" :disabled="isLocked" @click="clickEditRow(scope.row)">修改</el-button>
                        <el-button size="mini" type="danger" :disabled="isLocked" @click="clickDelete(scope.row)">撤销</el-button>
                    </div>
                    <div v-if="(scope.row.state==='draft' || !scope.row.id) && scope.row.isEdit">
                        <el-button size="mini" type="success" @click="clickSaveRow(scope.row)">保存</el-button>
                        <el-button size="mini" type="primary" plain @click="getOutboundList">取消</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-button
                class="margin-top-10"
                type="primary"
                v-if="!!$store.state.permissionsMap['accounting'] || $store.state.system==='0'"
                :disabled="isLocked"
                @click="clickAdd"
        >申请付款</el-button>
    </el-card>
</template>

<script>
    export default {
        props:['type','accountCompany','partnerCompany','orderDetail','invoiceDetail'],
        data(){
            return{

                outboundData:{},

                currency:'',

                accountReceivableAndPayableTotal:0,
                accountReceiptAndPaidTotal:0,

                loading:false,

            }
        },
        computed:{
            isEurope() {
                if (this.$store.state.currentUser.european_union) {
                    return this.$store.state.currentUser.european_union.indexOf(this.$store.state.currentCompany.country) > -1
                } else {
                    return false
                }
            },
            isLocked() {
                return !(this.accountCompany && this.$store.state.currentCompany.account_company_id === this.accountCompany.account_company_id)
            }
        },
        watch: {
            'accountCompany'() {
                this.init()
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let self = this;
                if(self.orderDetail && self.orderDetail.order_nodes){
                    self.orderDetail.order_nodes.forEach((item)=>{
                        if(item.account_company_id==self.partnerCompany.account_company_id){
                            let orderNode = item;
                            this.accountReceivableAndPayableTotal = Number(orderNode.total_amount);
                            this.currency = orderNode.currency;
                        }
                    });
                }else if(self.invoiceDetail){
                    self.accountReceivableAndPayableTotal = Number(self.invoiceDetail.total_taxed);
                    self.currency = self.invoiceDetail.currency;
                }


                this.getOutboundList();
            },
            getOutboundList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_payment + '/' + self.type + '/outbound',
                    data:{
                        order_name: self.orderDetail ? self.orderDetail.name : undefined,
                        invoice_id: self.invoiceDetail ? self.invoiceDetail.id : undefined,
                        account_company_id: self.accountCompany.account_company_id,
                        partner_company_id: self.partnerCompany.account_company_id,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.setData(data.msg)
                        }
                    }
                })
            },

            setData(outboundData){
                let self = this;
                self.accountReceiptAndPaidTotal = 0;

                if(outboundData.relations){
                    outboundData.relations.forEach(function (line) {
                        line.isEdit=false;
                        line.popover=false;
                        line.money=line.money*-1;
                        line.book_money=line.book_money*-1;
                        line.book_money_copy=line.book_money;
                        if (line.module_name === self.type && line.state !== 'canceled') {
                            self.accountReceiptAndPaidTotal += Number(line.book_money);
                        }
                    });
                }
                if(outboundData.bank_statement_lines){
                    const unPaidMoney = self.accountReceivableAndPayableTotal - self.accountReceiptAndPaidTotal;
                    outboundData.bank_statement_lines.forEach(function (line) {
                        line.unrealMoney = line.actualMoney = Number(line.left_money) > unPaidMoney ? unPaidMoney : line.left_money;
                    });
                }
                self.outboundData = outboundData;

            },


            saveRelations(row) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_payment + '/' + self.type + '/outbound/'+ row.id  + '/admin',
                    type:'PUT',
                    requestBody:true,
                    data:{
                        bank_statement_relation_id: row.id,
                        book_money: row.book_money_copy*-1,
                        payment_type: "outbound",
                        order_name: self.orderDetail ? self.orderDetail.name : undefined,
                        invoice_id: self.invoiceDetail ? self.invoiceDetail.id : undefined,
                        module: self.type,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            row.popover=false;
                            self.getOutboundList();
                        }
                    }
                })
            },

            clickAdd(){
                if(this.accountReceivableAndPayableTotal - this.accountReceiptAndPaidTotal <= 0){
                    this.$message({
                        showClose: true,
                        message: '已结清,无需申请!',
                        type: 'warning'
                    });
                    return
                }
                for(let i=0;i<this.outboundData.relations.length;i++){
                    if(this.outboundData.relations[i].isEdit){
                        this.$message({
                            showClose: true,
                            message: '新增行之前，请先保存正在修改行！',
                            type: 'warning'
                        });
                        return
                    }
                }

                this.outboundData.relations.push({
                    isEdit: true,
                    due_date: this.$utils.getDate(),
                    currency: this.currency,
                    comment: '',
                    money: this.accountReceivableAndPayableTotal - this.accountReceiptAndPaidTotal,
                    book_money: this.accountReceivableAndPayableTotal - this.accountReceiptAndPaidTotal,
                    discount_rate: 0,
                    module_name:'order',
                })
            },
            //点击编辑行
            clickEditRow(row) {
                for(let i=0;i<this.outboundData.relations.length;i++){
                    if(this.outboundData.relations[i].isEdit){
                        this.$message({
                            showClose: true,
                            message: '只允许同时修改一行信息，请先保存正在修改行！',
                            type: 'warning'
                        });
                        return
                    }
                }
                row.isEdit = true;
            },
            clickSaveRow(row) {
                let self = this;
                if(!row.book_money && row.book_money!==0){
                    this.$message({
                        showClose: true,
                        message: '请输入记账金额！',
                        type: 'error'
                    });
                    return
                }
                if(!row.money && row.money!==0){
                    this.$message({
                        showClose: true,
                        message: '请输入申请金额！',
                        type: 'error'
                    });
                    return
                }
                if(row.book_money<row.money){
                    this.$message({
                        showClose: true,
                        message: '记账金额不能小于申请金额！',
                        type: 'error'
                    });
                    return
                }
                if(this.isEurope && !row.discount_rate && row.discount_rate!==0){
                    this.$message({
                        showClose: true,
                        message: '请输入折扣率！',
                        type: 'error'
                    });
                    return
                }
                if(!row.due_date){
                    this.$message({
                        showClose: true,
                        message: '请选择付款日期！',
                        type: 'error'
                    });
                    return
                }



                let rowCopy=JSON.parse(JSON.stringify(row));
                rowCopy.money=row.money*-1;
                rowCopy.book_money=row.book_money*-1;
                self.loading = true;
                self.$http({
                    url: !row.id ? self.$api.bank_payment + '/' + self.type + '/outbound' : self.$api.bank_payment + '/' + self.type + '/outbound/'+ row.id,
                    type:!row.id ? 'POST' : 'PUT',
                    requestBody:true,
                    data:row.id ? rowCopy : {
                        account_company_id: self.accountCompany.account_company_id,
                        partner_company_id: self.partnerCompany.account_company_id,

                        due_date: row.due_date,
                        currency: row.currency,
                        comment: row.comment,
                        money: row.money*-1,
                        book_money: row.book_money*-1,

                        payment_type: "outbound",
                        order_name: self.orderDetail ? self.orderDetail.name : undefined,
                        invoice_id: self.invoiceDetail ? self.invoiceDetail.id : undefined,
                        module: self.type,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            row.isEdit=false;
                            self.getOutboundList();
                        }
                    }
                })
            },

            clickDelete(row){
                let self = this;
                self.$confirm('确定撤销该笔付款吗?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.bank_payment + '/' + self.type + '/outbound/'+ row.id,
                                type: 'DELETE',
                                requestBody:true,
                                data:{
                                    order_name: self.orderDetail ? self.orderDetail.name : undefined,
                                    invoice_id: self.invoiceDetail ? self.invoiceDetail.id : undefined,
                                },
                                success: function (data) {
                                    self.loading = false;
                                    if (data.msg) {
                                        self.$message({
                                            type: 'success',
                                            message: '撤销成功！',
                                            showClose: 'true'
                                        });
                                        self.getOutboundList();
                                    }else {
                                        self.$message({
                                            type: 'error',
                                            message: '撤销失败！',
                                            showClose: 'true'
                                        });
                                    }
                                }
                            })

                        }
                    }
                })
            },

            changeBookMoney(copyLine) {
                if (this.isEurope) {
                    if (copyLine.money && copyLine.discount_rate) {
                        copyLine.discount_rate = ((Number(copyLine.book_money) - Number(copyLine.money)) / Number(copyLine.book_money) * 100).myRound(0);
                    } else if (copyLine.money && !copyLine.discount_rate) {
                        copyLine.discount_rate = ((Number(copyLine.book_money) - Number(copyLine.money)) / Number(copyLine.book_money) * 100).myRound(0);
                    } else if (!copyLine.money && copyLine.discount_rate) {
                        copyLine.money = (Number(copyLine.book_money) - (Number(copyLine.book_money) * (Number(copyLine.discount_rate) / 100))).myRound(2);
                    }
                }
            },
            changeMoney(copyLine) {
                if (copyLine.book_money && Number(copyLine.book_money) && this.isEurope) {
                    copyLine.discount_rate = ((Number(copyLine.book_money) - Number(copyLine.money)) / Number(copyLine.book_money) * 100).myRound(0);
                }
                if (!this.isEurope) {
                    copyLine.book_money = copyLine.money;
                }
            },
            changeDiscountRate(copyLine) {
                if (copyLine.book_money && Number(copyLine.book_money) && copyLine.discount_rate && this.isEurope) {
                    copyLine.money = (Number(copyLine.book_money) - (Number(copyLine.book_money) * (Number(copyLine.discount_rate) / 100))).myRound(2);
                }

            },

            productFileUploadSuccess($index){
                if(this.$refs['accountingFileShow'+$index]){
                    this.$refs['accountingFileShow'+$index].update();
                }
            },
        }
    }
</script>

<style lang="scss">
    .table{
        td{
            padding: 10px 20px;
        }
    }
</style>