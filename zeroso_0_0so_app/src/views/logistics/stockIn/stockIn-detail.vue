<template>
    <div class="flex-box-column stockIn-detail" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item :to="parentQuery ? 'list?'+parentQuery : 'list'">仓库 / 入库列表</el-breadcrumb-item>
                    <el-breadcrumb-item>{{queryId ? '入库详情' : '创建入库'}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="detail-base-info">
                <div class="detail-base-title">
                    <h3 class="detail-status">
                        <span class="margin-right-20" v-if="detailForm.order_name">
                            订单号：
                            <router-link class="blue" :to="'/order/order/all/detail?id='+detailForm.order_base_id">{{detailForm.order_name}}</router-link>
                        </span>
                        <el-tag v-if="detailForm.logistics_state">
                            {{detailForm.logistics_state|zersoLogisticsIncomingStatus}}
                        </el-tag>
                        <el-tag type="warning" effect="dark" v-if="detailForm.logistics_custom_type">
                            {{detailForm.logistics_custom_type}}
                        </el-tag>

                        <span class="margin-left-20" v-if="detailForm.supplier_company">
                            供应商/supplier:
                            <router-link class="blue" target="_blank"
                                         :to="'/partner/detail?id='+detailForm.supplier_company.account_company_id">
                                {{detailForm.supplier_company.company_name}}
                            </router-link>
                        </span>

                        <span class="margin-left-20" v-if="packageInfo.id">
                            快递签收/ShaoKePack:
                            <router-link class="blue" target="_blank"
                                         :to="'/logistics/packages/detail?id='+packageInfo.id">
                                {{packageInfo.delivery_mail_no}}
                            </router-link>
                        </span>


                    </h3>
                    <div class="detail-control clearfix">
                        <div class="control-btns">

                        </div>
                        <DetailPagination v-if="!delivery_package_id" apiKey="logistics_incoming_transfers"
                                          :listApi="$api.order_incoming_transfers + '/search'"></DetailPagination>
                    </div>
                </div>

                <el-form class="detail-base-body" :model="detailForm" :rules="detailFormRule" ref="form"
                         label-width="180px">
                    <el-row class="border-bottom margin-bottom-20" :gutter="30">
                        <el-col :span="6">
                            <el-form-item label="入库节点/warehouse">
                                <el-select v-model="belongToCompanyId" @change="getNextNode">
                                    <el-option v-for="(item,$index) in internalCompany"
                                               :key="$index"
                                               :label="item.company_name"
                                               :value="item.account_company_id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="品牌/brand">
                                <span class="form-border-bottom">
                                    <router-link target="_blank" class="blue"
                                                 v-if="detailForm.brand && detailForm.brand.id"
                                                 :to="'/product/brand/detail?id='+detailForm.brand.id">{{detailForm.brand.name}}</router-link>
                                </span>
                            </el-form-item>
                            <el-form-item label="快递称重/ShaoKeW.">
                                <span class="form-border-bottom">{{(packageInfo.buy_weight ? packageInfo.buy_weight + 'kg' : null) | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="物流类型">
                                <logistics-type :type="detailForm.logistics_custom_type" :orderId="queryId" @update="init"></logistics-type>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="下一节点/sendTo">
                                <span class="form-border-bottom">{{sendToCompany.company_name | defaultStr}}</span>
                            </el-form-item>
                            <el-form-item label="快递运单号/trackId">
                                <div class="form-border-bottom">
                                    <router-link class="blue" target="_blank"
                                                 :to="'/logistics/packages/detail?id='+packageInfo.id">
                                        {{packageInfo.delivery_mail_no}}
                                    </router-link>
                                </div>
                            </el-form-item>
                        </el-col>
                        <div class="right">
                            <order-detail-status-box isLogistics="true" :queryId="detailForm.order_base_id"
                                                     :orderData="detailForm"></order-detail-status-box>
                        </div>
                    </el-row>

                    <el-table :data="detailForm.order_products" v-if="detailForm.order_products" border>
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column label="型号/type">
                            <template slot-scope="scope" v-if="scope.row.product_name">
                                <router-link class="blue" :to="'/product/product/detail?id='+scope.row.product_id">
                                    {{scope.row.product_name}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column label="订货号/orderNo.">
                            <template slot-scope="scope" v-if="scope.row.product_order_no">
                                <router-link class="blue" :to="'/product/product/detail?id='+scope.row.product_id">
                                    {{scope.row.product_order_no}}
                                </router-link>
                            </template>
                        </el-table-column>
                        <el-table-column label="净重(kg)/N.W.">
                            <template slot-scope="scope">
                                <InputNumber :value.sync="scope.row.net_weight"
                                             :disabled="scope.row.remaining_qty <= 0 || scope.row.isLocked"></InputNumber>
                            </template>
                        </el-table-column>
                        <el-table-column label="毛重(kg)/G.W.">
                            <template slot-scope="scope">
                                <InputNumber :value.sync="scope.row.gross_weight"
                                             :disabled="scope.row.remaining_qty <= 0 || scope.row.isLocked"></InputNumber>
                            </template>
                        </el-table-column>
                        <el-table-column label="应收总量/totalQty" prop="total_qty"></el-table-column>
                        <el-table-column label="未收数量/dueQty">
                            <template slot-scope="scope">
                                {{(scope.row.remaining_qty||0) - (scope.row.received_quantity||0)}}
                            </template>
                        </el-table-column>
                        <el-table-column label="到货数量/packQty">
                            <template slot-scope="scope">
                                <InputNumber :value.sync="scope.row.received_quantity" :integer="true"
                                             :max="scope.row.remaining_qty" :disabled="scope.row.remaining_qty<=0 || scope.row.isLocked"></InputNumber>
                            </template>
                        </el-table-column>
                        <el-table-column width="220px">
                            <template slot="header">
                                <p>供应商预计发货/dueDate</p>
                                <p class="blue cursor-pointer" slot="reference" @click="clickChangeAllDate">批量修改/Batch Edit</p>

                            </template>
                            <template slot-scope="scope">
                                <span>{{scope.row.forecast_received_date|zerosoCompanyDate}}</span>

                                <el-popover v-if="!scope.row.isLocked" v-model="scope.row.changeDateShow" placement="left" trigger="click">
                                    <i class="el-icon-edit el-icon-normal cursor-pointer margin-left-10" slot="reference" @click="clickChangeDate"></i>
                                    <div>
                                        <div class="padding-bottom-10">
                                            <el-date-picker
                                                    v-model="scope.row.forecast_received_date_copy"
                                                    type="date"
                                                    value-format="yyyy-MM-dd"
                                                    placeholder="付款日期">
                                            </el-date-picker>
                                        </div>
                                        <div>
                                            <el-button type="success" size="mini" @click="changeDateShowSave(scope.row)">保存</el-button>
                                            <el-button size="mini" @click="scope.row.changeDateShow=false">取消</el-button>
                                        </div>
                                    </div>
                                </el-popover>

                            </template>
                        </el-table-column>
                        <el-table-column label="图片">
                            <template slot-scope="scope">
                                <FileListShow
                                        :ref="'productFileShow'+scope.$index"
                                        :show-delete="true"
                                        :module_id="scope.row.product_id+''"
                                        module_name="product"
                                        subsystem="product">
                                </FileListShow>
                                <FileUpload
                                        @uploadSuccess="productFileUploadSuccess(scope.$index)"
                                        :autoUpload="true"
                                        :module_id="scope.row.product_id+''"
                                        module_name="product"
                                        subsystem="product">
                                </FileUpload>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <i class="el-icon-success el-icon-normal cursor-pointer green" v-if="scope.row.received_quantity && !scope.row.isLocked" @click="lockInput(scope.row)"></i>
                                <i class="el-icon-error el-icon-normal cursor-pointer red" v-if="scope.row.isLocked" @click="unLockInput(scope.row)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
            </div>



            <el-card class="margin-bottom-20" v-if="receivedList && receivedList.length>0">
                <div class="clearfix" slot="header">
                    <el-button class="right" type="primary" @click="preBoxedUp">装 箱/tapeBox</el-button>
                </div>
                <el-table :data="receivedList" border>
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                    <el-table-column label="型号/type">
                        <template slot-scope="scope" v-if="scope.row.product_name">
                            <router-link class="blue" :to="'/product/product/detail?id='+scope.row.product_id">
                                {{scope.row.product_name}}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="订货号/orderNo.">
                        <template slot-scope="scope" v-if="scope.row.product_order_no">
                            <router-link class="blue" :to="'/product/product/detail?id='+scope.row.product_id">
                                {{scope.row.product_order_no}}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="净重(kg)/N.W." prop="net_weight"></el-table-column>
                    <el-table-column label="毛重(kg)/G.W." prop="gross_weight"></el-table-column>
                    <el-table-column label="到货数量/packQty" prop="received_quantity"></el-table-column>
                    <el-table-column label="供应商预计发货/dueDate">
                        <template slot-scope="scope">
                            {{scope.row.forecast_received_date|zerosoCompanyDate}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>


            <el-card v-if="detailForm.pre_package_boxes && detailForm.pre_package_boxes.length>0">
                <el-table :data="detailForm.pre_package_boxes" border>
                    <el-table-column label="箱号/packId" width="120px">
                        <template slot-scope="scope">
                            <router-link class="blue" v-if="scope.row.package_box" :to="'/logistics/box/order/detail?id='+scope.row.package_box.id">
                                {{scope.row.package_box.box_name}}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column label="箱毛重(kg)/packG.W.">
                        <template slot-scope="scope" v-if="scope.row.package_box">
                            {{scope.row.package_box.weight}}
                        </template>
                    </el-table-column>

                    <el-table-column width="500px">
                        <template slot="header">
                            <table class="table">
                                <thead>
                                <tr>
                                    <th>型号/type</th>
                                    <th>订货号/orderNo.</th>
                                    <th>数量/Qty</th>
                                </tr>
                                </thead>
                            </table>
                        </template>

                        <template slot-scope="scope" v-if="scope.row.pre_box_list">
                            <table class="table">
                                <tbody>
                                <tr v-for="(item,$index1) in scope.row.pre_box_list" :key="$index1">
                                    <td>
                                        <router-link class="blue" :to="'/product/product/detail?id='+item.product_info.id">
                                            {{item.product_info.product_name}}
                                        </router-link>
                                    </td>
                                    <td>
                                        <router-link class="blue" :to="'/product/product/detail?id='+item.product_info.id">
                                            {{item.product_info.product_order_no}}
                                        </router-link>
                                    </td>
                                    <td>{{item.quantity}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </template>
                    </el-table-column>

                    <el-table-column label="下一节点/sendTo">
                        <template slot-scope="scope" v-if="scope.row.package_box">
                            {{scope.row.package_box.next_company_name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="图片/Picture">
                        <template slot-scope="scope" v-if="scope.row.package_box">
                            <FileListShow
                                    :ref="'logisticsBoxShow'+scope.$index"
                                    :show-delete="true"
                                    :module_id="scope.row.package_box.id+''"
                                    module_name="box"
                                    subsystem="logistics">
                            </FileListShow>
                            <FileUpload
                                    @uploadSuccess="logisticsBoxFileUploadSuccess(scope.$index)"
                                    :autoUpload="true"
                                    :module_id="scope.row.package_box.id+''"
                                    module_name="box"
                                    subsystem="logistics">
                            </FileUpload>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作/operation" width="250">
                        <template slot-scope="scope">
                            <div v-if="!scope.row.package_box">
                                <el-button
                                        type="primary" size="mini"
                                        :disabled="detailForm.status == 'canceled' || detailForm.status == 'force_canceled' || !belongToCompanyId"
                                        @click="clickTapeBox(scope.row)">封箱/tapeBox</el-button>

                                <el-button size="mini" :disabled="!belongToCompanyId" @click="clickCancelBox(scope.row)">取消/cancel</el-button>
                            </div>
                            <div v-else>
                                <PrintBoxTag name="打印标签/printTag"  :boxData="scope.row.package_box"></PrintBoxTag>
                            </div>

                        </template>
                    </el-table-column>

                    <el-table-column label="创建时间/createTime">
                        <template slot-scope="scope">
                            {{scope.row.create_time|zerosoCompanyTime}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>


        <el-dialog title="批量修改发货日期" :visible.sync="changeAllDateShow" width="400px">
            <div class="padding-10">
                <el-date-picker
                        v-model="changeAllDateValue"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="付款日期">
                </el-date-picker>
            </div>
            <div slot="footer">
                <el-button type="success" size="mini" @click="changeAllDateShowSave()">保存</el-button>
                <el-button size="mini" @click="changeAllDateShow=false">取消</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>

    import OrderDetailStatusBox from "../../order/component/order-detail-status-box";
    import LogisticsType from "./component/logisticsType";

    export default {
        components: {LogisticsType, OrderDetailStatusBox},
        data() {
            return {
                queryId: '',
                isEdit: false,
                parentQuery: '',
                delivery_package_id: '',

                detailForm: {
                    partner_company: {},
                    receive_company: {},
                },
                detailFormRule: {
                    delivery_mail_no: [
                        {required: true, message: '请输入运单号/trackId！'}
                    ],
                },

                packageInfo: {},

                internalCompany: [],
                belongToCompanyId: null,
                sendToCompany: {},



                receivedList: [],

                changeAllDateShow: false,
                changeAllDateValue: null,

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

                    if (self.$route.query.delivery_package_id && self.$route.query.delivery_package_id !== 'undefined' && self.$route.query.delivery_package_id !== 'null') {
                        self.delivery_package_id = self.$route.query.delivery_package_id;
                        self.getDeliveryPackageInfo();
                    }
                } else {
                    self.queryId = '';
                    self.detailForm = {
                        partner_company: {},
                        receive_company: {},
                    };
                }
                self.receivedList=[];
            },
            getDetailData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_incoming_transfers + '/' + self.queryId,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            if (!data.msg.partner_company) data.msg.partner_company = {};
                            if (!data.msg.receive_company) data.msg.receive_company = {};
                            data.msg.name = data.msg.order_name;
                            if(data.msg.order_products){
                                for(let i=0;i<data.msg.order_products.length;i++){
                                    data.msg.order_products[i].isLocked=false;
                                    data.msg.order_products[i].changeDateShow=false;
                                    data.msg.order_products[i].forecast_received_date_copy=data.msg.order_products[i].forecast_received_date;
                                }
                            }
                            if(data.msg.pre_package_boxes){
                                for(let i=0;i<data.msg.pre_package_boxes.length;i++){
                                    if(data.msg.pre_package_boxes[i].package_box && data.msg.pre_package_boxes[i].package_box.next_company_id){
                                        for(let k=0;k<data.msg.route_map.length;k++){
                                            if(data.msg.route_map[k].account_company_id === data.msg.pre_package_boxes[i].package_box.next_company_id){
                                                data.msg.pre_package_boxes[i].package_box.next_company_name = data.msg.route_map[k].company_name
                                            }
                                        }
                                    }
                                }
                            }
                            self.detailForm = data.msg;
                            self.getAllInternalCompany();
                        }
                    }
                })
            },

            getAllInternalCompany() {
                let self = this;
                self.belongToCompanyId = null;
                self.sendToCompany = {};
                self.internalCompany = self.detailForm.route_map.filter(function (node) {
                    return node.company_type == 'internal';
                });
                if(self.internalCompany.length>0){
                    self.belongToCompanyId = self.internalCompany[0].account_company_id;

                    //如果最上游内部公司是sivi下游是zns 默认入库节点为zns
                    if (self.internalCompany[0].account_company_id === 4 && self.internalCompany[1].account_company_id === 9428) {
                        self.belongToCompanyId = self.internalCompany[1].account_company_id;
                    }
                    self.getNextNode();
                }

            },

            // 获取下一节点
            getNextNode() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_incoming_transfers + '/' + self.queryId + '/next_node',
                    type: 'GET',
                    data: {
                        incoming_transfer_id: self.detailForm.order_base_id,
                        belong_to_company_id: self.belongToCompanyId,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.sendToCompany = data.msg;
                        }
                    }
                })
            },

            //获取包裹信息
            getDeliveryPackageInfo() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_delivery_packages + '/' + self.delivery_package_id,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.packageInfo = data.msg;
                        }
                    }
                })
            },


            clickChangeDate(row){
                row.changeDateShow=true;
                row.forecast_received_date_copy = row.forecast_received_date
            },
            changeDateShowSave(row){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_incoming_transfers + '/' + self.queryId + '/order_product/'+row.id + '/received_date',
                    type: 'PUT',
                    requestBody:true,
                    data: {
                        new_date: row.forecast_received_date_copy,
                        incoming_transfer_id: self.queryId,
                        order_product_id: row.id,
                    },
                    success: function (data) {
                        self.loading = false;
                        if(data.msg){
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            self.getDetailData();
                            row.changeDateShow=false;
                        }
                    }
                })
            },

            clickChangeAllDate(){
                this.changeAllDateShow=true;
            },
            changeAllDateShowSave(){
                let self = this;
                if(!self.changeAllDateValue){
                    self.$message({
                        showClose: true,
                        message: '请选择日期！',
                        type: 'error'
                    });
                    return
                }
                self.loading = true;
                self.$http({
                    url: self.$api.order_incoming_transfers + '/' + self.queryId + '/batch_set_received_date',
                    type: 'PUT',
                    requestBody:true,
                    data: {
                        new_date: self.changeAllDateValue,
                        incoming_transfer_id: self.queryId,
                    },
                    success: function (data) {
                        self.loading = false;
                        if(data.msg){
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            self.getDetailData();
                            self.changeAllDateShow=false;
                        }
                    }
                })
            },

            productFileUploadSuccess($index){
              if(this.$refs['productFileShow'+$index]){
                  this.$refs['productFileShow'+$index].update();
              }
            },
            logisticsBoxFileUploadSuccess($index){
              if(this.$refs['logisticsBoxShow'+$index]){
                  this.$refs['logisticsBoxShow'+$index].update();
              }
            },



            lockInput(line) {
                let self=this;
                if((!line.net_weight || Number(line.net_weight)===0) && (!line.gross_weight || Number(line.gross_weight)===0) ){
                    self.$message({
                        showClose: true,
                        message: '净重, 毛重 至少填一项！',
                        type: 'error'
                    });
                    return
                }
                line.isLocked = true;
                self.receivedList.push(line);
                this.updateWeight(line);
            },
            updateWeight(line) {
                let self = this;
                self.$http({
                    url: self.$api.order_incoming_transfers + '/' + self.queryId + '/order_product/'+line.id,
                    type: 'PUT',
                    requestBody:true,
                    data: {
                        net_weight: line.net_weight,
                        gross_weight: line.gross_weight,
                        incoming_transfer_id: self.queryId,
                        order_product_id: line.id,
                    },
                    success: function (data) {
                        if(data.msg){
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                        }
                    }
                })
            },

            // 解锁箱子
            unLockInput(line) {
                let self=this;
                self.receivedList = self.receivedList.filter(function (item) {
                    return item.id !== line.id
                });
                line.isLocked = false;
            },


            preBoxedUp() {
                let self=this;
                const lines = [];
                self.receivedList.forEach((line)=>{
                    lines.push({
                        order_product_id : line.id,
                        received_quantity : line.received_quantity
                    });
                });
                self.loading = true;
                self.$http({
                    url: self.$api.order_incoming_transfers + '/' + self.queryId + '/boxes',
                    type: 'POST',
                    requestBody:true,
                    data:{
                        incoming_transfer_id: self.queryId,
                        delivery_package_id: self.delivery_package_id || null,
                        lines: lines
                    },
                    success: function (data) {
                        self.loading = false;
                        if(data.msg){
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            self.init();
                        }
                    }
                })
            },


            //点击封箱
            clickTapeBox(row){
                let self = this;
                self.$prompt('箱毛重(kg)/packG.W.', '封箱', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputType:'number',
                    inputValidator(value){
                        return !value ? '请填写箱毛重！' : true
                    }
                }).then(({ value }) => {
                    self.updateBoxAction(row,{
                        name: "confirm",
                        gross_weight: value,
                        delivery_package_id: row.delivery_package_id,
                    })
                }).catch(()=>{

                });
            },
            //点击封箱
            clickCancelBox(row){
                this.updateBoxAction(row,{
                    name: "cancel"
                })
            },

            updateBoxAction(row,data) {
                let self = this;
                self.$http({
                    url: self.$api.order_incoming_transfers + '/' + self.queryId + '/boxes/' + row.id + '/action',
                    type: 'PUT',
                    requestBody:true,
                    data: {
                        incoming_transfer_id: self.queryId,
                        belong_to_company_id: self.belongToCompanyId,
                        pre_box_id: row.id,
                        ...data
                    },
                    success: function (data) {
                        if(data.msg){
                            self.$message({
                                showClose: true,
                                message: '操作成功！',
                                type: 'success'
                            });
                            self.init();
                        }
                    }
                })
            },

        }
    }
</script>

<style lang="scss">
    .stockIn-detail{
        .table {
            border-collapse: collapse;
            width: 100%;

            th, td {
                width: 40%;
                text-align: left;
                padding: 4px 10px;
            }

            th {
                border: none;
            }

            td {
                background-color: #ffffff !important;
                border: 1px solid #dddddd;
            }

            th:last-child,
            td:last-child {
                width: 20%;
            }
        }
    }

</style>
