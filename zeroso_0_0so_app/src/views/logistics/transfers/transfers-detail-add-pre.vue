<template>
    <div class="inline-block">
        <el-button type="primary" :disabled="!belongToCompanyId" @click="clickSearch">搜索</el-button>

        <el-dialog title="搜索" :visible.sync="dialogShow" width="1200px" :close-on-click-modal="false" v-loading="loading">
            <div class="padding-bottom-10" v-if="transferLine.product_info">
                <p class="blue">调拨单行信息</p>
                <span class="margin-right-10">品牌:{{transferLine.product_info.brand.name}}</span>
                <span class="margin-right-10">型号: {{transferLine.product_info.product_name}}</span>
                <span class="margin-right-10">订货号:{{transferLine.product_info.product_order_no}}</span>
                <span class="margin-right-10">总量:{{transferLine.qty}}</span>
                <span :class="{'red': transferLine.should_request - requestQtyTotal < 0}">
                    应调:{{transferLine.should_request - requestQtyTotal}}
                </span>
            </div>
            <el-table :data="listData" border height="450px">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="品牌">
                    <template slot-scope="scope" v-if="scope.row.product_info && scope.row.product_info.brand">
                        <p>{{scope.row.product_info.brand.name | defaultStr}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="型号">
                    <template slot-scope="scope" v-if="scope.row.product_info">
                        <router-link class="blue" target="_blank"
                                     :to="'/product/product/detail?id='+scope.row.product_info.id">
                            {{scope.row.product_info.product_name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column label="订货号">
                    <template slot-scope="scope" v-if="scope.row.product_info">
                        <router-link class="blue" target="_blank"
                                     :to="'/product/product/detail?id='+scope.row.product_info.id">
                            {{scope.row.product_info.product_order_no}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column label="箱号" prop="box_name"></el-table-column>
                <el-table-column label="库存数量" prop="quantity"></el-table-column>
                <el-table-column label="可调拨数量" prop="can_request_qty"></el-table-column>
                <el-table-column label="调拨数量">
                    <template slot-scope="scope">
                        <InputNumber :value.sync="scope.row.requestQty" :integer="true" @change="requestQtyTotalChange"></InputNumber>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveDate()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props:['transferId','belongToCompanyId','transferLine'],
        data() {
            return {
                loading:false,
                dialogShow:false,
                listData:[],
                requestQtyTotal:0,
            }
        },
        created() {

        },
        methods: {
            clickSearch(){
                this.dialogShow=true;
                this.getListData();
            },

            //获取列表
            getListData() {
                let self = this;
                self.listData = [];
                self.loading = true;
                self.$http({
                    url: self.$api.order_boxes_box_lines_search,
                    type: 'GET',
                    data: {
                        belong_to_company_id: self.belongToCompanyId || undefined,
                        product_id: self.transferLine.product_info.id,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            for(let i=0;i<data.msg.length;i++){
                                data.msg[i].requestQty='';
                            }
                            self.listData = data.msg;
                        }
                    }
                })
            },


            clickSaveDate() {
                let self = this;
                if(self.transferLine.should_request - self.requestQtyTotal<0){
                    self.$message({
                        showClose: true,
                        message: '调拨数量超过待调拨数量！',
                        type: 'error'
                    });
                    return
                }
                let dataArr=[];
                self.listData.forEach((item)=>{
                    if(item.requestQty){
                        dataArr.push({
                            box_line_id: item.id,
                            order_product_id: self.transferLine.id,
                            quantity: item.requestQty,
                        })
                    }
                });
                if(dataArr.length===0){
                    self.$message({
                        showClose: true,
                        message: '请输入调拨数量！',
                        type: 'error'
                    });
                    return
                }

                self.loading = true;
                self.$http({
                    url: self.$api.order_request_transfers + '/' + self.transferId + '/pre_request_lines',
                    type:'POST',
                    requestBody:true,
                    data: dataArr,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.$message({
                                showClose: true,
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.dialogShow=false;
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
            },

            requestQtyTotalChange(){
                this.requestQtyTotal=0;
                this.listData.forEach((item)=>{
                    if(item.requestQty){
                        this.requestQtyTotal += Number(item.requestQty);
                    }
                })
            },
        },
    }
</script>

<style lang="scss">

</style>