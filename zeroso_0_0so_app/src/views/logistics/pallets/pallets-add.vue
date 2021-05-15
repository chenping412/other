<template>
    <div class="inline-block">
        <el-button type="primary" @click="clickAdd">{{title ? title : palletsDetail ? '修改托盘': '新建托盘'}}</el-button>

        <el-dialog :title="title ? title : palletsDetail ? '修改托盘': '新建托盘'" :visible.sync="dialogShow" width="1400px" top="40px"
                   :close-on-click-modal="false" v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="70px">
                <table class="pallets-add-table">
                    <tbody>
                    <tr>
                        <td style="width: 25%;">
                            <el-form-item label="所在仓:" prop="belong_to_company_id">
                                <SelectInternalCompany
                                        :disabled="!!palletsDetail"
                                        :internalCompanyId.sync="addForm.belong_to_company_id"
                                        @change="selectCompanyChange">
                                </SelectInternalCompany>
                            </el-form-item>
                            <el-form-item label="发货至:" prop="send_to_company_id">
                                <SelectInternalCompany
                                        :disabled="!!palletsDetail"
                                        :internalCompanyId.sync="addForm.send_to_company_id"
                                        @change="selectCompanyChange">
                                </SelectInternalCompany>
                            </el-form-item>
                            <el-form-item label="长宽高(mm)" prop="length">
                                <InputNumber :value.sync="addForm.length" :integer="true" placeholder="长"></InputNumber>
                                <InputNumber :value.sync="addForm.width" :integer="true" placeholder="宽"></InputNumber>
                                <InputNumber :value.sync="addForm.height" :integer="true" placeholder="高"></InputNumber>
                            </el-form-item>
                            <el-form-item label="毛重(kg)" prop="weight">
                                <InputNumber :value.sync="addForm.weight"></InputNumber>
                            </el-form-item>
                        </td>
                        <td>
                            <h3>发货的箱</h3>
                            <el-table :data="selectedBoxes" height="550px">
                                <el-table-column label="订单" prop="order_name" width="90"></el-table-column>
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
                            <h3>不发货的箱</h3>
                            <el-table :data="availableBoxes" height="550px">
                                <el-table-column label="订单" prop="order_name" width="90"></el-table-column>
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
        props: ['title', 'palletsDetail'],
        data() {
            return {
                loading: false,
                dialogShow: false,
                addForm: {
                    belong_to_company_id: null,
                    send_to_company_id: null,
                    height: null,
                    length: null,
                    width: null,
                    weight: null,
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

                isSameOrder:false,

            }
        },
        created() {

        },
        methods: {
            clickAdd() {
                this.selectedBoxes = [];
                this.availableBoxes = [];
                if(this.palletsDetail){
                    this.addForm = {
                        id: this.palletsDetail.id,
                        belong_to_company_id: this.palletsDetail.belong_to_company_id,
                        send_to_company_id: this.palletsDetail.send_to_company_id,
                        height: this.palletsDetail.height,
                        length: this.palletsDetail.length,
                        width: this.palletsDetail.width,
                        weight: this.palletsDetail.weight,
                    };
                    this.getSelectBoxList();
                    this.getAvailableBoxList();
                }else {
                    this.addForm = {
                        belong_to_company_id: null,
                        send_to_company_id: null,
                        height: null,
                        length: null,
                        width: null,
                        weight: null,
                    };
                }
                this.dialogShow = true;
                this.$nextTick(() => {
                    this.$refs.form.clearValidate();
                })
            },

            selectCompanyChange(){
                this.selectedBoxes = [];
                this.availableBoxes = [];
                this.getAvailableBoxList();
            },
            //获取发货的箱
            getSelectBoxList() {
                let self = this;
                if (self.palletsDetail.id) {
                    self.loading = true;
                    self.$http({
                        url: self.$api.order_pallets + '/'+self.palletsDetail.id+'/get_boxes_grouped',
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
            getAvailableBoxList() {
                let self = this;
                if (self.addForm.belong_to_company_id && self.addForm.send_to_company_id) {
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



            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        let box_list=[];
                        self.selectedBoxes.forEach((item)=>{
                            item.boxes.forEach((box)=>{
                                box_list.push(box)
                            })
                        });

                        self.loading = true;
                        self.$http({
                            url: self.$api.order_pallets + (self.addForm.id ? '/' + self.addForm.id : ''),
                            type: self.addForm.id ? 'PUT' : 'POST',
                            requestBody: true,
                            data: {
                                box_list:box_list,
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
                                            path: '/logistics/pallets/detail',
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
    .pallets-add-table {
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