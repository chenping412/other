<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>{{invoiceType === 'customer' ? '客户发票':'供应商发票'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch :filterKey="'accounting_'+invoiceType+'_invoice'" :allowFilterFieldsUrl="listApi"
                           :groupConfig="groupConfig"
                           @clickSearch="init()"></ControlSearch>


            <div class="table-control clearfix">
                <div class="control-btns">

                    <el-button type="primary" @click="openDetail">{{invoiceType === 'customer' ? '创建客户发票':'创建供应商发票'}}</el-button>
                    <el-button v-if="invoiceType === 'customer'" @click="exportXML">导出XML</el-button>

                    <invoice-detail-edit-delivery-info
                            class="margin-left-10"
                            ref="invoiceEditDelivery"
                            @update="init">
                        <template>
                            <el-button @click="invoiceDelivery">批量寄票</el-button>
                        </template>
                    </invoice-detail-edit-delivery-info>

                    <div class="inline-block margin-left-20">
                        <span>本页总共：</span>
                        <span class="color-main">{{pageSize>listData.length ? listData.length : pageSize}}</span>
                        <span>条数据</span>
                        <span class="margin-left-20">发票总金额：</span>
                        <span class="color-main margin-right-20" v-for="(item,key) in moneyList" :key="key">{{item | isoCurrency(key)}}</span>
                    </div>
                </div>
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>


        <div class="container-content flex-item-scroll" v-loading="loading">
            <div class="container-table">
                <el-table :data="listData" @row-click="openDetail" :row-class-name="tableRowClassName"  @selection-change="handleSelectionChange" border v-if="!loading">
                    <el-table-column type="selection" width="55"> </el-table-column>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="发票号" field_name="invoice_number"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            {{scope.row.invoice_number | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column width="170">
                        <template slot="header">
                            <ButtonSort label="创建时间" field_name="create_time"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <span>{{scope.row.create_time | zerosoTimeFormat | defaultStr}}</span>
                            <el-tag size="mini" type="danger" effect="dark" v-if="scope.row.is_hot">催</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column width="300">
                        <template slot="header">
                            <ButtonSort label="客户" field_name="customer_company"
                                        v-show="invoiceType === 'customer'"></ButtonSort>
                            <ButtonSort label="供应商" field_name="supplier_company_id"
                                        v-show="invoiceType === 'supplier'"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            <div v-if="invoiceType === 'customer'">
                                <span>{{scope.row.customer.company_name | defaultStr}}</span>
                                <CompanyType v-if="scope.row.customer"
                                             :type="scope.row.customer.company_type"></CompanyType>
                            </div>
                            <div v-if="invoiceType === 'supplier'">
                                <span>{{scope.row.supplier.company_name | defaultStr}}</span>
                                <CompanyType v-if="scope.row.supplier"
                                             :type="scope.row.supplier.company_type"></CompanyType>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单号">
                        <template slot-scope="scope">
                            <p v-if="scope.row.reference && scope.row.reference.length>0">
                                {{scope.row.reference[0].name}}
                            </p>
                            <span v-else>{{'' | defaultStr}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template slot="header">
                            <ButtonSort label="发票日期" field_name="invoice_date"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            {{scope.row.invoice_date | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="未税总额" align="right">
                        <template slot-scope="scope">
                            {{scope.row.total | isoCurrency(scope.row.currency) | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column align="right">
                        <template slot="header">
                            <ButtonSort label="发票总额" field_name="total_taxed"></ButtonSort>
                        </template>
                        <template slot-scope="scope">
                            {{scope.row.total_taxed | isoCurrency(scope.row.currency) | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="税额" align="right">
                        <template slot-scope="scope">
                            {{scope.row.total_tax | isoCurrency(scope.row.currency) | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="附加费" align="right">
                        <template slot-scope="scope">
                            {{scope.row.additional_fee | isoCurrency(scope.row.currency) | defaultStr}}
                        </template>
                    </el-table-column>
                    <el-table-column label="核销状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.is_reconsiled ? '已核销' : '未核销'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="支付状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.is_paid| zerosoPaidState}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="state" label="状态">
                        <template slot-scope="scope">
                            <el-tag
                                    :type="scope.row.status ==='received'?'success'
                                :scope.row.status ==='canceled' || scope.row.status ==='draft'?'info'
                                :null"
                            >{{scope.row.status | zerosoInvoiceStatus}}
                            </el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

    </div>
</template>

<script>

    import InvoiceDetailEditDeliveryInfo from "./component/invoice-detail-edit-delivery-info";
    export default {
        components: {InvoiceDetailEditDeliveryInfo},
        data() {
            return {
                invoiceType: '',
                listApi: '',

                filter: {},

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,


                selectRowList:[],

                moneyList: {},

                loading: false,


                //分组列表配置
                groupConfig: [
                    {
                        title: [
                            {
                                title: '组名',
                            },
                        ],
                        dataIndex: 'value',
                        width: '50%',
                        edit: false
                    },
                    {
                        title: [
                            {
                                title: '数量',
                            },
                        ],
                        dataIndex: 'invoice_count',
                        width: '10%',
                        edit: false
                    },
                    {
                        title: [
                            {
                                title: '未税总额',
                            },
                        ],
                        dataIndex: 'total',
                        zerosoRound:true,
                        width: '20%',
                        edit: false
                    },
                    {
                        title: [
                            {
                                title: '含税总额',
                            },
                        ],
                        dataIndex: 'total_taxed',
                        zerosoRound:true,
                        width: '20%',
                        edit: false
                    },
                ],
            }
        },
        watch: {
            '$route'() {
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.invoiceType = this.$route.params.invoiceType;
                if (this.invoiceType === 'customer') {
                    this.listApi = this.$api.bank_customer_invoice_search;
                } else if (this.invoiceType === 'supplier') {
                    this.listApi = this.$api.bank_supplier_invoice_search;
                }

                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : {};
                this.order_by = this.$route.query.order_by ? [JSON.parse(decodeURIComponent(this.$route.query.order_by))] : undefined;
                this.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum * 1 : 1;
                this.pageSize = this.$route.query.pageSize ? this.$route.query.pageSize * 1 : this.$store.state.paginationPageSize;
                this.getListData();
            },


            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.listApi,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        filter: self.$utils.formatSearchFilter(self.filter),
                        order_by: self.order_by,
                        invoice_type: self.invoiceType,
                        key: 'accounting_' + self.invoiceType + '_invoice',
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg.items && data.msg.items) {
                            self.listData = data.msg.items;
                            self.totalCount = data.msg.total;

                            let moneyList = {};
                            self.listData.forEach((item) => {
                                if (moneyList[item.currency] === undefined) {
                                    moneyList[item.currency] = 0;
                                }
                                if (item.total_taxed) {
                                    moneyList[item.currency] += item.total_taxed * 1
                                }
                            });
                            self.moneyList = moneyList;
                        } else {
                            self.listData = [];
                            self.moneyList = {};
                            self.totalCount = 0;
                        }
                    }
                })
            },

            openDetail(row) {
                let query = {
                    id: row && row.id ? row.id : undefined,
                    invoice_type: this.invoiceType,
                };
                if (this.$route.fullPath.split('?')[1]) query.parentQuery = this.$route.fullPath.split('?')[1];
                this.$router.push({
                    path: 'detail',
                    query: query
                });
            },

            handleSelectionChange(val){
                this.selectRowList=val;
            },
            getIds() {
                let ids = [];
                this.selectRowList.forEach(function (line) {
                    ids.push(line.id)
                });
                return ids
            },

            exportXML(){
                let ids = this.getIds();
                if (ids.length >= 1) {
                    this.$utils.createInvoiceXML(ids);
                }else {
                    this.$message({
                        showClose: true,
                        message: '请选择发票！',
                        type: 'error'
                    });
                }
            },

            invoiceDelivery() {
                let self=this;
                let ids = this.getIds();
                if (ids.length >= 1) {
                    self.loading = true;
                    self.$http({
                        url: self.$api.bank_v4_invoice_batch_make_delivery,
                        data: {
                            invoice_ids:ids
                        },
                        traditional: true,
                        success (data) {
                            self.loading = false;
                            if(data.msg){
                                data.msg.invoice_ids = ids;
                                self.$refs.invoiceEditDelivery.showEdit({
                                    batchSendInvoiceUrl:self.$api.bank_v4_invoice_batch_make_delivery,
                                    delivery_info:data.msg
                                })
                            }
                        }
                    });
                }else {
                    this.$message({
                        showClose: true,
                        message: '请选择发票！',
                        type: 'error'
                    });
                }
            },


            tableRowClassName({row}) {
                if (row.invoice_type_name === 'red') return 'red'
            },

        }
    }
</script>

<style>

</style>
