<template>
  <div id="write-robot">
    <div class="top-else">
      <!--<h2>选择生成简报信息</h2>-->
      <div class="breadcrumb">
        <router-link :to="{ path: '/' }">首页</router-link>
        &gt;
        <span>写作机器人</span>
      </div>
    </div>
    <div class="web_bottom">
      <div class="write-main">
        <div class="filter">
          <div class="filedType clearfix" v-show="filedType==1">
            <div class="clearfix filterArea">
              <div class="filed-title">写作领域</div>
              <div class="filed-input" :class="{'two':dialogVisible}">
                <el-input v-model="filedName" placeholder="请选择您要写作的领域" @focus="showFileds" :readonly=true></el-input>
                <label class="write-area" v-show="!filedName">请选择您要写作的领域</label>
                <div class="filed-model" v-show="dialogVisible">
                  <div class="filed-model-top">选择写作领域 <span>(写作领域仅支持单选)</span></div>
                  <ul class="clearfix filedList">
                    <li v-for="(list,index) in fildList" @click="selectFiled(list,index)">{{list}}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="search">
              <p>请输入关键词</p>
              <div class="form-box">
                <form action="" target="nm_iframe">
                  <input type="text" class="text-input" :disabled="true" v-model="keyWord" placeholder="请输入关键词，多关键词用空格隔开"
                         maxlength="30">
                  <button :disabled="true" class="disabled" type="button">写作</button>
                </form>
              </div>
            </div>
          </div>
          <div class="filedType clearfix" v-show="filedType==3">
            <div class="clearfix filterArea">
              <div class="filed-title">写作领域</div>
              <div class="filed-input" :class="{'two':dialogVisible}">
                <el-input v-model="filedName" placeholder="点击选择" @focus="showFileds" :readonly=true></el-input>
                <label v-show="!filedName">请选择您要写作的领域</label>
                <div class="filed-model" v-show="dialogVisible">
                  <div class="filed-model-top">选择写作领域 <span>(写作领域仅支持单选)</span></div>
                  <ul class="clearfix filedList">
                    <li v-for="(list,index) in fildList" @click="selectFiled(list,index)">{{list}}</li>
                  </ul>
                </div>
              </div>
              <div class="filed-input filed-input2">
                <label>素材采集时间</label>
                <el-select v-model="timeQuantum" placeholder="请选择">
                  <el-option
                    v-for="item in timeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div class="filed-input filed-input3">
                <label>写作字数</label>
                <el-select v-model="wordNumber" placeholder="请选择">
                  <el-option
                    v-for="item in wordList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="search">
              <p>请输入关键词</p>
              <div class="form-box">
                <!--<form @submit="writeArticle()" action="http://tj.giiso.com/www/public/images/download_qr.png"-->
                <form @submit="writeArticle2()" action="http://tj.giiso.com/www/public/images/download_qr.png"
                      target="nm_iframe">
                  <input type="text" class="text-input keyWord" v-model="keyWord" :disabled="btnDisabled"
                         placeholder="请输入关键词，多关键词用空格隔开" maxlength="30">
                  <button :disabled="!(wordNumber && timeQuantum && keyWord && !btnDisabled)"
                          :class="{disabled: !(wordNumber && timeQuantum && keyWord && !btnDisabled)}" type="button"
                          @click="writeArticle2()">写作
                  </button>
                  <!--<el-button :disabled="!(dataPickerValue && stockValue)" type="button" @click="writeArticle()">写作</el-button>-->
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="state-ico" :class="{'state-show':stateShow}">
          <ul>
            <li :class="{'fade-in':state>=1,'fade-out':state>1}">
              <span class="roboter-ico roboter-1"></span>
              <div class="progress">
                <h3>小智收到</h3>
                <p>好开森~~~</p>
                <div class="progress-bar"><span :style="{ 'width':stateBar1+'%' }"></span></div>
                <span>{{stateBar1}}%</span>
              </div>
            </li>
            <li :class="{'fade-in':state>=2,'fade-out':state>2}">
              <span class="roboter-ico roboter-2"></span>
              <div class="progress">
                <h3>搜索资料</h3>
                <p>稍等哦，让我找找资料... </p>
                <div class="progress-bar"><span :style="{ 'width':stateBar2+'%' }"></span></div>
                <span>{{stateBar2}}%</span>
              </div>
            </li>
            <li :class="{'fade-in':state>=3,'fade-out':state>3}">
              <span class="roboter-ico roboter-3"></span>
              <div class="progress">
                <h3>思考一下</h3>
                <p>抱歉，我要好好想想~~~ </p>
                <div class="progress-bar"><span :style="{ 'width':stateBar3+'%' }"></span></div>
                <span>{{stateBar3}}%</span>
              </div>
            </li>
            <li :class="{'fade-in2':state>=4,'fade-out':state>4}">
              <span class="roboter-ico roboter-4"></span>
              <div class="progress">
                <h3>开始写作</h3>
                <p>努力写作中~~~</p>
                <div class="progress-bar"><span :style="{ 'width':stateBar4+'%' }"></span></div>
                <span>{{stateBar4}}%</span>
              </div>
            </li>
            <li :class="{'fade-in2':state>=5,'fade-out':state>5}">
              <span class="roboter-ico roboter-5"></span>
              <div class="progress">
                <h3>完成</h3>
                <p>终于写完了，棒棒哒~~~</p>
                <div class="progress-bar"><span style="width: 100%;"></span></div>
                <span>100%</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="article-title">
          <input v-model="articleTitle" type="text" :disabled="articleTitle==''" placeholder="文章标题生成中……"/>
        </div>
        <div class="article">
          <div class="text-area-out">
            <div class="text-area" id="text-area-div">{{articleData}}<span class="pen-box" id="pen-box"></span></div>
            <textarea v-model="articleData" id="text-area-text" @scroll="textAreaScroll()"></textarea>
          </div>
          <p class="word-number">输出文章约{{articleData.length}}字</p>
        </div>
        <div class="bottom clearfix">
          <button class="btn js-copy" id="saveArticle" :data-clipboard-text="articleData"
                     v-show="pageLength>=pageNum">复制文字
          </button>
          <el-button class="btn nextPage" @click="postShareData()" v-show="pageLength>=pageNum">向好友炫耀一下</el-button>
          <p v-show="pageLength>pageNum">写作效果不满意？<a href="javascript:;" @click="nextPage">换一篇试试 > .<</a></p>
        </div>
      </div>
      <!--<div class="model">-->
        <!--<div class="come-ico" @click="closeWelcomeModel">-->
          <!--<img src="../assets/images/come-ico.png">-->
        <!--</div>-->
      <!--</div>-->
    </div>
    <span class="pen-ico" id="pen-ico" v-show="penShow" style="display: none;"></span>
    <iframe name="nm_iframe" style="display:none;"></iframe>
  </div>
