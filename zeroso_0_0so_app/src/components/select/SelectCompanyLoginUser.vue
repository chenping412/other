<template>
    <el-select
            v-model="selectValue"
            :placeholder="placeholder || '请选择'"
            @change="selectChange"
            @clear="selectClear"
            :disabled="disabled"
            filterable
            clearable
            :loading="selectLoading">
        <el-option v-for="item in selectOption"
                   :key="item.id"
                   :value="item.id"
                   :label="item.nick_name">
        </el-option>
    </el-select>
</template>

<script>
    export default {
        props: ['user','userId','option','placeholder','disabled','accountCompanyId'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            userId(val){
                this.selectValue = val;
            },
            user(){
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                if(this.userId) {
                    this.selectValue = this.userId;
                }else if(this.user && this.user.id) {
                    this.selectValue = this.user.id;
                }else {
                    this.selectValue = '';
                }
                this.getSelectOption();
            },
            getSelectOption() {
                let self = this;
                self.selectLoading=true;
                self.$http({
                    url: self.$api.partner_companies_v5+'/'+self.accountCompanyId+'/login_users',
                    data:{
                        account_company_id: self.accountCompanyId
                    },
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
                this.$emit('update:userId',val);
                this.selectOption.forEach((item)=>{
                    if(item.id === val){
                        this.$emit('update:user',item);
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.$emit('update:userId',null);
                this.$emit('update:user',{});
                this.$emit('change',{});
            },
        },
    }
</script>
