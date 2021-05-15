<template>
    <div :id="'wang-editor-'+index" :style="{'width':width}"></div>
</template>

<script>
    import WangEditor from "wangeditor";

    export default {
        name: "WangEditor",
        props:{
            contentHtml:String,
            content:String,
            index:{
                type:String,
                default:new Date().getTime().toString()
            },
            isMinio:Boolean,
            module_id:undefined,
            module_name:undefined,
            subsystem:undefined,
            width:undefined,
        },
        mounted() {
            this.wangEditorInit();
        },
        methods: {
            wangEditorInit() {
                let self = this;
                self.$nextTick(() => {
                    if (!self.wangEditor) {
                        self.wangEditor = new WangEditor('#wang-editor-'+self.index);
                        self.wangEditor.customConfig.zIndex = 800;
                        self.wangEditor.customConfig.menus = [
                            'bold',  // 粗体
                            'underline',  // 下划线
                            'italic',  // 斜体
                            'strikeThrough',  // 删除线
                            'fontName',  // 字体
                            'fontSize',  // 字号
                            'foreColor',  // 文字颜色
                            'backColor',  // 背景颜色
                            'head',  // 标题
                            'list',  // 列表
                            'justify',  // 对齐方式
                            'link',  // 插入链接
                            'image',  // 插入图片
                            'table',  // 表格
                            // 'code',  // 插入代码
                            'undo',  // 撤销
                            'redo',  // 重复

                            // 'quote',  // 引用
                            // 'emoticon',  // 表情
                            // 'video',  // 插入视频
                        ];
                        self.wangEditor.customConfig.fontNames = [
                            '宋体', '黑体', '楷体', '微软雅黑',
                            'Arial', 'Verdana', 'Georgia',
                            'Times New Roman', 'Microsoft JhengHei',
                            'Trebuchet MS', 'Courier New', 'Impact', 'Comic Sans MS', 'Consolas'
                        ];
                        self.wangEditor.customConfig.colors = [
                            '#880000',
                            '#800080',
                            '#ff0000',
                            '#ff00ff',
                            '#000080',
                            '#0000ff',
                            '#00ffff',
                            '#008080',
                            '#008000',
                            '#808000',
                            '#00ff00',
                            '#ffcc00',
                            '#808080',
                            '#c0c0c0',
                            '#000000',
                            '#ffffff'
                        ];

                        self.wangEditor.customConfig.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
                        self.wangEditor.customConfig.customUploadImg = function (resultFiles) {
                            // resultFiles 是 input 中选中的文件列表
                            if(self.isMinio){
                                let nowDay = new Date().getTime();
                                nowDay = nowDay / 1000 / 3600 / 24 * -1;
                                nowDay = parseInt(nowDay.toString()).toString();
                                let subsystem = self.subsystem || nowDay;
                                let module_id = self.module_id || nowDay;

                                let updateUrl = self.$api.oss_file + '/' + subsystem
                                        + '?current_company_id=' + self.$store.state.currentCompany.account_company_id
                                        + '&current_user_id=' + self.$store.state.currentCompany.user_id;
                                if(resultFiles && resultFiles.length>0){
                                    for(let i=0;i<resultFiles.length;i++){
                                        let file = new File([resultFiles[i]], self.module_name + '-' + subsystem + '-' + module_id + '-' + i + '-' + new Date().getTime() + '.png',{type:resultFiles[i].type});
                                        self.$utils.updateFile({
                                            url: updateUrl,
                                            data:{
                                                enctype: "multipart/form-data",
                                                object_id: module_id,
                                                file_type: self.module_name,
                                                entity_uid: subsystem,
                                                files: file,
                                            },
                                            success(result){
                                                if(result.msg){
                                                    self.wangEditor.cmd.do('insertHtml', '<img src="' + (self.$api.oss_file + '/' + result.msg[0].entity_uid + '/' + result.msg[0].id) + '" alt="' + result.msg[0].file_name + '" style="max-width:100%;"/>');
                                                }else {
                                                    self.$message({
                                                        showClose: true,
                                                        message: '图片上传失败！',
                                                        type: 'error'
                                                    });
                                                }
                                            },
                                            error(){
                                                self.$message({
                                                    showClose: true,
                                                    message: '图片上传失败！',
                                                    type: 'error'
                                                });
                                            },
                                        })
                                    }
                                }
                            }else {
                                let updateUrl = self.$api.file_files_list
                                        + '?subsystem=message&module_name=message&module_id=0&current_company_id='
                                        + self.$store.state.currentCompany.account_company_id + '&current_user_id=' + self.$store.state.currentCompany.user_id;
                                if(resultFiles && resultFiles.length>0){
                                    for(let i=0;i<resultFiles.length;i++){
                                        self.$utils.updateFile({
                                            url: updateUrl,
                                            file: resultFiles[i],
                                            success(result){
                                                if(result.msg && result.msg.items && result.msg.items.id){
                                                    self.wangEditor.cmd.do('insertHtml', '<img src="' + (self.$api.file_file + '/' + result.msg.items.id) + '" alt="' + result.msg.items.file_name + '" style="max-width:100%;"/>');
                                                }else {
                                                    self.$message({
                                                        showClose: true,
                                                        message: '图片上传失败！',
                                                        type: 'error'
                                                    });
                                                }
                                            },
                                            error(){
                                                self.$message({
                                                    showClose: true,
                                                    message: '图片上传失败！',
                                                    type: 'error'
                                                });
                                            },
                                        })
                                    }
                                }
                            }

                        };
                        self.wangEditor.customConfig.onchange = function (html) {
                            let content = self.wangEditor.txt.text();
                            self.$emit('update:contentHtml', content ? html : '');
                            self.$emit('update:content', content);
                            self.$emit('change', content ? html : '', content);
                        };
                        self.wangEditor.create();
                        self.wangEditor.txt.html(self.contentHtml)
                    }
                });
            },

            setContent(content) {
                if (this.wangEditor) this.wangEditor.txt.html(content)
            },
            updateContent() {
                if (this.wangEditor) this.wangEditor.txt.html(this.contentHtml)
            },
        }
    }
</script>

<style lang="scss">
    .w-e-text-container {
        height: 400px !important;

        pre {
            border: none;
            border-left: 1px solid #ddd;
            background-color: #f8f8f8;
            padding: 15px 10px;
            font-size: 14px;
            color: #777;
            border-radius: 0;
            white-space: inherit;
        }
    }
</style>