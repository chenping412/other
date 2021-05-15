<template>
    <div class="inline-block margin-left-10">
        <el-button type="primary" plain @click="edit">推广品牌管理</el-button>

        <el-dialog title="推广品牌管理" :visible.sync="dialogShow" width="550px" :close-on-click-modal="false" v-loading="loading">
            <el-form :model="editRowForm" :rules="editRowFormRule" ref="editRowForm" label-width="0">
                <el-table :data="listData" border v-loading="loading">
                    <el-table-column label="品牌名称">
                        <template slot-scope="scope">
                            <el-form-item prop="brand_id" v-if="scope.row.isEdit">
                                <SelectBrand
                                        :brandId.sync="editRowForm.brand_id"
                                        :brand="editRowForm.brand"
                                        :option="editRowForm.brand_id ? [editRowForm.brand] : null"
                                ></SelectBrand>
                            </el-form-item>
                            <span v-else>{{(scope.row.brand ? scope.row.brand.name :'') | defaultStr}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="180">
                        <template slot-scope="scope">
                            <div v-if="scope.row.isEdit">
                                <el-button type="success" @click="clickSaveEdit(scope.row)">保存</el-button>
                                <el-button type="primary" plain @click="getListData()">取消</el-button>
                            </div>
                            <div v-else>
                                <ButtonEdit @click="clickEditRow(scope.row)"></ButtonEdit>
                                <ButtonDelete @click="deleteRow(scope.row.id)"></ButtonDelete>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div class="clearfix padding-top-10">
                <el-button type="primary" class="left" @click="clickAddRow">新建</el-button>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogShow = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['userId'],
        data() {
            return {
                loading:false,
                dialogShow:false,
                listData: [],

                editRowForm: {
                    login_user_id:'',
                },
                editRowFormRule: {
                    brand_id: [
                        {required: true, message: '请选择品牌！'}
                    ],
                },
            }
        },
        created() {

        },
        methods: {

            edit(){
                this.getListData();
                this.dialogShow=true;
            },
            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.product_ad_brands_user_v5 + '/' + self.userId,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            for(let i=0;i<data.msg.length;i++){
                                data.msg[i].isEdit = false;
                            }
                            self.listData = data.msg;
                        } else {
                            self.listData = [];
                        }
                    }
                })
            },

            //点击新增行
            clickAddRow() {
                for(let i=0;i<this.listData.length;i++){
                    if(this.listData[i].isEdit){
                        this.$message({
                            showClose: true,
                            message: '新增行之前，请先保存正在修改行！',
                            type: 'warning'
                        });
                        return
                    }
                }
                let row = {
                    isEdit:true,
                };
                this.editRowForm = JSON.parse(JSON.stringify(row));
                this.listData.push(row);
            },
            //点击编辑行
            clickEditRow(row) {
                for(let i=0;i<this.listData.length;i++){
                    if(this.listData[i].isEdit){
                        this.$message({
                            showClose: true,
                            message: '只允许同时修改一行信息，请先保存正在修改行！',
                            type: 'warning'
                        });
                        return
                    }
                }
                row.isEdit = true;
                row.relation_id = row.id;
                row.brand_id = row.brand ? row.brand.id : '';
                this.editRowForm = JSON.parse(JSON.stringify(row));
            },
            clickSaveEdit() {
                let self = this;
                self.$refs.editRowForm.validate(function (valid) {
                    if (valid) {

                        self.loading = true;
                        self.$http({
                            url: self.editRowForm.relation_id ? self.$api.product_ad_brands_relation_v5 + '/'+self.editRowForm.relation_id : self.$api.product_ad_brands_user_v5 + '/' + self.userId,
                            type:self.editRowForm.relation_id?'PUT':'POST',
                            requestBody:true,
                            data: self.editRowForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.getListData();
                                }
                            },error(data){
                                console.log(data)
                                if(data.responseJSON.msg && data.responseJSON.msg.error_code && data.responseJSON.msg.error_code === 40001){
                                    self.$confirm(data.responseJSON.msg.error_message, '提示', {
                                        confirmButtonText: '确认',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(() => {
                                        self.loading = true;
                                        self.$http({
                                            url: data.responseJSON.msg.callback_link,
                                            type:data.responseJSON.msg.callback_method,
                                            success: function (data) {
                                                self.loading = false;
                                                if (data.msg) {
                                                    self.$message({
                                                        showClose: true,
                                                        message: '保存成功！',
                                                        type: 'success'
                                                    });
                                                    self.getListData();
                                                }
                                            }
                                        })
                                    }).catch(() => {

                                    });
                                }
                            }
                        });
                    } else {
                        console.log('error submit!!');
                    }
                });
            },

            //删除行
            deleteRow(id) {
                let self = this;
                self.$confirm('确认删除吗？', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.product_ad_brands_relation_v5 + '/' + id,
                                type: 'DELETE',
                                success: function (data) {
                                    self.loading = false;
                                    if (data.msg) {
                                        self.$message({
                                            type: 'success',
                                            message: '删除成功！',
                                            showClose: 'true'
                                        });
                                        self.getListData();
                                    }
                                }
                            })

                        }
                    }
                })
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>