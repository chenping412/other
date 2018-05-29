<template>
  <div id="hot-news" class="clearfix">
    <div class="main">
      <div class="control clearfix">
        <div class="item">
          <span>领域</span>
          <el-select v-model="file" placeholder="请选择" style="width: 100px;">
            <el-option
              v-for="item in fileList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
        <div class="item">
          <span>字数</span>
          <el-select v-model="wordNumber" placeholder="请选择" style="width: 140px;">
            <el-option
              v-for="item in wordList"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </div>
        <div class="item" :class="{'model-lead': leadStatus==1}">
          <span>热点关键词</span>
          <div class="el-input el-input--small" style="width: 180px;">
            <input v-model="keyword" autocomplete="off" placeholder="不超过6个字，可用空格分词" type="text" class="el-input__inner"
                   @keyup.enter="clickWrite">
          </div>
          <span class="fail" v-show="keywordFail">不超过6个字，仅可以用一个空格分词</span>

          <div class="lead">
            <div class="content">
              <div class="item">
                <span>热点关键词</span>
                <el-input v-model="lead1Text" :autofocus="true" style="width: 180px;"></el-input>
              </div>
              <p class="tip">一定要输入热点关键词哦<br>不然小智可能会才思枯竭写不出来哦</p>
              <el-button type="primary" @click="leadStatus=2">下一步</el-button>
            </div>
          </div>

        </div>
        <div class="right btn">
          <el-button :disabled="keywordFail || keyword=='' || loading" type="primary" @click="clickWrite()">开始写作<img
            src="./../../assets/images/icon-write.png"/></el-button>
        </div>
      </div>

      <div class="editor">
        <div id="editor" style="height:400px;"></div>

        <div class="text" id="editor-text" style="display: none">
          <div class="title">
            <span>标题：</span>
            <input v-model="title" :class="{'loading': titleLoading}" type="text"/>
          </div>
          <div class="title">
            <span>作者：</span>
            <input v-model="author" type="text"/>
          </div>
          <div class="title">
            <span>时间：</span>
            <!--<input v-model="time" type="text" />-->
            <el-date-picker
              v-model="time"
              type="date"
              :clearable="false"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </div>

        <div class="see-more" v-show="library.seeMoreSHow">
          <p>想要查看剩余内容么，请进行<a href="../register.html">注册</a>哦！</p>
        </div>

        <div class="not-write" id="not-write" v-show="notWriteShow">
          <div class="inner">
            <img src="./../../assets/images/roboter-1.png">
            <p>小智温馨提醒<br>
              请输入热点关键词开始让小智帮您写作吧</p>
          </div>
        </div>

        <div class="contact" v-show="contactShow && library.contactShow">
          <p>想要编辑、改写、获取文章么？赶紧联系商务人员购买吧。<br>
            电话：0755-86720697邮箱：contact@giiso.com</p>
          <span @click="contactShow=false"></span>
        </div>
      </div>

      <div class="btns">
        <el-button type="primary" :disabled="!title || !author || !articleContent || articleContent=='\n'" @click="clickPreview()">
          <img src="./../../assets/images/btn-preview.png"/>预览
        </el-button>

        <div class="edit-btn" :class="{'model-lead': leadStatus==3}">
          <el-button type="primary" :disabled="true">
            <img src="./../../assets/images/btn-edit.png"/>改写
          </el-button>
          <p class="tool-tip">
            <span>主人如果对小智写的文章都不满意，可以将自己喜欢的文章粘贴到编辑区域或点击右侧的相关资讯替换到编辑区</span>
          </p>
          <div class="lead">
            <div class="content">
              <div class="img" :class="{'show': leadStatus==3}">
                <img src="./../../assets/images/popup-icon-edit.png">
              </div>
              <p class="tip">1.主人如果对小智写的文章都不满意，可以将自己喜欢的文章粘贴到编辑区域或点击右侧的相关资讯替换到编辑区<br>
                2.[改写]按钮变蓝说明该文章可以进行改写操作</p>
              <el-button type="primary" @click="closeLead()">知道了</el-button>
              <el-checkbox class="not-tip" v-model="notTipChecked">下次不再显示</el-checkbox>
            </div>
          </div>
        </div>

        <el-button class="js-copy" type="primary" :data-clipboard-text="copyText" :disabled="!title || !author || !articleContent || articleContent=='\n'">
          <img src="./../../assets/images/btn-copy.png"/>复制
        </el-button>
        <el-button type="primary" :disabled="!title || !author || !articleContent || articleContent=='\n'" @click="downLoadWord()">
          <img src="./../../assets/images/btn-download.png"/>下载
        </el-button>
      </div>

    </div>
    <div class="relate-news" :class="{'model-lead': leadStatus==2}">
      <div class="top">
        <h3>{{aiListData.length>2 ? 'AI写作':'相关推荐'}}</h3>
      </div>
      <ul class="list">
        <li v-for="(item,$index) in aiListShow" :class="{'active': item.active}"
            @click="clickRelateNewsList(item,$index)">
          <h4 :class="{'loading': !item.title}">{{item.title}}</h4>
          <p>{{item.summary}}</p>
        </li>
        <li v-for="(item,$index) in newsListShow" :class="{'active': item.active}"
            @click="clickRelateNewsList(item,$index)">
          <h4 :class="{'loading': !item.title}">{{item.title}}</h4>
          <p>{{item.summary}}</p>
        </li>
      </ul>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :current-page="pageNum"
          :total="newsList.length"
          layout=" prev, pager, next" background small>
        </el-pagination>
      </div>

      <div class="lead">
        <div class="content">
          <div class="top">
            <h3>相关推荐</h3>
          </div>
          <ul class="list">
            <li :class="{'show': leadStatus==2}">
              <p>习近平在十九届中央国家安全委员会第一次会议上强调：全面贯彻落实总体国家安全观 开创新时代国家安全工作新局面</p>
            </li>
          </ul>
          <p class="tip">这里可以选择查看更多小智写的文章哦~</p>
          <el-button type="primary" @click="leadStatus=3">下一步</el-button>
        </div>
      </div>

    </div>

    <div class="lead-model" v-show="leadStatus!=0"></div>
    <Loading :loading="loading"></Loading>
  </div>
