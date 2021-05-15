<template>
    <div class="file-list-show-component">
        <ul class="list">
            <li v-for="(item,$index) in fileListShow" :key="$index">
                <a class="file-block"
                   :href="item.isImage ? 'javascript:;' : item.url"
                   :target="!item.isImage ? '_blank' : null"
                   :title="item.file_name">
                    <i :class="item.isImage ? 'el-icon-picture' : 'el-icon-document'"></i>
                    <span class="file-name">{{item.file_name}}</span>
                    <el-image v-if="item.isImage" :src="item.url" :preview-src-list="previewSrcList" :z-index="4999"></el-image>
                </a>
                <a class="close el-icon-close" href="javascript:;" @click="clickDelete(item)" v-if="showDelete"> </a>
            </li>
        </ul>

    </div>
</template>

<script>
    export default {
        props: ['module_id','module_name','subsystem','showDelete','fileList','updateFileList'],
        data() {
            return {
                fileListShow:[],
                previewSrcList:[],
                loading:false,
            }
        },
        watch: {
            module_id() {
                this.init()
            },
            fileList() {
                this.init()
            },
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                if(this.fileList){
                    this.setFileListShow(JSON.parse(JSON.stringify(this.fileList)));
                }else if(this.module_id && this.module_name && this.subsystem){
                    this.getFileListData();
                }
            },
            getFileListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.file_files_list,
                    data:{
                        module_id:self.module_id,
                        module_name:self.module_name,
                        subsystem:self.subsystem,
                    },
                    success: function (data) {
                        self.loading = false;
                        self.fileListShow = [];
                        self.previewSrcList = [];
                        if (data.err_code.length === 0 && data.msg && data.msg.items && data.msg.items.length>0) {
                            self.setFileListShow(data.msg.items)
                        }
                    }
                })
            },
            setFileListShow(list){
                let self = this;
                self.fileListShow = [];
                self.previewSrcList = [];
                for(let i=0;i<list.length;i++){
                    list[i].url = self.$api.file_file + '/' + list[i].id;
                    list[i].isImage = list[i].file_type.indexOf('image')>-1;
                    if(list[i].isImage)self.previewSrcList.push(list[i].url);
                }
                self.fileListShow = list;
                self.$emit('update:updateFileList',self.fileListShow);
                self.$emit('update',self.fileListShow);
            },
            update(){
                this.init();
            },
            setUpdateFileList(){
                this.$emit('update:updateFileList',this.fileListShow)
            },

            clickDelete(item){
                let self = this;
                if(self.fileList){
                    self.fileListShow.splice(self.fileListShow.indexOf(item),1);
                    let list = JSON.parse(JSON.stringify(self.fileListShow));
                    for(let i=0;i<list.length;i++){
                        list[i].url=undefined;
                        list[i].isImage=undefined;
                    }
                    self.$emit('update:fileList',list);
                }else {
                    self.$confirm('确定删除该附件吗？删除后将不可恢复', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning',
                        callback: function (action) {
                            if (action == 'confirm') {
                                self.loading = true;
                                self.$http({
                                    url: self.$api.file_files_list+'/'+item.id,
                                    type: 'DELETE',
                                    success: function (data) {
                                        self.loading = false;
                                        if (data.msg && data.msg.delete && data.msg.delete.status) {
                                            self.$message({
                                                type: 'success',
                                                message: '删除成功！',
                                                showClose: 'true'
                                            });
                                            self.getFileListData();
                                        }else {
                                            self.$message({
                                                type: 'error',
                                                message: '删除失败！',
                                                showClose: 'true'
                                            });
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        },
    }
</script>

<style lang="scss">
    @import "../../assets/css/config";
    .file-list-show-component {
        .list{
            li{
                color: $color-main;
                position: relative;
                font-size: 13px;
                .file-block{
                    position: relative;
                    display: block;
                    padding-left: 4px;
                    margin-right: 22px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    .file-name{
                        margin-left: 5px;
                    }
                    .el-image{
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        &>.el-image__inner{
                            opacity: 0;
                        }
                    }
                }
                .close{
                    position: absolute;
                    right: 4px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                &:hover {
                    background-color: #f5f7fa;
                }
            }
        }
    }
</style>