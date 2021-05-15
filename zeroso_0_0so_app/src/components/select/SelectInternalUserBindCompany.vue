<template>
    <el-select
            v-model="selectValue"
            :placeholder="placeholder || '绑定公司'"
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
        props: ['company','companyId','option','placeholder','disabled'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            companyId(){
                this.init()
            },
            company(){
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                if(this.companyId) {
                    this.selectValue = this.companyId;
                }else if(this.company && this.company.account_company_id) {
                    this.selectValue = this.company.account_company_id;
                }else {
                    this.selectValue = '';
                }
                this.selectOption = this.$store.state.currentCompanyList;
            },
            selectChange(val){
                this.$emit('update:companyId',val);
                this.selectOption.forEach((item)=>{
                    if(item.account_company_id === val){
                        this.$emit('update:company',item);
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.$emit('update:companyId',null);
                this.$emit('update:company',{});
                this.$emit('change',{});
            },
        },
    }
</script>
