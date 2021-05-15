<template>
    <div>
        <div class="search clearfix padding-bottom-10">
            <el-button class="item" type="primary" @click="clickAddRow">新增</el-button>
            <el-input class="item" v-model="searchForm.field_name" clearable placeholder="扩展字段key"></el-input>
            <el-input class="item" v-model="searchForm.display_name" clearable placeholder="中文名称"></el-input>
            <el-select class="item" v-model="searchForm.is_shown" clearable placeholder="是否在官网展示" @change="getListData">
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
            </el-select>

            <div class="item">
                <el-button type="primary" @click="getListData">查询</el-button>
                <el-button @click="clickClear">重置</el-button>
            </div>

            <el-pagination
                    class="right"
                    @current-change="getListData"
                    @size-change="getListData"
                    :page-size.sync="pageSize"
                    :current-page.sync="pageNum"
                    :total="totalCount"
                    :page-sizes="$store.state.paginationPageSizes"
                    :layout="$store.state.paginationLayOut"
                    :pager-count="5"
                    background>
            </el-pagination>
        </div>
        <el-table :data="listData" border v-loading="loading">
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column label="扩展字段key">
                <template slot-scope="scope">
                    <el-input v-if="scope.row.isEdit" v-model="scope.row.field_name"></el-input>
                    <span v-else>{{scope.row.field_name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="中文名称">
                <template slot-scope="scope">
                    <el-input v-if="scope.row.isEdit" v-model="scope.row.display_name"></el-input>
                    <span v-else>{{scope.row.display_name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否在官网展示">
                <template slot-scope="scope">
                    <el-switch
                            v-if="scope.row.isEdit"
                            v-model="scope.row.is_shown"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                    <div v-else>
                        <el-tag type="success" effect="dark" v-if="scope.row.is_shown">是</el-tag>
                        <el-tag type="danger" effect="dark" v-if="!scope.row.is_shown">否</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column>
                <template slot-scope="scope">
                    <div v-if="scope.row.isEdit">
                        <el-button size="mini" type="success" @click="clickSaveDate(scope.row)">保存</el-button>
                        <el-button size="mini" @click="getListData">取消</el-button>
                    </div>
                    <div v-else>
                        <el-button size="mini" type="primary" @click="scope.row.isEdit=true">编辑</el-button>
                        <el-button size="mini" type="danger" @click="clickDelete(scope.row)">删除</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                listData: [],
                pageSize: this.$store.state.paginationPageSize,
                pageNum: 1,
                totalCount: 0,
                searchForm:{
                    "display_name": "",
                    "field_name": "",
                    "is_shown": null,
                },

                loading: false,
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.getListData();
            },
            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.new_product_basic_product_product_extend_field_list,
                    type: 'POST',
                    data:{
                        page: self.pageNum,
                        per_page: self.pageSize,
                        ...self.searchForm,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
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

            clickClear(){
                this.searchForm={
                    "display_name": "",
                    "field_name": "",
                    "is_shown": null,
                };
                this.getListData();
            },

            clickAddRow(){
                this.listData.unshift({
                    isEdit:true,
                    field_name: "",
                    display_name: "",
                    is_shown: true,
                })
            },


            clickSaveDate(row) {
                let self = this;
                if(!row.field_name){
                    self.$message({
                        showClose: true,
                        message: '请输入扩展字段key！',
                        type: 'error'
                    });
                    return
                }
                if(!row.display_name){
                    self.$message({
                        showClose: true,
                        message: '请输入中文名称！',
                        type: 'error'
                    });
                    return
                }
                self.loading = true;
                self.$http({
                    url: !row.id ? self.$api.new_product_basic_product_product_extend_field : self.$api.new_product_basic_product_product_extend_field+'/'+row.id,
                    type: !row.id ? 'POST' :'PUT',
                    requestBody: true,
                    data: row,
                    success: function () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '保存成功！',
                            type: 'success'
                        });
                        self.getListData();
                    }
                });
            },

            //删除
            clickDelete(row) {
                let self = this;
                self.$confirm('确认删除该扩展字段吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.new_product_basic_product_product_extend_field + '/' + row.id,
                                type: 'DELETE',
                                success: function () {
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '删除成功！',
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

<style>

</style>
