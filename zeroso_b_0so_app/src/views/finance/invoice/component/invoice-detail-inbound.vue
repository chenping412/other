<template>
    <el-card class="margin-bottom-20" v-loading="loading">
        <h3 slot="header">
            <span>已关联收款</span>
            <span class="margin-left-20">付款方:{{partnerCompany.company_name}}</span>
            <span class="margin-left-20">收款方:{{accountCompany.company_name}}</span>
        </h3>
        <el-table v-if="inboundData.relations" :data="inboundData.relations" border>
            <el-table-column type="index" label="序号" width="55" align="center" ></el-table-column>
            <el-table-column label="类型">
                <template slot-scope="scope">
                    <div @click="rowClick(scope.row)">
                    <el-tag type="warning" @click="rowClick(scope.row)">
                        <span v-if="scope.row.module_name==='order'">订单</span>
                        <span v-if="scope.row.module_name==='invoice'">发票</span>
                    </el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="记账金额">
                <template slot-scope="scope">
                    <InputNumber v-if="scope.row.isEdit" :value.sync="scope.row.book_money"></InputNumber>
                    <div v-else @click="rowClick(scope.row)">{{scope.row.book_money | zerosoAbs | isoCurrency(scope.row.currency) | defaultStr}}</div>
                </template>
            </el-table-column>
            <el-table-column label="关联金额">
                <template slot-scope="scope">
                    <InputNumber v-if="scope.row.isEdit" :value.sync="scope.row.money"></InputNumber>
                    <div v-else @click="rowClick(scope.row)">{{scope.row.money | zerosoAbs | isoCurrency(scope.row.currency) | defaultStr}}</div>
                </template>
            </el-table-column>
            <el-table-column label="金额">
                <template slot-scope="scope">
                    <div  @click="rowClick(scope.row)">
                    <span class="margin-right-10">{{scope.row.currency}}</span>
                    <span>{{scope.row.money | zerosoAbs | isoCurrency(scope.row.currency) | defaultStr}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="订单号/发票号" v-if="!orderDetail">
                <template slot-scope="scope">
                   <span class="blue cursor-pointer" @click="goTo(scope.row)">{{scope.row.module_id}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="comment" label="备注">
                <template slot-scope="scope">
                    <el-input v-if="scope.row.isEdit" v-model="scope.row.comment"></el-input>
                    <div v-else @click="rowClick(scope.row)">{{scope.row.comment | defaultStr}}</div>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <div @click="rowClick(scope.row)">{{scope.row.state | zerosoBillActionState}}</div>
                </template>
            </el-table-column>
            <el-table-column label="已在银行流水核销">
                <template slot-scope="scope">
                    <div @click="rowClick(scope.row)">
                        <span>{{scope.row.is_bank_statement_line_reconsiled ? '是' : '否'}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="已在发票核销">
                <template slot-scope="scope">
                    <div @click="rowClick(scope.row)">
                    <span>{{scope.row.is_invoice_reconsiled ? '是' : '否'}}</span>
                    <span>（{{scope.row.id}}）</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="due_date" label="日期">
                <template slot-scope="scope">
                    <div @click="rowClick(scope.row)">{{scope.row.due_date}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <div v-if="scope.row.isEdit">
                        <el-button size="mini" type="success" @click="saveRelations(scope.row)">保存</el-button>
                        <el-button size="mini" type="primary" plain @click="init()">取消</el-button>
                    </div>
                    <div v-else>
                        <el-button size="mini" type="primary" :disabled="isLocked" @click="scope.row.isEdit=true">编辑</el-button>
                        <el-button size="mini" type="danger" :disabled="isLocked" @click="deleteRelations(scope.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <table class="table">
            <tbody>
            <tr>
                <td>未收金额</td>
                <td>{{currency}}</td>
                <td>{{(accountReceivableAndPayableTotal - accountReceiptAndPaidTotal) | zerosoAbs | isoCurrency(currency)}}</td>
            </tr><tr>
                <td>含税总额</td>
                <td><b>{{currency}}</b></td>
                <td><b>{{accountReceivableAndPayableTotal | zerosoAbs | isoCurrency(currency)}}</b></td>
            </tr>
            </tbody>
        </table>

        <el-divider></el-divider>

        <h3 class="padding-bottom-10">可关联收款</h3>
        <el-table v-if="inboundData.bank_statement_lines" :data="inboundData.bank_statement_lines" border>
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column label="记账金额">
                <template slot-scope="scope">
                    <InputNumber :value.sync="scope.row.unrealMoney" :max="scope.row.left_money"></InputNumber>
                </template>
            </el-table-column>
            <el-table-column label="关联金额">
                <template slot-scope="scope">
                    <InputNumber :value.sync="scope.row.actualMoney" :max="scope.row.left_money" @change="changeActualMoney"></InputNumber>
                </template>
            </el-table-column>
            <el-table-column label="未关联金额">
                <template slot-scope="scope">
                    <span class="margin-right-10">{{scope.row.currency}}</span>
                    <span>{{scope.row.left_money | zerosoAbs | isoCurrency(scope.row.currency) | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="收到金额">
                <template slot-scope="scope">
                    <span class="margin-right-10">{{scope.row.currency}}</span>
                    <span>{{scope.row.money | zerosoAbs | isoCurrency(scope.row.currency) | defaultStr}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="comment" label="备注">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.comment"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="partner_bank_account_name" label="银行账户"></el-table-column>
            <el-table-column prop="transaction_date" label="日期"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" :disabled="isLocked" @click="addRelations(scope.row)">确定</el-button>
                </template>
            </el-table-column>
        </el-table>

    </el-card>
</template>

<script>
    import OrderUtils from "../../../order/order-utils";

    export default {
        props:['type','accountCompany','partnerCompany','orderDetail','invoiceDetail'],
        data(){
            return{
                inboundData:{},

                currency:'',
                
                accountReceivableAndPayableTotal:0,
                accountReceiptAndPaidTotal:0,

                loading:false,
            }
        },
        computed:{
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
                        if(item.account_company_id==self.accountCompany.account_company_id){
                            let orderNode = item;
                            self.accountReceivableAndPayableTotal = Number(orderNode.total_amount);
                            self.currency = orderNode.currency;
                        }
                    });
                }else if(self.invoiceDetail){
                    self.accountReceivableAndPayableTotal = Number(self.invoiceDetail.total_taxed);
                    self.currency = self.invoiceDetail.currency;
                }

                this.accountReceiptAndPaidTotal = 0;
                this.getInboundList();
            },
            getInboundList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_payment + '/' + self.type + '/inbound',
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

            setData(inboundData){
                let self = this;
                if(inboundData.relations){
                    inboundData.relations.forEach(function (line) {
                        line.isEdit=false;
                        if (line.module_name === self.type && line.state !== 'canceled') {
                            self.accountReceiptAndPaidTotal += Number(line.book_money);
                        }
                    });
                }
                if(inboundData.bank_statement_lines){
                    const unPaidMoney = self.accountReceivableAndPayableTotal - self.accountReceiptAndPaidTotal;
                    inboundData.bank_statement_lines.forEach(function (line) {
                        line.unrealMoney = line.actualMoney = Number(line.left_money) > unPaidMoney ? unPaidMoney : line.left_money;
                    });
                }
                self.inboundData = inboundData;

            },


            rowClick(row){
                this.$router.push({
                    path:'/finance/bank-statement-line/need_inbound/detail',
                    query:{
                        id:row.bank_statement_line_id
                    }
                })
            },
            changeActualMoney(copyLine) {
                copyLine.unrealMoney = copyLine.actualMoney;
            },


            saveRelations(row,isAdd) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: isAdd ? self.$api.bank_payment + '/' + self.type + '/inbound' : self.$api.bank_payment + '/' + self.type + '/inbound/'+ row.id,
                    type:isAdd?'POST':'PUT',
                    requestBody:true,
                    data:isAdd?row:{
                        bank_statement_relation_id: row.id,
                        comment: row.comment,
                        money: row.money,
                        book_money: row.book_money,
                        payment_type: "inbound",
                        order_name: self.orderDetail ? self.orderDetail.name : undefined,
                        invoice_id: self.invoiceDetail ? self.invoiceDetail.id : undefined,
                        module: self.type,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            row.isEdit=false;
                            self.init();
                        }
                    }
                })
            },

            addRelations(row) {
                let rowCopy=JSON.parse(JSON.stringify(row));
                rowCopy.bank_statement_line_id=rowCopy.id;
                rowCopy.book_money=rowCopy.unrealMoney;
                rowCopy.money=rowCopy.actualMoney;
                rowCopy.partner_company_id= this.partnerCompany.account_company_id;
                rowCopy.account_company_id= this.accountCompany.account_company_id;
                rowCopy.payment_type= "inbound";
                rowCopy.order_name= this.orderDetail ? this.orderDetail.name : undefined;
                rowCopy.invoice_id= this.invoiceDetail ? this.invoiceDetail.id : undefined;
                rowCopy.module= this.type;

                this.saveRelations(rowCopy,true);
            },

            deleteRelations(row){
                let self = this;
                let url= self.$api.bank_payment + '/' + self.type + '/inbound/'+ row.id;
                if(self.orderDetail){
                    url = url +'?order_name='+self.orderDetail.name
                }else if(self.invoiceDetail){
                    url = url +'?invoice_id='+self.invoiceDetail.id
                }
                self.loading = true;
                self.$http({
                    url: url,
                    type: 'DELETE',
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.init();
                        }
                    }
                })
            },

            goTo(row) {
                if(row.module_name==='order'){
                    OrderUtils.goToOrderDetail(row.module_id)
                }else if(row.module_name==='invoice'){
                    this.$router.push({
                        path:'/finance/invoice/supplier/detail',
                        query:{
                            id:row.module_id,
                        }
                    })
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