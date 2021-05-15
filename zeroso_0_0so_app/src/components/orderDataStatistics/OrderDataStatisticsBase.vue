<template>
    <table class="order-data-statistics-base" v-loading="loading">
        <tr>
            <td>询价数量</td>
            <td>{{baseData.create_order_times}}</td>
        </tr>
        <tr>
            <td>报价数量</td>
            <td>{{baseData.quoted_order_times}}</td>
        </tr>
        <tr>
            <td>成单数量</td>
            <td>{{baseData.performed_order_times}}</td>
        </tr>
        <tr>
            <td>报价率</td>
            <td>{{baseData.quoted_order_rate| tenthsToPercent}}</td>
        </tr>
        <tr>
            <td>成单率</td>
            <td>{{baseData.performed_order_rate|tenthsToPercent}}</td>
        </tr>
        <tr>
            <td>总询价金额</td>
            <td>{{baseData.quoted_total_amount|isoCurrency('CNY')}}</td>
        </tr>
        <tr>
            <td>平均询价金额</td>
            <td>{{baseData.quoted_average_amount|isoCurrency('CNY')}}</td>
        </tr>
        <tr>
            <td>总成单金额</td>
            <td>{{baseData.performed_total_amount|isoCurrency('CNY')}}</td>
        </tr>
        <tr>
            <td>平均成单金额</td>
            <td>{{baseData.performed_average_amount|isoCurrency('CNY')}}</td>
        </tr>
        <tr>
            <td>统计开始时间</td>
            <td>{{baseData.state_start_time | zerosoCompanyDate}}</td>
        </tr>
    </table>
</template>

<script>
    export default {
        props: ['baseUrl'],
        data() {
            return {
                baseData: {},
                loading:false,
            }
        },
        watch: {
            baseUrl() {
                this.getBaseData()
            }
        },
        created() {
            this.getBaseData()
        },
        methods: {
            getBaseData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.baseUrl,
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0) {
                            self.baseData = data.msg;
                        }
                    }
                })
            },
        },
    }
</script>

<style lang="scss">
    .order-data-statistics-base {
        padding: 16px 0;
        td {
            padding: 0 10px;
        }
        td:first-child {
            text-align: right;
        }
        td:last-child {
            font-weight: bolder;
            color: #333333;
        }
    }
</style>