<template>
    <div class="statistics-total margin-bottom-20">
        <div class="clearfix statistics-total-box margin-bottom-10">
            <h3 class="left title">总览</h3>
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

        <el-row :gutter="10">
            <el-col :span="4">
                <div class="statistics-total-box">
                    <h4 class="small-title">{{selectDateName}}询价数总计</h4>
                    <p class="total-number">3654</p>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="statistics-total-box">
                    <h4 class="small-title">{{selectDateName}}报价数总计</h4>
                    <p class="total-number">3200</p>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="statistics-total-box">
                    <h4 class="small-title">{{selectDateName}}核准数总计</h4>
                    <p class="total-number">3000</p>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="statistics-total-box">
                    <h4 class="small-title">{{selectDateName}}下单数总计</h4>
                    <p class="total-number">300</p>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="statistics-total-box">
                    <h4 class="small-title">{{selectDateName}}下单金额总计</h4>
                    <p class="total-number">￥500000</p>
                </div>
            </el-col>
            <el-col :span="4">
                <div class="statistics-total-box">
                    <h4 class="small-title">{{selectDateName}}成单联营公司数</h4>
                    <p class="total-number">12</p>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        props:['selectDateRadioList'],
        data() {
            return {
                loading: false,

                selectDateRadio:2,
                selectDate: [],

            }
        },
        computed:{
            selectDateName(){
                let name='';
                this.selectDateRadioList.forEach((item)=>{
                    if(item.value===this.selectDateRadio){
                        name = item.label
                    }
                });
                return name;
            },
        },
        created() {
            this.init();
        },
        methods:{
            init() {
                this.selectDateRadioChange(this.selectDateRadio);
            },
            selectDateRadioChange(val){
                this.selectDate = this.$parent.selectDateRadioChange(val)
            },
        }
    }
</script>

<style lang="scss">
    @import "src/assets/css/config";
.statistics-total{
    .statistics-total-box{
        border: 1px solid #EBEEF5;
        background-color: #FFFFFF;
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
        padding: 10px 20px;
        .title{
            line-height: 28px;
        }
        .small-title{
            font-weight: normal;
            color: #999999;
        }
        .total-number{
            font-size: 32px;
            font-weight: bolder;
            line-height: 1.5em;
            color: $color-success;
        }
    }
}
</style>