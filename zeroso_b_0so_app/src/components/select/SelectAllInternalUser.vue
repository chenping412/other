<template>
    <el-select
            v-model="selectValue"
            :placeholder="placeholder || '内部人员'"
            @change="selectChange"
            @clear="selectClear"
            :disabled="disabled"
            filterable
            clearable
            :loading="selectLoading">
        <el-option label="无" value="无" v-show="showNull"></el-option>
        <el-option v-for="(option,$index) in selectOption"
                   :key="$index"
                   :label="option.name"
                   :value="option.id">
        </el-option>
    </el-select>
</template>

<script>
    export default {
        props: ['user','userId','option','placeholder','disabled','showNull'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            userId(){
                this.init();
            },
            user(){
                this.init();
            },
            '$store.state.all_internal_users'(){
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                if(this.userId) {
                    this.selectValue = this.userId;
                }else if(this.user==='无') {
                    this.selectValue = '无';
                }else if(this.user && this.user.id) {
                    this.selectValue = this.user.id;
                }else {
                    this.selectValue = '';
                }
                let selectOption = [];
                if(this.$store.state.all_internal_users){
                    for(let i=0;i<this.$store.state.all_internal_users.length;i++){
                        selectOption.push({
                            account_user_id : this.$store.state.all_internal_users[i].id,
                            ...this.$store.state.all_internal_users[i]
                        })
                    }
                }
                this.selectOption=selectOption

            },
            selectChange(val){
                this.$emit('update:userId',val);
                if(val==='无'){
                    this.$emit('update:user',val);
                    this.$emit('change',val);
                }else {
                    this.selectOption.forEach((item)=>{
                        if(item.id === val){
                            this.$emit('update:user',item);
                            this.$emit('change',item);
                        }
                    })
                }
            },
            selectClear(){
                this.$emit('update:userId',null);
                this.$emit('update:user',{});
                this.$emit('change',{});
            },
        },
    }
</script>
