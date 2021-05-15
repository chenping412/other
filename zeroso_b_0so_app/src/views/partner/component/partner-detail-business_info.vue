<template>
    <div class="partner-detail-business_info clearfix" v-loading="loading">
        <el-form label-width="120px" >
            <el-row>
                <el-col :span="10">
                    <el-form-item label="法人：">
                        <span class="form-border-bottom">{{detailData.base_info.legal_person_name | defaultStr}}</span>
                    </el-form-item>
                    <el-form-item label="地区：">
                        <span class="form-border-bottom">{{detailData.base_info.base|defaultStr}}</span>
                    </el-form-item>
                    <el-form-item label="公司类型：">
                        <span class="form-border-bottom">{{detailData.base_info.company_org_type|defaultStr}}</span>
                    </el-form-item>
                    <el-form-item label="注册地址：">
                        <span class="form-border-bottom">{{detailData.base_info.reg_location|defaultStr}}</span>
                    </el-form-item>
                    <el-form-item label="工商注册号：">
                        <span class="form-border-bottom">{{detailData.base_info.reg_number|defaultStr}}</span>
                    </el-form-item>
                    <el-form-item label="组织机构码：">
                        <span class="form-border-bottom">{{detailData.base_info.org_number|defaultStr}}</span>
                    </el-form-item>
                    <el-form-item label="股东信息：">
                        <div class="form-border-bottom">
                            <p v-for="(investor,$index) in detailData.investor_list" :key="$index">{{investor.name + '. ' + (investor.type || '公司')}}</p>
                        </div>
                    </el-form-item>
                    <el-form-item label="高管信息：">
                        <div class="form-border-bottom">
                            <p v-for="(user,$index) in detailData.staff_list" :key="$index">{{user.name + '·' + (user.staffName ? user.staffName[0] : '' )}}</p>
                        </div>
                    </el-form-item>
                    <el-form-item label="经营范围：">
                        <span class="form-border-bottom">{{detailData.business_scope|defaultStr}}</span>
                    </el-form-item>
                </el-col>

                <el-col :span="10">
                    <el-form-item label="成立日期：">
                        <span class="form-border-bottom">{{detailData.base_info.estiblish_time}}</span>
                    </el-form-item>
                    <el-form-item label="营业起始：">
                        <span class="form-border-bottom">{{detailData.base_info.from_time}}</span>
                    </el-form-item>
                    <el-form-item label="营业终止：">
                        <span class="form-border-bottom">{{detailData.base_info.to_time}}</span>
                    </el-form-item>
                    <el-form-item label="营业状态：">
                        <span class="form-border-bottom">{{detailData.base_info.reg_status|defaultStr}}</span>
                    </el-form-item>
                    <el-form-item label="注册机构：">
                        <span class="form-border-bottom">{{detailData.base_info.reg_institute|defaultStr}}</span>
                    </el-form-item>
                    <el-form-item label="注册资本：">
                        <span class="form-border-bottom">{{detailData.base_info.reg_capital|defaultStr}}</span>
                    </el-form-item>
                    <el-form-item label="分支机构：">
                        <div class="form-border-bottom">
                            <p v-for="(item,$index) in detailData.branch_list" :key="$index">{{item}}</p>
                        </div>
                    </el-form-item>
                    <el-form-item label="投资信息：">
                        <div class="form-border-bottom">
                            <p v-for="(item,$index) in detailData.invest_list" :key="$index">{{item.name}}</p>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    export default {
        props: ['queryId'],
        data() {
            return {
                loading: false,

                detailData: {
                    base_info:{},
                    investor_list:[],
                    invest_list:[],
                    staff_list:[],
                    branch_list:[],
                },

            }
        },
        watch: {
            queryId () {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.queryId) {
                    this.getDetailData();
                }
            },
            getDetailData() {
                let self = this;
                self.detailData= {
                    base_info:{},
                    investor_list:[],
                    invest_list:[],
                    staff_list:[],
                    branch_list:[],
                };
                self.loading = true;
                self.$http({
                    url: self.$api.partner_companies_v2 + '/' + self.queryId + '/business_info',
                    success: function (data) {
                        self.loading = false;
                        if (data.err_code.length === 0 && data.msg && data.msg.partner_verified_company) {
                            self.detailData = data.msg.partner_verified_company;
                        }
                    }
                })
            },

        }
    }
</script>

<style lang="scss">
    .partner-detail-business_info {
        padding-bottom: 100px;
        .form-col{
            width: 50%;
            box-sizing: border-box;
        }
    }

</style>
