<template>
  <div id="content">
    <div class="top">
      <div class="breadcrumb">
        <router-link :to="{ path: '/index/resource' }">报告写作</router-link>
        &gt;
        <router-link :to="{ path: '/classify' }">行业简报信息页</router-link>
        &gt;
        <span>生成简报</span>
      </div>
      <div class="btn">
        <router-link :to="{ path: '/update-list', query: { id: id }}" tag="button">修改</router-link>
        <button type="button" class="js-copy" :data-clipboard-text="copyData">复制</button>
        <button type="button" @click="createWord">导出word</button>
      </div>
    </div>
    <div class="content-list">
      <div class="wrap scroll">
        <ul class="ul-overview">
          <li><p>目录</p></li>
          <li v-for="(list, index) in contentList">
            <p>{{ indexCN[index] + "、 " + list.className }}</p>
            <ul>
              <li v-for="(item, index) in list.contents">
                <p class="title-list">{{index + 1}}、{{ item.title }}</p>
              </li>
            </ul>
          </li>
        </ul>
        <ul class="ul-detail">
          <li v-for="(list, index) in contentList">
            <p>{{ indexCN[index] + ". " + list.className }}</p>
            <ul>
              <li v-for="(item, index) in list.contents">
                <p>{{index + 1}} .{{ item.title }}</p>
                <p class="source">
                  <span>{{ item.source }}</span>
                  <span>{{ item.time }}</span>
                </p>

                <pre>{{ item.textcontent }}</pre>
                <div style="text-align: center; margin: 10px 0">
                  <img :src="item.image">
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <div class="model-white" v-show="loadingShow">
      <img src="../assets/images/loading.gif" alt="">
    </div>
    <div class="model" v-show="loginState">
      <div class="content">
        <a href="javascript:;">
          <b>!</b>
          登陆过期，请重新登陆。
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from "jquery";
  import {Loading} from 'element-ui';

  export default {
    data() {
      return {
        loadingShow: false,
        ids: "",
        sd: "",
        ed: "",
        id: "",
        copyData: "",
        contentList: [],
        indexCN: [
          "一",
          "二",
          "三",
          "四",
          "五 ",
          "六",
          "七",
          "八",
          "九",
          "十",
          "十一",
          "十二",
          "十三",
          "十四",
          "十五",
          "十六",
          "十七",
          "十八",
          "十九",
          "二十",
        ],
        loginState: false,
      }
    },
    created() {
      var self = this;
      console.log(self.$route.query)
      self.ids = self.$route.query.classId;
      self.sd = self.$route.query.sdate;
      self.ed = self.$route.query.edate;
      if (self.$route.query.id) {
        self.reCreate();
      } else {
        self.createReport();
      }
    },
    methods: {
      //获取生成的报表
      createReport() {
        var self = this;
        // var loadingInstance = Loading.service();
        self.loadingShow = true;
        $.ajax({
          url: apiHost + "/industry-bulletin/brief/create",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            classIds: self.ids,
            beginDate: self.sd,
            endDate: self.ed,
          },
          success: function (data) {
            if (data.code == 0) {
              self.loadingShow = false;
              self.id = data.data.id;
              self.contentList = data.data.data;
              for(var i=0; i< self.contentList.length; i++) {
                for(var j=0; j< self.contentList[i].contents.length; j++) {

                  self.contentList[i].contents[j].textcontent = self.contentList[i].contents[j].textcontent.replace(/	/g, "");
                  self.contentList[i].contents[j].textcontent = self.contentList[i].contents[j].textcontent.replace(/		/g, "");
                  self.contentList[i].contents[j].textcontent = self.contentList[i].contents[j].textcontent.replace(/　/g, "");
                  self.contentList[i].contents[j].textcontent = self.contentList[i].contents[j].textcontent.replace(/\n/g, "\n    ");
                  self.contentList[i].contents[j].textcontent = "    " + self.contentList[i].contents[j].textcontent
                }
              }
              var str = "";
              var strstr = "";
              self.contentList.map((list, index) => {
                str += self.indexCN[index] + ". " + list.className + "\n";
                strstr += self.indexCN[index] + ". " + list.className + "\n";
                if (list.contents) {
                  list.contents.map((item, index) => {
                    str += index + 1 + ". " + item.title + "\n"
                    strstr += index + 1 + ". " + item.title + "\n"
                      + item.source + item.time + "\n"
                      + item.textcontent + "\n"
                  })
                }
              })
              self.copyData = str + strstr;
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "./login.html";
                self.loginState = false;
              }, 2000);
            }
          }
        })
      },
      //导出word
      createWord() {
        var self = this;
        window.open(apiHost + "/industry-bulletin//brief/down_word?id=" + self.id)
//        $.ajax({
//          url: apiHost + "/industry-bulletin//brief/down_word",
//          type: "GET",
//          xhrFields: {
//            withCredentials: true
//          },
//          crossDomain: true,
//          data: {
//            id: self.$route.query.id,
//          },
//          success: function (data) {
//            if (data.code == "0") {
////              $('<form method="post" action="' + self.loadUrl + '"></form>').appendTo('body').submit().remove();
//            }
//          },
//          error: function () {
//
//          }
//        })
      },
      //重新生成报表
      reCreate() {
        var self = this;
        // var loadingInstance = Loading.service();
        self.loadingShow = true;
        $.ajax({
          url: apiHost + "/industry-bulletin/brief/recreate",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            id: self.$route.query.id,
//            id: "7",
          },
          success: function (data) {
            if (data.code == 0) {
              // loadingInstance.close();
              self.loadingShow = false;
              self.id = data.data.id;
              self.contentList = data.data.data;
              var str = "";
              var strstr = "";
              self.contentList.map((list, index) => {
                str += self.indexCN[index] + ". " + list.className + "\n";
                strstr += self.indexCN[index] + ". " + list.className + "\n";
                if (list.contents) {
                  list.contents.map((item, index) => {
                    str += index + 1 + ". " + item.title + "\n"
                    strstr += index + 1 + ". " + item.title + "\n"
                      + item.source + item.time + "\n"
                      + item.textcontent + "\n"
                  })
                }
              })
              self.copyData = str + strstr;
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "./login.html";
                self.loginState = false;
              }, 2000);
            }
          }
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  pre {
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -o-pre-wrap;
    *word-wrap: break-word;
    *white-space : normal ;
  }
  #content {
    background-color: #fff;
    /*padding-bottom: 40px;*/
    height: 100%;
    padding-top: 61px;
    margin-bottom: 60px;
  }
  #content .top .btn {
    float: right;
  }
  #content .top .btn button {
    width: 150px;
    height: 30px;
    color: #0874ea;
    border: none;
    border-radius: 6px;
    border: 1px solid #0874ea;
    cursor: pointer;
    margin-top: 15px;
    background-color: #fff;
    margin-left: 17px;
  }
  #content .top .btn button:hover {
    background-color: #0874ea;
    color: #fff;
  }


  #content .content-list {
    padding: 0 50px 0 50px;
  }

  #content .content-list .wrap {
    /*height: 560px;*/
    padding: 15px 10px 10px 10px;
    /*overflow-y: scroll;*/
    margin-bottom: 60px;
  }

  #content .content-list .wrap .ul-detail {
    /*margin-top: 20px;*/
  }

  #content .content-list .wrap p, #content .content-list .wrap p span, pre{
    font-size: 12px;
    color: #333;
    line-height: 25px;
  }
  #content .content-list .wrap .textarea {
    width: 100%;
    min-height: 500px;
    border: none;
    font-size: 12px;
    color: #333;
    line-height: 25px;
    display: block;
    overflow-y: auto;
  }
  #content .content-list .wrap p.title-list {
    text-indent: 1em;
  }

  #content .content-list .wrap p.source span {
    color: #999999;
    margin-right: 45px;
  }

  #content > .btn {
    margin-top: 15px;
    text-align: center;
    padding-top: 30px;
    padding-bottom: 60px;
  }

  #content > .btn button {
    width: 150px;
    height: 30px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

</style>
