<template>
  <div id="app">
    <div class="app-menu">
      <div class="logo">
        <img src="./assets/images/come-logo.png">
        <p>写作机器人</p>
      </div>
      <div class="nav">
        <router-link to="/hot-news"><img src="./assets/images/menu-article-active.png"/>写热点</router-link>
        <router-link to="/stock"><img src="./assets/images/menu-stock-active.png"/>写股评</router-link>
        <router-link to="/business"><img src="./assets/images/menu-brief-report-active.png"/>写简报</router-link>
        <router-link to="/report"><img src="./assets/images/menu-paper-active.png"/>写报告</router-link>
      </div>
      <div class="user">
        <div class="info" v-show="isLogin">
          <div class="icon"></div>
          <p>{{userInfo.username}}</p>
          <p>
            <a href="javascript:;">个人中心</a>
          </p>
          <p>
            <a href="javascript:;" @click="logout()">退出</a>
          </p>
        </div>
        <div class="info" v-show="!isLogin">
          <p>
            <a href="../register.html">注册</a>
          </p>
          <p>
            <a href="../login.html">登录</a>
          </p>
        </div>
      </div>
    </div>
    <div class="app-main clearfix">
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
  import Clipboard from 'clipboard';
  export default {
    data() {
      return {
        userInfo: "",
        isLogin:false
      }
    },
    created() {
      this.getUserInfo();
      this.getMenuList();
    },
    mounted() {
      this.copy();
    },
    methods: {
      //获取用户信息
      getUserInfo() {
        var self = this;
        self.$.ajax({
          url: apiHost + "/user/info.do",
          type: "POST",
          data: {},
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          success: function (data) {
            if (data.code == 0 && data.data) {
              self.isLogin=true;
              self.userInfo = data.data;
              if(data.data.userType == 0){
                self.library.contactShow=true;
              }
              self.library.seeMoreSHow=false;
            }else {
              self.library.contactShow=true;
            }
          },
          error:function(){
            self.library.contactShow=true;
          }
        })
      },
      //退出
      logout() {
        var self = this;
        self.$http({
          url: apiHost + "/auth/logout.do",
          type: "POST",
          data: {},
          success: function (data) {
            if (data.code == 0) {
              location.href = "../login.html"
            }
          }
        })
      },
      //获取菜单列表
      getMenuList() {
        var self = this;
        self.$http({
          url: apiHost + "/writer_robot/common/menu.do",
          success: function (data) {
            if (data.code == 0 && data.data) {

            }else {

            }
          }
        })
      },
      //复制
      copy: function () {
        var self = this;
        this.clipboard = new Clipboard('.js-copy');
        //复制成功执行的回调，可选
        this.clipboard.on('success', function (e) {
          if (e.text == "false") {
            self.$alert('请完成文章写作后，再进行一键复制', '提示', {
              type: 'warning'
            });
          } else if (e.text == "false-title") {
            self.$alert('请输入标题后，再进行一键复制', '提示', {
              type: 'warning'
            });
          } else if (e.text == "false-author") {
            self.$alert('请输入作者后，再进行一键复制', '提示', {
              type: 'warning'
            });
          } else if (e.text == "false-time") {
            self.$alert('请输入文章时间后，再进行一键复制', '提示', {
              type: 'warning'
            });
          } else if (e.text == "false-content") {
            self.$alert('请输入文章内容后，再进行一键复制', '提示', {
              type: 'warning'
            });
          } else {
            self.$message.success('已复制！');
          }
        });
        //复制失败执行的回调，可选
        this.clipboard.on('error', function (e) {
          self.$alert('复制失败，您的浏览器不支持', '提示', {
            type: 'warning'
          });
        });
      },
    }
  }
</script>

