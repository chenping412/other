<template>
  <div id="article">
    <div class="top clearfix">
      <div class="write-article">
        <el-button size="small" type="primary" @click="$router.push('/write-article')">发布文章</el-button>
      </div>
      <div class="btn">
      </div>
      <ul class="tab clearfix">
        <li>
          <a href="javascirpt:;" :class="{active: index == 0}"
             @click="index = 0">全部文章 (<span>{{total_0}}</span>)</a>
        </li>
        <li>
          <a href="javascirpt:;" :class="{active: index == 1}"
             @click="index = 1">已发布 (<span>{{total_3}}</span>)</a>
        </li>
        <li>
          <a href="javascirpt:;" :class="{active: index == 2}"
             @click="index = 2">草稿箱 (<span>{{total_1}}</span>)</a>
        </li>
        <li>
          <a href="javascirpt:;" :class="{active: index == 3}"
             @click="index = 3">待审核 (<span>{{total_2}}</span>)</a>
        </li>
      </ul>
    </div>
    <div class="article-main">
      <p>提示：审稿需要时间，请耐心等候。</p>
      <div>
        <div v-if="index == 0">
          <ul class="clearfix article-list">
            <li v-for="list in classifyArticleList_0" class="clearfix">
              <el-col :span="15">
                <span v-if="list.status == 2" style="color: skyblue;" class="type">(已发布)</span>
                <span v-if="list.status == 0" style="color: #ccc;" class="type">(草稿)</span>
                <span v-if="list.status == 1" style="color: yellowgreen;" class="type">(待审核)</span>
                <span v-if="list.status == -1" style="color: red;" class="type">(未通过)</span>
                {{list.title}}
              </el-col>
              <el-col :span="9">
                <span class="readNum">{{list.readNum}} 万</span>
                <span> {{list.createTime}} </span>
                <el-button size="small" v-if="list.status == 0 || list.status == -1 || index == 2"
                           @click="$router.push({path: '/write-article', query: {id: list.newsId}})">编辑
                </el-button>
                <el-button size="small" v-if="list.status == 0 || list.status == -1 || index == 2"
                           @click="removeArticle(list.newsId)">删除
                </el-button>
              </el-col>
            </li>
          </ul>
          <el-pagination
            @current-change="pageNumberChange_0"
            :current-page.sync="pageNum_0"
            :page-size="pageSize_0"
            layout="prev, pager, next, jumper"
            :total="total_0">
          </el-pagination>
        </div>
        <div v-if="index == 1">
          <ul class="clearfix article-list">
            <li v-for="list in classifyArticleList_3" class="clearfix">
              <el-col :span="15">
                <span v-if="list.status == 2">已发布</span>
                <span v-if="list.status == 0">草稿</span>
                <span v-if="list.status == 1">待审核</span>
                <span v-if="list.status == -1">未通过</span>
                {{list.title}}
              </el-col>
              <el-col :span="9">
                <span class="readNum">{{list.readNum}} 万</span>
                <span> {{list.createTime}} </span>
                <el-button size="small" v-if="list.status == 0 || list.status == -1 || index == 2"
                           @click="$router.push({path: '/write-article', query: {id: list.newsId}})">编辑
                </el-button>
                <el-button size="small" v-if="list.status == 0 || list.status == -1 || index == 2"
                           @click="removeArticle(list.newsId)">删除
                </el-button>
              </el-col>
            </li>
          </ul>
          <el-pagination
            @current-change="pageNumberChange_3"
            :current-page.sync="pageNum_3"
            :page-size="pageSize_3"
            layout="prev, pager, next, jumper"
            :total="total_3">
          </el-pagination>
        </div>
        <div v-if="index == 2">
          <ul class="clearfix article-list">
            <li v-for="list in classifyArticleList_1" class="clearfix">
              <el-col :span="15">
                <span v-if="list.status == 2">已发布</span>
                <span v-if="list.status == 0">草稿</span>
                <span v-if="list.status == 1">待审核</span>
                <span v-if="list.status == -1">未通过</span>
                {{list.title}}
              </el-col>
              <el-col :span="9">
                <span class="readNum">{{list.readNum}} 万</span>
                <span> {{list.createTime}} </span>
                <el-button size="small" v-if="list.status == 0 || list.status == -1 || index == 2"
                           @click="$router.push({path: '/write-article', query: {id: list.newsId}})">编辑
                </el-button>
                <el-button size="small" v-if="list.status == 0 || list.status == -1 || index == 2"
                           @click="removeArticle(list.newsId)">删除
                </el-button>
              </el-col>
            </li>
          </ul>
          <el-pagination
            @current-change="pageNumberChange_1"
            :current-page.sync="pageNum_1"
            :page-size="pageSize_1"
            layout="prev, pager, next, jumper"
            :total="total_1">
          </el-pagination>
        </div>
        <div v-if="index == 3">
          <ul class="clearfix article-list">
            <li v-for="list in classifyArticleList_2" class="clearfix">
              <el-col :span="15">
                <span v-if="list.status == 2">已发布</span>
                <span v-if="list.status == 0">草稿</span>
                <span v-if="list.status == 1">待审核</span>
                <span v-if="list.status == -1">未通过</span>
                {{list.title}}
              </el-col>
              <el-col :span="9">
                <span class="readNum">{{list.readNum}} 万</span>
                <span> {{list.createTime}} </span>
                <el-button size="small" v-if="list.status == 0 || list.status == -1 || index == 2"
                           @click="$router.push({path: '/write-article', query: {id: list.newsId}})">编辑
                </el-button>
                <el-button size="small" v-if="list.status == 0 || list.status == -1 || index == 2"
                           @click="removeArticle(list.newsId)">删除
                </el-button>
              </el-col>
            </li>
          </ul>
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
        classifyArticleList_0: [],
        classifyArticleList_1: [],
        classifyArticleList_2: [],
        classifyArticleList_3: [],
        pageSize_0: 10,
        pageNum_0: 1,
        total_0: 0,
        pageSize_1: 10,
        pageNum_1: 1,
        total_1: 0,
        pageSize_2: 10,
        pageNum_2: 1,
        total_2: 0,
        pageSize_3: 10,
        pageNum_3: 1,
        total_3: 0,
      };
    },
    created() {
      this.uid = JSON.parse(localStorage.userInfo).uid;
      this.token = JSON.parse(localStorage.userInfo).token;
      //全部
      this.getAllArticle();
      //草稿
      this.getClassifyArticle_1();
      //待审批
      this.getClassifyArticle_2();
      //已发布
      this.getClassifyArticle_3();

    },
    methods: {
      //获取全部文章
      getAllArticle() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/daka/news/all_list",
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
          },
          success: function (data) {
            if (data.code == 0) {
              self.classifyArticleList_0 = data.data;
              self.total_0 = self.classifyArticleList_0[0].newsCount;

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
      //草稿
      getClassifyArticle_1() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/daka/news/deferent_list",
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
            status: 0,
            pageSize: self.pageSize_1,
            pageNum: self.pageNum_1,
          },
          success: function (data) {
            if (data.code == 0) {
              self.classifyArticleList_1 = data.data;
              self.total_1 = self.classifyArticleList_1[0].newsCount;
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
      //待审核
      getClassifyArticle_2() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/daka/news/deferent_list",
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
            status: 1,
            pageSize: self.pageSize_2,
            pageNum: self.pageNum_2,
          },
          success: function (data) {
            if (data.code == 0) {
              self.classifyArticleList_2 = data.data;
              self.total_2 = self.classifyArticleList_2[0].newsCount;
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
      //已发布
      getClassifyArticle_3() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/daka/news/deferent_list",
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
            status: 2,
            pageSize: self.pageSize_3,
            pageNum: self.pageNum_3,
          },
          success: function (data) {
            if (data.code == 0) {
              if (data.data && data.data.length > 0 && data.data.newsCount) {
                self.classifyArticleList_3 = data.data;
                self.total_3 = self.classifyArticleList_3[0].newsCount;
              }
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
      pageNumberChange_0(val) {
        var self = this;
        self.pageNum_0 = val;
        self.getAllArticle();
      },
      pageNumberChange_1(val) {
        var self = this;
        self.pageNum_1 = val;
        self.getClassifyArticle_1();
      },
      pageNumberChange_2(val) {
        var self = this;
        self.pageNum_2 = val;
        self.getClassifyArticle_2();
      },
      pageNumberChange_3(val) {
        var self = this;
        self.pageNum_3 = val;
        self.getClassifyArticle_3();
      },
      //删除文章
      removeArticle(id) {
        var self = this;
        self.$confirm('此操作将删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $.ajax({
            url: self.apiHost + "/daka/news/del",
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
              newsId: id,
            },
            success: function (data) {
              if (data.code == 0) {
                self.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                location.reload();
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
      p {
        line-height: 40px;
        font-size: 14px;
        color: red;
      }
      ul.article-list {
        li {
          line-height: 45px;
          font-size: 14px;
          color: #666666;
          border-bottom: 1px solid #ddd;
          span.type {
            display: inline-block;
            width: 60px;
          }
          span.readNum {
            margin-right: 20px;
          }
          .el-button {
            float: right;
            margin-left: 15px;
            margin-top: 6px;
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