</template>

<script>
  import Loading from './../Loading.vue'
  export default {
    components: {
      Loading
    },
    data: function () {
      return {
        file: '全部',
        fileList: [],
        wordNumber: 800,
        wordList: [{
          code: 800,
          name: '800字'
        }, {
          code: 1500,
          name: '1000-1500字'
        }, {
          code: 2000,
          name: '1500-2000字'
        }],
        keyword: '范冰冰',
        title: '',
        author: '',
        time: '',
        articleHtml: '',
        articleContent: '',

        aiListData: [],
        relateNewsListData: [],
        editeIndex: 0,


        pageSize: 3,
        pageNum: 1,

        titleLoading: false,
        loading: false,

        leadStatus: 1,
        lead1Text: '',
        notTipChecked: false,

        keywordFail: false,
        contactShow: true,
        notWriteShow: true,
      }
    },
    computed: {
      aiListShow: function () {
        var arr = [];
        if (this.aiListData.length < 2) {
          arr = this.aiListData
        }
        return arr;
      },
      newsList: function () {
        var arr = [];
        if (this.aiListData.length >= 2) {
          arr = this.aiListData;
        } else {
          arr = this.relateNewsListData;
        }
        return arr;
      },
      newsListShow: function () {
        return this.newsList.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize)
      },
      copyText: function () {
        var str = '';
        if (!this.title) {
          str = 'false-title'
        } else if (!this.author) {
          str = 'false-author'
        } else if (!this.time) {
          str = 'false-time'
        } else if (!this.articleContent || this.articleContent=='\n') {
          str = 'false-content'
        } else {
          str = '标题：' + this.title + '\n\r'
            + '作者：' + this.author + '\n\r'
            + '时间：' + this.time + '\n\r'
            + '内容：\n' + this.articleContent + '\n'
        }
        return str
      }
    },
    watch: {
      keyword: function (val, oldVal) {
        if (val == '') {
          this.keywordFail = false;
        } else {
          var str = val.replace(/ /g, '');
          if (str.length > 6) {
            this.keyword = oldVal;
          } else {
            var arr = val.split(' ');
            if (arr.length > 2) {
              this.keywordFail = true;
            } else {
              this.keywordFail = false;
            }
          }
        }
      }
    },
    created: function () {
      if ((window.localStorage.hotNewsLeadStatus && window.localStorage.hotNewsLeadStatus == 'hide') || (window.sessionStorage.hotNewsLeadStatus && window.sessionStorage.hotNewsLeadStatus == 'hide')) {
        this.leadStatus = 0;
      }

      this.getFileList();

    },
    mounted: function () {
      this.init();
      this.editorInt();
      this.windowReset();
    },
    destroyed: function () {
      if (this.editor) this.editor.destroy();
    },
    methods: {
      init: function () {
        var self = this;
        var lead1Text = '叙利亚';
        var m = 0;
        setInterval(function () {
          m++;
          if (m > lead1Text.length) m = 0;
          self.lead1Text = lead1Text.slice(0, m);
        }, 500)
      },
      //获取领域列表
      getFileList() {
        var self = this;
        self.$http({
          url: apiHost + "/writer_robot/common/getTags.do",
          data: {},
          success: function (data) {
            if (data.code == 0 && data.data) {
              self.fileList = data.data
            }
          }
        })
      },
      //开始写作
      clickWrite(){
        var self = this;
        if (self.keyword == '') {
          self.$alert('请输入热点关键词哦！', '提示', {
            type: 'warning'
          });
          return false;
        }
        self.title = '';
        self.author = '';
        self.time = '';
        self.aiListData = [];
        self.relateNewsListData = [];
        self.editor.setContent('');
        self.pageSize = 3;
        self.getAIListData();

      },
      //获取AI写作列表
      getAIListData: function () {
        var self = this;
        self.loading = true;
        var url = apiHost + "/writer_robot/hotnews/snapshot.do";
        if (!self.library.contactShow) {
          url = apiHost + "/writer_robot/hotnews/write.do"
        }
        self.$http({
          url: url,
          data: {
            keyword: self.keyword,
            sl: self.wordNumber,
            tags: self.file == '全部' ? '' : self.file
          },
          success: function (data) {
            if (data.code == '0' && data.data && data.data.ai_data && data.data.ai_data.result && data.data.ai_data.result.length > 0) {
              self.aiListData = data.data.ai_data.result;
              self.loading = false;
              self.notWriteShow = false;

              self.time = self.getTime();
              self.author = 'giiso';

              var str = '';
              if (self.library.contactShow) {
                //此处将生成图片展示到编辑器中
              str = '<p style="text-align: center"><img src="'+ self.aiListData[0].snapshot +'"></p>';
              } else {
                //此处处理换行符在ueditor中无法正常换行，把\n替换成段落p标签
                str = "<p>" + self.aiListData[0].content.replace(/\n/g, "</p><p>") + "</p>";
              }
              self.editor.setContent(str);
              self.$set(self.aiListData[0], 'active', true);

              //标题生成逻辑
              self.titleLoading = true;
              var m = 0;
              self.timer = setInterval(function () {
                self.getTitle(self.aiListData[m]._id, function (data, _id) {
                  if (data.code == '0') {
                    for (var j = 0; j < self.aiListData.length; j++) {
                      if (self.aiListData[j]._id == _id) {
                        self.$set(self.aiListData[j], 'title', data.data);
                        if (j == self.editeIndex) {
                          self.titleLoading = false;
                          self.title = data.data;
                        }
                        break;
                      }
                    }
                  }
                });
                m++;
                if (m >= self.aiListData.length) {
                  clearInterval(self.timer)
                }
              }, 200);


              if (self.aiListData.length == 1) {
                self.pageSize = 2;
                self.getRelateNewsListData();
              }
            } else {
              self.getRelateNewsListData(true);
            }
          },
          error: function () {
            self.getRelateNewsListData(true);
          }
        })
      },

      //标题生成
      getTitle: function (id, callback) {
        var self = this;
        self.$http({
          url: apiHost + "/writer_robot/hotnews/createTitle.do",
          data: {
            id: id
          },
          success: function (data) {
            if (callback) callback(data, id);
          }
        })
      },

      //获取推荐资讯列表
      getRelateNewsListData: function (hasNoAiNews) {
        var self = this;
        var url = apiHost + "/writer_robot/hotnews/suggest/snapshot.do";
        if (!self.library.contactShow) {
          url = apiHost + "/writer_robot/hotnews/suggest/search.do"
        }
        self.$http({
          url: url,
          type: "POST",
          data: {
            keyword: self.keyword,
            cluster: hasNoAiNews ? 15 : 10
          },
          success: function (data) {
            self.loading = false;
            if (data.code == '0' && data.data && data.data.length > 0) {
              self.relateNewsListData = data.data;
              if (hasNoAiNews) {
                self.notWriteShow = false;
                self.time = self.getTime();
                self.author = 'giiso';
                self.title = self.relateNewsListData[0].title;
                var str = '';
                if (self.library.contactShow) {
                  //此处将生成图片展示到编辑器中
                str = '<p style="text-align: center"><img src="'+ self.relateNewsListData[0].snapshot +'"></p>';
                } else {
                  //此处处理换行符在ueditor中无法正常换行，把\n替换成段落p标签
                  str = "<p>" + self.relateNewsListData[0].content.replace(/\n/g, "</p><p>") + "</p>";
                }
                self.editor.setContent(str);
                self.$set(self.relateNewsListData[0], 'active', true);
              }
            } else {
              if (self.aiListData.length == 0) {
                self.$message.error('对不起，未写出有效内容，请更换关键词！');
              }
            }
          },
          error: function () {
            self.loading = false;
            self.$message.error('对不起，服务器出错！');
          }
        })
      },
      //点击相关列表，导入选中内容
      clickRelateNewsList: function (item, index) {
        var self = this;
        self.$confirm('您确定要替换编辑区域的文章标题和内容么？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          self.editeIndex = (self.pageNum - 1) * self.pageSize + index;
          if (item.title) {
            self.title = item.title;
          } else {
            self.title = '';
            self.titleLoading = true;
          }
          var str = '';
          if (self.library.contactShow) {
            //此处将生成图片展示到编辑器中
            str = '<p style="text-align: center"><img src="'+ item.snapshot +'"></p>';
          } else {
            //此处处理换行符在ueditor中无法正常换行，把\n替换成段落p标签
            str = "<p>" + item.content.replace(/\n/g, "</p><p>") + "</p>";
          }
          self.editor.setContent(str);

          //切换class
          for (var i = 0; i < self.aiListShow.length; i++) {
            self.$set(self.aiListShow[i], 'active', false);
          }
          for (var i = 0; i < self.newsList.length; i++) {
            self.$set(self.newsList[i], 'active', false);
          }
          item.active = true;

        }).catch(function () {

        });
      },



      //点击预览
      clickPreview:function(){
        var self=this;
        var previewId='previewId_'+self.generateUUID();
        window.sessionStorage[previewId]=JSON.stringify({
          title:self.title,
          author:self.author,
          time:self.time,
          article:self.articleHtml
        });
        setTimeout(function(){
          window.open('./static/preview/index.html?previewId='+previewId);
        },100)
      },
      //导出word文档
      downLoadWord: function () {
        var self=this;

        self.$confirm('您确定要下载么？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          self.$http({
            url: apiHost + "/writer_robot/hotnews/download.do",
            data: {
              title: self.title,
              author: self.author,
              time: self.time,
              content: self.articleContent
            },
            success: function (data) {
              window.location.href=data;
            }
          })
        }).catch(function () {

        });

      },






      //分页
      handleCurrentChange(val) {
        this.pageNum = val;
      },
      //关闭引导浮层
      closeLead(val) {
        this.leadStatus = 0;
        if (this.notTipChecked) {
          window.localStorage.hotNewsLeadStatus = 'hide';
        } else {
          window.sessionStorage.hotNewsLeadStatus = 'hide';
        }
      },
      generateUUID: function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxxyxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
      },
      getTime() {
        var now = new Date();
        var y = now.getFullYear();
        var M = now.getMonth() + 1;
        if (M < 10) M = "0" + M;
        var d = now.getDate();
        if (d < 10) d = "0" + d;

        return  y + "-" + M + "-" + d;
      },
      //富文本编辑器初始化程序
      editorInt: function () {
        var self = this;
        self.changeHeight();

        self.editor = UE.getEditor('editor', {
          toolbars: [[
            'source', '|',
            'undo', 'redo', '|',
            'pasteplain', 'removeformat', 'selectall', '|',
            'paragraph', 'fontfamily', 'fontsize', 'forecolor', 'bold', 'italic', 'underline', 'fontborder', 'superscript', 'subscript', 'blockquote', '|',
            'drafts',
          ], [
            'insertorderedlist', 'insertunorderedlist', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
            'inserttable',
//            'horizontal', 'date', 'time', 'spechars', '|',
            'simpleupload', 'insertimage', 'emotion', '|',

          ]],
          fontsize: [10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42],
          wordCount: false,
          elementPathEnabled: false,
          autoHeightEnabled: true,
          retainOnlyLabelPasted: true
        });
        self.editor.ready(function (editor) {
          self.changeHeight();
          self.$("#editor-text").insertAfter(self.$(".edui-editor-toolbarbox")).show();
          var iframeDocument = self.$(document.getElementById('editor').getElementsByTagName('iframe')[0]).contents().find("head");
          iframeDocument.append('<style type="text/css">' +
            'body{margin: 10px 20px 20px 25px;}' +
            'body::-webkit-scrollbar{width: 4px;}' +
            'body::-webkit-scrollbar-thumb{background: #D8D8D8;border-radius: 4px;}' +
            'img{max-width: 100%;}' +
            'p{font-size: 14px;color: #333333;line-height: 20px;margin-bottom: 20px;font-family: PingFang SC, Hiragino Sans GB, Microsoft Yahei, sans-serif;}' +
            '</style>')
        });
        self.editor.addListener('contentChange', function (editor) {
          self.articleHtml = self.editor.getContent();
          self.articleContent = self.editor.getPlainTxt();
        })
      },
      //预设编辑器高度
      changeHeight: function () {
        var self = this;
        var mainBoxHeight = self.$('#hot-news').find('.main').outerHeight();
        var controlBoxHeight = self.$('#hot-news').find('.control').outerHeight();
        var btnsBoxHeight = self.$('#hot-news').find('.btns').outerHeight();
        self.$('.edui-editor').height(mainBoxHeight - controlBoxHeight - btnsBoxHeight - 90);
        self.$('#editor').height(mainBoxHeight - controlBoxHeight - btnsBoxHeight - 90);
        self.$('#not-write').height(mainBoxHeight - controlBoxHeight - btnsBoxHeight - 90);
      },
      //预设编辑器高度
      windowReset: function () {
        var self = this;
        window.onresize = function () {
          self.changeHeight();
        }
      }
    }
  }
