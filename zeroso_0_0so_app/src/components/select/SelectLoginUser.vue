<template>
    <el-select
            popper-class="select-login-user"
            v-model="selectValue"
            filterable
            remote
            :disabled="disabled"
            :placeholder="placeholder || '输入登录用户'"
            :remote-method="remoteMethod"
            @change="selectChange"
            @clear="selectClear"
            clearable
            :loading="selectLoading">

        <div class="option-header">
            <span class="col nick_name">昵称</span>
            <span class="col">邮箱</span>
            <span class="col">手机</span>
        </div>

        <el-option v-for="item in selectOption"
                   :key="item.id"
                   :value="item.id"
                   :label="item.nick_name">
            <span class="col nick_name">{{item.nick_name}}</span>
            <span class="col">{{item.email}}</span>
            <span class="col">{{item.mobile}}</span>
        </el-option>
    </el-select>
</template>

<script>
    export default {
        props: ['user','userId','option','placeholder','disabled','loginUserShowNull'],
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
            },
        },
        created() {
            this.init()
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
                if(this.option) {
                    if(this.option[0] ==='无'){
                        this.selectOption = [{
                            id:'无',
                            nick_name:'无',
                        }]
                        this.selectValue = '无';
                    }else {
                        this.selectOption = this.option;
                        if(this.loginUserShowNull){
                            this.selectOption = this.selectOption.concat({
                                id:'无',
                                nick_name:'无',
                            })
                        }
                    }
                }else {
                    this.selectOption = [];
                    if(this.loginUserShowNull){
                        this.selectOption = this.selectOption.concat({
                            id:'无',
                            nick_name:'无',
                        })
                    }
                }
            },
            remoteMethod(query) {
                let self = this;
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    self.selectLoading=true;
                    self.$http({
                        url: self.$api.login_user_fuzzy_search,
                        type: 'GET',
                        data: {
                            text:query || ''
                        },
                        success: function (data) {
                            self.selectLoading = false;
                            if (data.msg && data.msg.items) {
                                self.selectOption = data.msg.items;
                                if(self.loginUserShowNull){
                                    self.selectOption = self.selectOption.concat({
                                        id:'无',
                                        nick_name:'无',
                                    })
                                }
                            }
                        },error(){
                            self.selectLoading = false;
                        }
                    });
                },100);
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
                this.selectOption = [];
                this.$emit('update:userId',null);
                this.$emit('update:user',{});
                this.$emit('change',{});
            },
        },
    }
</script>

<style lang="scss">
    .select-login-user{
        .col{
            display: inline-block;
            width: 220px;
            margin-right: 10px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            &.nick_name{
                width: 100px;
            }
        }
        .option-header{
            display: flex;
            white-space: nowrap;
            padding: 5px 20px;
            font-weight: bolder;
        }
    }
</style>