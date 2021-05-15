<template>
    <div id="wang-editor"></div>
</template>

<script>
    import WangEditor from "wangeditor";

    export default {
        name: "WangEditor",
        props: ['contentHtml', 'content'],
        mounted() {
            this.wangEditorInit();
        },
        methods: {
            wangEditorInit() {
                let self = this;
                self.$nextTick(() => {
                    if (!self.wangEditor) {
                        self.wangEditor = new WangEditor('#wang-editor');
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
                        ]
                        self.wangEditor.customConfig.uploadFileName = 'file';
                        self.wangEditor.customConfig.uploadImgServer = self.$api.file_files_list
                                + '?subsystem=message&module_name=message&module_id=0&current_company_id='
                                + self.$store.state.currentCompany.account_company_id + '&current_user_id=' + self.$store.state.currentCompany.user_id;
                        self.wangEditor.customConfig.uploadImgParamsWithUrl = false;
                        self.wangEditor.customConfig.withCredentials = true;
                        self.wangEditor.customConfig.uploadImgHooks = {
                            success: function (xhr, editor, result) {
                                console.log(result);
                                let originalName = self.wangEditor.uploadImgOriginalName || '';
                                self.wangEditor.command(null, 'insertHtml', '<img src="' + (self.$api.file_file + '/' + result.msg.items.id) + '" alt="' + originalName + '" style="max-width:100%;"/>');

                            },
                            error: function (xhr) {
                                console.log(xhr.status)
                            },
                        };
                        self.wangEditor.customConfig.onchange = function (html) {
                            let content = self.wangEditor.txt.text();
                            self.$emit('update:contentHtml', html);
                            self.$emit('update:content', html);
                            self.$emit('change', html, content);
                        };
                        self.wangEditor.create();
                        self.wangEditor.txt.html(self.contentHtml)
                    }
                });
            },

            setContent(content) {
                if (this.wangEditor) this.wangEditor.txt.html(content)
            }
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