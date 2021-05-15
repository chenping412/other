<template>
    <div class="partner-add">
        <el-button type="primary" @click="dialogShow = true">{{title || '新增合作伙伴'}}</el-button>

        <el-dialog :title="title || '新增合作伙伴'" :visible.sync="dialogShow" width="500px" :close-on-click-modal="false" v-loading="loading" :append-to-body="true">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="110px">
                <el-form-item label="公司全称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="国家" prop="country">
                    <el-select v-model="addForm.country">
                        <el-option
                                v-for="item in $store.state.country"
                                :key="item.code2"
                                :value="item.code2"
                                :label="item.chinese_name">
                        </el-option>
                    </el-select>
                </el-form-item>
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
        props:['title'],
        data() {
            return {
                loading:false,
                dialogShow:false,
                addForm: {
                    name:'',
                    country:'CN',
                },
                addFormRule: {
                    name: [
                        {required: true, message: '请输入公司全称！'}
                    ],
                },
            }
        },
        watch: {},
        created() {
        },
        methods: {
            openAddModel(){
              this.dialogShow=true;
            },
            clickSaveDate() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.partner_companies_accurate_search,
                            data: {
                                name: self.addForm.name,
                                country: self.addForm.country,
                                per_page: 1,
                                accurate: 'true',
                            },
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    if(data.msg.company_status === 'not_found'){
                                        self.$confirm('系统中没能找到资料，请确认您输入的是该公司工商注册全名。若公司名称有误可能会造成订单纠纷，请确保公司全名正确。是否继续新增？', '提示', {
                                            confirmButtonText: '继续新增',
                                            cancelButtonText: '取消',
                                            type: 'warning'
                                        }).then(() => {
                                            self.$router.push({
                                                path: '/partner/detail',
                                                query: {
                                                    name: self.addForm.name,
                                                    country: self.addForm.country,
                                                }
                                            });
                                        }).catch(() => {

                                        });
                                    }else {
                                        if(data.msg.account_company_id){
                                            self.$router.push({
                                                path: '/partner/detail',
                                                query: {
                                                    id: data.msg.account_company_id,
                                                }
                                            });
                                        }else {
                                            self.$router.push({
                                                path: '/partner/detail',
                                                query: {
                                                    name: self.addForm.name,
                                                    country: self.addForm.country,
                                                }
                                            });
                                        }
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
    .partner-add {
        display: inline-block;
    }
</style>