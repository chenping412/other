<template>
    <div style="position: relative;">
        <el-select
                v-model="selectValue"
                filterable
                remote
                multiple
                allow-create
                default-first-option
                :multiple-limit="multipleLimit || 0"
                :placeholder="placeholder || '请输入邮箱'"
                :remote-method="remoteMethod"
                @change="selectChange"
                @visible-change="visibleChange"
                :loading="selectLoading">
            <el-option v-for="item in selectOption"
                       :key="item"
                       :value="item"
                       :label="item">
            </el-option>
        </el-select>
        <div style="position: absolute;right: 0;top: 0;bottom: 0">
            <slot name="append"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['email','placeholder','multipleLimit'],
        data() {
            return {
                selectValue:[],
                query:'',


                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            selectValue(val,oldVal){
                if(val.length>oldVal.length){
                    let addArr=[];

                    for(let i=0;i<val.length;i++){
                        let m=0;
                        for(let k=0;k<oldVal.length;k++){
                            if(val[i] === oldVal[k]){
                                m++
                            }
                        }
                        if(m===0){
                            addArr.push(val[i]);
                        }
                    }
                    console.log(addArr)
                    addArr.forEach((item)=>{
                        this.checkEmailAddress(item);
                    })
                }
            },
            email(){
                this.init()
            }
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                 if(this.email) {
                    this.selectValue = this.email;
                }else {
                    this.selectValue = [];
                }
                if(!this.selectOption || this.selectOption.length<=0){
                    if(this.email) {
                        this.selectOption = this.email;
                    }
                }
            },
            remoteMethod(query) {
                let self = this;
                self.query=query;
                if(query){
                    if(this.timer) clearTimeout(this.timer);
                    this.timer = setTimeout(()=>{
                        self.selectLoading=true
                        self.$http({
                            url: self.$api.message_mail_email_search_v3,
                            type: 'GET',
                            data: {
                                text:query || ''
                            },
                            success: function (data) {
                                self.selectLoading = false;
                                if (data.msg && data.msg.items) {
                                    let arr=[];
                                    data.msg.items.forEach((item)=>{
                                       arr.push(item.email);
                                    });
                                    self.selectOption = arr;
                                }
                            }
                        });
                    },100);
                }
            },
            selectChange(val){
                this.$emit('update:email',val);
                this.$emit('change',val);
                this.selectOption=[];
            },
            visibleChange(show){
                if(!show && this.query && this.selectValue.length!==this.multipleLimit){
                    this.selectValue.push(this.query);
                    this.checkEmailAddress(this.query);
                    this.$emit('update:email',this.selectValue);
                    this.$emit('change',this.selectValue);
                    this.query='';
                }
            },


            checkEmailAddress(email_address){
                let self = this;
                self.$http({
                    url: self.$api.message_email_address_info_v4,
                    data:{
                        email_address:email_address
                    }
                })
            },
        },
    }
</script>

<style lang="scss">

</style>