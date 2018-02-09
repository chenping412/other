<template>
  <div id="main-top">
    <div class="main-top">
      <div class="main-top-content clearfix">
        <div class="head-img">
          <img :src="userInfo.headImgUrl" alt="">
        </div>
        <dl class="net-weekly">
          <dt><h3>互联网周刊</h3></dt>
          <dd><p>明星都在看的原创娱乐新闻 <br>资讯平台</p></dd>
        </dl>
        <ul class="master-info">
          <li>
            <dl>
              <dt>
                <span>{{userInfo.newsReadCount}}</span>次
              </dt>
              <dd>
                文章阅读
              </dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>
                <span>{{userInfo.videoPlayCount}}</span>万次
              </dt>
              <dd>
                短视频播放
              </dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>
                <span>{{userInfo.fansNum}}</span>人
              </dt>
              <dd>
                粉丝
              </dd>
            </dl>
          </li>
          <li>
            <dl>
              <dt>
                <span>{{userInfo.income}}</span>元
              </dt>
              <dd>
                收益
              </dd>
            </dl>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    data() {
      return {
        uid: "",
        token: "",
        userInfo: {},
      }
    },
    created() {
      this.uid = JSON.parse(localStorage.userInfo).uid;
      this.token = JSON.parse(localStorage.userInfo).token;
      this.getUserInfo();
    },
    methods: {
      //获取用户信息
      getUserInfo() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/daka/user/detail",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            uid: self.uid,
//            token: self.token,
            token: "84ca274813a44e30a61b6db5cbe5c07a",
            isTest: true,
          },
          success: function (data) {
            if (data.code == 0) {
              self.userInfo = data.data;
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
    }
  }
</script>

<style lang="scss">
  #main-top {
    .main-top {
      background-color: #000;
      padding: 60px 0;
      .main-top-content {
        width: 1100px;
        margin-left: auto;
        margin-right: auto;
        .head-img {
          float: left;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #fff;
          margin-right: 20px;
          img {
            width: 100%;
          }
        }
        .net-weekly {
          float: left;
          dt {
            h3 {
              color: #fff;
              font-size: 16px;
              line-height: 35px;

            }
          }
          dd {
            p {
              color: #ffffff;
              font-size: 14px;
              line-height: 20px;
            }
          }
        }
        .master-info {
          float: right;
          li {
            color: #fff;
            float: left;
            margin-right: 20px;
            dl {
              text-align: center;
              dt {
                line-height: 40px;
                font-size: 18px;
                span {
                  font-size: 18px;
                }
              }
              dd {
                line-height: 40px;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
</style>
