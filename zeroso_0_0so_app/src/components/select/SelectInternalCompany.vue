<template>
    <el-select
            v-model="selectValue"
            :placeholder="placeholder || '内部公司'"
            @change="selectChange"
            @clear="selectClear"
            :disabled="disabled"
            filterable
            clearable
            :loading="selectLoading">
        <el-option v-for="(item,$index) in selectOption"
                   :key="$index"
                   :value="item.account_company_id"
                   :label="item.company_name">
            <div>
                <span>{{item.company_name}}</span>
                <CompanyType :type="item.company_type"></CompanyType>
            </div>
        </el-option>
    </el-select>
</template>

<script>
    export default {
        props: ['internalCompany','internalCompanyId','option','placeholder','disabled'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            internalCompanyId(){
                this.init()
            },
            internalCompany(){
                this.init()
            }
        },
        created() {
            this.init();
            this.getOptionList()
        },
        methods: {
            init(){
                if(this.internalCompanyId) {
                    this.selectValue = this.internalCompanyId;
                }else if(this.internalCompany && this.internalCompany.account_company_id) {
                    this.selectValue = this.internalCompany.account_company_id;
                }else {
                    this.selectValue = '';
                }
            },
            getOptionList() {
                let self = this;
                self.selectLoading=true;
                self.$http({
                    url: self.$api.partner_internal_companies,
                    type: 'GET',
                    success: function (data) {
                        self.selectLoading = false;
                        if (data.msg) {
                            self.selectOption = data.msg;
                        }
                    },error(){
                        self.selectLoading = false;
                    }
                });
            },
            selectChange(val){
                this.$emit('update:internalCompanyId',val);
                this.selectOption.forEach((item)=>{
                    if(item.account_company_id === val){
                        this.$emit('update:internalCompany',item);
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.$emit('update:internalCompanyId',null);
                this.$emit('update:internalCompany',{});
                this.$emit('change',{});
            },
        },
    }
</script>
