<template>
  <div id="stock" class="clearfix">
    <div class="main">
      <div class="control clearfix">

        <div class="item" :class="{'model-lead': leadStatus==1}">
          <div class="item">
            <span>日期</span>
            <el-date-picker
              v-model="date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"  size="small"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="item">
            <span>时间</span>
            <el-select v-model="time" placeholder="请选择时间" size="small">
              <el-option value="10:30" label="10:30"></el-option>
              <el-option value="11:30" label="11:30"></el-option>
              <el-option value="14:00" label="14:00"></el-option>
              <el-option value="15:00" label="15:00"></el-option>
            </el-select>
          </div>

          <div class="lead">
            <div class="content">
              <div class="item">
                <span>日期</span>
                <el-select v-model="lead1Text" placeholder="请选择日期" size="small">
                </el-select>
              </div>
              <div class="item">
                <span>时间</span>
                <el-select v-model="lead1Text" placeholder="请选择时间" size="small">
                </el-select>
              </div>
              <p class="tip"> 在这里选择日期、时间后，才可以写作哦~</p>
              <el-button type="primary" @click="closeLead">知道了</el-button>
              <el-checkbox class="not-tip" v-model="notTipChecked">下次不再显示</el-checkbox>
            </div>
          </div>

        </div>
        <div class="right btn">
          <el-button type="primary" :disabled="loading"  @click="clickWrite()">开始写作<img src="./../../assets/images/icon-write.png"/></el-button>
        </div>
      </div>

      <div class="editor">
        <div id="editor" style="height:400px;"></div>


        <div class="see-more" v-show="library.seeMoreSHow">
          <p>想要查看剩余内容么，请进行<a href="../register.html">注册</a>哦！</p>
        </div>

        <div class="not-write" id="not-write" v-show="notWriteShow">
          <div class="inner">
            <img src="./../../assets/images/roboter-1.png">
            <p>小智温馨提醒<br>
              请输入日期、时间，开始让小智帮您写作吧</p>
          </div>
        </div>

        <div class="contact" v-show="contactShow && library.contactShow">
          <p>想要编辑、改写、获取文章么？赶紧联系商务人员购买吧。<br>
            电话：0755-86720697邮箱：contact@giiso.com</p>
          <span @click="contactShow=false"></span>
        </div>
      </div>

      <div class="btns">
        <el-button type="primary" :disabled="!articleContent || articleContent=='\n'" @click="clickPreview()">
          <img src="./../../assets/images/btn-preview.png"/>预览
        </el-button>
        <el-button class="js-copy" type="primary" :data-clipboard-text="!articleContent || articleContent=='\n' ? 'false' : articleContent" :disabled="!articleContent || articleContent=='\n'">
          <img src="./../../assets/images/btn-copy.png"/>复制
        </el-button>
        <el-button type="primary" :disabled="!articleContent || articleContent=='\n'" @click="downLoadWord()">
          <img src="./../../assets/images/btn-download.png"/>下载
        </el-button>
      </div>

    </div>

    <p class="hasnodata" v-show="hsaNoData">您选择的时间无数据，请重新选择</p>
    <div class="lead-model" v-show="leadStatus!=0"></div>
    <Loading :loading="loading"></Loading>
  </div>
</template>

