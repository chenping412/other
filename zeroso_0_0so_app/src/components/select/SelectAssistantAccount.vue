<template>
    <div class="select-assistant-account">
        <el-select class="assistant_type" v-model="assistantAccountForm.assistant_type" @change="assistantTypeChange()">
            <el-option label="类型" value=""></el-option>
            <el-option label="公司" value="account_company"></el-option>
            <el-option label="用户" value="account_user"></el-option>
            <el-option label="部门" value="account_department" v-if="$store.state.system === '0'"></el-option>
        </el-select>
        <div class="assistant_id inline-block">
            <SelectPartnerCompanyOnly
                    v-if="assistantAccountForm.assistant_type === 'account_company'"
                    @change="partnerCompanyChange"
                    :partnerId.sync="assistantAccountForm.assistant_id"
                    :partner="assistantAccountForm.assistant_id ? {account_company_id:assistantAccountForm.assistant_id,company_name:assistantAccountForm.name} : null"
                    :option="assistantAccountForm.assistant_id ? [{account_company_id:assistantAccountForm.assistant_id,company_name:assistantAccountForm.name}] : null">
            </SelectPartnerCompanyOnly>

            <el-select v-model="assistantAccountForm.assistant_id" @change="userChange"
                       v-if="assistantAccountForm.assistant_type === 'account_user'">
                <el-option
                        v-for="(item,$index) in $store.state.all_internal_users"
                        :key="$index"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>

            <el-select v-model="assistantAccountForm.assistant_id" placeholder="部门" @change="departmentChange"
                       v-if="assistantAccountForm.assistant_type === 'account_department'">
                <el-option
                        v-for="(item,$index) in accountDepartmentList"
                        :key="$index"
                        :label="item.dept_name"
                        :value="item.dept_id">
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SelectAssistantAccount",
        props:['assistantAccount'],
        data(){
            return {
                assistantAccountForm:{
                    assistant_type: "",
                    assistant_id: "",
                    name: "",
                },

                accountDepartmentList: [],
            }
        },
        watch:{
            assistantAccount(){
                this.init()
            },
        },
        created() {
            this.init()
            this.getAccountDepartmentList()
        },
        methods: {
            init(){
                if(this.assistantAccount) {
                    this.assistantAccountForm = JSON.parse(JSON.stringify(this.assistantAccount));
                }
            },
            assistantTypeChange(){
                this.assistantAccountForm.assistant_id = "";
                this.assistantAccountForm.name = "";
                this.setUpdate();
            },
            partnerCompanyChange(partner) {
                if (partner) {
                    this.assistantAccountForm.assistant_id = partner.account_company_id;
                    this.assistantAccountForm.name = partner.company_name
                }
                this.setUpdate();
            },
            userChange(){
                this.assistantAccountForm.name = "";
                this.$store.state.all_internal_users.forEach((item)=>{
                    if(item.id === this.assistantAccountForm.assistant_id){
                        this.assistantAccountForm.name = item.name;
                    }
                });
                this.setUpdate();
            },
            departmentChange(){
                this.assistantAccountForm.name = "";
                this.accountDepartmentList.forEach((item)=>{
                    if(item.dept_id === this.assistantAccountForm.assistant_id){
                        this.assistantAccountForm.name = item.dept_name;
                    }
                });
                this.setUpdate();
            },
            setUpdate(){
              this.$emit('update:assistantAccount',JSON.parse(JSON.stringify(this.assistantAccountForm)))
            },

            //获取部门列表
            getAccountDepartmentList() {
                let self = this;
                self.$http({
                    url: self.$api.ding_talk_v1_departments,
                    success: function (data) {
                        if (data.msg) {
                            self.accountDepartmentList = data.msg;
                        }
                    }
                });
            },
        }

    }
</script>

<style lang="scss">
    .select-assistant-account{
        display: inline-block;
        .assistant_type,
        .assistant_type .el-input{
            width: 75px !important;
        }
        .assistant_id,
        .assistant_id .el-input{
            width: 140px !important;
        }
    }
</style>