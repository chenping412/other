<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>产品中心 / 海关编码</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <ControlSearch
                    :allowFilterFieldsMore.sync="allowFilterFieldsMore"
                    :allowFilterFieldsFast.sync="allowFilterFieldsFast"
                    @clickSearch="init()">
            </ControlSearch>

            <div class="table-control clearfix">
                <div class="control-btns">
                    <el-button type="primary" :disabled="buttonDisabled" @click="clickAddRow">新增海关编码</el-button>
                </div>
                <TableControlPagination
                        :pageSize="pageSize"
                        :pageNum="pageNum"
                        :totalCount="totalCount">
                </TableControlPagination>
            </div>
        </div>

        <div class="container-content flex-item-scroll">
            <div class="container-table">
                <el-form :model="editRowForm" :rules="editRowFormRule" ref="editRowForm" label-width="0">
                    <el-table :data="listData" border v-loading="loading">
                        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                        <el-table-column>
                            <template slot="header">
                                <ButtonSort label="国家" field_name="country"></ButtonSort>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item prop="country" v-if="scope.row.isEdit">
                                    <el-select v-model="editRowForm.country">
                                        <el-option
                                                v-for="item in $store.state.country"
                                                :key="item.code2"
                                                :label="item.chinese_name"
                                                :value="item.code2">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <span v-else>{{scope.row.country | country | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot="header">
                                <ButtonSort label="海关编码" field_name="hs_code"></ButtonSort>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item prop="hs_code" v-if="scope.row.isEdit">
                                    <el-input v-model="editRowForm.hs_code"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.hs_code | defaultStr}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="海关商品描述">
                            <template slot-scope="scope">
                                <el-form-item prop="hs_description" v-if="scope.row.isEdit">
                                    <el-input type="textarea" rows="2" v-model="editRowForm.hs_description"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.hs_description | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="监管条件">
                            <template slot-scope="scope">
                                <el-form-item prop="regulatory_condition" v-if="scope.row.isEdit">
                                    <el-input v-model="editRowForm.regulatory_condition"></el-input>
                                </el-form-item>
                                <span v-else>{{scope.row.regulatory_condition | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="关税税率">
                            <template slot-scope="scope">
                                <el-form-item prop="tariff" v-if="scope.row.isEdit">
                                    <InputNumber :value.sync="editRowForm.tariff" placeholder="关税税率">
                                        <template slot="append">%</template>
                                    </InputNumber>
                                </el-form-item>
                                <span v-else>{{scope.row.tariff | percent | defaultStr}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isEdit">
                                    <el-button type="success" size="mini" @click="clickSaveEdit(scope.row)">保存</el-button>
                                    <el-button type="primary" size="mini" plain @click="getListData()">取消</el-button>
                                </div>
                                <div v-else>
                                    <el-button type="primary" size="mini" :disabled="buttonDisabled" @click="clickEditRow(scope.row)">编辑</el-button>
                                    <el-button type="danger" size="mini" :disabled="buttonDisabled" plain @click="clickDelete(scope.row.id)">删除</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
            </div>
        </div>


    </div>
</template>

<script>

    export default {
        components: {

        },
        data() {
            return {
                allowFilterFieldsFast: [
                    {
                        "field_name": "country",
                        "type": "country",
                        "translate": "国家",
                    }, {
                        "field_name": "hs_code",
                        "type": "string",
                        "translate": "海关编码",
                    }, {
                        "field_name": "hs_description",
                        "type": "string",
                        "translate": "海关商品描述",
                    },
                ],
                allowFilterFieldsMore: [],

                filter: {},

                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,

                editRowForm: {},
                editRowFormRule: {
                    hs_code: [
                        {required: true, message: '请输入海关编码！'}
                    ], hs_description: [
                        {required: true, message: '请输入海关商品描述！'}
                    ], country: [
                        {required: true, message: '请选择国家！'}
                    ], tariff: [
                        {required: true, message: '请输入关税税率！'}
                    ],
                },

                loading: false,
                buttonDisabled:false,

            }
        },
        watch: {
            '$route'() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : {};
                this.order_by = this.$route.query.order_by ? JSON.parse(decodeURIComponent(this.$route.query.order_by)) : {};
                this.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum * 1 : 1;
                this.pageSize = this.$route.query.pageSize ? this.$route.query.pageSize * 1 : this.$store.state.paginationPageSize;
                this.getListData();
            },

            //获取列表
            getListData() {
                let self = this;
                self.buttonDisabled = false;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_hs_list,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        page: self.pageNum,
                        per_page: self.pageSize,
                        ...self.$utils.formatSearchFilterV6(self.filter),
                        ...self.$utils.formatSearchSortV7(self.order_by),
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            for(let i=0;i<data.msg.items.length;i++){
                                data.msg.items[i].isEdit = false;
                            }
                            self.listData = data.msg.items;
                            self.totalCount = data.msg.total;
                        } else {
                            self.listData = [];
                            self.totalCount = 0;
                        }
                    }
                })
            },

            //点击新增行
            clickAddRow() {
                let row = {
                    isEdit:true,
                };
                this.editRowForm = JSON.parse(JSON.stringify(row));
                this.listData.unshift(row);
                this.buttonDisabled=true;
            },
            //点击编辑行
            clickEditRow(row) {
                row.isEdit = true;
                this.editRowForm = JSON.parse(JSON.stringify(row));
                this.buttonDisabled=true;
            },
            //保存编辑
            clickSaveEdit(row) {
                let self = this;
                self.$refs.editRowForm.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.new_product_basic_product_hs + (self.editRowForm.id ? '/'+self.editRowForm.id : ''),
                            type:self.editRowForm.id?'PUT':'POST',
                            requestBody:true,
                            data: self.editRowForm,
                            success () {
                                self.loading = false;
                                self.$message({
                                    showClose: true,
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                row.isEdit = false;
                                self.getListData();
                            }
                        });
                    }
                });
            },

            //删除
            clickDelete(id) {
                let self = this;
                self.$confirm('确定删除吗？', '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.new_product_basic_product_hs + '/' + id,
                                type: 'DELETE',
                                requestBody: true,
                                success: function () {
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

        }
    }
</script>

