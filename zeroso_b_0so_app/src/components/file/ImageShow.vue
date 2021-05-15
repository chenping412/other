<template>
    <el-image class="image-show-component"
              :src="imageUrl"
              :preview-src-list="srcList"
              :z-index="4999"
              fit="contain">
        <div slot="placeholder" class="image-placeholder">
            <i class="el-icon-loading"></i>
        </div>
        <i slot="error" class="el-icon-picture-outline error-icon teal"></i>
    </el-image>
</template>

<script>
    export default {
        props: ['module_id','module_name','subsystem','src'],
        data() {
            return {
                imageUrl:'',
                srcList:[],
            }
        },
        watch: {
            module_id() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                if(this.src){
                    this.imageUrl = this.src;
                    this.srcList = [this.src]
                }else if(this.module_id && this.module_name && this.subsystem){
                    this.getImageListData();
                }
            },
            getImageListData() {
                let self = this;
                self.imageUrl='';
                self.srcList = [];
                self.$http({
                    url: self.$api.file_files_list,
                    data:{
                        module_id:self.module_id,
                        module_name:self.module_name,
                        subsystem:self.subsystem,
                    },
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg && data.msg.items && data.msg.items.length>0) {
                            self.imageUrl = self.$api.file_file + '/' + data.msg.items[0].id;
                            data.msg.items.forEach((item)=>{
                                self.srcList.push(self.$api.file_file + '/' + item.id)
                            })
                        }
                    }
                })
            },
            update(){
                this.getImageListData();
            },
        },
    }
</script>

<style lang="scss">
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