</template>

<script>
  import $ from 'jquery';
  import Clipboard from 'clipboard';

  export default {
    data() {
      return {
        tagIndex: "",
        btnDisabled: false,
        stockSelectDisabled: false,
        stockCode: "",
        textInputDisabled: true,
        stockListDetail: [],
        showStockList: false,
        pageLength: 0,
        pageNum: 1,
        dataPickerValue: "",
        nowDate: "",
        timeQuantum: 1,
        timeList: [{
          value: 1,
          label: '最近一周'
        }, {
          value: 2,
          label: '最近一月'
        }, {
          value: 3,
          label: '最近半年'
        }],
        wordNumber: 800,
        wordList: [{
          value: 800,
          label: '800字'
        }, {
          value: 1500,
          label: '1000-1500'
        }, {
          value: 2000,
          label: '1500-2000'
        }],
        filedName: "",
        filedType: 1,
        fildList: [],
        dialogVisible: false,
        keyWord: "",
        allArticleData: [],
        allArticleData0: [],
        allArticleData1: [],
        allArticleGetNum: 0,
        articleData: "",
        text: " ",
        articleTitle: "",
        mm: 0,
        config: {
          version: 0,
          itype: 2,
          q: "",
          token: "0"
        },
        penShow: false,
        stateShow: false,
        state: 0,
        stateBar1: 0,
        stateBar2: 0,
        stateBar3: 0,
        stateBar5: 0,
        timeInterval: {},
        timeOut: {},
        hideUp: false,
        robotHost: "",
        hostApi: "/stock"
      }
    },
    computed: {
      stateBar4: function () {
        if (this.text.length == 0) {
          return 100;
        } else {
          var m = parseInt(this.mm / this.text.length * 100);
          if (m > 100) m = 100;
          return m;
        }
      }
    },
    watch: {
      allArticleGetNum: function (val) {
        var self = this;
        if (val == 2) {
          var length = self.allArticleData0.length > self.allArticleData1.length ? self.allArticleData0.length : self.allArticleData1.length;
          if (length > 0) {
            for (var i = 0; i < length; i++) {
              if (i < self.allArticleData0.length) {
                self.allArticleData.push(self.allArticleData0[i]);
              }
              if (i < self.allArticleData1.length) {
                self.allArticleData.push(self.allArticleData1[i]);
              }
            }
            self.simulateWrite(self.allArticleData[self.pageNum - 1].summray);
          } else {
            self.simulateWrite('');
          }
          console.log(self.allArticleData)
        }
      },
      articleData: function () {
        var self = this;
        self.$nextTick(function () {
          var height = $("#text-area-text")[0].scrollHeight;
          $("#text-area-text").scrollTop(height);
          $("#text-area-div").scrollTop(height);
          this.penLocation();
        })
      },
      penShow: function () {
        var self = this;
        self.$nextTick(function () {
          self.penLocation();
        });
      },
      stateShow: function () {
        var self = this;
        self.$nextTick(function () {
          self.penLocation();
          setTimeout(function () {
            self.penLocation();
            /*if(self.stateShow==true){
              $(document).scrollTop($('.state-ico').offset().top-10);
            }*/
          }, 1000)
        });

      }
    },
    created() {
      var self = this;
      if (location.host != "robot.giiso.com" && location.host != "writer.giiso.com") {
        self.robotHost = "http://writer.giiso.com";
        self.hostApi = "http://writer.giiso.com/stock";
      }


      $("body").click(function (e) {
        var _con = $(".filed-model");
        if (!_con.is(e.target) && _con.has(e.target).length === 0 && e.target.className != 'el-input__inner') {
          self.dialogVisible = false;
        }
      })
      $("body").click(function (e) {
        var _con = $(".stockListDetail");
        if (!_con.is(e.target) && _con.has(e.target).length === 0 && e.target.className != 'el-input__inner') {
          self.showStockList = false;
        }
      })
      self.getFiledList();
    },
    mounted: function () {
      this.init();
      // this.copyArticle();
      this.getTime();

    },
    methods: {
      //点击在写一篇
      nextPage() {
        var self = this;
        self.pageNum++;
        $('.text-input').blur();
        self.btnDisabled = true;
        clearInterval(self.timeInterval);
        clearTimeout(self.timeOut);
        self.pageLength = 0;
        self.articleTitle = "";
        self.articleData = "";
        //触发小智收到动画
        self.stateShow = true;
        self.timeOut = setTimeout(function () {
          self.state = 1;
          self.penShow = true;
          self.changeStateBar('stateBar1', 1000);
          self.simulateWrite(self.allArticleData[self.pageNum - 1].summray);
        }, 500);
      },
      //获取领域分类列表
      getFiledList() {
        var self = this;
        $.ajax({
          // url: "http://172.16.1.31:9092/industry-bulletin/writer_robot/writer/get_classify",
          url: apiHost + "/industry-bulletin/writer_robot/writer/get_classify",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {},
          success: function (data) {
            if (data.code == 0) {
              self.fildList = data.data;
              self.$nextTick(function () {
                self.selectFiled(self.fildList[0], 0);
              })
            }
          }
        })
      },
      getTime() {
        var self = this;
        var now = new Date();
        var y = now.getFullYear();
        var m = now.getMonth() + 1;
        if (m < 10) {
          m = "0" + m
        }
        var d = now.getDate();
        if (d < 10) {
          d = "0" + d
        }
        self.dataPickerValue = y + "-" + m + "-" + d;
        self.nowDate = y + "-" + m + "-" + d;
        console.log(self.nowDate)
      }
      ,
      showFileds() {
        var self = this;
        self.dialogVisible = true
      }
      ,
      closeWelcomeModel() {
        $(".model").fadeOut();
      }
      ,
      init: function () {
        var self = this;
        self.penLocation();
        setTimeout(function () {
          $(".model").fadeOut();
        }, 3000);
        window.onresize = function () {
          self.penLocation();
        }
      },


      //非股票类型点击写作触发
      writeArticle2: function () {
        var self = this;
        $('.text-input').blur();
        self.btnDisabled = true;
        clearInterval(self.timeInterval);
        clearTimeout(self.timeOut);
        self.pageNum = 1;
        self.pageLength = 0;
        self.articleTitle = "";
        self.articleData = "";
        self.allArticleData = [];
        self.allArticleData0 = [];
        self.allArticleData1 = [];
        self.allArticleGetNum = 0;

        // self.getAllArticleData(0);
        self.getAllArticleData(1);

        //触发小智收到动画
        self.stateShow = true;
        self.timeOut = setTimeout(function () {
          self.state = 1;
          self.penShow = true;
          self.changeStateBar('stateBar1', 1000);
        }, 500)

      },
      //非股票类型写作获取数据
      getAllArticleData: function (version) {
        var self = this;
        $.ajax({
          method: 'POST',
          // url: "http://172.16.1.31:9092/industry-bulletin/writer_robot/writer/write",
          url: apiHost + "/industry-bulletin/writer_robot/writer/write",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            version: version,
            keyword: self.keyWord,
            time: self.timeQuantum,
            sl: self.wordNumber,
            cluster: "",
            tags: self.tagIndex,
            token: 0
          },
          success: function (data) {
            if (data.code == 0 && data.data && data.data.rwnews && data.data.rwnews.result && data.data.rwnews.result.length > 0) {
              if (version == 0) {
                self.allArticleData0 = data.data.rwnews.result;
              } else {
                self.allArticleData1 = data.data.rwnews.result;
              }
            }
            self.allArticleGetNum=2;
          },
          error: function () {
            self.allArticleGetNum++;
          }
        });
      }
      ,
      //模拟文章写作过程,并调用生成标题接口,在获取接口数据后调用
      simulateWrite: function (article) {
        var self = this;
        self.text = article.replace(/ /g, "");
        if (self.text != '') self.getTitle();

        self.timeOut = setTimeout(function () {
          self.state = 2;
          self.changeStateBar('stateBar2', 2000);
          self.timeOut = setTimeout(function () {
            self.state = 3;
            self.changeStateBar('stateBar3', 1000);
            self.timeOut = setTimeout(function () {
              self.state = 4;

              if (self.text == '') {
                self.penShow = false;
                self.state = 5;
                self.btnDisabled = false;
                self.$message({
                  showClose: true,
                  message: '对不起，无有效内容,请修改题目',
                  duration: 3000
                });
              }

              var m = 0;

              function simulateWrite() {
                clearInterval(self.timeInterval);
                self.timeInterval = setInterval(function () {
                  if (m == 0) {
                    self.articleData += "      ";
                  }
                  self.articleData += self.text.slice(m, m + 1);
                  if (self.text.slice(m, m + 1) == "。" || self.text.slice(m, m + 1) == "！") {
                    clearInterval(self.timeInterval);
                    self.timeOut = setTimeout(function () {
                      simulateWrite()
                    }, 700)
                  }

                  var isN = self.text.slice(m, m + 1);
                  if (isN.indexOf("\n") >= 0) {
                    self.articleData += "      ";
                  }

                  m++;
                  self.mm = m;
                  if (m > self.text.length) {
                    clearInterval(self.timeInterval);
                    setTimeout(function () {
                      self.penShow = false;
                      self.state = 5;
                      self.pageLength = self.allArticleData.length;
                      self.btnDisabled = false;
                      if (self.stockValue == 7) {
                        self.textInputDisabled = false
                      }
                    }, 1000)
                  }
                }, 40);
              }

              simulateWrite();
            }, 2000)
          }, 3000)
        }, 2000);


      }
      ,
      //标题生成
      getTitle: function () {
        var self = this;
        $.ajax({
          // url: "http://172.16.1.31:9092/industry-bulletin//writer_robot/writer/headline_generation",
          url: apiHost + "/industry-bulletin/writer_robot/writer/headline_generation",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            article: self.text
          },
          success: function (data) {
            if(data.code == 0) {
              self.articleTitle = data.data;
            }
          }
        })
      },
      //进度条计算，过渡增加进度条百分比
      changeStateBar: function (stateBar, time) {
        var self = this;
        setTimeout(function () {
          var m = 0;
          var timerIIII = setInterval(function () {
            self[stateBar] = m;
            m += 2;
            if (m > 100) {
              clearInterval(timerIIII);
            }
          }, time / 50)
        }, 700)
      },
      //文本域滚动时，隐藏div也跟着滚动
      textAreaScroll: function () {
        var top = $("#text-area-text").scrollTop();
        $("#text-area-div").scrollTop(top);
      }
      ,
      //重新定位笔的位置
      penLocation: function () {
        var offset = $("#pen-box").offset();
        $("#pen-ico").css({
          top: offset.top,
          left: offset.left
        });
      },
      selectFiled(list, index) {
        var self = this;
        self.btnDisabled = false;
        self.tagIndex = list;
        self.state = 0;
        self.articleData = "";
        self.stateShow = false;
        clearInterval(self.timeInterval);
        clearTimeout(self.timeOut);
        self.timeQuantum = 1;
        self.wordNumber = 800;
        self.pageLength = 0;
        $(".filedList li").removeClass("active");
        $(".filedList").each(function (i, el) {
          $(el).find("li").eq(index).addClass("active");
        })
        if (list == "股评") {
          self.keyWord = "股市早评";
          self.stockValue = 1;
          self.filedType = 2;
          self.getTime();
          self.filedName = list;
        } else if (list == "全部") {
          self.filedName = "全部";
          self.keyWord = "";
          self.filedType = 3;
          self.tagIndex = "";
        } else {
          self.keyWord = "";
          self.filedType = 3;
          self.filedName = self.fildList[index];
        }
        self.dialogVisible = false;
      }
      ,
      //复制文本内容
      copyArticle: function () {
        var self = this;
        this.clipboard = new Clipboard('.js-copy');
        //复制成功执行的回调，可选
        this.clipboard.on('success', function (e) {
          self.$message({
            showClose: true,
            message: '复制成功',
            duration: 3000
          });
        });
        //复制失败执行的回调，可选
        this.clipboard.on('error', function (e) {
          self.$message({
            showClose: true,
            message: '复制失败，您的浏览器不支持',
            duration: 3000
          });
        });
      }
      ,
      //上传分享数据，并经过微信授权页面后跳转到分享页
      postShareData: function () {
        var self = this;
        $.ajax({
          url: self.robotHost + "/share/share/upload_article",
          type: "POST",
          data: {
            title: self.articleTitle,
            article: self.articleData,
            keyword: self.keyWord,
            time: self.nowDate,
            sl: self.wordNumber,
            tags: self.filedName
          },
          success: function (data) {
            if (data.code == 0) {
              if (self.isWeixin) {
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7142f10380ce946a&redirect_uri=http%3A%2F%2F" + location.host + "%2Fshare%2Fwx%2Fauth&response_type=code&scope=snsapi_userinfo&state="
                  + data.id + "#wechat_redirect";
              } else {
                window.location.href = "share-page/share.html?id=" + data.id;
              }

            }
          },
          error: function () {

          }
        })
      }
    }
  }