</script>

<style>

  #hot-news {
    min-width: 1100px;
  }

  #hot-news .main .control .item {
    position: relative;
  }

  #hot-news .main .control .item .fail {
    position: absolute;
    color: red;
    font-size: 12px;
    left: 82px;
    top: 37px;
    white-space: nowrap;
  }

  #hot-news .main .control .item.model-lead:after {
    bottom: -15px;
    left: 105px;
  }

  #hot-news .main .control .item.model-lead:before {
    top: 48px;
    left: 110px;
    width: 2px;
    height: 400px;
  }

  #hot-news .main .control .item.model-lead .content .item {
    display: inline-block;
    padding: 83px 0 30px;
    float: none;
  }

  #hot-news .main .control .item.model-lead .content .tip {
    padding-bottom: 60px;
  }

  #hot-news .main .editor .text {
    padding: 20px 0 10px;
    background: #fff;
    border-bottom: 1px solid #dddddd;
  }

  #hot-news .main .editor .text .title {
    padding-left: 25px;
  }

  #hot-news .main .editor .text .title > span,
  #hot-news .main .editor .text .title input {
    font-size: 18px;
    color: #000000;
    font-weight: bolder;
    line-height: 25px;
  }

  #hot-news .main .editor .text input {
    height: 25px;
    border: none;
    background: transparent;
    width: 86%;
  }

  #hot-news .main .editor .text input.loading {
    background: url('./../../assets/images/loading.gif') no-repeat left center;
    background-size: 16px;
  }

  #hot-news .main .editor .text .el-date-editor.el-input {
    width: 140px;
  }

  #hot-news .main .btns .edit-btn {
    display: inline-block;
    margin: 0 17px;
    position: relative;
  }

  #hot-news .main .btns .edit-btn .tool-tip {
    position: absolute;
    right: -9px;
    top: -9px;
    width: 18px;
    height: 18px;
    background: url("./../../assets/images/tips-question.png") no-repeat center;
  }

  #hot-news .main .btns .edit-btn .tool-tip:hover span {
    display: block;
  }

  #hot-news .main .btns .edit-btn .tool-tip span {
    display: none;
    position: absolute;
    left: -20px;
    bottom: 27px;
    width: 374px;
    padding: 8px 12px;
    font-size: 12px;
    color: #FFFFFF;
    line-height: 17px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 6px;
    z-index: 19999;
    text-align: left;
  }

  #hot-news .main .btns .edit-btn .tool-tip span:after {
    content: '';
    position: absolute;
    left: 23px;
    bottom: -12px;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.8);
  }

  #hot-news .main .btns .edit-btn.model-lead {
    box-shadow: 0 0 0 6px #ffffff;
  }

  #hot-news .main .btns .edit-btn.model-lead:after {
    top: -12px;
    left: 45px;
  }

  #hot-news .main .btns .edit-btn.model-lead:before {
    bottom: 48px;
    left: 50px;
    width: 2px;
    height: 450px;
  }

  #hot-news .main .btns .edit-btn.model-lead .content {
    padding-top: 42px;
  }

  #hot-news .main .btns .edit-btn.model-lead .content .img {
    width: 90px;
    height: 63px;
    padding-top: 27px;
    margin: 0 auto 17px;
    background: #8495A9;
    border-radius: 50%;
    transform: scale(0.6);
  }

  #hot-news .main .btns .edit-btn.model-lead .content .img.show {
    animation: imgShow 0.8s 0.3s forwards;
  }

  @keyframes imgShow {
    0% {
      transform: scale(0.6);
    }
    40% {
      transform: scale(1);
    }
    70% {
      transform: scale(0.8);
    }
    100% {
      transform: scale(1);
    }
  }

  #hot-news .main .btns .edit-btn.model-lead .content .img img {
    width: 36px;
  }

  #hot-news .main .btns .edit-btn.model-lead .content .tip {
    padding-bottom: 35px;
    width: 352px;
    margin: 0 auto;
  }

  #hot-news .relate-news {
    float: left;
    margin-left: 10px;
    width: 280px;
    height: 100%;
    padding-top: 10px;
  }

  #hot-news .relate-news .top {
    padding: 25px 26px;
    margin-bottom: 10px;
    background: #FFFFFF;
    box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.09);
  }

  #hot-news .relate-news .top h3 {
    font-size: 16px;
    color: #000000;
    font-weight: bolder;
    line-height: 22px;
    border-left: 3px solid #0276FE;
    padding-left: 10px;
  }

  #hot-news .relate-news .list li {
    background: #F5F6F7;
    padding: 29px 21px 33px 25px;
    cursor: pointer;
    margin-bottom: 10px;
    border-right: 4px solid transparent;
  }

  #hot-news .relate-news .list li.active {
    border-color: #0276FE;
    background: #FFFFFF;
  }

  #hot-news .relate-news .list li h4 {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font-size: 14px;
    color: #000000;
    font-weight: bolder;
    line-height: 20px;
    max-height: 40px;
    margin-bottom: 7px;
  }

  #hot-news .relate-news .list li h4.loading {
    background: url('./../../assets/images/loading.gif') no-repeat center;
    background-size: 16px;
    height: 40px;
  }

  #hot-news .relate-news .list li p {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    font-size: 12px;
    color: #919191;
    line-height: 17px;
    max-height: 68px;
  }

  #hot-news .relate-news .pagination {
    padding: 12px 0 10px;
    background: #fff;
  }

  #hot-news .relate-news.model-lead {
    background-color: #ebeff2;
    box-shadow: 0 0 0 10px #ebeff2;
  }

  #hot-news .relate-news.model-lead:after {
    left: -15px;
    top: 38%;
  }

  #hot-news .relate-news.model-lead:before {
    top: 38%;
    right: 280px;
    width: 600px;
    height: 2px;
    margin-top: 5px;
  }

  #hot-news .relate-news.model-lead .content {
    padding-top: 36px;
  }

  #hot-news .relate-news.model-lead .content .top {
    padding: 16px 20px;
    width: 170px;
    margin: 0 auto 6px;
  }

  #hot-news .relate-news.model-lead .content .list {
    width: 210px;
    margin: 0 auto;
    overflow: hidden;
    padding-bottom: 20px;
    height: 92px;
  }

  #hot-news .relate-news.model-lead .content .list li {
    padding: 12px 18px;
    background: #FFFFFF;
    box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.09);
    transform: translateY(-120%);
    margin: 0;
  }

  #hot-news .relate-news.model-lead .content .list li.show {
    animation: listShow 0.8s 0.3s forwards;
  }

  @keyframes listShow {
    0% {
      transform: translateY(-120%);
    }
    100% {
      transform: translateY(0);
    }
  }

  #hot-news .relate-news.model-lead .content .tip {
    padding: 0 0 22px;
  }

  #hot-news #editor {
    padding-top: 61px;
    position: relative;
  }

  /*富文本编辑器样式覆盖*/
  #hot-news .edui-editor {
    width: auto !important;
    position: static;
    overflow-y: scroll;
  }

  #hot-news .edui-editor::-webkit-scrollbar {
    width: 6px;
  }

  #hot-news .edui-editor::-webkit-scrollbar-thumb {
    background: #D8D8D8;
    border-radius: 4px;
  }

  #hot-news .edui-editor-toolbarbox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
  }

  #hot-news .edui-editor-iframeholder {
    width: auto !important;
  }


</style>
