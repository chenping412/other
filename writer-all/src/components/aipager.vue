<template>
  <div id="aipager">
    <div class="top-else">
      <div class="breadcrumb">
        <router-link :to="{ path: '/index/resource' }">报告写作</router-link>
        &gt;
        <span>行业快报</span>
      </div>
    </div>
    <div class="aipager-content">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="分类">
          <el-select v-model="searchForm.classname" size="small">
            <el-option
              v-for="item in classList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            size="small"
            v-model="searchForm.date"
            :editable="false"
            :clearable="false"
            type="date"
            @change="dateChange"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="float: right;">
          <button @click="search" type="button">生成快报</button>
          <button @click="exportWord" type="button">导出word</button>
        </el-form-item>
      </el-form>
      <div class="ai-main">
        <ul>
          <li v-for="listParent in pagerList">
            <h4>{{ listParent.cname }}</h4>
            <ul>
              <li v-for="(listChild, index2) in listParent.news">
                <p>{{ index2+1 + "，" + listChild.summary }}</p>
              </li>
            </ul>
            <div class="img" v-show="!!listParent.images">
              <img :src="listParent.images" alt="">
            </div>
          </li>
        </ul>
      </div>
      <div class="loading" v-show="loadingShow">
      </div>
    </div>

  </div>
</template>

<script>
  import $ from 'jquery'
  import {MessageBox} from 'element-ui';

  export default {
    data() {
      return {
        loadingShow: false,
        pagerList: [],
        searchForm: {
          classname: "财经行业",
          date: "",
        },
        classList: [
          // {label: "AI行业", value: "AI行业"},
          {label: "财经行业", value: "财经行业"},
        ],
        id: null,
      }
    },
    created() {
      this.getCurrentDate();
      this.getAINews();
    },
    methods: {
      getCurrentDate() {
        var self = this;
        var current = new Date();
        var yy = current.getFullYear();
        var mm = current.getMonth() + 1;
        if (mm < 10) {
          mm = "0" + mm
        }
        var dd = current.getDate()
        if (dd < 10) {
          dd = "0" + dd
        }
        self.searchForm.date = yy + "-" + mm + "-" + dd;
        return yy + "-" + mm + "-" + dd;
      },
      dateChange(val) {
        console.log(val)
        var self = this;
        var selectedDate = new Date(val.split("-")[0], Number(val.split("-")[1]) - 1, val.split("-")[2]).getTime();
        if (selectedDate > new Date().getTime()) {
          MessageBox({
            title: "提示",
            message: "写作日期不能大于当天",
            type: "warning"
          })
          self.searchForm.date = self.getCurrentDate();
          return;
        }
        self.searchForm.date = val;
      },
      search() {
        var self = this;
        self.getAINews();
      },
      getAINews() {
        var self = this;
        self.loadingShow = true
        $.ajax({
          // url: "http://172.16.1.31:9092/industry-bulletin/writer_robot/aipaper/content",
          url: apiHost + "/industry-bulletin/writer_robot/express/content",
          type: "POST",
          xhrFields: {
            withCredentials: true,
            type: 1
          },
          crossDomain: true,
          data: {
            date:  self.searchForm.date
          },
          success: function (data) {
            self.pagerList = data.data.aipaper;
            self.loadingShow = false;
            self.id = data.data.id
          }
        })
      },
      //导出word
      exportWord() {
        var self = this;
        window.open(apiHost + "/industry-bulletin/writer_robot/express/down_word?id=" + self.id + "&head=" + self.searchForm.classname)
      },
    }
  }
</script>

<style lang="less" type="text/less">
  #aipager {
    .el-form {
      padding: 18px 0;
    }
    .el-form-item {
      margin: 0 35px 0 0;
    }
    .aipager-content {
      padding-left: 52px;
      padding-right: 52px;
      background-color: #fff;
      padding-bottom: 40px;
      /*padding-top: 90px;*/
    }
    .aipager-content button {
      width: 150px;
      height: 30px;
      line-height: 30px;
      color: #0874ea;
      border: none;
      border-radius: 6px;
      border: 1px solid #0874ea;
      cursor: pointer;
      background-color: #fff;
      margin-left: 17px;
    }
    .aipager-content button:hover {
      background-color: #0874ea;
      color: #fff;
    }
    /*width: 1200px;*/
    /*margin: 0 auto;*/
    .loading {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(255, 255, 255, 0.6);
    }
    .ai-header {
      width: 1200px;
      height: 86px;
      margin: 0 auto 38px;
      h3 {
        font-size: 24px;
        line-height: 36px;
        float: left;
        padding: 55px 0 0 18px;
      }
    }
    .date-search {
      border-bottom: 1px solid #e6e6e6;
      padding: 13px 0;
      .el-button {
        margin-left: 10px;
      }
    }
    .ai-main {
      background-color: #fff;
      padding: 20px;
      & > ul {
        & > li {
          padding-bottom: 20px;
          h4 {
            text-align: center;
            font-size: 14px;
            line-height: 30px;
            color: #111;
          }
          & > ul {
            li {
              margin-bottom: 20px;
              p {
                font-size: 14px;
                color: #666;
                line-height: 20px;
              }
            }
          }
          .img {
            width: 100%;
            /*height: 580px;*/
            img {
              width: 100%;
              /*height: 100%;*/
            }
          }
        }
      }
      .from {
        text-align: right;
        font-size: 14px;
        color: #666;
        line-height: 30px;
        border-bottom: 1px solid #ddd;
      }
    }
    .footer {
      padding: 20px;
      h4 {
        font-size: 14px;
        color: #111111;
      }
      .footer-img {
        margin-top: 20px;
        width: 100%;
        height: 400px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

</style>
