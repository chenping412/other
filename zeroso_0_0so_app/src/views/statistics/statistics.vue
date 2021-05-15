<template>
    <div id="statistics-page" class="flex-box-column" v-loading="loading">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>

        <StatisticsTotal :selectDateRadioList="selectDateRadioList"></StatisticsTotal>

        <StatisticsInternalCompany :selectDateRadioList="selectDateRadioList"></StatisticsInternalCompany>

        <StatisticsDeal :selectDateRadioList="selectDateRadioList"></StatisticsDeal>

        <StatisticsQuotation :selectDateRadioList="selectDateRadioList"></StatisticsQuotation>


    </div>
</template>

<script>
    import Vue from 'vue'
    import VeLine from 'v-charts/lib/line.common'
    import VePie from 'v-charts/lib/pie.common'
    Vue.component(VeLine.name, VeLine);
    Vue.component(VePie.name, VePie);

    import StatisticsTotal from './component/statistics-total'
    import StatisticsInternalCompany from './component/statistics-internal-company'
    import StatisticsDeal from './component/statistics-deal'
    import StatisticsQuotation from './component/statistics-quotation'
    export default {
        components:{StatisticsTotal,StatisticsInternalCompany,StatisticsDeal,StatisticsQuotation},
        data() {
            return {
                loading: false,
                selectDateRadioList:[
                    {
                        label:'今日',
                        value:0,
                    },{
                        label:'昨日',
                        value:1,
                    },{
                        label:'本周',
                        value:2,
                    },{
                        label:'本月',
                        value:3,
                    },{
                        label:'近7天',
                        value:7,
                    },{
                        label:'近30天',
                        value:30,
                    },{
                        label:'近180天',
                        value:180,
                    },
                ],

            }
        },

        created() {

        },
        methods: {

            selectDateRadioChange(val){
                let selectDate=[];
                let today=this.$moment().format('YYYY-MM-DD');
                if(val===0){
                    selectDate = [today,today];
                }else if(val===1){
                    selectDate = [this.$moment().subtract(1,'days').format('YYYY-MM-DD'),this.$moment().subtract(1,'days').format('YYYY-MM-DD')];
                }else if(val===2){
                    selectDate = [this.$moment().startOf('week').format('YYYY-MM-DD'),today];
                }else if(val===3){
                    selectDate = [this.$moment().startOf('month').format('YYYY-MM-DD'),today];
                }if(val===7 || val===30 || val===180){
                    selectDate = [this.$moment().subtract(val-1,'days').format('YYYY-MM-DD'),today];
                }
                return selectDate;
            },
        }
    }
</script>

<style lang="scss">
    #statistics-page {
        .small-title{
            line-height: 28px;
        }
        .el-table .cell{
            padding: 0 3px;
        }
    }
</style>
