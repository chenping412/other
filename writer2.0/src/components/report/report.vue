<template>
  <div id="report" class="clearfix">
    <div class="main">
      <div class="control clearfix">
        <div :class="{'model-lead': leadStatus==1}">
          <div class="clearfix">
            <div class="item">
              <span>类型</span>
              <el-select v-model="classChecked" placeholder="请选择类型">
                <el-option
                  v-for="item in classList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="item">
              <span>时间</span>
              <el-date-picker
                v-show="classChecked==1"
                v-model="date"
                :editable="false"
                :clearable="false"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择时间"
                :picker-options="pickerOptions">
              </el-date-picker>
              <el-date-picker
                v-show="classChecked==2"
                v-model="week"
                :editable="false"
                :clearable="false"
                type="week"
                format="yyyy 第 WW 周"
                placeholder="请选择周">
              </el-date-picker>
              <el-date-picker
                v-show="classChecked==3"
                v-model="month"
                :editable="false"
                :clearable="false"
                type="month"
                placeholder="请选择月">
              </el-date-picker>
            </div>
            <div class="right btn">
              <el-button type="primary" :disabled="true" @click="clickWrite()">开始写作<img src="./../../assets/images/icon-write.png"/></el-button>
            </div>
          </div>

          <div class="industry">
            <p class="title">请选择行业：已选择（0/3）</p>
            <el-checkbox-group v-model="industryCheckList" @change="handleCheckedChange">
              <el-checkbox v-for="item in industryList" :label="item.classId" :key="item.classId">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </div>

          <div class="lead">
            <div class="content">
              <div class="item">
                <span>类型</span>
                <el-select v-model="lead1Text" placeholder="请选择类型" size="small"></el-select>
              </div>
              <div class="item">
                <span>时间</span>
                <el-select v-model="lead1Text" placeholder="请选择时间" size="small"></el-select>
              </div>
              <div class="item" style="padding-top: 10px;">
                <span>请选择行业</span>
              </div>
              <p class="tip">在这里选择报告类型和时间哦~最多选3个行业~</p>
              <el-button type="primary" @click="closeLead()">知道了</el-button>
              <el-checkbox class="not-tip" v-model="notTipChecked">下次不再显示</el-checkbox>
            </div>
          </div>
        </div>
      </div>

      <div class="editor">
        <div id="editor" style="height:400px;"></div>


        <div class="see-more" v-show="seeMoreSHow">
          <p>想要查看剩余内容么，请进行<a href="../register.html">注册</a>哦！</p>
        </div>

        <div class="not-write" id="not-write" v-show="notWriteShow">
          <div class="inner">
            <img src="./../../assets/images/roboter-1.png">
            <p>小智温馨提醒<br>
              请选择类型、行业、时间，开始让小智帮您写作吧~</p>
          </div>
        </div>

        <div class="contact" v-show="contactShow">
          <p>想要编辑、改写、获取文章么？赶紧联系商务人员购买吧。<br>
            电话：0755-86720697邮箱：contact@giiso.com</p>
          <span @click="contactShow=false"></span>
        </div>
      </div>

      <div class="btns">
        <el-button type="primary"><img src="./../../assets/images/btn-preview.png"/>预览</el-button>
        <el-button type="primary"><img src="./../../assets/images/btn-copy.png"/>复制</el-button>
        <el-button type="primary"><img src="./../../assets/images/btn-download.png"/>下载</el-button>
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
        classChecked:1,
        classList: [
          {label: "日报", value: 1},
          {label: "周报", value: 2},
          {label: "月报", value: 3}
        ],

        pickerOptions:{
          disabledDate(time){
            if(time.getTime()>new Date().getTime()){
              return true;
            }
          }
        },
        date:'',
        week:'',
        month:'',

        industryList:[
          {name: "宏观经济与资本市场", classId: 1},
          {name: "生物技术与健康产业", classId: 2},
          {name: "信息科技行业", classId: 3}
        ],
        industryCheckList:[],

        loading: false,

        leadStatus:1,
        lead1Text:'',
        notTipChecked:false,

        contactShow:false,
        seeMoreSHow:false,
        notWriteShow:true,
        hsaNoData:false,
      }
    },
    created:function(){
      if((window.localStorage.reportLeadStatus && window.localStorage.reportLeadStatus=='hide') || (window.sessionStorage.reportLeadStatus && window.sessionStorage.reportLeadStatus=='hide')){
        this.leadStatus=0;
      }
      this.getIndustryList();
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

      },
      //获取领域列表
      getIndustryList() {
        var self = this;
        self.$http({
          url: apiHost + "/writer_robot/common/getIndustry",
          data: {},
          success: function (data) {
            if (data.code == 0 && data.data) {
              self.industryList = data.data
            }
          }
        })
      },

      handleCheckedChange:function(){

      },
      //关闭引导浮层
      closeLead(val) {
        this.leadStatus=0;
        if(this.notTipChecked){
          window.localStorage.reportLeadStatus='hide';
        }else {
          window.sessionStorage.reportLeadStatus='hide';
        }
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

  #report .main .control .industry{

  }
  #report .main .control .industry .title{
    font-size: 14px;
    color: #666666;
    line-height: 20px;
    padding:20px 0 10px;
  }

  #report .main .control .model-lead:after{
    bottom: -15px;
    left: 40%;
    margin-left: -5px;
  }
  #report .main .control .model-lead:before{
    top: 108px;
    left: 40%;
    width: 2px;
    height: 400px;
  }
  #report .main .control .model-lead .content{
    padding-top: 50px;
  }
  #report .main .control .model-lead .content .item{
    display: block;
    text-align: center;
    padding:0 0 8px;
    float: none;
  }
  #report .main .control .model-lead .content .tip{
    padding:20px 0 39px;
  }


  #report .hasnodata{
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
