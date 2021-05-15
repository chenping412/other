<template>
    <div v-loading="loading">

        <div class="clearfix padding-bottom-10">
            <el-select class="left" v-model="professionType" @change="getListData">
                <el-option label="全部" value=""></el-option>
                <el-option
                        v-for="(item,$index) in $store.state.templateProfessionType"
                        :key="$index"
                        :label="item.label"
                        :value="item.code">
                </el-option>
            </el-select>

            <el-button class="right" type="primary" @click="openDetail">新建邮件模板</el-button>
        </div>

        <el-table :data="listData" border @row-click="openDetail" v-loading="loading">
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column label="模板名称" prop="name" width="250px"></el-table-column>
            <el-table-column label="按钮位置" width="200px">
                <template slot-scope="scope">
                    {{scope.row.profession_type | templateProfessionType}}
                </template>
            </el-table-column>
            <el-table-column label="主题" prop="subject"></el-table-column>
            <el-table-column label="更新时间" prop="subject" width="200px">
                <template slot-scope="scope">
                    {{scope.row.write_time | zerosoCompanyTime}}
                </template>
            </el-table-column>
        </el-table>


    </div>
</template>

<script>

    export default {
        data() {
            return {
                professionType:'',

                listData: [],

                loading: false,
            }
        },
        created() {
            this.getListData();
        },
        methods: {
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.file_mail_templates,
                    data:{
                        account_company_ids: self.$store.state.currentCompany.account_company_id,
                        module_name: 'message',
                        page: 1,
                        per_page: 1000,
                        subsystem: 'message',
                        profession_type: self.professionType
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
                            self.listData = data.msg.items;
                        }
                    }
                })
            },

            openDetail(row) {
                this.$router.push({
                    path: 'emailEdit',
                    query: {
                        id : row && row.id ? row.id : undefined
                    }
                });
            },

        }
    }
</script>

<style lang="scss">

</style>
