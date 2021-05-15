<template>
    <div class="order-detail-company-line margin-bottom-20" v-loading="loading">
        <el-card style="overflow: inherit;">
            <h3 slot="header">公司</h3>
            <div class="list-box padding-bottom-20 clearfix">
                <table class="table route_map">
                    <tbody>
                    <tr v-for="(item,$index) in route_map" :key="$index"
                        :class="{'active': currentRouteMap.account_company_id === item.account_company_id}">
                        <td>
                            <router-link class="nowrap" target="_blank" :to="'/partner/detail?id='+item.account_company_id"
                                :title="item.company_name +  (item.name ? '，'+item.name : '') + '，' + item.country">
                                <span>{{item.company_name | mainCompanyAbbreviationCode(item.account_company_id)}}</span>
                                <CompanyType :type="item.company_type"></CompanyType>
                                <span v-if="item.name">，{{item.name}}</span>
                                <span v-if="$index === 0 && item.company_type!=='internal'">，{{item.country | country}}
                                </span>
                            </router-link>

                            <i class="el-icon-circle-plus-outline el-icon-normal cursor-pointer add-up" title="添加"
                               v-if="(currentRouteMap.id === item.id || ($index===0 && item.company_type==='internal')) && orderData.order_type!=='merged'"
                               @click="clickCompanyAdd($index,'up')"></i>

                            <i class="el-icon-circle-plus-outline el-icon-normal cursor-pointer add-down" title="添加"
                               v-if="currentRouteMap.id === item.id && orderData.order_type!=='merged'"
                               @click="clickCompanyAdd($index,'down')"></i>
                        </td>
                        <td width="120px" style="text-align: right;">
                            <el-tag type="danger" effect="dark" size="mini" v-if="item.supplier_pickup_method && $index === 0">
                                {{zerosoSupplierDeliveryOrderIcon(item.supplier_pickup_method)}}
                            </el-tag>

                            <i class="el-icon-message el-icon-normal cursor-pointer"
                               title="发邮件"
                               v-if="item.company_type!=='internal'"
                               @click="clickWriteEmail(item)">
                            </i>
                            <i class="el-icon-chat-dot-square el-icon-normal cursor-pointer color-danger"
                               title="发消息"
                               v-if="item.company_type==='internal' || ($index===route_map.length-1 && item.company_type==='little_v')"
                               @click="clickSendMessage()">
                            </i>

                            <i class="el-icon-edit-outline el-icon-normal cursor-pointer" title="编辑"
                               v-if="currentRouteMap.id === item.id || currentRouteMap.id === item.in_order_node_id || currentRouteMap.id === item.out_order_node_id"
                                @click="clickCompanyEdit(item)"></i>

                            <i class="el-icon-delete el-icon-normal cursor-pointer"  title="删除"
                               v-if="(currentRouteMap.id === item.in_order_node_id || currentRouteMap.id === item.out_order_node_id) && orderData.order_type!=='merged'"
                                @click="clickCompanyDelete(item)"></i>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <table class="table order_nodes" v-if="order_nodes.length>0">
                    <thead>
                    <tr>
                        <th width="40px"></th>
                        <th>订单状态</th>
                        <th>货币</th>
                        <th>税率</th>
                        <th>未税金额</th>
                        <th>含税总额</th>
                        <th>付款方式</th>
                        <th>询报价单发货方式</th>
                        <th style="width: 0;position: relative"></th>
                    </tr>
                    </thead>
                    <tbody>
                        <template v-for="(item,$index) in order_nodes">
                            <tr :key="$index"
                                :class="{'background-red':$index===0 && item.account_company.company_type!=='internal' && Number(item.untaxed_amount)>=Number(order_nodes[$index+1].untaxed_amount)}"
                                v-if="$index < order_nodes.length-1"
                                @mouseover="tiggerNodeInfoShow(item,true)"
                                @mouseout="tiggerNodeInfoShow(item,false)">
                                <td width="40px"><el-tag type="danger" v-if="item.is_hot">催</el-tag></td>
                                <td>
                                    <el-popover placement="bottom-start" width="400">
                                        <div slot="reference" class="inline-block cursor-pointer">
                                            <span class="inline-block" style="min-width: 100px;">
                                                <el-tag :type="stateColor[item.state]">{{item.state | zerosoOrderNodeStatus}}</el-tag>
                                            </span>
                                            <span v-if="item.node_state_time.length>0">{{item.node_state_time[item.node_state_time.length-1].state_time | zerosoDateFormat}}</span>
                                            <i class="el-icon-caret-bottom"></i>
                                        </div>
                                        <table v-if="item.node_state_time.length>0">
                                            <tbody>
                                            <tr v-for="(item,$index) in item.node_state_time" :key="$index">
                                                <td><el-tag :type="stateColor[item.state_name]">{{item.state_name | zerosoOrderStateActions}}时间</el-tag></td>
                                                <td><span class="margin-left-10">{{item.state_time | zerosoTimeFormat(8)}}</span></td>
                                                <td><span class="margin-left-10" v-if="item.account_user">{{item.account_user.name}}</span></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </el-popover>
                                </td>
                                <td>{{item.currency}}</td>
                                <td>{{item.tax_rate}}%</td>
                                <td>{{item.untaxed_amount | isoCurrency(item.currency)}}</td>
                                <td>
                                    <span>{{item.total_amount | isoCurrency(item.currency)}}</span>
                                </td>
                                <td>{{item.payment_method | paymentMethod}}</td>
                                <td>{{item.delivery_method | orderDeliveryMethod | defaultStr}}</td>
                                <td style="width: 0;position: relative;">
                                    <order-detail-company-line-node-info
                                            :queryId="queryId"
                                            @updateInit="$emit('updateInit')"
                                            v-show="item.nodeInfoShow"
                                            :orderData="orderData"
                                            :node.sync="item"
                                            :$index="$index"
                                            :nextNode="order_nodes[$index+1]">
                                    </order-detail-company-line-node-info>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </el-card>



        <el-dialog :title="companyEditForm.isAdd?'添加公司':'编辑公司'" :visible.sync="companyEditDialogShow" width="550px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="companyEditForm" label-width="80px" label-position="left">
                <el-form-item label="公司名">
                    <SelectPartner
                            :partnerId.sync="companyEditForm.account_user_id"
                            :companyId.sync="companyEditForm.account_company_id"
                            :partner="companyEditForm.companyOld"
                            :option="companyEditForm.account_company_id?[companyEditForm.companyOld]:null"
                            :data="{
                                internal_only: companyEditForm.internal_only,
                                is_order: true
                            }"
                            @change="companyChange">
                    </SelectPartner>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <partner-add class="left" title="新建公司" v-if="!companyEditForm.internal_only"></partner-add>
                <el-button type="primary" @click="companyEditSave()">保 存</el-button>
                <el-button @click="companyEditDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>


        <el-dialog title="删除公司" :visible.sync="companyDeleteDialogShow" width="550px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form label-width="110px">
                <el-form-item label="公司名">
                    <span v-if="companyDeleteForm.company">
                        {{companyDeleteForm.company.company_name}}
                    </span>
                </el-form-item>
                <el-form-item label="对上游订单" v-if="companyDeleteForm.up && JSON.stringify(companyDeleteForm.up) !== '{}'">
                    <p v-if="companyDeleteForm.up.payment_method">
                        <span>付款方式：</span>
                        <span>{{companyDeleteForm.up.payment_method.origin_value | paymentMethod}}</span>
                        <span style="margin: 0 10px;">--></span>
                        <span class="red">{{companyDeleteForm.up.payment_method.new_value | paymentMethod}}</span>
                    </p>
                    <p v-if="companyDeleteForm.up.service_rate">
                        <span>服务费率：</span>
                        <span>{{companyDeleteForm.up.service_rate.origin_value}}%</span>
                        <span style="margin: 0 10px;">--></span>
                        <span class="red">{{companyDeleteForm.up.service_rate.new_value}}%</span>
                    </p>
                    <p v-if="companyDeleteForm.up.tax_rate">
                        <span>税率：</span>
                        <span>{{companyDeleteForm.up.tax_rate.origin_value}}%</span>
                        <span style="margin: 0 10px;">--></span>
                        <span class="red">{{companyDeleteForm.up.tax_rate.new_value}}%</span>
                    </p>
                    <p>
                        <el-checkbox v-model="companyDeleteForm.is_refresh_up_node_param">更新参数</el-checkbox>
                    </p>
                </el-form-item>
                <el-form-item label="对下游订单" v-if="companyDeleteForm.down && JSON.stringify(companyDeleteForm.down) !== '{}'">
                    <p v-if="companyDeleteForm.down.payment_method">
                        <span>付款方式：</span>
                        <span>{{companyDeleteForm.down.payment_method.origin_value | paymentMethod}}</span>
                        <span style="margin: 0 10px;">--></span>
                        <span class="red">{{companyDeleteForm.down.payment_method.new_value | paymentMethod}}</span>
                    </p>
                    <p v-if="companyDeleteForm.down.service_rate">
                        <span>服务费率：</span>
                        <span>{{companyDeleteForm.down.service_rate.origin_value}}%</span>
                        <span style="margin: 0 10px;">--></span>
                        <span class="red">{{companyDeleteForm.down.service_rate.new_value}}%</span>
                    </p>
                    <p v-if="companyDeleteForm.down.tax_rate">
                        <span>税率：</span>
                        <span>{{companyDeleteForm.down.tax_rate.origin_value}}%</span>
                        <span style="margin: 0 10px;">--></span>
                        <span class="red">{{companyDeleteForm.down.tax_rate.new_value}}%</span>
                    </p>
                    <p>
                        <el-checkbox v-model="companyDeleteForm.is_refresh_down_node_param">更新参数</el-checkbox>
                    </p>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="companyDeleteSave()">删 除</el-button>
                <el-button @click="companyDeleteDialogShow = false">取 消</el-button>
            </div>
        </el-dialog>


        <edit-email :show.sync="editEmailShow" :emailTemplate="emailTemplate"></edit-email>

    </div>
