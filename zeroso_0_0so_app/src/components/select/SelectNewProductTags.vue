<template>
    <div class="select-template-components" :class="{'has-append':$slots.append}">
        <el-select
                v-model="selectValue"
                filterable
                remote
                :size="size"
                :placeholder="placeholder || '标签名称'"
                :remote-method="remoteMethod"
                @change="selectChange"
                @clear="selectClear"
                clearable
                :loading="selectLoading">
            <el-option v-for="item in selectOption"
                       :key="item.id"
                       :value="item.id"
                       :label="item.name">
                <span>{{item.name}}</span>
                <newProductTagsState :state="item.state" size="mini"></newProductTagsState>
             </el-option>
        </el-select>
        <div class="select-template-components-append">
            <slot name="append"></slot>
        </div>
    </div>
</template>

<script>
    /*选择中国海关编码组件*/
    export default {
        props: ['tag','tagId','option','placeholder','size'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            tagId(){
                this.selectValue = this.tagId;
            },
            tag(){
                this.init()
            },
        },
        created() {
            this.init()
        },
        methods: {
            init(){
                if(this.tagId) {
                    this.selectValue = this.tagId;
                }else if(this.tag && this.tag.id) {
                    this.selectValue = this.tag.id;
                }else {
                    this.selectValue = '';
                }
                if(!this.selectOption || this.selectOption.length<=0){
                    if(this.option) {
                        this.selectOption = this.option;
                    }else {
                        this.remoteMethod();
                    }
                }
            },
            setInit(id,option){
                this.selectValue = id;
                this.selectOption = option;
            },
            remoteMethod(query) {
                let self = this;
                if(this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    self.selectLoading=true;
                    self.$http({
                        url: self.$api.new_product_basic_product_label_normal_q,
                        type: 'GET',
                        data: {
                            name:query || null
                        },
                        success: function (data) {
                            self.selectLoading = false;
                            if (data.msg && data.msg) {
                                self.selectOption = data.msg;
                            }
                        },error(){
                            self.selectLoading = false;
                        }
                    });
                },100);
            },
            selectChange(val){
                this.$emit('update:tagId',val);
                this.selectOption.forEach((item)=>{
                    if(item.id === val){
                        this.$emit('update:tag',item);
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.remoteMethod();
                this.$emit('update:tagId',null);
                this.$emit('update:tag',{});
                this.$emit('change',{});
            },
        },
    }
</script>

<style lang="scss">
    @import "select-template-components";
</style>