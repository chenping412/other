<template>
  <div id="add-subject">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">资讯管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/index/news-subject' }">专题管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增专题</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="add-subject-main">
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
            <el-select v-model="city" :disabled="radio==0" placeholder="请选择" size="small" class="select"
                       @change="cityChange">
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
      <el-row class="add-subject">
        <el-col :span="24" class="article-title">
          <span class="span">专题名称：</span>
          <el-input type="text" size="small" v-model="articleTitle"></el-input>
        </el-col>
        <el-col :span="24">
          <span class="span">
            专题图片
          </span>
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="24">
          <span class="span">
            专题文章(请从右边选择文章)
          </span>
          <el-row>
            <el-col :span="11" class="news-list-box news-list-box-left">
              <el-row>
                <ul class="news-list">
                  <li v-for="(list, index) in newsListSelect">
                    <el-row>
                      <el-col :span="20">{{list.title}}</el-col>
                      <el-col :span="4">
                        <el-button size="mini" @click="remove">清除</el-button>
                      </el-col>
                    </el-row>
                  </li>
                </ul>
              </el-row>
            </el-col>
            <el-col :span="2" class="news-list-box-mid"><i class="el-icon-arrow-left"></i></el-col>
            <el-col :span="11" class="news-list-box news-list-box-right">
              <el-row class="news-list-box-top">
                <el-col :span="18">
                  <el-input
                    size="small"
                    placeholder="请输入内容"
                    prefix-icon="el-icon-search"
                    v-model="newsKeyword">
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" size="small" style="float: right;">搜索</el-button>
                </el-col>
              </el-row>
              <el-row>
                <ul class="news-list">
                  <li v-for="(list, index) in newsList">
                    <el-row>
                      <el-col :span="20">{{list.title}}</el-col>
                      <el-col :span="4">
                        <el-button size="mini" @click="selectList(index)">选择</el-button>
                      </el-col>
                    </el-row>
                  </li>
                </ul>
              </el-row>
            </el-col>
          </el-row>
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
        newsList: [
          {title: "第27次！中国海警3舰船编队进钓鱼岛领海巡航", id: 1},
          {title: "第27次！中国海警3舰船编队进钓鱼岛领海巡航", id: 2},
          {title: "第27次！中国海警3舰船编队进钓鱼岛领海巡航", id: 3},
          {title: "第27次！中国海警3舰船编队进钓鱼岛领海巡航", id: 4},
          {title: "第27次！中国海警3舰船编队进钓鱼岛领海巡航", id: 5},
          {title: "第27次！中国海警3舰船编队进钓鱼岛领海巡航", id: 6},
          {title: "第27次！中国海警3舰船编队进钓鱼岛领海巡航", id: 7},
          {title: "第27次！中国海警3舰船编队进钓鱼岛领海巡航", id: 8},
          {title: "第27次！中国海警3舰船编队进钓鱼岛领海巡航", id: 9},
          {title: "第27次！中国海警3舰船编队进钓鱼岛领海巡航", id: 10},
        ],
        newsListSelect: [],
        imageUrl: "",
        newsKeyword: ""
      }
    },
    created() {
      this.getNormalChannelClass();
      this.getCities();
      this.getNewsList();
    },
    mounted() {
      this.init();
    },
    watch: {
      radio: function (val) {
        if (val == 1) {
          this.selectClass = []
        }
      }
    },
    methods: {
      //初始化数据
      init() {
        var self = this;
        if (localStorage.jsonStr) {
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
        if (self.radio == 0) {
          for (var i = 0; i < self.selectClass.length; i++) {
            for (var j = 0; j < self.channelClass.length; j++) {
              if (self.selectClass[i] == self.channelClass[j].channelName) {
                ids.push(self.channelClass[j].id)
              }
            }
          }

        } else {
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
      },

      //获取新闻列表
      getNewsList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/news/special_topic/get_news_list",
          type: "post",
          data: {},
          success: function (data) {
            if (data.code == 0) {

            }
          },
          error: function (err) {
          }
        })
      },
      selectList(index) {
        var self = this;
        self.newsListSelect.push(self.newsList[index])
      },
      remove(index) {
        var self = this;
        self.newsListSelect.splice(index, 1)
      },
      beforeAvatarUpload(file) {
        console.log(file)
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>

<style lang="less">
  #add-subject {
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .add-subject-main {
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
        &.add-subject {
          .span {
            line-height: 30px;
            color: #606266;
            font-size: 14px;
          }
          .article-title {
            padding: 15px 0;
            .span {
              float: left;
              margin-right: 20px;
            }
            .el-input {
              float: left;
              width: 300px;
            }
          }
        }
        .news-list-box {
          border: 1px solid #ddd;
          .news-list-box-top {
            padding: 15px 15px 15px 15px;
            border-bottom: 1px solid #ddd;
          }
          .news-list {
            padding: 0 15px 0;
            height: 200px;
            overflow-y: scroll;
            li {
              line-height: 28px;
              font-size: 14px;
              color: #606266;
              .el-button {
                float: right;
                margin-right: 20px;
              }
            }
          }
        }
        .news-list-box-left {
          .news-list {
            height: 268px;
            padding-top: 15px;
          }
        }
        .news-list-box-mid {
          font-size: 30px;
          text-align: center;
          line-height: 305px;
        }
      }
    }
  }
</style>
