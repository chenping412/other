<template>
    <div class="express-number" v-loading="loading">
        <div class="padding-20">
            <el-tag effect="dark" size="medium" class="cursor-pointer"
                    v-for="(log,$index) in expressNumbers"
                    :key="$index"
                    :type="selectIndex===$index ? 'success' : null"
                    @click="getExpressLogs($index)">
                <span class="margin-20">{{log.expCode}} {{log.expNo}}</span>
            </el-tag>
        </div>

        <div v-if="logData.routes">
            <table class="table">
                <thead>
                <tr>
                    <th>时间</th>
                    <th>地点</th>
                    <th>信息</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(log,$index) in logData.routes" :key="$index">
                    <td>{{log.create_time | zerosoCompanyTime}}</td>
                    <td>{{log.location}}</td>
                    <td>{{log.remark}}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        props:['expressNumbers'],
        data() {
            return {
                logData:{},
                selectIndex:-1,

                loading:false,
            }
        },
        watch:{
            expressNumbers(){
                this.init()
            }
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                console.log(this.expressNumbers)
                if(this.expressNumbers[0]){
                    this.getExpressLogs(0)
                }
            },
            getExpressLogs($index) {
                let self=this;
                self.selectIndex = $index;
                self.logData = {};
                self.loading = true;
                self.$http({
                    url: self.$api.order_third_delivery_trace_log + '/' + self.expressNumbers[self.selectIndex].expNo,
                    data: {
                        delivery_request_code:self.expressNumbers[self.selectIndex].expCode
                    },
                    success: function (data) {
                        self.loading = false;
                        if(data.msg){
                            self.logData = data.msg
                        }
                    }
                });
            }
        },
    }
</script>

<style lang="scss">
    .express-number{
        .table{
            width: 100%;
            border-collapse: collapse;
            th,td{
                border: 1px solid #dddddd;
                padding: 10px 20px;
            }
        }
    }
</style>