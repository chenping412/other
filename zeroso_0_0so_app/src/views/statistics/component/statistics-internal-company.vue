<template>
    <el-card class="margin-bottom-20" v-loading="loading">
        <div class="clearfix" slot="header">
            <h3 class="left">联营公司询报价单执行情况统计</h3>
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
                        v-model="internalDate"
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
            <el-col :span="8">
                <h4 class="small-title">排行榜</h4>
                <el-table :data="companyInquiryData" size="mini" max-height="850px">
                    <el-table-column type="index" label="序号" width="40" align="center"></el-table-column>
                    <el-table-column prop="company_name" label="公司名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="num1" label="询价数" width="50px"></el-table-column>
                    <el-table-column prop="num2" label="报价数" width="50px"></el-table-column>
                    <el-table-column label="报价率" width="50px">
                        <template slot-scope="scope">{{scope.row.num2 | percent}}</template>
                    </el-table-column>
                    <el-table-column prop="num3" label="核准数" width="50px"></el-table-column>
                    <el-table-column label="核准率" width="50px">
                        <template slot-scope="scope">{{scope.row.num2 | percent}}</template>
                    </el-table-column>
                    <el-table-column prop="num4" label="下单数" width="50px"></el-table-column>
                    <el-table-column label="下单率" width="50px">
                        <template slot-scope="scope">{{scope.row.num2 | percent}}</template>
                    </el-table-column>
                    <el-table-column prop="money" label="下单金额" width="65px"></el-table-column>
                </el-table>
            </el-col>
            <el-col :span="10">
                <div class="clearfix">
                    <h4 class="small-title left">各指标趋势图</h4>
                    <el-select class="right" v-model="selectInternalCompanyId" size="mini">
                        <el-option value="" label="全部公司"></el-option>
                        <el-option
                                v-for="(item,$index) in internalCompanyList"
                                :key="$index"
                                :value="item.account_company_id"
                                :label="item.company_name">
                        </el-option>
                    </el-select>
                </div>
                <ve-line :data="companyInquiryChartLine1" height="300px"></ve-line>
                <ve-line :data="companyInquiryChartLine2" height="300px"></ve-line>
                <ve-line :data="companyInquiryChartLine3" height="300px"></ve-line>
            </el-col>
            <el-col :span="6">
                <h4 class="small-title">各联营公司数据占比</h4>
                <el-radio-group v-model="companyInquiryPieQuotaSelect" size="mini" style="margin: 10px 0 30px;">
                    <el-radio-button
                            v-for="(item,$index) in quotaList"
                            :key="$index"
                            :label="item.value">
                        {{item.label}}
                    </el-radio-button>
                </el-radio-group>
                <ve-pie :data="companyInquiryChartPie" height="400px"></ve-pie>
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

                internalCompanyList: [],
                selectInternalCompanyId: '',

                quotaList:[
                    {
                        label:'询价数',
                        value:1,
                    },{
                        label:'报价数',
                        value:2,
                    },{
                        label:'核准数',
                        value:3,
                    },{
                        label:'下单数',
                        value:4,
                    },{
                        label:'下单金额',
                        value:5,
                    },
                ],


                selectDateRadio:2,
                internalDate: [],

                companyInquiryData: [
                    {
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },{
                        company_name:'东莞欧博智能制造有限公司',
                        num1:20,
                        num2:17,
                        num3:3,
                        num4:0,
                        money:45645,
                    },
                ],
                companyInquiryChartLine1: {
                    columns: ['日期', '询价数', '报价数', '核准数', '下单数'],
                    rows: [
                        { '日期': '2020-07-04', '询价数': 139, '报价数': 109, '核准数': 100, '下单数': 10 },
                        { '日期': '2020-07-05', '询价数': 353, '报价数': 323, '核准数': 300, '下单数': 30 },
                        { '日期': '2020-07-06', '询价数': 292, '报价数': 262, '核准数': 200, '下单数': 20 },
                        { '日期': '2020-07-07', '询价数': 172, '报价数': 142, '核准数': 130, '下单数': 15 },
                        { '日期': '2020-07-08', '询价数': 379, '报价数': 349, '核准数': 340, '下单数': 34 },
                        { '日期': '2020-07-09', '询价数': 459, '报价数': 429, '核准数': 400, '下单数': 42 },
                        { '日期': '2020-07-10', '询价数': 459, '报价数': 429, '核准数': 400, '下单数': 42 },
                    ]
                },
                companyInquiryChartLine2: {
                    columns: ['日期', '下单金额'],
                    rows: [
                        { '日期': '2020-07-04', '下单金额': 13930},
                        { '日期': '2020-07-05', '下单金额': 35300},
                        { '日期': '2020-07-06', '下单金额': 29230},
                        { '日期': '2020-07-07', '下单金额': 17230},
                        { '日期': '2020-07-08', '下单金额': 37920},
                        { '日期': '2020-07-09', '下单金额': 45930},
                        { '日期': '2020-07-10', '下单金额': 45930},
                    ]
                },
                companyInquiryChartLine3: {
                    columns: ['日期', '报价率', '核准率', '下单率'],
                    rows: [
                        { '日期': '2020-07-04', '报价率': 80,'核准率': 60,'下单率': 12,},
                        { '日期': '2020-07-05', '报价率': 85,'核准率': 55,'下单率': 15,},
                        { '日期': '2020-07-06', '报价率': 90,'核准率': 70,'下单率': 8,},
                        { '日期': '2020-07-07', '报价率': 70,'核准率': 58,'下单率': 10,},
                        { '日期': '2020-07-08', '报价率': 75,'核准率': 60,'下单率': 13,},
                        { '日期': '2020-07-09', '报价率': 80,'核准率': 65,'下单率': 18,},
                        { '日期': '2020-07-10', '报价率': 63,'核准率': 55,'下单率': 22,},
                    ]
                },

                companyInquiryPieQuotaSelect:1,
                companyInquiryChartPie: {
                    columns: ['company', 'number'],
                    rows: [
                        { 'company': '公司1', 'number': 13930},
                        { 'company': '公司2', 'number': 35300},
                        { 'company': '公司3', 'number': 29230},
                        { 'company': '公司4', 'number': 17230},
                        { 'company': '公司5', 'number': 37920},
                        { 'company': '公司6', 'number': 45930},
                        { 'company': '公司7', 'number': 45930},
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
                this.getInternalCompanyList();
            },
            getInternalCompanyList() {
                let self = this;
                self.$http({
                    url: self.$api.partner_internal_companies,
                    type: 'GET',
                    success: function (data) {
                        if (data.msg) {
                            self.internalCompanyList = data.msg;
                        }
                    }
                });
            },


            selectDateRadioChange(val){
                this.internalDate = this.$parent.selectDateRadioChange(val)
            },

        }
    }
</script>

<style scoped>

</style>