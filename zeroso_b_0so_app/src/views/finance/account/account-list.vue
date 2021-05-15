<template>
    <div id="" class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>科目一览表</el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <div class="table-control clearfix">
                <div class="control-btns">
                    <el-radio-group size="medium" v-model="accountType" @change="getListData">
                        <el-radio-button v-for="(item,$index) in accountTypeList"
                                         :key="$index"
                                         :label="item.id">
                            {{item.name}}
                        </el-radio-button>
                    </el-radio-group>
                </div>
                <div class="right">
                    <el-select v-model="is_private">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="false" label="公账"></el-option>
                        <el-option value="true" label="私账"></el-option>
                    </el-select>

                    <span class="margin-left-10">区间：</span>
                    <el-date-picker
                            v-model="accountDate"
                            :clearable="false"
                            type="daterange"
                            range-separator="至"
                            value-format="yyyy-MM-dd"
                            unlink-panels>
                    </el-date-picker>

                    <el-button type="primary" @click="getListData">确认</el-button>
                </div>
            </div>
        </div>

        <div class="container-table flex-item-scroll">
            <el-table :data="listData" border v-loading="loading">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="编号" prop="code"></el-table-column>
                <el-table-column label="科目" prop="name"></el-table-column>
                <el-table-column label="期初余额" prop="start_balance"></el-table-column>
                <el-table-column label="借方" prop="debit"></el-table-column>
                <el-table-column label="贷方" prop="credit"></el-table-column>
                <el-table-column label="期末余额" prop="end_balance"></el-table-column>
            </el-table>
        </div>


    </div>
</template>

<script>

    export default {
        data() {
            return {
                accountTypeList: [],

                accountType: null,
                is_private:'',
                accountDate:[],

                listData: [],

                loading: false,
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.accountDate = this.$utils.getNowMonthDate();
                this.getAccountTypeList();
            },
            //获取列表
            getAccountTypeList() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_account_type,
                    success: function (data) {
                        self.loading = false;
                        self.accountTypeList = data.msg.items;
                        if( self.accountTypeList.length>0){
                            self.accountType = self.accountTypeList[0].id;
                            self.getListData();
                        }
                    }
                })
            },

            //获取列表
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_account,
                    type: 'GET',
                    data: {
                        account_type_id: self.accountType,
                        start_date: self.accountDate[0],
                        end_date: self.accountDate[1],
                        is_private:self.is_private || undefined,
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.listData = data.msg.items;
                        } else {
                            self.listData = [];
                        }
                    }
                })
            },


        }
    }
</script>

<style>

</style>
