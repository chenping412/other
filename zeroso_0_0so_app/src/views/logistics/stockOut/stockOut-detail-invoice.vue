<template>
    <div class="flex-box-column stockIn-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? '/logistics/stockOut/list?'+parentQuery : '/logistics/stockOut/list'">库存 / 出库单列表</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{path:'/logistics/stockOut/detail',query:$route.query}">出库单详情{{detailForm.name}}</el-breadcrumb-item>
                    <el-breadcrumb-item>生成发票</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <div class="detail-status">
                        <h3 class="inline-block margin-right-20">出库单：{{detailForm.name}}</h3>
                    </div>
                </div>
                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form"
                         label-width="120px">
                    <div style="width: 600px;">
                        <el-form-item label="发货公司：">
                        <span class="form-border-bottom">
                            <router-link
                                    class="blue"
                                    target="_blank"
                                    v-if="detailForm.received_from_company"
                                    :to="'/partner/detail?id='+detailForm.received_from_company.account_company_id">
                                <span>{{detailForm.received_from_company.company_name}}</span>
                                <CompanyType :type="detailForm.received_from_company.company_type"></CompanyType>
                            </router-link>
                        </span>
                        </el-form-item>
                        <el-form-item label="收货公司：">
                        <span class="form-border-bottom">
                            <router-link
                                    class="blue"
                                    target="_blank"
                                    v-if="detailForm.send_to_company"
                                    :to="'/partner/detail?id='+detailForm.send_to_company.account_company_id">
                                <span>{{detailForm.send_to_company.company_name}}</span>
                                <CompanyType :type="detailForm.received_from_company.company_type"></CompanyType>
                            </router-link>
                        </span>
                        </el-form-item>
                    </div>
                </el-form>



                <el-table v-if="detailForm.box_lines" :data="detailForm.box_lines" border>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="货物或应用劳务名称">
                        <template slot-scope="scope">
                            <el-input type="textarea" v-model="scope.row.product_type_name" placeholder="请输入货物或应用劳务名称"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="规格参考">
                        <template slot-scope="scope">
                            <pre>{{scope.row.copyProductName | defaultStr}}</pre>
                        </template>
                    </el-table-column>
                    <el-table-column label="规格型号">
                        <template slot-scope="scope">
                            <el-input type="textarea" :rows="3" v-model="scope.row.product_name"  placeholder="请输入规格型号"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="待开数量" prop="quantity"> </el-table-column>
                    <el-table-column label="单价">
                        <template slot-scope="scope">
                            <InputNumber :value.sync="scope.row.unit_price" placeholder="请输入单价"></InputNumber>
                        </template>
                    </el-table-column>

                </el-table>

                <div style="text-align: center;padding: 20px 0;">
                    <el-button type="primary" @click="createInvoice">确认</el-button>
                </div>


            </div>

        </div>


    </div>
</template>

<script>

    export default {
        data() {
            return {
                queryId: '',
                parentQuery: '',

                detailForm: {},
                detailFormRule: {},

                loading: false,
            }
        },
        watch: {
            '$route'() {
                this.init()
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let self = this;

                if (self.$route.query.parentQuery && self.$route.query.parentQuery !== 'undefined' && self.$route.query.parentQuery !== 'null') {
                    self.parentQuery = self.$route.query.parentQuery;
                }
                if (self.$route.query.id && self.$route.query.id !== 'undefined' && self.$route.query.id !== 'null') {
                    self.queryId = self.$route.query.id * 1;
                    self.getDetailData();
                } else {
                    self.queryId = '';
                    self.detailForm = {};
                }
            },
            getDetailData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_outgoing_transfers + '/' + self.queryId + '/box_lines',
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            if(data.msg.box_lines){
                                for(let i=0;i<data.msg.box_lines.length;i++){
                                    data.msg.box_lines[i].copyProductName=data.msg.box_lines[i].product_name
                                }
                            }
                            self.detailForm = data.msg;
                        }
                    }
                })
            },




            createInvoice() {
                let self = this;
                for(let i=0;i<self.detailForm.box_lines.length;i++){
                    if(!self.detailForm.box_lines[i].product_name){
                        self.$message({
                            showClose: true,
                            message: '部分产品规格型号为空，必须填写规格型号！',
                            type: 'error'
                        });
                        return
                    }
                    if(!self.detailForm.box_lines[i].unit_price){
                        self.$message({
                            showClose: true,
                            message: '部分产品单价为空，必须填写单价！',
                            type: 'error'
                        });
                        return
                    }
                }


                let invoiceData = {
                    outgoing_transfer_id: self.queryId,
                    invoice_lines: []
                };
                self.detailForm.box_lines.forEach(function (line) {
                    invoiceData.invoice_lines.push({
                        order_line_id: line.order_product_id,
                        price: line.unit_price,
                        price_tax: line.unit_price,
                        product_name: line.product_name,
                        quantity: line.quantity,
                        product_type_name: line.product_type_name,
                    });
                });


                self.loading = true;
                self.$http({
                    url: self.$api.bank_v4_invoice_generate_by_box_line,
                    type: 'POST',
                    requestBody:true,
                    data:invoiceData,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.id) {
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            self.$router.push({
                                path: '/finance/invoice/customer/detail',
                                query:{
                                    id:data.msg.id
                                }
                            });
                        } else {
                            self.$message({
                                showClose: true,
                                message: '操作失败！',
                                type: 'error'
                            });
                        }
                    }
                })
            },


        }
    }
</script>

<style lang="scss">

</style>
