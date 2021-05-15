<template>
    <div class="select-template-components" :class="{'has-append':$slots.append}">
        <el-select
                v-model="selectValue"
                filterable
                remote
                :placeholder="placeholder || '请输入关键词'"
                :remote-method="remoteMethod"
                @change="selectChange"
                @clear="selectClear"
                clearable
                :disabled="disabled"
                :loading="selectLoading">
            <el-option v-for="item in selectOption"
                       :key="item.account_company_id + '_' + item.account_user_id"
                       :value="item.account_company_id + '_' + item.account_user_id"
                       :label="item.company_name + (item.name?'，'+item.name:'') ">
                <span v-if="item.company_name">{{item.company_name}}</span>
                <span v-if="item.name">，{{item.name}}</span>
                <CompanyType :type="item.company_type"></CompanyType>
            </el-option>
        </el-select>
        <div class="select-template-components-append">
            <slot name="append"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['partner','partnerId','companyId','option','placeholder','data','autoGetNormal','disabled'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            partnerId(){
                this.selectValueInit();
            },
            companyId(){
                this.selectValueInit();
            },
            partner(){
                this.init()
            },
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                this.selectValueInit();
                if(this.option) {
                    this.selectOption = this.option;
                }else {
                   if(this.autoGetNormal) this.remoteMethod('');
                }
            },
            selectValueInit(){
                if(this.partnerId || this.companyId) {
                    this.selectValue = this.companyId + '_' + this.partnerId;
                }else if(this.partner && this.partner.account_company_id) {
                    this.selectValue = this.partner.account_company_id + '_' +this.partner.account_user_id;
                }else {
                    this.selectValue = '';
                }
            },
            setInit(account_user_id,option){
                this.selectOption = option;
                this.$nextTick(()=>{
                    this.selectValue = option[0].account_company_id + '_' + option[0].account_user_id;
                });
            },
            remoteMethod(query) {
                let self = this;
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    let data = self.data || {};
                    self.selectLoading=true;
                    self.$http({
                        url: self.$api.partner_search,
                        type: 'GET',
                        data: {
                            is_order:true,
                            page:1,
                            per_page:100,
                            name:query || null,
                            ...data
                        },
                        success: function (data) {
                            self.selectLoading = false;
                            if (data.msg && data.msg.items) {
                                self.selectOption = data.msg.items;
                            }
                        },error(){
                            self.selectLoading = false;
                        }
                    });
                },100);
            },
            selectChange(val){
                this.selectOption.forEach((item)=>{
                    if(item.account_company_id + '_' + item.account_user_id === val){
                        this.$emit('update:partnerId',item.account_user_id);
                        this.$emit('update:partner',{
                            account_user_id:item.account_user_id,
                            name:item.name,
                            account_company_id:item.account_company_id,
                            company_name:item.company_name,
                            company_type:item.company_type,
                        });
                        this.$emit('update:companyId',item.account_company_id);
                        this.$emit('change',val,item);
                    }
                })
            },
            selectClear(){
                this.$emit('update:partnerId',null);
                this.$emit('update:partner',{});
                this.$emit('change',null,{});
                this.remoteMethod('');
            },
        },
    }
</script>

<style lang="scss">
    @import "select-template-components";
</style>