</template>

<script>


    import OrderDetailCompanyLineNodeInfo from "./order-detail-company-line-node-info";
    import PartnerAdd from "../../partner/component/partner-add";
    import EditEmail from "../../email/editEmail";

    export default {
        components: {EditEmail, PartnerAdd, OrderDetailCompanyLineNodeInfo},
        props:['orderData','queryId','orderNodesMaps'],
        data() {
            return {
                route_map:[],
                currentRouteMap:{},

                order_nodes:[],


                stateColor: {
                    'draft': 'warning',
                    'waiting_quote': 'warning',
                    'mutually_confirm': 'warning',
                    'cancelled': 'info',

                },

                companyEditDialogShow: false,
                companyEditForm: {},

                companyDeleteDialogShow: false,
                companyDeleteForm: {},


                editEmailShow:false,
                emailTemplate:{},
                
                loading: false,
            }
        },
        computed:{

        },
        watch: {
            'orderData'() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if(this.orderData){
                    this.route_map = this.orderData.route_map ? JSON.parse(JSON.stringify(this.orderData.route_map)) : [];
                    this.order_nodes = this.orderData.order_nodes ? JSON.parse(JSON.stringify(this.orderData.order_nodes)) : [];

                    this.route_map.forEach((item)=>{
                        if(this.$store.state.currentCompany.account_company_id === item.account_company_id){
                            this.currentRouteMap = item;
                        }
                    })
                }
            },

            clickCompanyAdd($index,direction){
                let item = this.route_map[$index];
                let order_node_id=this.route_map[$index].id;
                let supplier_order_node_id=null;
                let internal_only=item.company_type==='internal';
                if(direction==='up'){
                    if($index>0){
                        supplier_order_node_id = this.route_map[$index-1].id;
                    }else {
                        internal_only=false;
                    }
                }else if(direction==='down'){
                    supplier_order_node_id = this.route_map[$index].id;
                    if($index===this.route_map.length-1){
                        internal_only=false;
                    }
                }

                this.companyEditDialogShow=true;
                this.companyEditForm={
                    isAdd:true,
                    order_id:this.queryId,
                    order_node_id:order_node_id,
                    supplier_order_node_id:supplier_order_node_id,
                    internal_only: internal_only,
                    is_refresh_up_node_param: true,
                    is_refresh_down_node_param: true,
                    account_user_id:null,
                    account_company_id:null,
                    companyOld:null
                };
            },
            clickCompanyEdit(item){
                this.companyEditDialogShow=true;
                this.companyEditForm={
                    isAdd:false,
                    order_id:this.queryId,
                    order_node_id:item.id,
                    account_user_id:item.account_user_id,
                    account_company_id:item.account_company_id,
                    is_refresh_up_node_param: true,
                    is_refresh_down_node_param: true,
                    internal_only: item.company_type==='internal',
                    companyOld:{
                        account_company_id: item.account_company_id,
                        account_user_id: item.account_user_id,
                        name: item.name,
                        company_name: item.company_name,
                    }
                };
            },
            companyChange(id,item){
                this.companyEditForm.account_company_id=item.account_company_id;
            },
            companyEditSave(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_order_orders + '/' + self.queryId + '/companies',
                    type: self.companyEditForm.isAdd ? 'POST' : 'PUT',
                    requestBody: true,
                    data: self.companyEditForm,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.companyEditDialogShow = false;
                            self.$emit('updateInit');
                        } else {
                            self.$message({
                                showClose: true,
                                message: '保存失败！',
                                type: 'error'
                            });
                        }
                    }
                });
            },

            clickWriteEmail(item){
                this.emailTemplate = {
                    mail_to: item.email ? [item.email] : [],
                    mail_cc: [],
                    mail_bcc: [],
                    message_subject: '',
                    mail_from: '',
                    updateFiles: [],
                    message_body_html: '',

                    isAdd:true,
                };
                this.editEmailShow=true;
            },
            clickSendMessage(){
                let href = '#/related/message?orderName=' +this.orderData.name;
                window.open(href);
            },


            clickCompanyDelete(item){
                let self = this;
                self.$http({
                    url: self.$api.order_order_orders + '/' + self.queryId + '/order_node_change',
                    data:{
                        method: 'delete',
                        origin_node_id: item.id,
                    },
                    success: function (data) {
                        if (data.msg) {
                            data.msg.company={
                                account_company_id: item.account_company_id,
                                account_user_id: item.account_user_id,
                                name: item.name,
                                company_name: item.company_name,
                            };
                            data.msg.is_refresh_down_node_param= true;
                            data.msg.is_refresh_up_node_param= true;
                            data.msg.order_node_id= item.id;

                            self.companyDeleteForm = data.msg;
                            self.companyDeleteDialogShow=true;
                        }
                    }
                });
            },
            companyDeleteSave(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.order_order_orders + '/' + self.queryId + '/companies',
                    type: 'DELETE',
                    requestBody: true,
                    data: {
                        order_node_id:self.companyDeleteForm.order_node_id,
                        is_refresh_up_node_param:self.companyDeleteForm.is_refresh_up_node_param,
                        is_refresh_down_node_param:self.companyDeleteForm.is_refresh_down_node_param,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '删除成功！',
                                type: 'success'
                            });
                            self.companyDeleteDialogShow = false;
                            self.$emit('updateInit');
                        } else {
                            self.$message({
                                showClose: true,
                                message: '保存失败！',
                                type: 'error'
                            });
                        }
                    },error(){
                        self.companyDeleteDialogShow = false;
                    }
                });
            },





            tiggerNodeInfoShow(item,nodeInfoShow){
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    for(let i=0;i<this.order_nodes.length;i++){
                        this.order_nodes[i].nodeInfoShow=false;
                    }
                    item.nodeInfoShow = nodeInfoShow;
                },300)
            },


            zerosoSupplierDeliveryOrderIcon (value) {
                let result = {
                    "supplier_delivery": '发',
                    "ups_pickup": 'U',
                    "dhl_pickup": 'D',
                    "unknown": '未'
                };
                return result[value] || value
            },
        }
    }
