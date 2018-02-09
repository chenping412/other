<template>
  <div id="article">
    <div class="top clearfix">
      <div class="write-article">
        <el-button size="small" type="primary" @click="$router.push('/upload-video')">上传视频</el-button>
      </div>
      <div class="btn">
      </div>
      <ul class="tab clearfix">
        <li>
          <a href="javascirpt:;" :class="{active: index == 0}"
             @click="index = 0">已发布 (<span>{{total_0}}</span>)</a>
        </li>
        <li>
          <a href="javascirpt:;" :class="{active: index == 1}"
             @click="index = 1">待审核 (<span>{{total_1}}</span>)</a>
        </li>
        <li>
          <a href="javascirpt:;" :class="{active: index == 2}"
             @click="index = 2">未通过 (<span>{{total_2}}</span>)</a>
        </li>
      </ul>
    </div>
    <div class="article-main">
      <div v-if="index == 0">
        <el-select v-model="videoTypeValue" @change="videoTypeChange" placeholder="全部" size="small" style="padding: 15px 0;">
          <el-option
            v-for="item in videoTypeList"
            :key="item.channelIds"
            :label="item.channelName"
            :value="item.channelIds">
          </el-option>
        </el-select>
        <div class="table">
          <el-table
            :data="videoList_0"
            style="width: 100%">
            <el-table-column
              align="center"
              label="短视频"
              width="315">
              <template slot-scope="scope">
                <div class="video">
                  <div class="video-image">
                    <img src="" :src="scope.row.imageUrl" alt="">
                  </div>
                  <div class="video-detail">
                    <a :href="scope.row.videoUrl">{{scope.row.title}}</a>
                    <p>视频ID: {{scope.row.videoId}}</p>
                    <p>视频时长：{{scope.row.mins}}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="type"
              label="分类"
              width="180">
            </el-table-column>
            <el-table-column
              prop="playNum"
              label="播放数">
            </el-table-column>
            <el-table-column
              align="center"
              prop="createTime"
              label="发布时间">
            </el-table-column>
            <el-table-column
              align="center"
              prop="address"
              label="操作">
              <template slot-scope="scope">
                <span @click="removeVideo(scope.row.videoId)">删除</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="pageNumberChange_0"
            :current-page.sync="pageNum_0"
            :page-size="pageSize_0"
            layout="prev, pager, next, jumper"
            :total="total_0">
          </el-pagination>
        </div>
      </div>
      <div v-if="index == 1">
        <div class="table">
          <el-table
            :data="videoList_1"
            style="width: 100%">
            <el-table-column
              align="center"
              label="短视频"
              width="315">
              <template slot-scope="scope">
                <div class="video">
                  <div class="video-image">
                    <img src="" :src="scope.row.imageUrl" alt="">
                  </div>
                  <div class="video-detail">
                    <a :href="scope.row.videoUrl">{{scope.row.title}}</a>
                    <p>视频ID: {{scope.row.videoId}}</p>
                    <p>视频时长：{{scope.row.mins}}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="type"
              label="分类"
              width="180">
            </el-table-column>
            <el-table-column
              align="center"
              prop="playNum"
              label="播放数">
            </el-table-column>
            <el-table-column
              align="center"
              prop="createTime"
              label="发布时间">
            </el-table-column>
            <el-table-column
              align="center"
              prop="address"
              label="操作">
              <template slot-scope="scope">
                <span @click="removeVideo(scope.row.videoId)">删除</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="pageNumberChange_1"
            :current-page.sync="pageNum_1"
            :page-size="pageSize_1"
            layout="prev, pager, next, jumper"
            :total="total_1">
          </el-pagination>
        </div>
      </div>
      <div v-if="index == 2">
        <div class="table">
          <el-table
            :data="videoList_2"
            style="width: 100%">
            <el-table-column
              align="center"
              label="短视频"
              width="315">
              <template slot-scope="scope">
                <div class="video">
                  <div class="video-image">
                    <img src="" :src="scope.row.imageUrl" alt="">
                  </div>
                  <div class="video-detail">
                    <a :href="scope.row.videoUrl">{{scope.row.title}}</a>
                    <p>视频ID: {{scope.row.videoId}}</p>
                    <p>视频时长：{{scope.row.mins}}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="type"
              label="分类"
              width="180">
            </el-table-column>
            <el-table-column
              align="center"
              prop="playNum"
              label="播放数">
            </el-table-column>
            <el-table-column
              align="center"
              prop="createTime"
              label="发布时间">
            </el-table-column>
            <el-table-column
              align="center"
              prop="address"
              label="操作">
              <template slot-scope="scope">
                <span @click="removeVideo(scope.row.videoId)">删除</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="pageNumberChange_2"
            :current-page.sync="pageNum_2"
            :page-size="pageSize_2"
            layout="prev, pager, next, jumper"
            :total="total_2">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import $ from "jquery"

  export default {
    data() {
      return {
        index: 0,
        uid: "",
        token: "",
        videoList_0: [],
        videoList_1: [],
        videoList_2: [],
        pageSize_0: 1,
        pageNum_0: 1,
        total_0: 0,
        pageSize_1: 1,
        pageNum_1: 1,
        total_1: 0,
        pageSize_2: 1,
        pageNum_2: 1,
        total_2: 0,
        videoTypeList: [],
        videoTypeValue: "",
      };
    },
    created() {
      this.uid = JSON.parse(localStorage.userInfo).uid;
      this.token = JSON.parse(localStorage.userInfo).token;
      this.getVideoTypeList();
      this.getVideoList_0();
      this.getVideoList_1();
      this.getVideoList_2();

    },
    methods: {
      videoTypeChange() {
        var self = this;
        self.getVideoList_0();
      },
      //获取已发布视频
      getVideoList_0() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/daka/video/publish_list",
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
            pageSize: self.pageSize_0,
            pageNum: self.pageNum_0,
            channelIds: self.videoTypeValue,
          },
          success: function (data) {
            if (data.code == 0) {
              self.videoList_0 = data.data;
              self.total_0 = self.videoList_0[0].videoCount;

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
      //获取待审核视频
      getVideoList_1() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/daka/video/deferent_list",
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
            pageSize: self.pageSize_1,
            pageNum: self.pageNum_1,
            status: "0"
          },
          success: function (data) {
            if (data.code == 0) {
              self.videoList_1 = data.data;
              self.total_1 = self.videoList_1[0].videoCount;
              console.log(self.total_1)

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
      //获取未通过视频
      getVideoList_2() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/daka/video/deferent_list",
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
            pageSize: self.pageSize_2,
            pageNum: self.pageNum_2,
            status: "2"
          },
          success: function (data) {
            if (data.code == 0) {
              self.videoList_2 = data.data;
              self.total_2 = self.videoList_2[0].videoCount;

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
      //删除视频
      removeVideo(id) {
        var self = this;
        self.$confirm('此操作将删除该视频, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $.ajax({
            url: self.apiHost + "/daka/video/delete",
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
              videoId: id,
            },
            success: function (data) {
              if (data.code == 0) {
                self.$message({
                  type: 'success',
                  message: '删除成功!'
                });
//                location.reload();
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
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      pageNumberChange_0(val) {
        var self = this;
        self.pageNum_0 = val;
        self.getVideoList_0();
      },
      pageNumberChange_1(val) {
        var self = this;
        self.pageNum_1 = val;
        self.getVideoList_1();
      },
      pageNumberChange_2(val) {
        var self = this;
        self.pageNum_2 = val;
        self.getVideoList_2();
      },
      //获取视频分类列表
      getVideoTypeList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/daka/video/type_list",
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
              self.videoTypeList = data.data;
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
      }
    }
  };
</script>

<style lang="scss">
  #article {
    .top {
      border-bottom: 1px solid #ddd;
      .tab {
        float: left;
        li {
          float: left;
          margin-right: 20px;
          a {
            display: block;
            line-height: 40px;
            font-size: 14px;
            width: 120px;
            text-align: center;
            &.active {
              border-bottom: 2px solid #0074ea;
            }
          }
        }
      }
      .write-article {
        float: right;
      }
    }
    .article-main {
      .table {
        border-top: 1px solid #ddd;
        .video {
          /*width: 300px;*/
          .video-image {
            float: left;
            width: 150px;
            img {
              width: 100%;
              vertical-align: top;
            }
          }
          .video-detail {
            margin-left: 15px;
            float: left;
            text-align: left;
            width: 120px;
          }
        }
      }
      .el-pagination {
        float: right;
        margin-top: 15px;
      }
    }
  }
</style>