<style>
  html {
    height: 100%;
  }
  body {
    height: 100%;
    min-height: 768px;
    position: relative;
    overflow: hidden;
    background: #ebeff2;
    transform:translate(0,0);
    min-width: 1240px;
    max-width: 1920px;
  }
  #app{
    height: 100%;
  }
  .app-menu{
    position: absolute;
    left: 0;
    top:0;
    height: 100%;
    width: 140px;
    background-image: linear-gradient(-3deg, #273E66 3%, #000000 86%);
  }
  .app-menu .logo{
    padding: 42px 0;
    text-align: center;
  }
  .app-menu .logo img{
    width: 70px;
  }
  .app-menu .logo p{
    font-size: 14px;
    color: #FFFFFF;
    line-height: 20px;
    padding-top: 6px;
  }
  .app-menu .nav a{
    display: block;
    font-size: 14px;
    color: #FFFFFF;
    font-weight: normal;
    line-height: 45px;
    height: 45px;
    text-align: center;
    margin-bottom: 6px;
    border-left: 3px solid transparent;
    opacity: 0.6;
  }
  .app-menu .nav a.router-link-active{
    font-weight: bolder;
    background: #424558;
    border-color: #0276FE;
    opacity: 1;
  }
  .app-menu .nav a img{
    margin-right: 10px;
  }

  .app-menu .user{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding-bottom: 13px;
    text-align: center;
  }
  .app-menu .user .icon{
    width: 36px;
    height: 36px;
    margin:0 auto 10px;
    border-radius: 50%;
    background: #ffffff url("./assets/images/avatar.png") no-repeat center;
    background-size: contain;
  }
  .app-menu .user p{
    font-size: 14px;
    color: #999999;
    padding-bottom: 30px;
  }
  .app-menu .user p a:hover{
    color: #ffffff;
  }
  .app-main{
    padding-left: 140px;
    height: 100%;
    background: #ebeff2;
  }

  /*内容区公用样式*/
  .app-main>div{
    height: 100%;
    min-width: 810px;
  }
  #app .el-button img{
    max-width: 18px;
    max-height: 18px;
    margin-right: 5px;
  }
  #app .main {
    float: left;
    width: 72%;
    min-width: 800px;
    min-height: 100%;
    background: #FFFFFF;
    box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.10);
    position: relative;
  }

  #app .main .control {
    padding: 44px 35px 30px 35px;
  }

  #app .main .control .item {
    margin-right: 17px;
    float: left;
    font-size: 14px;
  }
  #app .main .control .btn .el-button img{
    margin:0 -5px 0 7px;
  }

  #app .main .control .item > span {
    color: #666666;
    margin-right: 7px;
  }
  #app .main .editor{
    position: relative;
  }
  #app .main .editor .see-more{
    position: absolute;
    bottom: 1px;
    left:1px;
    width: 99%;
    height: 50%;
    background-image: linear-gradient(-180deg, rgba(255,255,255,0.00) 14%, #FFFFFF 56%);
    z-index: 1001;
  }
  #app .main .editor .see-more p{
    position: absolute;
    bottom:110px;
    left: 0;
    width: 100%;
    font-size: 14px;
    color: #333333;
    text-align: center;
  }
  #app .main .editor .see-more p a{
    color: #0276FE;
  }

  #app .main .editor .not-write{
    position: absolute;
    bottom: 1px;
    left:1px;
    width: 99.9%;
    height: 600px;
    background-color: #fff;
    z-index: 1002;
  }
  #app .main .editor .not-write .inner{
    position: absolute;
    top:50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%);
    text-align: center;
  }
  #app .main .editor .not-write .inner img{
    width: 72px;
    margin-bottom: 20px;
  }
  #app .main .editor .not-write .inner p{
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    font-weight: bolder;
  }

  #app .main .editor .contact{
    position: absolute;
    left: 50%;
    top: 20px;
    width: 370px;
    height: 60px;
    margin-left: -185px;
    background: rgba(224,40,40,0.8);
    border-radius: 6px;
    z-index: 1003;
  }
  #app .main .editor .contact p{
    font-size: 12px;
    color: #FFFFFF;
    line-height: 17px;
    padding:13px 0 0 15px;
  }
  #app .main .editor .contact span{
    position: absolute;
    right: 8px;
    top: 8px;
    width: 16px;
    height: 16px;
    background: url("./assets/images/icon-close.png") no-repeat center;
    cursor: pointer;
  }



  #app .main .btns{
    text-align: center;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding-bottom: 25px;
  }
  #app .main .btns .el-button+.el-button{
    margin-left: 17px;
  }



  /*引导浮层公用样式*/
  #app .lead-model{
    position: fixed;
    left: 0;
    top:0;
    width: 100%;
    height: 100%;
    min-width: 1240px;
    background-color: rgba(0,0,0,0.7);
    z-index: 10000;
  }

  #app .model-lead{
    position: relative;
    z-index: 10001;
    background-color: #fff;
    box-shadow: 0 0 0 10px #ffffff;
    border-radius: 2px;
  }
  #app .model-lead:after{
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: #0276FE;
    border: 2px solid #FFFFFF;
    border-radius: 50%;
    z-index: 9;
  }
  #app .model-lead:before{
    content: '';
    position: absolute;
    z-index: 8;
    background-color: #ffffff;
  }

  #app .lead{
    display: none;
  }
  #app .model-lead .lead{
    display: block;
    position: fixed;
    top:50%;
    left: 42%;
    width: 390px;
    height: 310px;
    margin:-155px 0 0 -195px;
    z-index: 10;
  }
  #app .model-lead .lead:before{
    content: '';
    position: absolute;
    top:-94px;
    left: 50%;
    width: 72px;
    height: 124px;
    margin-left: -36px;
    background: url("./assets/images/roboter-1.png") no-repeat center;
    background-size: contain;
  }
  #app .model-lead .lead .content{
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 9;
    background: #FFFFFF;
    border-radius: 4px;
    box-sizing: border-box;
    text-align: center;
  }
  #app .model-lead .lead .content .tip{
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    line-height: 23px;
    font-weight: bolder;
  }
  #app .model-lead .lead .content .not-tip{
    position: absolute;
    right: 20px;
    bottom: 30px;
    font-size: 14px;
    color: #999999;
  }





  /*element-ui组件UI覆盖部分*/
  #app .el-button{
    font-size: 14px;
    min-width: 95px;
  }
  #app .btns .el-button{
    padding: 7px 15px;
  }
  #app .btns .el-button:disabled{
    position: relative;
  }
  #app .btns .el-button:disabled:after{
    content: '';
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  #app .el-input__inner{
    border: 2px solid  transparent;
    border-bottom-color: #D5D6D8;
    height: 34px;
    line-height: 34px;
    padding:0;
    font-size: 14px;
    color: #333333;
    font-weight: bolder;
  }
  #app .el-select .el-input .el-select__caret{
    transform: rotateZ(90deg);
    font-weight: bolder;
    color: #666;
    margin-right: -10px;
  }
  #app .el-select .el-input .el-select__caret.is-reverse{
    transform: rotateZ(0deg);
  }

  #app .el-pagination{
    text-align: center;
    padding: 2px 0;
  }
  #app .el-pagination .btn-prev{
    float: left;
  }
  #app .el-pagination .btn-next{
    float: right;
  }
  #app .el-pagination .number{
    min-width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 50%;
    padding:0;
    background: #ADC2DA;
    color: #FFFFFF;
  }
  #app .el-pagination .el-pager .more,
  #app .el-pagination .el-pager .more::before{
    line-height: 20px;
  }
  #app .el-pagination .number.active{
    background: #0276FE;
  }
  #app .el-pagination button{
    background: transparent;
  }
  #app .el-pagination  .el-icon{
    color: #0276FE;
    font-weight: bolder;
  }
  #app .el-pagination button:disabled  .el-icon{
    color: #c0c4cc;
  }
  #app .el-pagination .btn-quickprev+li,
  #app .el-pagination .btn-quickprev+li+li+li+li+li{
    display: none;
  }
  #app .main .el-date-editor .el-input__prefix{
    /*display: none;*/
    left: auto;
    right: -5px;
    transform: rotateZ(90deg);
  }
  #app .main .el-date-editor .el-input__icon{
    font-weight: bolder;
    color: #666;
  }
  #app .main .el-date-editor .el-icon-date:before{
    content: "\E605";
  }

  /*富文本编辑器样式覆盖*/
  #app .edui-editor{
    width: auto !important;
  }
  #app .edui-editor-iframeholder{
    width: auto !important;
  }

</style>
