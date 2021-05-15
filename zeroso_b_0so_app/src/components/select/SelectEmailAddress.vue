<template>
    <el-select
            v-model="selectValue"
            :placeholder="placeholder || '邮箱地址'"
            @change="selectChange"
            @clear="selectClear"
            clearable
            :loading="selectLoading">
        <el-option v-for="item in selectOption"
                   :key="item.id"
                   :value="item.id"
                   :label="item.email">
        </el-option>
    </el-select>
</template>

<script>
    export default {
        props: ['email','emailId','option','placeholder'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            emailId(){
                this.init()
            }
        },
        created() {
            this.init();
            this.getMyEmailUserList()
        },
        methods: {
            init(){
                if(this.emailId) {
                    this.selectValue = this.emailId;
                }else if(this.email && this.email.id) {
                    this.selectValue = this.email.id;
                }else {
                    this.selectValue = '';
                }
            },
            getMyEmailUserList() {
                let self = this;
                self.selectLoading=true;
                self.$http({
                    url: self.$api.message_v4_multi_self_address,
                    type: 'GET',
                    success: function (data) {
                        self.selectLoading = false;
                        if (data.msg && data.msg.items) {
                            self.selectOption = data.msg.items;
                        }
                    },error(){
                        self.selectLoading = false;
                    }
                });
            },
            selectChange(val){
                this.$emit('update:emailId',val);
                this.selectOption.forEach((item)=>{
                    if(item.id === val){
                        this.$emit('update:email',{
                            id:item.id,
                            name:item.name,
                            state:item.state,
                        });
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.$emit('update:emailId',null);
                this.$emit('update:email',{});
                this.$emit('change',{});
            },
        },
    }
</script>