<script>
  import Loading from './../Loading.vue'
  export default {
    components:{
      Loading
    },
    data: function () {
      return {
        pickerOptions:{
          disabledDate(time){
            if(time.getTime()>new Date().getTime()){
              return true;
            }
            var week=time.getDay();
            if(week == 0 || week ==6){
              return true;
            }
          }
        },
        date:'',
        time:'10:30',
        articleHtml: '',
        articleContent: '',


        loading: false,

        leadStatus:1,
        lead1Text:'',
        notTipChecked:false,

        contactShow: true,
        notWriteShow: true,
        hsaNoData:false,
      }
    },
    created:function(){
      var self=this;
      if((window.localStorage.stockLeadStatus && window.localStorage.stockLeadStatus=='hide') || (window.sessionStorage.stockLeadStatus && window.sessionStorage.stockLeadStatus=='hide')){
        this.leadStatus=0;
      }
      this.date=this.getTime();
    },
    mounted: function () {
      this.editorInt();
      this.windowReset();
    },
    destroyed: function () {
      if(this.editor) this.editor.destroy();
    },
    methods: {
      //开始写作
      clickWrite(){
        var self = this;
        self.loading = true;
        var url = apiHost + "/writer_robot/stock/snapshot.do";
        if (!self.library.contactShow) {
          url = apiHost + "/writer_robot/stock/write.do"
        }
        self.$http({
          url: url,
          data: {
            date:self.date+' '+self.time+':00'
          },
          success: function (data) {
            self.loading = false;
            setTimeout(function(){
              if (data.code == '0' && data.data && data.data.d) {
                self.notWriteShow = false;

                var str = '';
                if (self.library.contactShow) {
                  //此处将生成图片展示到编辑器中
                  str = '<p style="text-align: center"><img src="'+ self.aiListData[0].snapshot +'"></p>';
                } else {
                  //此处处理换行符在ueditor中无法正常换行，把\n替换成段落p标签
                  str = "<p>" + data.data.d.replace(/\n/g, "</p><p>") + "</p>";
                }
                self.editor.setContent(str);

              } else {
                self.hsaNoData=true;
                setTimeout(function(){
                  self.hsaNoData=false;
                },3000)
              }
            },1100)
          },
          error: function () {
            self.loading = false;
            self.$message.error('对不起，服务器出错！');
          }
        })
      },

      //点击预览
      clickPreview:function(){
        var self=this;
        var previewId='previewId_'+self.generateUUID();
        window.sessionStorage[previewId]=JSON.stringify({
          title:'写股评',
          author:'giiso',
          time:self.date+' '+self.time+':00',
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
              title:'写股评',
              author:'giiso',
              time:self.date+' '+self.time+':00',
              content: self.articleContent
            },
            success: function (data) {
              window.location.href=data;
            }
          })
        }).catch(function () {

        });

      },


      //关闭引导浮层
      closeLead(val) {
        this.leadStatus=0;
        if(this.notTipChecked){
          window.localStorage.stockLeadStatus='hide';
        }else {
          window.sessionStorage.stockLeadStatus='hide';
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
            'paragraph','fontfamily','fontsize', 'forecolor', 'bold', 'italic', 'underline','fontborder','superscript','subscript','blockquote',  '|',
            'drafts',
          ], [
            'insertorderedlist','insertunorderedlist', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
            'inserttable',
//            'horizontal', 'date', 'time', 'spechars', '|',
            'simpleupload', 'insertimage', 'emotion', '|',

          ]],
          fontsize: [10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42],
          wordCount: false,
          elementPathEnabled: false,
          autoHeightEnabled: false,
          retainOnlyLabelPasted: true
        });
        self.editor.ready(function (editor) {
          var iframeDocument=self.$(document.getElementById('editor').getElementsByTagName('iframe')[0]).contents().find("head");
          iframeDocument.append('<style type="text/css">' +
            'body{margin: 10px 20px 20px 25px;}' +
            'body::-webkit-scrollbar{width: 6px;}' +
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
      changeHeight:function(){
        var self=this;
        var mainBoxHeight=self.$('.app-main').find('.main').outerHeight();
        var controlBoxHeight=self.$('.app-main').find('.control').outerHeight();
        var btnsBoxHeight=self.$('.app-main').find('.btns').outerHeight();
        self.$('#editor').height(mainBoxHeight-controlBoxHeight-btnsBoxHeight-90);
        self.$('#not-write').height(mainBoxHeight-controlBoxHeight-btnsBoxHeight-90);
      },
      //预设编辑器高度
      windowReset:function(){
        var self=this;
        window.onresize=function(){
          var mainBoxHeight=self.$('.app-main').find('.main').outerHeight();
          var controlBoxHeight=self.$('.app-main').find('.control').outerHeight();
          var btnsBoxHeight=self.$('.app-main').find('.btns').outerHeight();
          self.$('.edui-editor-iframeholder').height(mainBoxHeight-controlBoxHeight-btnsBoxHeight-90);
          self.$('#not-write').height(mainBoxHeight-controlBoxHeight-btnsBoxHeight-90);
        }
      }
    }
  }
</script>

<style>

  #stock .main .control .item.model-lead:after{
    bottom: -15px;
    right: 15px;
  }
  #stock .main .control .item.model-lead:before{
    top: 48px;
    right: 20px;
    width: 2px;
    height: 400px;
  }
  #stock .main .control .item.model-lead .content{
    padding-top: 80px;
  }
  #stock .main .control .item.model-lead .content .item{
    display: inline-block;
    padding:0 0 5px;
    float: none;
  }
  #stock .main .control .item.model-lead .content .tip{
    padding:24px 0 48px;
  }


  #stock .hasnodata{
    position: fixed;
    left: 42%;
    top:50%;
    transform: translate(-50%,-50%);
    font-size: 12px;
    color: #FFFFFF;
    text-align: center;
    opacity: 0.8;
    background: #000000;
    border-radius: 6px;
    width: 274px;
    height: 60px;
    line-height: 60px;
    z-index: 12000;
  }
</style>
