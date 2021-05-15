<template>
    <div class="account-documents-move" v-loading.fullscreen="loading">
        <el-card class="margin-bottom-20">
            <div slot="header" class="clearfix">
                <div class="left">
                    <h3 class="inline-block margin-right-20">{{document.voucher_number||'生成凭证'}}</h3>
                    <el-tag type="warning" v-if="document.voucher_number">
                        {{document.status|zerosoAccountMoveState}}
                    </el-tag>
                </div>

                <div class="right">
                    <el-button
                            type="primary" size="mini"
                            v-if="(document.id && isEdit) || !document.id"
                            @click="save()">
                        {{document.id?'保存':'制单'}}
                    </el-button>
                    <el-button
                            type="primary" size="mini"
                            v-if="document.id && !isEdit"
                            :disabled="!enabledEdit"
                            @click="edit()">
                        编辑
                    </el-button>
                    <el-button
                            size="mini"
                            v-if="document.id && isEdit"
                            @click="editCancel()">
                        取消
                    </el-button>

                    <el-button
                            v-if="$store.state.permissionsMap['AccountingNeed']"
                            type="primary" size="mini"
                            :disabled="!isCheck"
                            @click="action('check')">
                        复核
                    </el-button>
                    <el-button
                            v-if="isRevert && $store.state.permissionsMap['AccountingNeed']"
                            type="primary" size="mini"
                            @click="action('revert')">
                        回退
                    </el-button>

                    <el-button
                            type="danger" size="mini"
                            v-if="enabledEdit"
                            :disabled="!document.id"
                            @click="cancel()">
                        撤销
                    </el-button>
                </div>
            </div>
            <div v-if="document">

                <el-form :model="document" :rules="documentAccountMoveLinesRules" ref="documentAccountMoveRules"
                         label-width="150px">
                    <el-row>
                        <el-col :span="10">
                            <el-form-item label="编制单位">
                                <span class="form-border-bottom">
                                    {{$store.state.currentCompany.company_name}}
                                </span>
                            </el-form-item>
                            <el-form-item label="会计区间">
                                <div class="form-border-bottom">
                                    <span v-if="document.account_period">
                                        {{document.account_period.date_start+' 至 '+document.account_period.date_end}}
                                    </span>
                                </div>
                            </el-form-item>
                            <el-form-item label="单据数量" prop="document_amount">
                                <span class="form-border-bottom" v-if="!isEdit">
                                    {{document.document_amount}}
                                </span>
                                <InputNumber v-else :value.sync="document.document_amount"
                                             :integer="true"></InputNumber>
                            </el-form-item>
                            <el-form-item label="批量修改汇率">
                                <div v-if="isEdit">
                                    <InputNumber :value.sync="exchangeRateModify" style="width: 50%;"></InputNumber>
                                    <el-button type="primary" @click="exchangeRateModifyClick">确定</el-button>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="日期" prop="date">
                                <span class="form-border-bottom" v-if="!isEdit">
                                    {{document.date}}
                                </span>
                                <el-date-picker
                                        v-else
                                        v-model="document.date"
                                        type="date"
                                        value-format="yyyy-MM-dd"
                                        placeholder="日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="会计区间状态">
                                <span class="form-border-bottom">
                                    <el-tag v-if="document.account_period">{{document.account_period.status?'打开':'关闭'}}</el-tag>
                                </span>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

                <el-button
                        type="primary"
                        class="right margin-right-20"
                        v-if="isFoldButton && !isEdit"
                        @click="foldToggle()">
                    {{isFold?'展开':'折叠'}}
                </el-button>


                <table class="table" v-if="document.account_move_lines">
                    <thead>
                    <tr>
                        <th width="50px">序号</th>
                        <th>摘要</th>
                        <th>会计科目</th>
                        <th>辅助科目</th>
                        <th>业务员</th>
                        <th>产品信息</th>
                        <th>产品数量</th>
                        <th>借方</th>
                        <th>贷方</th>
                        <th>外币币种</th>
                        <th>外币金额</th>
                        <th>汇率</th>
                        <th>操作</th>
                    </tr>
                    </thead>

                    <tbody class="el-input--small">
                    <tr v-for="(row,$index) in document.account_move_lines" :key="row.id + '_' + row.indexKey">
                        <td>{{$index+1}}</td>
                        <td>
                            <span v-if="!isEdit">{{row.comment}}</span>
                            <div v-else>
                                <input class="el-input__inner" v-model="row.comment" placeholder="摘要"/>
                            </div>
                        </td>
                        <td>
                            <span v-if="!isEdit">{{row.account ? row.account.code + ' ' +  row.account.name : null}}</span>
                            <div v-else>
                                <el-select v-model="row.account_id" placeholder="会计科目" filterable clearable style="width: 180px;">
                                    <el-option v-for="item in accountList"
                                               :key="item.id"
                                               :value="item.id"
                                               :label="item.code + ' ' + item.name">
                                    </el-option>
                                </el-select>
                            </div>
                        </td>
                        <td>
                            <span v-if="row.is_locked || !isEdit">{{row.assistant_account}}</span>
                            <div v-else>
                                <div style="width: 280px;">
                                    <div class="inline-block" style="width: 200px;">
                                        <SelectPartnerCompanyOnly placeholder="公司"
                                                v-if="row.assistant_type === 'account_company'"
                                                @change="partnerCompanyChange($event,row)"
                                                :partnerId.sync="row.assistant_id"
                                                :partner="row.assistant_id ? {account_company_id:row.assistant_id,company_name:row.assistant_account} : null"
                                                :option="row.assistant_id ? [{account_company_id:row.assistant_id,company_name:row.assistant_account}] : null">
                                        </SelectPartnerCompanyOnly>

                                        <el-select v-model="row.assistant_id" placeholder="用户"
                                                   v-if="row.assistant_type === 'account_user'">
                                            <el-option
                                                    v-for="(item,$index) in $store.state.all_internal_users"
                                                    :key="$index"
                                                    :label="item.name"
                                                    :value="item.id">
                                            </el-option>
                                        </el-select>

                                        <el-select v-model="row.assistant_id" placeholder="部门"
                                                   v-if="row.assistant_type === 'account_department'">
                                            <el-option
                                                    v-for="(item,$index) in accountDepartmentList"
                                                    :key="$index"
                                                    :label="item.dept_name"
                                                    :value="item.dept_id">
                                            </el-option>
                                        </el-select>
                                    </div>

                                    <el-select v-model="row.assistant_type" @change="assistantTypeChange(row)" style="width: 75px;">
                                        <el-option label="类型" value=""></el-option>
                                        <el-option label="公司" value="account_company"></el-option>
                                        <el-option label="用户" value="account_user"></el-option>
                                        <el-option label="部门" value="account_department" v-if="$store.state.system === '0'"></el-option>
                                    </el-select>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span v-if="row.is_locked || !isEdit">
                                    {{(row.in_charge_user ? row.in_charge_user.name : null) | defaultStr}}
                                </span>
                            <div v-else>
                                <el-select v-model="row.in_charge_user_id" placeholder="业务员">
                                    <el-option
                                            v-for="(item,$index) in $store.state.all_internal_users"
                                            :key="$index"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                        </td>
                        <td>
                           <span v-if="row.is_locked || !isEdit">
                                    {{(row.product ? row.product.product_name+','+row.product.product_order_no : null) | defaultStr}}
                                </span>
                            <div v-else>
                                <SelectProductSingle
                                        :productId.sync="row.product_id"
                                        :product.sync="row.product"
                                        :option="row.product_id ? [row.product] : null"
                                        placeholder="产品信息">
                                </SelectProductSingle>
                            </div>
                        </td>
                        <td>
                            <span v-if="row.is_locked || !isEdit">{{row.product_qty | defaultStr}}</span>
                            <div v-else>
                                <input class="el-input__inner" type="number" v-model="row.product_qty" placeholder="产品数量"/>
                            </div>
                        </td>
                        <td>
                            <span v-if="!isEdit">{{row.debit}}</span>
                            <div v-else>
                                <input class="el-input__inner" type="number" v-model="row.debit"  @input="calculateMoney" placeholder="借方"/>
                            </div>
                        </td>
                        <td>
                            <span v-if="!isEdit">{{row.credit}}</span>
                            <div v-else>
                                <input class="el-input__inner" type="number" v-model="row.credit"  @input="calculateMoney" placeholder="贷方"/>
                            </div>
                        </td>
                        <td>
                            <span v-if="row.is_locked || !isEdit">{{row.currency}}</span>
                            <div v-else>
                                <el-select v-model="row.currency" placeholder="外币币种">
                                    <el-option label="非外币" value=""></el-option>
                                    <el-option
                                            v-for="(item,$index) in $store.state.currency"
                                            :key="$index"
                                            :label="item.label"
                                            :value="item.code">
                                    </el-option>
                                </el-select>
                            </div>
                        </td>
                        <td>
                            <span v-if="row.is_locked || !isEdit">{{row.currency_money}}</span>
                            <div v-else>
                                <input class="el-input__inner" type="number" v-model="row.currency_money"  @input="changeCurrencyMoney(row)" placeholder="外币金额"/>
                            </div>
                        </td>
                        <td>
                            <span v-if="row.is_locked || !isEdit">{{row.exchange_rate}}</span>
                            <div v-else>
                                <input class="el-input__inner" type="number" v-model="row.exchange_rate" @input="changeCurrencyMoney(row)" placeholder="汇率"/>
                            </div>
                        </td>
                        <td class="nowrap">
                            <button class="el-button el-button--danger el-button--mini"
                                    :class="{'is-disabled':row.is_locked || !isEdit}"
                                       :disabled="row.is_locked || !isEdit"
                                       @click="delLine($index,row)">删除
                            </button>
                            <span class="el-tag el-tag--mini el-tag--info cursor-pointer"
                                  v-if="isEdit"
                                  @click="setRowMoney(row)">
                                试算
                            </span>
                        </td>
                    </tr>
                    </tbody>
                </table>


                <div class="padding-10 clearfix">
                    <div class="left">
                        <span class="margin-right-20">制单人：<b>{{document.create_user_name | defaultStr}}</b></span>
                        <span class="margin-right-20">审核人：<b>{{document.validate_user_name | defaultStr}}</b></span>
                    </div>

                    <div class="right">
                        <span class="margin-right-20">总计：<b>{{document.uppercaseTotal|zerosoDigitUppercase}}</b></span>
                        <span class="margin-right-20">借方：<b>{{document.debitTotal}}</b></span>
                        <span class="margin-right-20">贷方：<b>{{document.creditTotal}}</b></span>

                        <el-button style="margin-left: 100px;margin-right: 40px;" type="primary" size="mini"
                                   :disabled="!isEdit"
                                   @click="addLine()">添加
                        </el-button>
                    </div>
                </div>

            </div>
        </el-card>


        <el-card class="margin-bottom-20">
            <div slot="header" class="clearfix">
                <h3 class="left">关联单据</h3>
            </div>
            <el-table :data="bank_statement_relations" border>
                <el-table-column width="55">
                    <template v-slot:header>
                        <el-checkbox v-model="relationsCheckAll" :disabled="!!document.status || document.id"
                                     @change="bankStatementRelationsHookAll"></el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.is_checked" :disabled="isRelationLocked(scope.row) || document.id"
                                     @change="bankStatementRelationsHook(scope.row)"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.relation_type | paymentType}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="单据号">
                    <template slot-scope="scope">
                        <span class="blue cursor-pointer" @click="goTo(scope.row)">{{scope.row.name || scope.row.id}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.state | zerosoBillActionState}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="已在银行流水核销">
                    <template slot-scope="scope">
                        {{scope.row.is_bank_statement_line_reconsiled?'是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column label="已在发票核销">
                    <template slot-scope="scope">
                        {{scope.row.is_invoice_reconsiled?'是':'否'}}
                    </template>
                </el-table-column>
                <el-table-column prop="comment" label="备注"></el-table-column>
                <el-table-column prop="due_date" label="日期"></el-table-column>
                <el-table-column label="记账金额" align="right">
                    <template slot-scope="scope">
                        {{scope.row.book_money | isoCurrency(scope.row.currency)}}
                    </template>
                </el-table-column>
                <el-table-column label="实际金额" align="right">
                    <template slot-scope="scope">
                        {{scope.row.money | isoCurrency(scope.row.currency)}}
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    import OrderUtils from "../../../order/order-utils";

    export default {
        props: ['accountMove', 'type','invoice_position'],
        data() {
            return {
                document: {},
                bank_statement_relations: [],

                isEdit: false,
                enabledEdit: false,
                isRevert: false,
                isCheck: false,
                isVerify: false,
                relationsCheckAll: false,

                exchangeRateModify: null,

                documentAccountMoveLinesRules: {
                    document_amount: [
                        {required: true, message: '请输入单据数量！'}
                    ], date: [
                        {required: true, message: '请选择日期！'}
                    ],
                },


                isFold: false,
                isFoldButton: false,

                accountList: [],
                accountDepartmentList: [],

                loading: false,
            }
        },
        watch: {
            'accountMove'() {
                this.init()
            }
        },
        created() {
            this.init();
            this.getAccountList();
            this.getAccountDepartmentList();
        },
        methods: {
            init() {
                let self = this;
                let document = {};
                if (self.accountMove.fold_detail) {
                    document = JSON.parse(JSON.stringify(self.accountMove.fold_detail));
                    self.isFoldButton = self.isFold = self.accountMove.is_fold;
                } else {
                    document = JSON.parse(JSON.stringify(self.accountMove));
                }
                document.debitTotal = 0;
                document.creditTotal = 0;
                self.document = document;

                self.init2();
            },
            init2() {
                let self = this;
                self.document.debitTotal = 0;
                self.document.creditTotal = 0;

                self.enabledEdit = self.document.status === 'draft';
                self.isEdit = !self.document.id;
                self.isCheck = self.document.status === 'draft';
                self.isVerify = self.document.status === 'checked';
                self.isRevert = self.document.status === 'checked' || self.document.status === 'verified';

                if (self.document.bank_statement_relations) {
                    //初始化数据时处理相关默认锁定的相关单据
                    self.document.bank_statement_relations.forEach(function (line) {
                        self.bankStatementRelationsHook(line)
                    });
                    self.bank_statement_relations = JSON.parse(JSON.stringify(self.document.bank_statement_relations));
                }else {
                    self.bank_statement_relations=[]
                }
                if (self.document.account_move_lines) {
                    self.calculateMoney();
                }


                //当为供应商发票时，自动勾选关联单据，20210113改为不判断发票类型
                if(self.type==='invoice' && !self.document.id){
                    self.$nextTick(()=>{
                        self.bankStatementRelationsHookAll(true);
                        self.relationsCheckAll=true;
                    })
                }
            },
            getAccountList() {
                let self = this;
                self.$http({
                    url: self.$api.bank_account,
                    success: function (data) {
                        if (data.msg) {
                            self.accountList = data.msg.items;
                        }
                    }
                });
            },
            //获取部门列表
            getAccountDepartmentList() {
                let self = this;
                if(self.$store.state.zerosoCompany[self.$store.state.currentCompany.account_company_id]){
                    self.$http({
                        url: self.$api.ding_talk_v1_departments,
                        success: function (data) {
                            if (data.msg) {
                                self.accountDepartmentList = data.msg;
                            }
                        }
                    });
                }
            },

            action(name) {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_v4_account_move + '/' + self.document.id + '/action',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        account_move_id: self.document.id,
                        name: name
                    },
                    success: function () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '操作成功！',
                            type: 'success'
                        });
                        self.$emit('update')
                    }
                });
            },

            cancel() {
                let self = this;
                self.$confirm('确定撤销该凭证吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.bank_v4_account_move + '/' + self.document.id,
                                type: 'DELETE',
                                requestBody: true,
                                data: {
                                    account_move_id: self.document.id,
                                    name: name
                                },
                                success: function () {
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '操作成功！',
                                        type: 'success'
                                    });
                                    if (self.type === 'accountDocuments') {
                                        self.$router.back();
                                    } else {
                                        self.$emit('update')
                                    }
                                }
                            });
                        }
                    }
                });
            },

            save() {
                let self = this;

                self.$refs.documentAccountMoveRules.validate((valid) => {
                    if (valid) {
                        //银行流水上面收款的都提交 付款的选中提交
                        //发票上面 发票类型的都提交 订单类型的选中才提交
                        let document = JSON.parse(JSON.stringify(self.document));

                        if (self.document.bank_statement_relations) {
                            document.bank_statement_relations = self.document.bank_statement_relations.filter(function (line) {
                                return line.is_checked
                            });
                        }

                        if (!self.document.bank_statement_relations) {
                            self.document.bank_statement_relations = []
                        }

                        for(let i=0;i<document.account_move_lines.length;i++){
                            let line=document.account_move_lines[i];
                            if (!line.comment) {
                                self.$message({
                                    showClose: true,
                                    message: '第'+(i+1)+'行，请输入摘要！',
                                    type: 'error'
                                });
                                return
                            }
                            if (!line.account_id) {
                                self.$message({
                                    showClose: true,
                                    message: '第'+(i+1)+'行，请选择会计科目！',
                                    type: 'error'
                                });
                                return
                            }
                            if (!line.debit && !line.credit) {
                                self.$message({
                                    showClose: true,
                                    message: '第'+(i+1)+'行，请输入借方或贷方！',
                                    type: 'error'
                                });
                                return
                            }

                            if (line.product) {
                                line.product_id = line.product.id
                            } else {
                                line.product_id = null
                            }
                            if (line.assistant_type === '') {
                                line.assistant_type = null;
                                line.assistant_id = null;
                            }
                            if(line.product_qty){
                                line.product_qty = Number(line.product_qty).toFixed(2);
                            } else {
                                line.product_qty = undefined;
                            }
                            if(line.debit){
                                line.debit =  Number(line.debit).toFixed(2);
                            }else{
                                line.debit = '0.00'
                            }
                            if(line.credit){
                                line.credit =  Number(line.credit).toFixed(2);
                            }else{
                                line.credit = '0.00'
                            }
                        }
                        if (Number(document.debitTotal) !== Number(document.creditTotal)) {
                            self.$message({
                                showClose: true,
                                message: '借贷总额不等！',
                                type: 'error'
                            });
                            return
                        }

                        self.loading = true;
                        self.$http({
                            url: document.id ? self.$api.bank_v4_account_move + '/' + self.document.id : self.$api.bank_v4_account_move,
                            type: document.id ? 'PUT' : 'POST',
                            requestBody: true,
                            data: document,
                            success: function (data) {
                                self.loading = false;
                                self.$message({
                                    showClose: true,
                                    message: '操作成功！',
                                    type: 'success'
                                });

                                if (self.type === 'accountDocuments') {
                                    if (document.id) {
                                        self.$emit('update')
                                    } else if (data.msg && data.msg.id) {
                                        self.$router.push({
                                            path: 'detail',
                                            query: {
                                                id: data.msg.id
                                            }
                                        })
                                    }
                                } else {
                                    self.$emit('update')
                                }
                            }
                        });
                    }
                });

            },

            edit() {
                let self = this;
                self.isEdit = true;
                if (self.accountMove.no_fold_detail) {
                    self.isFold = false;
                    let document = {};
                    document = JSON.parse(JSON.stringify(self.accountMove.no_fold_detail));
                    document.debitTotal = 0;
                    document.creditTotal = 0;
                    self.document = document;
                }
                self.calculateMoney()
            },

            editCancel() {
                let self = this;
                self.isEdit = false;
                self.$emit('update')
            },
            addLine() {
                let self = this;
                let debit = 0;
                let credit = 0;
                let params = {};
                if (Number(self.document.debitTotal) > Number(self.document.creditTotal)) {
                    credit = Number(Number(self.document.debitTotal) - Number(self.document.creditTotal)).myRound(2)
                } else if (Number(self.document.debitTotal) < Number(self.document.creditTotal)) {
                    debit = Number(Number(self.document.creditTotal) - Number(self.document.debitTotal)).myRound(2)
                } else if (Number(self.document.debitTotal) === Number(self.document.creditTotal)) {
                    debit = 0;
                    credit = 0;
                }

                // 摘要、会计科目、辅助科目、业务员。

                if (self.document.account_move_lines.length) {
                    let line = self.document.account_move_lines[self.document.account_move_lines.length - 1];
                    params = {
                        comment: line.comment,
                        account_id: line.account_id,
                        assistant_type: line.assistant_type,
                        assistant_account: line.assistant_account,
                        assistant_id: line.assistant_id,
                        in_charge_user_id: line.in_charge_user_id,
                        indexKey:new Date().getTime(),//新增行时，此处用来标识v-for的key，防止在删除行时，复用附件会移位
                    };
                }

                params.credit = credit.toFixed(2);
                params.debit = debit.toFixed(2);

                self.document.account_move_lines.push(params);
                self.calculateMoney()
            },
            delLine(index, line) {
                let self = this;
                self.document.account_move_lines.splice(index, 1);
                self.document.bank_statement_relations.forEach(function (relationLine) {
                    if (line.bank_statement_relation_id && relationLine.id === line.bank_statement_relation_id) {
                        relationLine.is_checked = false;
                        self.bankStatementRelationsHook(relationLine)
                    }
                });
                self.calculateMoney()
            },

            partnerCompanyChange(partner, row) {
                if (partner) {
                    row.assistant_account = partner.company_name
                }
            },

            setRowMoney(row){
                let self=this;
                if(self.document.account_move_lines.length<=1) return;

                let totalDiffer =  Number(Number(self.document.debitTotal) - Number(self.document.creditTotal)).myRound(2);
                let rowDiffer =  Number(Number(row.debit) - Number(row.credit)).myRound(2);
                if(totalDiffer>0){
                    if(Number(totalDiffer-rowDiffer)>=0){
                        row.debit = 0.00;
                        row.credit = Number(totalDiffer-rowDiffer).myRound(2);
                    }else {
                        row.debit = -Number(totalDiffer-rowDiffer).myRound(2);
                        row.credit = 0.00;
                    }
                }else if(totalDiffer<0){
                    if(rowDiffer-totalDiffer>=0){
                        row.debit = Number(rowDiffer-totalDiffer).myRound(2);
                        row.credit = 0.00;
                    }else {
                        row.debit = 0.00;
                        row.credit = -Number(rowDiffer-totalDiffer).myRound(2);
                    }
                }
                self.calculateMoney()
            },


            calculateMoney() {
                let self = this;
                self.document.debitTotal = 0;
                self.document.creditTotal = 0;
                self.document.account_move_lines.forEach(function (line) {
                    if (line.debit) self.document.debitTotal += Number(line.debit);
                    if (line.credit) self.document.creditTotal += Number(line.credit);
                });

                self.document.debitTotal = self.document.debitTotal.myRound(2);
                self.document.creditTotal = self.document.creditTotal.myRound(2);
                self.document.uppercaseTotal = Number(self.document.debitTotal) >= Number(self.document.creditTotal) ? self.document.debitTotal : self.document.creditTotal

            },
            exchangeRateModifyClick() {
                let self = this;
                let account_move_lines = JSON.parse(JSON.stringify(self.document.account_move_lines));
                for (let i = 0; i < account_move_lines.length; i++) {
                    if (account_move_lines[i].currency) {
                        account_move_lines[i].exchange_rate = self.exchangeRateModify;
                        self.changeCurrencyMoney(account_move_lines[i])
                    }
                }
                self.document.account_move_lines = account_move_lines;
                self.calculateMoney();
            },
            changeCurrencyMoney(line) {
                let self = this;
                if (line.currency_money && line.exchange_rate) {
                    let result = Number(line.currency_money * line.exchange_rate).myRound(2);
                    if (Number(result) > 0) {
                        line.debit = Math.abs(result);
                        line.credit = 0;
                    } else {
                        line.debit = 0;
                        line.credit = Math.abs(result);
                    }
                    self.calculateMoney()
                }
            },
            bankStatementRelationsHook(line) {
                let self = this;
                if (!self.isEdit) return null;
                if (line.is_checked) {
                    if (line.account_move_lines) {
                        self.document.account_move_lines = self.document.account_move_lines.concat(JSON.parse(JSON.stringify(line.account_move_lines)))
                    }
                } else {
                    self.document.account_move_lines = self.document.account_move_lines.filter(function (moveLine) {
                        return !(moveLine && moveLine.bank_statement_relation_id === line.id)
                    });
                }
                self.calculateMoney()
            },
            bankStatementRelationsHookAll(is_checked) {
                let self = this;
                if(self.document.bank_statement_relations){
                    self.document.bank_statement_relations.forEach(function (line) {
                        if (!line.is_locked) {
                            line.is_checked = is_checked;
                            self.bankStatementRelationsHook(line)
                        }
                    })
                }
                self.bank_statement_relations = JSON.parse(JSON.stringify(self.document.bank_statement_relations));
            },

            isRelationLocked(line) {
                if (this.document.status) return true;
                return line.is_locked;
            },

            foldToggle() {
                let self = this;
                if (self.isFold) {
                    self.isFold = false;
                    self.document = JSON.parse(JSON.stringify(self.accountMove.no_fold_detail));
                } else {
                    self.isFold = true;
                    self.document = JSON.parse(JSON.stringify(self.accountMove.fold_detail));
                }
                self.init2();
            },


            assistantTypeChange(row){
                row.assistant_id = null;
            },

            goTo(row) {
                if (row.module_name === 'order') {
                    OrderUtils.goToOrderDetail(row.module_id)
                } else if (row.module_name === 'invoice') {
                    this.$router.push({
                        path: '/finance/invoice/supplier/detail',
                        query: {
                            id: row.module_id,
                        }
                    })
                } else {
                    this.$router.push({
                        path: '/finance/prepaid/detail',
                        query: {
                            id: row.id,
                        }
                    })
                }
            },
        },
    }
</script>

<style lang="scss">
    @import "src/assets/css/config";

    .account-documents-move {
        .table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;

            th {
                background-color: $color-background;
            }

            th, td {
                border: 1px solid $color-border;
                padding: 8px 10px;

                .el-input__inner:disabled {
                    background-color: #F5F7FA;
                    border-color: #E4E7ED;
                    color: #C0C4CC;
                    cursor: not-allowed;
                }
            }
        }
    }

</style>