</script>

<style lang="less" type="text/less">

  #write-robot .write-main .search .form-box input:disabled {
    background-color: #eee;
  }

  #write-robot .write-main .search .form-box button.disabled {
    background-color: #ccc;
    border-color: #ccc;
    cursor: not-allowed;
    color: #fff;
  }

  #write-robot .write-main .search .form-box button.disabled:hover {
    background-color: #ccc;
    border-color: #ccc;
    color: #fff;
  }

  .filedList .active {
    background-color: #00a0e9 !important;
    color: #fff !important;
  }

  #write-robot .el-input__inner {
    border-color: #e6e6e6;
    height: 30px;
    border-radius: 4px;
  }

  .pen-ico {
    position: absolute;
    left: 0;
    top: 0;
    width: 139px;
    height: 240px;
    margin: 10px 0 0 -30px;
    background: url("../assets/images/pen-ico.png") no-repeat center/contain;
    z-index: 99;
  }

  .filedType {
  }

  .filterArea {
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
  }

  .filed-title {
    float: left;
    /*width: 96px;*/
    margin-right: 15px;
    height: 30px;
    line-height: 30px;
    color: #666;
    font-size: 14px;
  }

  .filed-input {
    position: relative;
    float: left;
    &:after {
      content: "";
      position: absolute;
      right: 10px;
      top: 12px;
      width: 0;
      height: 0;
      border: 7px solid transparent;
      border-top-color: #bfcbd9;
      transition: all 0.3s;
      transform-origin: 7px 3px;
    }
    &.two:after {
      transform: rotate(180deg);
    }
    .el-input {
      position: relative;
      width: 165px;
      input {
        border-radius: 0;
      }
    }
    label {
      margin: 0 16px;
      color: #666;
    }
    .filed-model {
      position: absolute;
      width: 350px;
      left: 0;
      top: 40px;
      background-color: #fff;
      border: 1px solid #ccc;
      z-index: 999999999;
      .filed-model-top {
        font-size: 14px;
        border-bottom: 1px solid #ccc;
        margin: 0 20px;
        line-height: 62px;
        color: #333;
        font-weight: bold;
        span {
          color: #999;
          font-weight: normal;
        }
      }
      ul {
        padding: 0 15px 15px 15px;
        margin-top: 13px;
        li {
          float: left;
          width: 70px;
          height: 40px;
          cursor: pointer;
          box-sizing: border-box;
          text-align: center;
          line-height: 40px;
          margin: 5px;
          background-color: #f4f4f4;
          color: #666;
          font-size: 14px;
        }
      }
    }
  }

  .filed-input2 {
    float: right;
    &:after {
      border: none;
    }
  }

  .filed-input3 {
    margin: 0 15px;
    float: right;
    &:after {
      border: none;
    }
  }

  .web_banner {
    display: none;
  }

  #write-robot .write-main {
    width: 1074px;
    margin: 0 auto;
    /*padding-top: 61px;*/
    overflow: hidden;
    .filter {
      padding: 15px 50px 0 50px;
      background-color: #fff;
      margin-bottom: 15px;
    }
    .search {
      height: 30px;
      color: #999999;
      font-size: 14px;
      margin: 20px 0;
      p {
        float: left;
        line-height: 30px;
        height: 30px;
        font-size: 14px;
        color: #666;
      }
      .form-box {
        float: right;
        input {
          width: 655px;
          border: 1px solid #e6e6e6;
          line-height: 30px;
          margin-right: 8px;
          font-size: 14px;
          outline: none;
          height: 30px;
          padding-left: 10px;
          border-radius: 4px;
        }
        button {
          width: 150px;
          height: 30px;
          color: #0874ea;
          border: none;
          border-radius: 6px;
          border: 1px solid #0874ea;
          cursor: pointer;
          background-color: #fff;
          margin-left: 17px;
          &:hover {
            background-color: #0874ea;
            color: #fff;
          }
        }
      }
    }
    .state-ico {
      height: 0;
      margin-bottom: 0;
      transition: all ease 0.3s;
      &.state-show {
        height: 78px;
        margin-bottom: 15px;
      }
      ul {
        height: 100%;
        width: 1090px;
        position: relative;
        li {
          width: 1090px;
          height: 78px;
          color: #ffffff;
          position: absolute;
          top: 0;
          left: 100%;
          background: #00a0e9;
          transition: all ease 0.5s;
          .roboter-ico {
            width: 56px;
            height: 94px;
            position: absolute;
            top: 4px;
            left: 315px;
            z-index: 98;
            background: url("../assets/images/roboter-1.png") no-repeat center/contain;
            &.roboter-2 {
              background-image: url("../assets/images/roboter-2.png");
            }
            &.roboter-3 {
              background-image: url("../assets/images/roboter-3.png");
            }
            &.roboter-4 {
              background-image: url("../assets/images/roboter-4.png");
            }
            &.roboter-5 {
              background-image: url("../assets/images/roboter-5.png");
            }
          }
          .progress {
            width: 320px;
            height: 78px;
            margin: 0 auto;
            padding: 12px 0 0 40px;
            h3 {
              float: left;
              font-size: 19px;
              line-height: 35px;
              padding-right: 14px;
            }
            p {
              font-size: 15px;
              line-height: 35px;
              float: left;
            }
            .progress-bar {
              width: 266px;
              height: 10px;
              float: left;
              border: 1px solid #ffffff;
              background-color: #ffffff;
              border-radius: 6px;
              overflow: hidden;
              & > span {
                display: block;
                height: 100%;
                width: 0;
                background-color: #00a0e9;
                border-radius: 5px;
              }
            }
            & > span {
              font-size: 14px;
              line-height: 10px;
              float: right;
            }
          }
          &:nth-child(2) {
            background: #dae000;
            .progress .progress-bar {
              & > span {
                background: #dae000;
              }
            }
          }
          &:nth-child(3) {
            background: #f39800;
            .progress .progress-bar {
              & > span {
                background: #f39800;
              }
            }
          }
          &:nth-child(4) {
            background: #8fc31f;
            .progress .progress-bar {
              & > span {
                background: #8fc31f;
              }
            }
          }
          &:nth-child(5) {
            background: #ea5514;
            .progress .progress-bar {
              & > span {
                background: #ea5514;
              }
            }
          }
          &.fade-in {
            left: 0;
            .roboter-ico {
              animation: roboter_run1 0.4s 0.7s 1;
            }
          }
          &.fade-in2 {
            left: 0;
            .roboter-ico {
              animation: roboter_run2 1.6s 0.7s infinite;
            }
          }
          &.fade-out {
            left: -100%;
          }
        }
      }
    }
    .btn {
      background-color: #0774ea;
      border-color: #0774ea;
      color: #fff;
      width: 150px;
      height: 30px;
      line-height: 30px;
      border-radius: 4px;
      margin-right: 15px;

    }
    .article-title {
      input {
        width: 100%;
        height: 39px;
        padding: 0 18px;
        border: 1px solid #e6e6e6;
        line-height: 37px;
        margin-right: 8px;
        font-size: 14px;
        outline: none;
        box-sizing: border-box;
        &:disabled {
          background-color: #eee;
        }
      }
    }
    .article {
      margin-top: 15px;
      position: relative;
      border: 1px solid #e6e6e6;
      padding-bottom: 30px;
      .text-area-out {
        width: 100%;
        height: 430px;
        margin: 0 auto;
        position: relative;
      }
      .text-area-out .text-area, .text-area-out textarea {
        position: absolute;
        top: 0;
        left: 0;
        overflow-y: scroll;
        width: 100%;
        height: 100%;
        padding: 0 16px;
        font-size: 18px;
        border: none;
        color: black;
        line-height: 30px;
        letter-spacing: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
        resize: none;
        box-sizing: border-box;
      }
      .word-number {
        position: absolute;
        right: 0px;
        bottom: 0px;
        width: 100%;
        height: 30px;
        box-sizing: border-box;
        /*background-color: #ffffff;*/
        line-height: 30px;
        font-size: 14px;
        color: #b5b5b5;
        text-align: right;
        padding-right: 25px;
      }
      .text-area-out .text-area .pen-box {
        display: inline-block;
        height: 16px;
        width: 2px;
      }
    }
    .bottom {
      padding: 15px 0 25px 0;
      line-height: 38px;
      min-height: 38px;
      .nextPage {
        display: none;
      }
      p {
        display: inline-block;
        font-size: 14px;
        a {
          color: #3399FF;
        }
      }
    }
  }

  .model {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    .come-ico {
      width: 644px;
      height: 328px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -164px 0 0 -322px;
      cursor: pointer;
    }
  }

  @keyframes roboter_run1 {
    0% {
      transform: translateY(-20px);
    }
    33% {
      transform: translateY(0);
    }
    66% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes roboter_run2 {
    0% {
      transform: translateY(-20px);
    }
    8% {
      transform: translateY(0);
    }
    16% {
      transform: translateY(-20px);
    }
    24% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(0);
    }
  }

  body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, button, textarea, p, blockquote, th, td {
    margin: 0;
    padding: 0;
    font-weight: normal;
    font-family: PingFang SC, Hiragino Sans GB, Microsoft Yahei, sans-serif;
  }

  a {
    text-decoration: none;
  }

  img {
    border: none;
  }

  ol, ul, li, button {
    list-style: none;
    border: none
  }

  input, button, textarea {
    outline: none;
    font-family: PingFang SC, Hiragino Sans GB, Microsoft Yahei, sans-serif;
  }

  .clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
  }

  .clearfix {
    *zoom: 1;
  }


</style>
