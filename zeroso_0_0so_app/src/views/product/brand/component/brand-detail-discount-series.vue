<template>
    <div class="brand-detail-discount-series clearfix" v-loading="loading">
        <table class="table">
            <thead>
            <tr>
                <th>所属供应商</th>

                <th>折扣系列名称</th>
                <th>折扣</th>
                <th>过期时间</th>
                <th>备注</th>
                <th>最后操作人</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody v-for="(parentItem,parentIndex) in listData" :key="parentIndex">
            <template v-if="parentItem.discount_series">
                <tr v-for="(item,$index) in parentItem.discount_series" :key="$index">

                    <td :rowspan="parentItem.discount_series.length" v-if="$index===0">
                        <router-link
                                class="blue"
                                :to="'/partner/detail?id='+parentItem.company_info_with_follower.account_company_id"
                                v-if="parentItem.company_info_with_follower">
                            {{parentItem.company_info_with_follower.company_name}}
                        </router-link>
                    </td>

                    <td>{{item.name | defaultStr}}</td>
                    <td>{{item.discount | tenthsToPercent}}</td>
                    <td>{{item.expire_time | zerosoCompanyDate}}</td>
                    <td>{{item.comment | defaultStr}}</td>
                    <td>
                        <span>{{item.operator_user.company_name}}</span>
                        <span>，{{item.operator_user.name}}</span>
                        <span>，{{(item.write_time || item.create_time) | zerosoCompanyTime}}</span>
                    </td>
                    <td>
                        <span class="cursor-pointer blue" @click="clickEdit(item,parentItem)">编辑</span>
                        <span class="cursor-pointer red margin-left-20" @click="clickDelete(item,parentItem)">删除</span>
                    </td>


                </tr>
            </template>
            </tbody>
        </table>

        <div class="padding-top-10">
            <el-button type="primary" @click="clickAdd()">新增折扣系列</el-button>

            <i class="el-icon-refresh-right el-icon-normal cursor-pointer margin-left-20" @click="getListData"></i>
        </div>

        <el-dialog title="折扣系列" :visible.sync="dialogShow" width="600px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="110px">
                <el-form-item label="所属供应商" prop="brand_supplier_id">
                    <el-select v-model="addForm.brand_supplier_id" :disabled="!!addForm.id">
                        <el-option
                                v-for="item in brandSupplierList"
                                :key="item.id"
                                :value="item.id"
                                :label="item.company_info_with_follower.company_name">
                            <span>{{item.company_info_with_follower.company_name}}</span>
                            <el-tag v-if="item.is_default">推荐</el-tag>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="折扣系列名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="折扣" prop="discountPercent">
                    <InputNumber :value.sync="addForm.discountPercent" round="2" max="99.99" placeholder="0 ~ 99.99">
                        <template slot="append">%</template>
                    </InputNumber>
                </el-form-item>
                <el-form-item label="过期时间" prop="expire_time">
                    <el-date-picker
                            v-model="addForm.expire_time"
                            type="date"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions"
                            placeholder="过期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" prop="comment">
                    <el-input type="textarea" :rows="6" v-model="addForm.comment"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveData()">保 存</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    export default {
        props: ['queryId'],
        data() {
            let self=this;
            return {
                loading: false,

                listData: [],


                dialogShow: false,
                addForm: {},
                addFormRule: {
                    name: [
                        {required: true, message: '请输入名称！'}
                    ], brand_supplier_id: [
                        {required: true, message: '请选择所属供应商！'}
                    ], discountPercent: [
                        {required: true, message: '请输入折扣！'}
                    ], expire_time: [
                        {required: true, message: '请选择过期时间！'}
                    ],
                },
                brandSupplierList: [],

                pickerOptions: {
                    shortcuts: [{
                        text: '1个月后',
                        onClick(picker) {
                            picker.$emit('pick', self.$moment().add(1,'months').format('YYYY-MM-DD'));
                        }
                    }, {
                        text: '6个月后',
                        onClick(picker) {
                            picker.$emit('pick', self.$moment().add(6,'months').format('YYYY-MM-DD'));
                        }
                    }, {
                        text: '1年后',
                        onClick(picker) {
                            picker.$emit('pick', self.$moment().add(1,'years').format('YYYY-MM-DD'));
                        }
                    }, {
                        text: '年底',
                        onClick(picker) {
                            picker.$emit('pick', self.$moment().endOf('year').format('YYYY-MM-DD'));
                        }
                    }]
                },

            }
        },
        watch: {
            queryId() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.queryId) {
                    this.getListData();
                }
            },
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.product_v5 + '/' + self.queryId + '/brand_suppliers/discount_series',
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg) {
                            self.listData = data.msg;
                        }
                    }
                })
            },

            //新建地址
            clickAdd() {
                this.dialogShow = true;
                this.addForm = {
                    brand_id: this.queryId,
                    name: '',
                    brand_supplier_id: '',
                    discountPercent: '',
                    comment: '',
                };
                this.getBrandSupplierListData();
            },
            //编辑地址
            clickEdit(item,parentItem) {
                this.dialogShow = true;
                this.addForm = {
                    brand_id: parentItem.brand_id,
                    brand_supplier_id: parentItem.id,
                    id: item.id,
                    name: item.name,
                    discountPercent: Number(item.discount * 100).myRound(2),
                    expire_time: item.expire_time,
                    comment: item.comment,
                };
                this.getBrandSupplierListData();
            },
            //保存
            clickSaveData() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        if(Number(self.addForm.discountPercent) >= 50){
                            self.$confirm('当前输入折扣为<b class="red">'+self.addForm.discountPercent+'%</b>，请确认是否有误，以避免较大损失！', '提示', {
                                confirmButtonText: '确认',
                                cancelButtonText: '取消',
                                type: 'warning',
                                dangerouslyUseHTMLString:true,
                                callback: function (action) {
                                    if (action === 'confirm') {
                                        self.saveDataSubmit();
                                    }
                                }
                            })
                        }else {
                            self.saveDataSubmit();
                        }
                    }
                });
            },
            saveDataSubmit(){
                let self = this;
                self.addForm.discount = Number(self.addForm.discountPercent / 100).myRound(4)
                self.loading = true;
                self.$http({
                    url: self.addForm.id ?
                            self.$api.product_v5 + '/' + self.addForm.brand_id + '/brand_suppliers/' + self.addForm.brand_supplier_id + '/discount_series/' + self.addForm.id
                            : self.$api.product_v5 + '/' + self.addForm.brand_id + '/brand_suppliers/' + self.addForm.brand_supplier_id + '/discount_series',
                    type: self.addForm.id ? 'PUT' : 'POST',
                    requestBody: true,
                    data: self.addForm,
                    success() {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '保存成功！',
                            type: 'success'
                        });
                        self.dialogShow = false;
                        self.getListData();
                    }
                });
            },


            //删除
            clickDelete(row,parentItem) {
                let self = this;
                self.$confirm('确定删除？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.product_v5 + '/' + parentItem.brand_id + '/brand_suppliers/' + row.brand_supplier_id + '/discount_series/' + row.id,
                                type: 'DELETE',
                                success() {
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '操作成功！',
                                        type: 'success'
                                    });
                                    self.getListData();
                                }
                            });
                        }
                    }
                })
            },


            getBrandSupplierListData() {
                let self = this;
                self.$http({
                    url: self.$api.product_brand_v5 + '/' + self.queryId + '/suppliers',
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg) {
                            self.brandSupplierList = data.msg;
                        } else {
                            self.brandSupplierList = [];
                        }
                    }
                })
            },

        }
    }
</script>

<style lang="scss">
    .brand-detail-discount-series {
        .table {
            width: 100%;
            th, td {
                text-align: left;
                padding: 10px 15px;
                vertical-align: top;
                border: 1px solid #dddddd;
            }
            th{
                background-color: #F2F6FC;
            }
        }
    }
</style>
