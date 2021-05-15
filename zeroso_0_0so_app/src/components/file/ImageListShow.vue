<template>
    <div>
        <div class="image-show-component-out" v-for="(item,$index) in imageUrlList" :key="$index">
            <el-image class="image-show-component"
                      :style="{'width':width?width+'px':null,'height':height?height+'px':null}"
                      :src="item"
                      :preview-src-list="imageUrlList"
                      :z-index="4999"
                      fit="contain">
                <div slot="placeholder" class="image-placeholder">
                    <i class="el-icon-loading"></i>
                </div>
                <i slot="error" class="el-icon-picture-outline error-icon teal"></i>
            </el-image>
            <i class="el-icon-circle-close image-show-component-out-close" v-show="showDelete" @click="clickDelete(item)"></i>
        </div>
    </div>

</template>

<script>
    export default {
        props: ['urlList','width','height','showDelete'],
        data() {
            return {
                imageUrlList:[],
            }
        },
        watch: {
            urlList() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                if(this.urlList){
                    this.imageUrlList = JSON.parse(JSON.stringify(this.urlList));
                }
            },
            clickDelete(item){
                this.imageUrlList.splice(this.imageUrlList.indexOf(item),1);
                this.$emit("update:urlList",this.imageUrlList);
            },
        },
    }
</script>

<style lang="scss">
    .image-show-component-out{
        display: inline-block;
        position: relative;
        .image-show-component-out-close{
            position: absolute;
            right: -5px;
            top: -5px;
            z-index: 9;
            cursor: pointer;
            font-size: 18px;
            color: #606266;
            background-color: #ffffff;
        }
        &+.image-show-component-out{
            margin-left: 10px;
        }
    }
    .image-show-component {
        line-height: inherit;
        vertical-align: middle;
        width: 150px;
        height: 150px;
        text-align: center;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        position: relative;
        .error-icon{
            font-size: 50px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
        }
        .image-placeholder{
            font-size: 30px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
        }
    }
</style>