<template>
  <div id="write-article">
    <Header></Header>
    <div class="write-article-content">
      <div class="title">
        <el-input type="text" v-model="articleTitle" size="" placeholder="请输入文章标题"></el-input>
      </div>
      <div id="editor" type="text/plain" style="width:100%;height:600px; margin-top: 10px;"></div>
      <div class="btn">
        <el-button type="primary" size="small" @click="save(0)">保存草稿</el-button>
        <el-button type="primary" size="small" @click="save(1)">提交审核</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  import Header from '../components/header.vue'
  import MainTop from '../components/main-top.vue'

  export default {
    components: {
      Header,
      MainTop,
    },
    data() {
      return {
        articleTitle: "",
        articleHtml: "",
        uid: "",
        token: "",
      }
    },
    created() {
      this.uid = JSON.parse(localStorage.userInfo).uid;
      this.token = JSON.parse(localStorage.userInfo).token;
      if (this.$route.query.id) {
        console.log(this.$route.query.id)
        this.getArticleDetailById(this.$route.query.id);
      }
    },
    mounted: function () {
      this.editorInt();
    },
    methods: {

      //根据id查询文章详情
      getArticleDetailById(id) {
        var self = this;
        $.ajax({
          url: self.apiHost + "/daka/news/detail_web",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            uid: self.uid,
            token: "84ca274813a44e30a61b6db5cbe5c07a",
            isTest: true,
            newsId: id
          },
          success: function (data) {
            if (data.code == 0) {
              self.articleTitle = data.data.title
              self.articleHtml = data.data.content
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              setTimeout(function () {
                self.$router.push("/")
              }, 2000);
            }
          }
        })
      },
      editorInt: function () {
        var self = this;
        var head = document.getElementsByTagName('head')[0];
        var ueditorAll = document.createElement('script');
        ueditorAll.src = 'static/ueditor/ueditor.all.js';
        ueditorAll.setAttribute('type', 'text/javascript');
        ueditorAll.setAttribute('charset', 'utf-8');
        head.appendChild(ueditorAll);
        ueditorAll.onload = function () {
          var zhCn = document.createElement('script');
          zhCn.src = 'static/ueditor/lang/zh-cn/zh-cn.js';
          zhCn.setAttribute('type', 'text/javascript');
          zhCn.setAttribute('charset', 'utf-8');
          head.appendChild(zhCn);
          zhCn.onload = function () {
            self.editor = UE.getEditor('editor', {
              toolbars: [[
                'fullscreen', 'source', '|',
                'undo', 'redo', '|',
                'pasteplain', 'removeformat', 'selectall', '|',
                'bold', 'underline', '|',
                'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
                'simpleupload', 'insertimage', 'map', '|',
                'inserttable', 'horizontal', 'date', 'time', 'spechars', '|',
                'link', 'unlink', '|',
                'drafts', 'help', '|'
              ]],
              fontsize: [10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42],
              saveInterval: 5000,
              maximumWords: 20000,
              wordCountMsg: '当前已输入 {#count} 个字，您还可以输入{#leave} 个字。',
              wordOverFlowMsg: '<span style="color:red;">正文内容已超过最大字数限制，请适当简化您的内容。</span>',
              elementPathEnabled: false,
              autoHeightEnabled: false,
              retainOnlyLabelPasted: true
            });
            self.editor.ready(function () {
              if(self.$route.query.id) {
                self.editor.setContent(self.articleHtml);
                return;
              }
              if (localStorage.jsonStr) {
                var dataObj = JSON.parse(localStorage.jsonStr);
                self.editor.setContent(dataObj.articleHtml);
                self.articleTitle = dataObj.articleTitle;
              }else {
                self.editor.setContent(self.articleHtml);
              }
            })
          }
        }
      },
//      save() {
//        var self = this;
//        var jsonStr = JSON.stringify({
//          articleTitle: self.articleTitle,
//          articleHtml: self.editor.getContent()
//        });
//        localStorage.jsonStr = jsonStr;
//      },
      save(type) {
        var self = this;
        var url = "";
        var data = {};
        if (self.$route.query.id) {
          url = self.apiHost + "/daka/news/edit";
          data = {
            uid: self.uid,
//            token: self.token,
            token: "84ca274813a44e30a61b6db5cbe5c07a",
            isTest: true,
            newsId: self.$route.query.id,
            title: self.articleTitle,
            content: self.editor.getContent(),
            status: type
          }
        }else {
          url = self.apiHost + "/daka/news/publish";
          data = {
            uid: self.uid,
//            token: self.token,
            token: "84ca274813a44e30a61b6db5cbe5c07a",
            isTest: true,
            title: self.articleTitle,
            content: self.editor.getContent(),
            status: type
          }
        }
        $.ajax({
          url: url,
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: data,
          success: function (data) {
            if (data.code == 0) {
              self.allArticleList = data.data;
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              setTimeout(function () {
                self.$router.push("/")
              }, 2000);
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #write-article {
    .write-article-content {
      width: 1100px;
      margin-left: auto;
      margin-right: auto;
      .title {
        margin-top: 20px;
      }
      .btn {
        padding: 20px 0 10px 0;
      }
    }
  }
</style>
