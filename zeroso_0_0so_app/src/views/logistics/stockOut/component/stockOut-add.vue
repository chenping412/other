<template>
    <div class="inline-block">
        <el-button type="primary" v-if="!buttonHidden" :disabled="stockOutDetail && stockOutDetail.state !== 'draft'" @click="clickAdd">
            {{title ? title : stockOutDetail ? '修改出库单': '新建出库单'}}
        </el-button>

        <el-dialog :title="title ? title : stockOutDetail ? '修改出库单': '新建出库单'" :visible.sync="dialogShow" width="1400px" top="40px"
                   :close-on-click-modal="false" v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="80px">
                <table class="stock-out-add-table">
                    <tbody>
                    <tr>
                        <td style="width: 25%;">
                            <el-form-item label="所在仓:" prop="belong_to_company_id">
                                <SelectInternalCompany
                                        :internalCompanyId.sync="addForm.belong_to_company_id"
                                        :disabled="!!stockOutDetail"
                                        @change="selectCompanyChange">
                                </SelectInternalCompany>
                            </el-form-item>
                            <el-form-item label="销售公司:" prop="sale_company_id">
                                <SelectInternalCompany
                                        :internalCompanyId.sync="addForm.sale_company_id"
                                        :disabled="!!stockOutDetail"
                                        @change="selectCompanyChange">
                                </SelectInternalCompany>
                            </el-form-item>
                            <el-form-item label="发货至:" prop="send_to_company_id">
                                <SelectPartnerCompanyOnly
                                        :partnerId.sync="addForm.send_to_company_id"
                                        :partner="addForm.send_to_company"
                                        :option="addForm.send_to_company?[addForm.send_to_company]:null"
                                        :disabled="!!stockOutDetail"
                                        @change="selectCompanyChange">
                                </SelectPartnerCompanyOnly>
                            </el-form-item>

                            <div class="stock-out-add-pallet">
                                <h4>发货托盘</h4>
                                <div>
                                    <el-tag size="medium" v-for="(pallet,$index) in selectedPallets" :key="$index">
                                        <span>{{pallet.pallet_name}}</span>
                                        <el-tag size="mini" type="warning" v-if="pallet.logistics_custom_type">{{pallet.logistics_custom_type}}</el-tag>
                                        <i class="el-icon-close cursor-pointer" @click="delPallets($index)"> </i>
                                    </el-tag>
                                </div>
                            </div>

                            <div class="stock-out-add-pallet">
                                <h4>不发货托盘</h4>
                                <div>
                                    <el-tag size="medium" v-for="(pallet,$index) in availablePallets" :key="$index">
                                        <span>{{pallet.pallet_name}}</span>
                                        <el-tag size="mini" type="warning" v-if="pallet.logistics_custom_type">{{pallet.logistics_custom_type}}</el-tag>
                                        <i class="el-icon-plus cursor-pointer" @click="addPallets($index)"> </i>
                                    </el-tag>
                                </div>
                            </div>

                        </td>
                        <td>
                            <h4>发货的箱</h4>
                            <el-table :data="selectedBoxes" height="550px">
                                <el-table-column label="订单" width="90">
                                    <template slot-scope="scope">
                                        <p>{{scope.row.order_name}}</p>
                                        <i class="el-icon-close el-icon-normal cursor-pointer" @click="delOrder(scope.row.order_name,scope.$index)"> </i>
                                    </template>
                                </el-table-column>
                                <el-table-column label="全部到货" width="90">
                                    <template slot-scope="scope">
                                        {{scope.row.is_box_approach?'是':'否'}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="收款情况" width="90">
                                    <template slot-scope="scope">
                                        <el-tag v-if="scope.row.payment_status==='invoiced_payment'" type="info">后付款</el-tag>
                                        <el-tag v-if="scope.row.payment_status==='partial'" type="danger">部分收款</el-tag>
                                        <el-tag v-if="scope.row.payment_status==='no_receipt'" type="danger">未收款</el-tag>
                                        <el-tag v-if="scope.row.payment_status==='receipt'" type="success">已收款</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="相关箱">
                                    <template slot-scope="scope">
                                        <p v-for="(box,$index) in scope.row.boxes" :key="$index">
                                            <el-tag size="medium">
                                                <span>{{box.box_name}}</span>
                                                <el-tag size="mini" type="warning" v-if="box.logistics_custom_type">{{box.logistics_custom_type}}</el-tag>
                                                <i class="el-icon-close cursor-pointer" @click="delBox(box,scope.row.order_name,scope.$index,$index)"> </i>
                                            </el-tag>
                                        </p>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </td>
                        <td>
                            <h4>不发货的箱</h4>
                            <el-table :data="availableBoxes" height="550px">
                                <el-table-column label="订单" width="90">
                                    <template slot-scope="scope">
                                        <p>{{scope.row.order_name}}</p>
                                        <i class="el-icon-plus el-icon-normal cursor-pointer" @click="addOrder(scope.row.order_name,scope.$index)"> </i>
                                    </template>
                                </el-table-column>
                                <el-table-column label="全部到货" width="90">
                                    <template slot-scope="scope">
                                        {{scope.row.is_box_approach?'是':'否'}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="收款情况" width="90">
                                    <template slot-scope="scope">
                                        <el-tag v-if="scope.row.payment_status==='invoiced_payment'" type="info">后付款</el-tag>
                                        <el-tag v-if="scope.row.payment_status==='partial'" type="danger">部分收款</el-tag>
                                        <el-tag v-if="scope.row.payment_status==='no_receipt'" type="danger">未收款</el-tag>
                                        <el-tag v-if="scope.row.payment_status==='receipt'" type="success">已收款</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="相关箱">
                                    <template slot-scope="scope">
                                        <p v-for="(box,$index) in scope.row.boxes" :key="$index">
                                            <el-tag size="medium">
                                                <span>{{box.box_name}}</span>
                                                <el-tag size="mini" type="warning" v-if="box.logistics_custom_type">{{box.logistics_custom_type}}</el-tag>
                                                <i class="el-icon-plus cursor-pointer" @click="addBox(box,scope.row.order_name,scope.$index,$index)"> </i>
                                            </el-tag>
                                        </p>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['title', 'stockOutDetail','buttonHidden'],
        data() {
            return {
                loading: false,
                dialogShow: false,
                addForm: {
                    belong_to_company_id: null,
                    sale_company_id: null,
                    send_to_company_id: null,
                },
                addFormRule: {
                    belong_to_company_id: [
                        {required: true, message: '请选择所在仓！'}
                    ],
                    send_to_company_id: [
                        {required: true, message: '请选择发货至！'}
                    ],
                },

                selectedBoxes: [],
                availableBoxes: [],

                selectedPallets: [],
                availablePallets: [],

                isSameOrder:false,

            }
        },
        created() {

        },
        methods: {
            clickAdd() {
                this.selectedBoxes = [];
                this.availableBoxes = [];
                this.selectedPallets = [];
                this.availablePallets = [];

                if(this.stockOutDetail){
                    this.addForm = {
                        id: this.stockOutDetail.id,
                        belong_to_company_id: this.stockOutDetail.belong_to_company_id,
                        sale_company_id: this.stockOutDetail.sale_company_id,
                        send_to_company_id: this.stockOutDetail.send_to_company_id,
                        send_to_company: this.stockOutDetail.send_to_company,
                    };
                    this.selectedPallets = this.stockOutDetail.pallet_list ? JSON.parse(JSON.stringify(this.stockOutDetail.pallet_list)) : [];
                    this.getSelectBoxList();
                    this.getAvailableBoxList();
                    this.getAvailablePalletsList();
                }else {
                    this.addForm = {
                        belong_to_company_id: null,
                        sale_company_id: null,
                        send_to_company_id: null,
                    };
                }
                this.dialogShow = true;
                this.$nextTick(() => {
                    this.$refs.form.clearValidate();
                })
            },

            boxAddStockOut(stockOutAddForm,selectedBoxes){
                let self=this;
                this.selectedBoxes = [];
                this.availableBoxes = [];
                this.selectedPallets = [];
                this.availablePallets = [];
                this.addForm = {
                    belong_to_company_id: stockOutAddForm.belong_to_company_id,
                    sale_company_id: stockOutAddForm.sale_company_id,
                    send_to_company_id: stockOutAddForm.send_to_company_id,
                    send_to_company: stockOutAddForm.send_to_company,
                };
                this.getAvailableBoxList(()=>{
                    self.selectedBoxes = [];
                    selectedBoxes.forEach((selectBox)=>{
                        self.availableBoxes.forEach((order,orderIndex)=>{
                            if(order.boxes){
                                order.boxes.forEach((box,boxIndex)=>{
                                    if(box.id === selectBox.id){
                                        self.addBox(box,order.order_name,orderIndex,boxIndex)
                                    }
                                })
                            }
                        })
                    })
                });

                this.getAvailablePalletsList();
                this.dialogShow = true;
                this.$nextTick(() => {
                    this.$refs.form.clearValidate();
                })
            },


            selectCompanyChange(){
                this.selectedBoxes = [];
                this.availableBoxes = [];
                this.selectedPallets = [];
                this.availablePallets = [];
                this.getAvailableBoxList();
                this.getAvailablePalletsList();
            },
            //获取发货的箱
            getSelectBoxList() {
                let self = this;
                if (self.stockOutDetail.id) {
                    self.selectedBoxes = [];
                    self.loading = true;
                    self.$http({
                        url: self.$api.order_outgoing_transfers + '/'+self.stockOutDetail.id+'/get_boxes_grouped',
                        type: 'GET',
                        data: {
                            belong_to_company_id: self.addForm.belong_to_company_id,
                            send_to_company_id: self.addForm.send_to_company_id,
                        },
                        success: function (data) {
                            self.loading = false;
                            if (data.msg) {
                                self.selectedBoxes = data.msg;
                                self.sameOrder();
                            }
                        }
                    })
                }
            },
            //获取不发货的箱
            getAvailableBoxList(callBack) {
                let self = this;
                if (self.addForm.belong_to_company_id && self.addForm.send_to_company_id) {
                    self.availableBoxes = [];
                    self.loading = true;
                    self.$http({
                        url: self.$api.order_boxes_available_boxes,
                        type: 'GET',
                        data: {
                            belong_to_company_id: self.addForm.belong_to_company_id,
                            send_to_company_id: self.addForm.send_to_company_id,
                        },
                        success: function (data) {
                            self.loading = false;
                            if (data.msg.items) {
                                self.availableBoxes = data.msg.items;
                                if(callBack) callBack();
                            }
                        }
                    })
                }
            },

            //获取不发货托盘
            getAvailablePalletsList() {
                let self = this;
                if (self.addForm.belong_to_company_id && self.addForm.send_to_company_id) {
                    self.availableBoxes = [];
                    self.loading = true;
                    self.$http({
                        url: self.$api.order_pallets_available_pallets,
                        type: 'GET',
                        data: {
                            belong_to_company_id: self.addForm.belong_to_company_id,
                            sale_company_id: self.addForm.sale_company_id,
                            send_to_company_id: self.addForm.send_to_company_id,
                        },
                        success: function (data) {
                            self.loading = false;
                            if (data.msg.items) {
                                self.availablePallets = data.msg.items;
                            }
                        }
                    })
                }
            },


            addBox(box, orderName, orderIndex, boxIndex) {
                let self=this;
                let selectOrderIndex = null;
                self.selectedBoxes.forEach(function (order, index) {
                    if (order.order_name === orderName) {
                        selectOrderIndex = index
                    }
                });
                if (selectOrderIndex !== null) {
                    self.selectedBoxes[selectOrderIndex].boxes.push(box);
                    self.availableBoxes[orderIndex].boxes.splice(boxIndex, 1);
                    if (!self.availableBoxes[orderIndex].boxes.length) {
                        self.availableBoxes.splice(orderIndex, 1)
                    }
                } else {
                    let value = JSON.parse(JSON.stringify(self.availableBoxes[orderIndex]));
                    value.boxes = [box];
                    self.selectedBoxes.push(value);
                    self.availableBoxes[orderIndex].boxes.splice(boxIndex, 1);
                    if (!self.availableBoxes[orderIndex].boxes.length) {
                        self.availableBoxes.splice(orderIndex, 1)
                    }
                }
                self.sameOrder()
            },
            delBox(box, orderName, orderIndex, boxIndex) {
                let self=this;
                let availableOrderIndex = null;
                self.availableBoxes.forEach(function (order, index) {
                    if (order.order_name === orderName) {
                        availableOrderIndex = index
                    }
                });
                if (availableOrderIndex !== null) {
                    self.availableBoxes[availableOrderIndex].boxes.push(box);
                    self.selectedBoxes[orderIndex].boxes.splice(boxIndex, 1);
                    if (!self.selectedBoxes[orderIndex].boxes.length) {
                        self.selectedBoxes.splice(orderIndex, 1)
                    }
                } else {
                    let value = JSON.parse(JSON.stringify(self.selectedBoxes[orderIndex]));
                    value.boxes = [box];
                    self.availableBoxes.push(value);
                    self.selectedBoxes[orderIndex].boxes.splice(boxIndex, 1);
                    if (!self.selectedBoxes[orderIndex].boxes.length) {
                        self.selectedBoxes.splice(orderIndex, 1)
                    }
                }
                self.sameOrder()
            },
            sameOrder() {
                let self=this;
                self.isSameOrder = false;
                self.selectedBoxes.forEach(function (order1) {
                    self.availableBoxes.forEach(function (order2) {
                        if (order1.order_name === order2.order_name) {
                            self.isSameOrder = true;
                            order1.sameOrder = true;
                            order2.sameOrder = true;
                        }
                    })
                })
            },
            addOrder(orderName, orderIndex) {
                let self=this;
                if (self.availableBoxes[orderIndex].boxes && !self.availableBoxes[orderIndex].boxes.length) return null;
                let selectOrderIndex = null;
                self.selectedBoxes.forEach(function (order, index) {
                    if (order.order_name === orderName) {
                        selectOrderIndex = index
                    }
                });
                if (selectOrderIndex !== null) {
                    self.selectedBoxes[selectOrderIndex].boxes = self.selectedBoxes[selectOrderIndex].boxes.concat(self.availableBoxes[orderIndex].boxes);
                    self.availableBoxes.splice(orderIndex, 1)
                } else {
                    self.selectedBoxes.push(self.availableBoxes.splice(orderIndex, 1)[0]);
                }
            },
            delOrder(orderName, orderIndex) {
                let self=this;
                let selectOrderIndex = null;
                self.availableBoxes.forEach(function (order, index) {
                    if (order.order_name === orderName) {
                        selectOrderIndex = index
                    }
                });
                if (selectOrderIndex !== null) {
                    self.availableBoxes[selectOrderIndex].boxes = self.availableBoxes[selectOrderIndex].boxes.concat(self.selectedBoxes[orderIndex].boxes);
                    self.selectedBoxes.splice(orderIndex, 1)
                } else {
                    self.availableBoxes.push(self.selectedBoxes.splice(orderIndex, 1)[0]);
                }
            },

            addPallets(index) {
                if (this.availablePallets[index].boxes && !this.availablePallets[index].boxes.length) return null;
                this.selectedPallets.push(this.availablePallets[index]);
                this.availablePallets.splice(index, 1)
            },
            delPallets(index) {
                this.availablePallets.push(this.selectedPallets[index]);
                this.selectedPallets.splice(index, 1)
            },





            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        let box_ids=[];
                        self.selectedBoxes.forEach((item)=>{
                            item.boxes.forEach((box)=>{
                                box_ids.push(box.id)
                            })
                        });
                        let pallet_ids=[];
                        self.selectedPallets.forEach((item)=>{
                            pallet_ids.push(item.id)
                        });
                        if(box_ids.length===0 && pallet_ids.length===0){
                            self.$message({
                                showClose: true,
                                message: '未选择 发货的箱 或 发货托盘！',
                                type: 'error'
                            });
                            return
                        }

                        self.loading = true;
                        if(!self.addForm.sale_company_id) self.addForm.sale_company_id = undefined;

                        self.$http({
                            url: self.$api.order_outgoing_transfers + (self.addForm.id ? '/' + self.addForm.id : ''),
                            type: self.addForm.id ? 'PUT' : 'POST',
                            requestBody: true,
                            data: {
                                box_ids:box_ids,
                                pallet_ids:pallet_ids,
                                ...self.addForm
                            },
                            success: function (data) {
                                self.loading = false;
                                if (data.msg && data.msg.id) {
                                    self.$message({
                                        showClose: true,
                                        message: '操作成功！',
                                        type: 'success'
                                    });
                                    self.dialogShow = false;

                                    if (self.addForm.id) {
                                        self.$emit('update')
                                    } else {
                                        self.$router.push({
                                            path: '/logistics/stockOut/detail',
                                            query: {
                                                id: data.msg.id
                                            }
                                        });
                                    }
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


        },
    }
</script>

<style lang="scss" scoped>
    .stock-out-add-pallet{
        height: 210px;
        border-top: 1px solid #dddddd;
        overflow-y: auto;
        h4{
            padding: 5px 0;
        }
    }
    .stock-out-add-table {
        table-layout: fixed;
        width: 100%;
        border-collapse: collapse;
        td {
            vertical-align: top;
            width: 33.33%;
            border: 1px solid #dddddd;
            padding: 10px;
        }
    }
</style>