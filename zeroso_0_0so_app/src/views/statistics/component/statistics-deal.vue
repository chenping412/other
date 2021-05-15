<template>
    <el-card class="margin-bottom-20" v-loading="loading">
        <div class="clearfix" slot="header">
            <h3 class="left">谈判助理专家询报价成单统计</h3>
            <div class="right">
                <el-radio-group v-model="selectDateRadio" @change="selectDateRadioChange" size="mini" class="margin-right-10">
                    <el-radio-button
                            v-for="(item,$index) in selectDateRadioList"
                            :key="$index"
                            :label="item.value">
                        {{item.label}}
                    </el-radio-button>
                </el-radio-group>

                <el-date-picker
                        v-model="selectDate"
                        size="mini"
                        type="daterange"
                        start-placeholder="开始日期"
                        range-separator="至"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        unlink-panels
                        :picker-options="$store.state.dateRangeOptions">
                </el-date-picker>
            </div>
        </div>
        <el-row :gutter="20">
            <el-col :span="6">
                <h4 class="small-title">排行榜</h4>
                <el-table :data="userDealData" size="mini" max-height="580px">
                    <el-table-column type="index" label="序号" width="40" align="center"></el-table-column>
                    <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="num1" label="成单产品数量"></el-table-column>
                    <el-table-column prop="money" label="成单金额"></el-table-column>
                </el-table>
            </el-col>
            <el-col :span="11">
                <div class="clearfix">
                    <h4 class="small-title left">各指标趋势图</h4>
                    <el-select class="right" v-model="selectNegotiateUserId" size="mini">
                        <el-option value="" label="全部人员"></el-option>
                        <el-option
                                v-for="(item,$index) in negotiateUserList"
                                :key="$index"
                                :value="item.id"
                                :label="item.nick_name">
                        </el-option>
                    </el-select>
                </div>
                <ve-line :data="userDealChartLine1" height="300px"></ve-line>
                <ve-line :data="userDealChartLine2" height="300px"></ve-line>
            </el-col>
            <el-col :span="7">
                <h4 class="small-title">各人员数据占比</h4>
                <el-radio-group v-model="userDealPieQuotaSelect" size="mini" style="margin: 10px 0 30px;">
                    <el-radio-button
                            v-for="(item,$index) in quotaList"
                            :key="$index"
                            :label="item.value">
                        {{item.label}}
                    </el-radio-button>
                </el-radio-group>
                <ve-pie :data="userDealChartPie" height="400px"></ve-pie>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
    export default {
        props:['selectDateRadioList'],
        data() {
            return {
                loading: false,

                negotiateUserList: [],
                selectNegotiateUserId: '',


                selectDateRadio:2,
                selectDate: [],

                userDealData: [
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                    {name:'张三', num1:20, money:45645,},
                ],
                userDealChartLine1: {
                    columns: ['日期', '成单产品数量'],
                    rows: [
                        { '日期': '2020-07-04', '成单产品数量': 13},
                        { '日期': '2020-07-05', '成单产品数量': 35},
                        { '日期': '2020-07-06', '成单产品数量': 29},
                        { '日期': '2020-07-07', '成单产品数量': 17},
                        { '日期': '2020-07-08', '成单产品数量': 37},
                        { '日期': '2020-07-09', '成单产品数量': 45},
                        { '日期': '2020-07-10', '成单产品数量': 45},
                    ]
                },
                userDealChartLine2: {
                    columns: ['日期', '成单金额'],
                    rows: [
                        { '日期': '2020-07-04', '成单金额': 13930},
                        { '日期': '2020-07-05', '成单金额': 35300},
                        { '日期': '2020-07-06', '成单金额': 29230},
                        { '日期': '2020-07-07', '成单金额': 17230},
                        { '日期': '2020-07-08', '成单金额': 37920},
                        { '日期': '2020-07-09', '成单金额': 45930},
                        { '日期': '2020-07-10', '成单金额': 45930},
                    ]
                },

                quotaList:[
                    {
                        label:'成单产品数量',
                        value:1,
                    },{
                        label:'成单金额',
                        value:2,
                    },
                ],
                userDealPieQuotaSelect:1,
                userDealChartPie: {
                    columns: ['name', 'number'],
                    rows: [
                        { 'name': '张毅1', 'number': 13930},
                        { 'name': '张毅2', 'number': 35300},
                        { 'name': '张毅3', 'number': 29230},
                        { 'name': '张毅4', 'number': 17230},
                        { 'name': '张毅5', 'number': 37920},
                        { 'name': '张毅6', 'number': 45930},
                        { 'name': '张毅7', 'number': 45930},
                    ]
                },


            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.selectDateRadioChange(this.selectDateRadio);
                this.getNegotiateUserList();
            },
            getNegotiateUserList() {
                let self = this;
                self.$http({
                    url: self.$api.login_user_fuzzy_search,
                    type: 'GET',
                    data:{
                        text:'',
                    },
                    success: function (data) {
                        if (data.msg) {
                            self.negotiateUserList = data.msg.items;
                        }
                    }
                });
            },


            selectDateRadioChange(val){
                this.selectDate = this.$parent.selectDateRadioChange(val)
            },

        }
    }
</script>

<style scoped>

</style>