</script>

<style lang="scss">
    @import "../../../assets/css/config";
.order-detail-company-line{
    .list-box{
        position: relative;
        .table{
            border-collapse: collapse;
            th,td{
                border-bottom: 1px solid #dddddd;
                padding:0 10px;
                height: 48px;
                white-space: nowrap;
                text-align: left;
            }
            td{
                border-top: 1px solid #dddddd;
            }
            tr:hover td{
                background-color: #f5f7fa;
            }
        }
        .route_map{
            width: 30%;
            float: left;
            margin-top: 24px;
            table-layout: fixed;
            td{
                background-color: #f5f5f5;
                position: relative;
                .add-up,
                .add-down{
                    position: absolute;
                    right: 0;
                    z-index: 9;
                    display: none;
                }
                .add-up{
                    top: -10px;
                }
                .add-down{
                    bottom: -10px;
                }
            }
            .active td{
                background-color: #ffffff;
            }
            tr:hover{
                td {
                    .add-up,
                    .add-down{
                        display: block;
                    }
                }
            }
        }
        .order_nodes{
            width: 70%;
            float: left;
            position: relative;
            /*.order-detail-company-line-node-info{*/
            /*    display: none;*/
            /*}*/
            /*tr:hover .order-detail-company-line-node-info{*/
            /*    display: block;*/
            /*}*/
            .background-red td{
                background-color: #ff8787 !important;
            }

        }
    }

}
</style>
