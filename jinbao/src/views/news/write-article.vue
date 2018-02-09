<template>
  <div id="write-article">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">资讯管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/index/news-neibugaojianku' }">内部稿件库</el-breadcrumb-item>
        <el-breadcrumb-item>写文章</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="write-article-main">
      <el-row>
        <el-col :span="24">
          <div class="channel-type-radio">
            <el-radio v-model="radio" label="0">普通频道</el-radio>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="channel-type-class">
            <el-checkbox-group
              v-model="selectClass"
              :disabled="radio==1">
              <el-checkbox v-for="item in channelClass" :label="item.channelName" :key="item.id">{{item.channelName}}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="channel-type-radio">
            <el-radio v-model="radio" label="1">地方频道</el-radio>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="channel-type-class">
            <el-select v-model="city" :disabled="radio==0" placeholder="请选择" size="small" class="select" @change="cityChange">
              <el-option
                v-for="item in cities"
                :key="item.areaNo"
                :label="item.areaName"
                :value="item.areaNo">
              </el-option>
            </el-select>
            <el-select v-model="town" :disabled="radio==0" placeholder="请选择" size="small" class="select">
              <el-option
                v-for="item in towns"
                :key="item.areaNo"
                :label="item.areaName"
                :value="item.areaNo">
              </el-option>
            </el-select>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-switch
            v-model="allowComments"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="允许评论">
          </el-switch>
          <p>关闭后，别人将无法对文章进行评论</p>
        </el-col>
        <el-col :span="8">
          <el-switch
            v-model="relativeRecommend"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="相关推荐">
          </el-switch>
          <p>关闭后，资讯详情将不出现相关推荐的文章</p>
        </el-col>
        <el-col :span="8">
          <el-switch
            v-model="advRecommend"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="广告推荐">
          </el-switch>
          <p>关闭后，资讯详情里相关推荐的文章列表不会出现广告</p>
        </el-col>
      </el-row>
      <el-row class="write-article">
        <el-col :span="24" class="article-title">
          <span>文章标题：</span>
          <el-input type="text" size="small" v-model="articleTitle"></el-input>
        </el-col>
        <el-col :span="24">
          <span>
            文章内容
          </span>
          <div id="editor" type="text/plain" style="width:100%;height:400px; margin-top: 10px;"></div>
        </el-col>
      </el-row>
      <el-row>
        <el-button type="primary" size="small" @click="save">保存</el-button>
        <el-button type="primary" size="small" @click="public">发布</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        radio: "0",
        selectClass: [],
        channelClass: [],
        cities: [],
        city: "",
        towns: [],
        town: "",
        allowComments: true,
        relativeRecommend: true,
        advRecommend: true,
        articleTitle: "",
        articleHtml: "",
      }
    },
    created() {
      this.getNormalChannelClass();
      this.getCities();
    },
    mounted() {
      this.editorInt();
      this.init();
    },
    watch: {
      radio: function (val) {
        if(val == 1) {
          this.selectClass = []
        }
      }
    },
    methods: {
      //初始化数据
      init() {
        var self = this;
        if(localStorage.jsonStr) {
          var dataObj = JSON.parse(localStorage.jsonStr)
          self.radio = dataObj.radio;
          self.city = dataObj.city;
          self.town = dataObj.town;
          self.allowComments = dataObj.allowComments;
          self.relativeRecommend = dataObj.relativeRecommend;
          self.allowCadvRecommendomments = dataObj.allowCadvRecommendomments;
          self.advRecommend = dataObj.advRecommend;
          self.articleTitle = dataObj.articleTitle;
//          self.editor.setContent(self.articleHtml)
        }
      },
      //获取城市列表
      getCities() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/news/channel/get_city",
          type: "post",
          data: {},
          success: function (data) {
            if (data.code == 0) {
              self.cities = data.data;
              if (data.data.length > 0) {
                self.city = data.data[0].areaNo
                self.getTowns(data.data[0].areaNo)
              }
            }
          },
          error: function (err) {
          }
        })
      },
      cityChange(val) {
        this.getTowns(val)
      },
      //获取普通频道分类
      getNormalChannelClass() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/news/channel/get_news_channel",
          type: "post",
          data: {
            type: 0
          },
          success: function (data) {
            if (data.code == 0) {
              self.channelClass = data.data;
            }
          },
          error: function (err) {
          }
        })
      },
      //获取区列表
      getTowns(townCode) {
        var self = this;
        $.ajax({
          url: self.apiHost + "/news/channel/get_parentno",
          type: "post",
          data: {
            parentNo: townCode
          },
          success: function (data) {
            if (data.code == 0) {
              self.towns = data.data;
              if (data.data.length > 0) {
                self.town = data.data[0].areaNo;
              }
            }
          },
          error: function (err) {
          }
        })
      },
      //实例化文本编辑器
      editorInt: function () {
        var self = this;
        var head = document.getElementsByTagName('head')[0];
        var ueditorAll = document.createElement('script');
        ueditorAll.src = 'static/ueditor/ueditor.all.min.js';
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

              if(localStorage.jsonStr) {
                var dataObj = JSON.parse(localStorage.jsonStr);
                self.editor.setContent(dataObj.articleHtml)
              }
            })
          }
        }
      },
      save() {
        var self = this;
        var jsonStr = JSON.stringify({
          radio: self.radio,
          selectClass: self.selectClass,
          city: self.city,
          town: self.town,
          allowComments: self.allowComments,
          relativeRecommend: self.relativeRecommend,
          advRecommend: self.advRecommend,
          articleTitle: self.articleTitle,
          articleHtml: self.editor.getContent(),

        });
        localStorage.jsonStr = jsonStr;
      },
      //发布
      public() {
        var self = this;
        //获取普通频道参数ids
        var ids = [];
        if(self.radio == 0) {
          for(var i=0; i<self.selectClass.length; i++) {
            for(var j=0; j<self.channelClass.length; j++) {
              if(self.selectClass[i] == self.channelClass[j].channelName) {
                ids.push(self.channelClass[j].id)
              }
            }
          }

        }else {
          ids = [self.city, self.town]
        }
        $.ajax({
          url: self.apiHost + "/manage/article/add_article",
          type: "post",
          data: {
            channelIds: ids.join(","),
            type: self.radio,
            isComment: Number(!self.allowComments),
            isRecommend: Number(!self.relativeRecommend),
            isAd: Number(!self.advRecommend),
            title: self.articleTitle,
            content: self.editor.getContent(),
          },
          success: function (data) {
            if (data.code == 0) {

            }
          },
          error: function (err) {
          }
        })
      }

    }
  }
</script>

<style lang="less">
  #write-article {
    .write-article-main {
      .el-row {
        margin-bottom: 20px;
        .channel-type-radio {
          padding: 15px 0;
        }
        .channel-type-class {
          padding: 0 0 15px 25px;
          .select {
            width: 150px;
          }
        }
        p {
          font-size: 12px;
          color: #ccc;
          margin-top: 8px;
        }
        &.write-article {
          span {
            line-height: 30px;
            color: #606266;
            font-size: 14px;
          }
          .article-title {
            padding: 15px 0;
            span {
              float: left;
              margin-right: 20px;
            }
            .el-input {
              float: left;
              width: 300px;
            }
          }
        }
      }
    }
  }
</style>
