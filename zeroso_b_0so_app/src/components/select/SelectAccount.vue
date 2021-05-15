<template>
    <el-select
            v-model="selectValue"
            :placeholder="placeholder || '选择科目'"
            @change="selectChange"
            @clear="selectClear"
            :disabled="disabled"
            filterable
            clearable
            :loading="selectLoading">
        <el-option v-for="item in selectOption"
                   :key="item.id"
                   :value="item.id"
                   :label="item.code + ' ' + item.name">
        </el-option>
    </el-select>
</template>

<script>
    export default {
        props: ['account','accountId','option','placeholder','disabled'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            accountId(){
                this.selectValue = this.accountId;
            },
            account(){
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                if(this.accountId) {
                    this.selectValue = this.accountId;
                }else if(this.account && this.account.id) {
                    this.selectValue = this.account.id;
                }else {
                    this.selectValue = '';
                }
                if(this.option){
                    this.selectOption = this.option
                }else {
                    this.getSelectOption();
                }
            },
            getSelectOption() {
                let self = this;
                self.selectLoading=true;
                self.$http({
                    url: self.$api.bank_account,
                    type: 'GET',
                    success: function (data) {
                        self.selectLoading = false;
                        if (data.msg) {
                            self.selectOption = data.msg.items;
                        }
                    },error(){
                        self.selectLoading = false;
                    }
                });
            },
            selectChange(val){
                this.$emit('update:accountId',val);
                this.selectOption.forEach((item)=>{
                    if(item.id === val){
                        this.$emit('update:account',item);
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.$emit('update:accountId',null);
                this.$emit('update:account',{});
                this.$emit('change',{});
            },
        },
    }
</script>
