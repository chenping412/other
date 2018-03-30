<template>
  <div id="api-dosage">
    <div class="breadcrumb">
      <a href="javascript:;">API介绍</a>
    </div>

    <ul class="apiList clearfix">
      <li>
        <div class="top newsSearch">
          <h2>
            资讯搜索
            <!--<a href="javascript:;">已开通</a>-->
          </h2>
        </div>
        <p>根据用户提供的表达式，结合平台搜索算法，返回最新、最精准的资讯内容</p>
        <div class="bot">
          <!--<a href="http://localhost:3001/robotshop/document-news-search.html" target="_blank">查看技术文档</a>-->
          <a href= "/document-news-search.html" target="_blank">查看技术文档</a>
          <button @click="dialogVisible = true">立即咨询</button>
        </div>
      </li>
      <li>
        <div class="top relativeNews">
          <h2>
            相似资讯
            <!--<a href="javascript:;">已开通</a>-->
          </h2>
        </div>
        <p>根据用户输入的一篇文章，结合平台语义挖掘及搜索算法，返回与之相似的资讯列表</p>
        <div class="bot">
          <!--<a href="http://localhost:3001/robotshop/document-news-relative.html" target="_blank">查看技术文档</a>-->
          <a href="/document-news-relative.html" target="_blank">查看技术文档</a>
          <button @click="dialogVisible = true">立即咨询</button>
        </div>
      </li>
      <li>
        <div class="top abstract">
          <h2>
            摘要压缩
            <!--<a href="javascript:;">已开通</a>-->
          </h2>
        </div>
        <p>根据用户输入的一篇文章，结合平台语义压缩算法，将文章压缩成200字左右的内容</p>
        <div class="bot">
          <!--<a href="http://localhost:3001/robotshop/document-summary.html" target="_blank">查看技术文档</a>-->
          <a href="/document-summary.html" target="_blank">查看技术文档</a>
          <button @click="dialogVisible = true">立即咨询</button>
        </div>
      </li>
      <li>
        <div class="top keyword">
          <h2>
            关键词提取
            <!--<a href="javascript:;">已开通</a>-->
          </h2>
        </div>
        <p>根据用户提供的文章，结合平台自然语言处理算法，为用户返回该文章的关键词组</p>
        <div class="bot">
          <!--<a href="http://localhost:3001/robotshop/document-getkeyword.html" target="_blank">查看技术文档</a>-->
          <a href="/document-getkeyword.html" target="_blank">查看技术文档</a>
          <button @click="dialogVisible = true">立即咨询</button>
        </div>
      </li>
      <li>
        <div class="top participle">
          <h2>
            智能分词
            <!--<a href="javascript:;">已开通</a>-->
          </h2>
        </div>
        <p>根据用户输入的一段话，结合平台的智能分词器，返回所需的分词结果，准确率达92.8%</p>
        <div class="bot">
          <!--<a href="http://localhost:3001/robotshop/document-textcatgory.html" target="_blank">查看技术文档</a>-->
          <a href="/document-textcatgory.html" target="_blank">查看技术文档</a>
          <button @click="dialogVisible = true">立即咨询</button>
        </div>
      </li>
      <li>
        <p style="text-align: center; margin: 0; line-height: 160px;">—— &nbsp;&nbsp;更多API，敬请期待&nbsp;&nbsp; ——</p>
      </li>
    </ul>

    <el-dialog
      :visible.sync="dialogVisible"
      size="tiny">
      <h3>商务合作</h3>
      <ul>
        <li class="clearfix">
          <div class="boxname">咨询时间:</div>
          <div class="boxvalue">9:00 - 18:00</div>
        </li>
        <li class="clearfix">
          <div class="boxname">电话:</div>
          <div class="boxvalue">0755-22223970</div>
        </li>
        <li class="clearfix">
          <div class="boxname">QQ:</div>
          <div class="boxvalue">2020601975</div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import $ from 'jquery';

  export default {
    data() {
      return {
        apiHost: "",
        dialogVisible: false
      }
    },
    created: function () {
      if(location.host != "robot.giiso.com") {
        this.apiHost = "http://172.16.33.4:8081"
      }
    },
    mounted() {
      $(".el-dialog__close").hide();
    },
    methods: {
      tableRowClassName(row, index) {
        if (index % 2 === 1) {
          return 'info-row';
        }
        return '';
      }
    },
  }
</script>

<style lang="less" type="text/less">
  #api-dosage {
    .breadcrumb {
      margin: 52px 0 21px 0;
      a {
        display: block;
        line-height: 30px;
        color: #141414;
        font-size: 24px;
      }
    }
    .apiList {
      width: 1000px;
      li {
        float: left;
        width: 260px;
        height: 160px;
        background: #FFFFFF;
        border: 1px solid #D0D0D0;
        border-radius: 2px;
        padding: 20px;
        margin-right: 20px;
        margin-bottom: 20px;
        position: relative;
        .top {
          margin-bottom: 10px;
          height: 40px;
          padding-left: 50px;
          h2 {
            font-size: 20px;
            color: #111111;
            line-height: 40px;
            a {
              display: inline-block;
              font-size: 12px;
              color: #FFFFFF;
              background: #AAAAAA;
              padding: 0 10px;
              height: 20px;
              line-height: 20px;
              border-radius: 10px;
              margin-left: 5px;
            }
          }
        }
        .newsSearch {
          background: url(../assets/images/intro-search.png) left center no-repeat;
        }
        .relativeNews {
          background: url(../assets/images/intro-relatable-news.png) left center no-repeat;
        }
        .abstract {
          background: url(../assets/images/intro-sum.png) left center no-repeat;
        }
        .keyword {
          background: url(../assets/images/intro-key-word.png) left center no-repeat;
        }
        .participle {
          background: url(../assets/images/intro-separate-word.png) left center no-repeat;
        }
        p {
          font-size: 14px;
          color: #111111;
          line-height: 20px;
          margin-bottom: 40px;
        }
        .bot {
          position: absolute;
          bottom: 20px;
          width: 260px;
          a {
            display: block;
            float: left;
            font-size: 12px;
            color: #4378E6;
            line-height: 26px;
            text-decoration: underline;
          }
          button {
            display: block;
            float: right;
            background: #4378E6;
            border-color: #4378E6;
            color: #fff5e0;
            border-radius: 0;
            width: 76px;
            height: 26px;
            line-height: 26px;
            font-size: 12px;
            color: #FFFFFF;
            cursor: pointer;
          }
        }
      }
    }
    .el-dialog {
      width: 400px;
      .el-dialog__header {
        padding: 10px 20px 10px 20px;
      }
      .el-dialog__body {
        padding-top: 0;
        h3 {
          font-size: 18px;
          color: #111;
          line-height: 25px;
          margin-bottom: 10px;
          margin-top: 20px;
        }
        ul {
          width: 195px;
          li {
            line-height: 20px;
            font-size: 14px;
            color: #555;
            .boxname {
              float: left;
              text-align: right;
              width: 70px;
            }
            .boxvalue {
              float: right;
              text-align: left;
              width: 113px;
            }
          }
        }
      }
      .el-dialog__footer {
        padding-top: 17px;
        padding-bottom: 17px;
        background-color: #f3f5f6;
        .el-button {
          width: 80px;
          background: #477EF8;
          border-radius: 2px;
        }
      }
    }
  }
</style>
