<template>
    <el-card class="margin-bottom-20" v-loading="loading">
        <div class="clearfix" slot="header">
            <h3 class="left">谈判助理专家询报价统计</h3>
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
            <el-col :span="12">
                <h4 class="small-title">排行榜</h4>
                <el-table :data="userQuotationData" size="mini" max-height="840px">
                    <el-table-column type="index" label="序号" width="40" align="center"></el-table-column>
                    <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="num1" label="进询价池产品数量"></el-table-column>
                    <el-table-column prop="num1" label="无价格表产品数量"></el-table-column>
                    <el-table-column prop="num1" label="有商城产品数量"></el-table-column>
                    <el-table-column prop="num1" label="有价格表产品数量"></el-table-column>
                    <el-table-column prop="num1" label="已发询价单中新增数量"></el-table-column>
                    <el-table-column prop="num1" label="无效产品数量"></el-table-column>
                    <el-table-column prop="num1" label="替换产品数量"></el-table-column>
                    <el-table-column prop="num1" label="报价产品数量"></el-table-column>
                    <el-table-column prop="num1" label="不报价产品数量"></el-table-column>
                </el-table>
            </el-col>
            <el-col :span="12">
                <div>
                    <div class="clearfix margin-bottom-10">
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
                    <ve-line :data="userQuotationChartLine1" height="400px"></ve-line>
                </div>

                <div>
                    <h4 class="small-title">各人员数据占比</h4>
                    <el-radio-group v-model="userQuotationPieQuotaSelect" size="mini" style="margin: 10px 0;">
                        <el-radio-button
                                v-for="(item,$index) in quotaList"
                                :key="$index"
                                :label="item.value">
                            {{item.label}}
                        </el-radio-button>
                    </el-radio-group>
                    <ve-pie :data="userQuotationChartPie" height="350px"></ve-pie>
                </div>
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

                userQuotationData: [
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                    {name:'张三', num1:10,},
                ],
                userQuotationChartLine1: {
                    columns: ['日期', '进询价池产品数量', '无价格表产品数量', '有商城产品数量', '有价格表产品数量', '已发询价单中新增数量', '无效产品数量', '替换产品数量', '报价产品数量', '不报价产品数量'],
                    rows: [
                        {
                            '日期': '2020-07-04',
                            '进询价池产品数量': 13,
                            '无价格表产品数量': 1,
                            '有商城产品数量': 4,
                            '有价格表产品数量': 6,
                            '已发询价单中新增数量': 7,
                            '无效产品数量': 8,
                            '替换产品数量': 9,
                            '报价产品数量': 11,
                            '不报价产品数量': 15,
                        },{
                            '日期': '2020-07-05',
                            '进询价池产品数量': 13,
                            '无价格表产品数量': 1,
                            '有商城产品数量': 4,
                            '有价格表产品数量': 6,
                            '已发询价单中新增数量': 7,
                            '无效产品数量': 8,
                            '替换产品数量': 9,
                            '报价产品数量': 11,
                            '不报价产品数量': 15,
                        },{
                            '日期': '2020-07-06',
                            '进询价池产品数量': 13,
                            '无价格表产品数量': 1,
                            '有商城产品数量': 4,
                            '有价格表产品数量': 6,
                            '已发询价单中新增数量': 7,
                            '无效产品数量': 8,
                            '替换产品数量': 9,
                            '报价产品数量': 11,
                            '不报价产品数量': 15,
                        },{
                            '日期': '2020-07-07',
                            '进询价池产品数量': 13,
                            '无价格表产品数量': 1,
                            '有商城产品数量': 4,
                            '有价格表产品数量': 6,
                            '已发询价单中新增数量': 7,
                            '无效产品数量': 8,
                            '替换产品数量': 9,
                            '报价产品数量': 11,
                            '不报价产品数量': 15,
                        },{
                            '日期': '2020-07-08',
                            '进询价池产品数量': 13,
                            '无价格表产品数量': 1,
                            '有商城产品数量': 4,
                            '有价格表产品数量': 6,
                            '已发询价单中新增数量': 7,
                            '无效产品数量': 8,
                            '替换产品数量': 9,
                            '报价产品数量': 11,
                            '不报价产品数量': 15,
                        },{
                            '日期': '2020-07-09',
                            '进询价池产品数量': 13,
                            '无价格表产品数量': 1,
                            '有商城产品数量': 4,
                            '有价格表产品数量': 6,
                            '已发询价单中新增数量': 7,
                            '无效产品数量': 8,
                            '替换产品数量': 9,
                            '报价产品数量': 11,
                            '不报价产品数量': 15,
                        },{
                            '日期': '2020-07-10',
                            '进询价池产品数量': 13,
                            '无价格表产品数量': 1,
                            '有商城产品数量': 4,
                            '有价格表产品数量': 6,
                            '已发询价单中新增数量': 7,
                            '无效产品数量': 8,
                            '替换产品数量': 9,
                            '报价产品数量': 11,
                            '不报价产品数量': 15,
                        },
                    ]
                },

                quotaList:[
                    {
                        label:'进询价池产品数量',
                        value:1,
                    },{
                        label:'无价格表产品数量',
                        value:2,
                    },{
                        label:'有商城产品数量',
                        value:3,
                    },{
                        label:'有价格表产品数量',
                        value:4,
                    },{
                        label:'已发询价单中新增数量',
                        value:5,
                    },{
                        label:'无效产品数量',
                        value:6,
                    },{
                        label:'替换产品数量',
                        value:7,
                    },{
                        label:'报价产品数量',
                        value:8,
                    },{
                        label:'不报价产品数量',
                        value:9,
                    },
                ],
                userQuotationPieQuotaSelect:1,
                userQuotationChartPie: {
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