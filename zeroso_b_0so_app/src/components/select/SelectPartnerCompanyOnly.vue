<template>
    <div class="select-template-components" :class="{'has-append':$slots.append}">
        <el-select
                v-model="selectValue"
                :size="size"
                filterable
                remote
                :placeholder="placeholder || '请输入公司名称'"
                :remote-method="remoteMethod"
                @change="selectChange"
                @clear="selectClear"
                clearable
                :disabled="disabled"
                :loading="selectLoading"
                style="width: 100%;">

            <template  v-if="recommendOption && recommendOption.length>0">
                <el-option-group label="推荐">
                    <el-option v-for="item in recommendOption"
                               :key="item.account_company_id"
                               :value="item.account_company_id"
                               :label="item.company_name + (item.name?'，'+item.name:'') ">
                        <span v-if="item.company_name">{{item.company_name}}</span>
                        <span v-if="item.name">，{{item.name}}</span>
                        <CompanyType :type="item.company_type"></CompanyType>
                    </el-option>
                </el-option-group>

                <el-option-group label="检索">
                    <el-option v-for="item in selectOption"
                               :key="item.account_company_id"
                               :value="item.account_company_id"
                               :label="item.company_name + (item.name?'，'+item.name:'') ">
                        <span v-if="item.company_name">{{item.company_name}}</span>
                        <span v-if="item.name">，{{item.name}}</span>
                        <CompanyType :type="item.company_type"></CompanyType>
                    </el-option>
                </el-option-group>
            </template>
            <template v-else>
                <el-option v-for="item in selectOption"
                           :key="item.account_company_id"
                           :value="item.account_company_id"
                           :label="item.company_name + (item.name?'，'+item.name:'') ">
                    <span v-if="item.company_name">{{item.company_name}}</span>
                    <span v-if="item.name">，{{item.name}}</span>
                    <CompanyType :type="item.company_type"></CompanyType>
                </el-option>
            </template>
        </el-select>
        <div class="select-template-components-append">
            <slot name="append"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['partner','partnerId','option','placeholder','autoGetNormal','disabled','size','recommendOption'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            partnerId(){
                this.selectValue = this.partnerId;
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
                if(this.partnerId) {
                    this.selectValue = this.partnerId;
                }else if(this.partner && this.partner.account_company_id) {
                    this.selectValue = this.partner.account_company_id;
                }else {
                    this.selectValue = '';
                }
                if(this.option) {
                    this.selectOption = this.option;
                }else {
                    if(this.autoGetNormal) this.remoteMethod('');
                }
            },
            setInit(account_company_id,option){
                this.selectValue = account_company_id;
                this.selectOption = option;
            },
            remoteMethod(query) {
                let self = this;
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    self.selectLoading=true;
                    self.$http({
                        url: self.$api.partner_search,
                        type: 'GET',
                        data: {
                            page:1,
                            per_page:100,
                            name:query || null,
                            company_only:true
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
                this.$emit('update:partnerId',val);
                let arr = JSON.parse(JSON.stringify(this.selectOption));
                if(this.recommendOption && this.recommendOption.length>0){
                    arr.concat(this.recommendOption)
                }
                arr.forEach((item)=>{
                    if(item.account_company_id === val){
                        this.$emit('update:partner',{
                            account_company_id:item.account_company_id,
                            company_name:item.company_name,
                        });
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.$emit('update:partnerId',null);
                this.$emit('update:partner',{});
                this.$emit('change',{});
                this.remoteMethod('');
            },
        },
    }
</script>

<style lang="scss">
    @import "select-template-components";
</style>