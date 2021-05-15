<template>
    <div class="tags-list-component">
        <el-tag
                v-for="(tag,$index) in dynamicTags"
                :key="$index"
                :closable="isEdit"
                size="medium"
                :type="inputValueIsSpace && $index === dynamicTags.length-1 ? 'danger' : null"
                @close="handleClose(tag)">
            {{tag}}
        </el-tag>
        <el-input
                v-if="isEdit"
                class="input-new-tag"
                v-model="inputValue"
                size="mini"
                placeholder="按回车添加"
                @keyup.enter.native="handleInputConfirm"
                @keyup.delete.native="deleteInput">
        </el-input>
    </div>
</template>

<script>
    export default {
        props: ['tags','isEdit'],
        data() {
            return {
                dynamicTags: [],
                inputValue: '',
                inputValueIsSpace: false,
            }
        },
        watch:{
            tags(){
                this.init();
            },
            inputValue(){
                if(this.inputValue){
                    this.inputValueIsSpace=false;
                }
            },
            dynamicTags(){
                this.inputValueIsSpace=false;
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                if(this.tags){
                    this.dynamicTags = JSON.parse(JSON.stringify(this.tags))
                }
            },
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                this.$emit('update:tags',this.dynamicTags);
                this.$emit('change',this.dynamicTags);
            },
            handleInputConfirm() {
                if (this.inputValue) {
                    if(this.dynamicTags.indexOf(this.inputValue)>-1){
                        this.$message({
                            showClose: true,
                            message: '已存在相同标签！',
                            type: 'error'
                        });
                    }else {
                        this.dynamicTags.push(this.inputValue);
                        this.inputValue = '';
                        this.$emit('update:tags',this.dynamicTags);
                        this.$emit('change',this.dynamicTags);
                    }
                }else {
                    this.$message({
                        showClose: true,
                        message: '不能为空！',
                        type: 'error'
                    });
                }

            },
            deleteInput(){
                if(this.inputValueIsSpace && this.dynamicTags.length>0){
                    this.dynamicTags.splice(this.dynamicTags.length-1, 1);
                    this.$emit('update:tags',this.dynamicTags);
                    this.$emit('change',this.dynamicTags);
                }
                if(!this.inputValue){
                    this.inputValueIsSpace=true;
                }

            }
        },
    }
</script>

<style lang="scss">
    .tags-list-component {
        .input-new-tag{
            margin: 2px;
            width: 100px;
        }
    }
</style>