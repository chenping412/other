<template>
    <div class="inline-block">
        <span @click="getListData">{{title || '汇率查询'}}</span>

        <el-dialog :title="title || '汇率查询'" :visible.sync="dialogShow" width="800px" append-to-body>
            <div class="padding-bottom-10">
                <span>本位币：</span>
                <el-select v-model="origin_currency" @change="getListData" size="mini">
                    <el-option
                            v-for="item in $store.state.currency"
                            :key="item.code"
                            :label="item.code"
                            :value="item.code">
                    </el-option>
                </el-select>
            </div>
            <el-table :data="listData" border v-loading="loading" size="mini">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column label="汇率名" prop="name"></el-table-column>
                <el-table-column label="汇率值" prop="rate"></el-table-column>
                <el-table-column label="汇率时间">
                    <template slot-scope="scope">
                        {{scope.row.effect_time | zerosoCompanyTime}}
                    </template>
                </el-table-column>
            </el-table>
            <p class="left">以上数据来自第三方（雅虎）提供，供参考，请以实际交易的汇率为准</p>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogShow = false">关 闭</el-button>
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

                origin_currency: 'CNY',
                listData:[],
            }
        },
        watch: {},
        created() {
        },
        methods: {
            getListData(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_currency_exchange_rate,
                    data: {
                        origin_currency: self.origin_currency
                    },
                    success: function (data) {
                        self.loading = false;
                        self.listData = data.msg.items;
                        self.dialogShow=true;
                    }
                });
            },
        },
    }
</script>
