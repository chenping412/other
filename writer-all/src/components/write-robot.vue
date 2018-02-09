<template>
  <div id="write-robot" v-loading.fullscreen="fullLoading">
    <div class="top-else" style="padding: 0 30px;">
      <div class="breadcrumb">
        <router-link :to="{ path: '/' }">首页</router-link>
        <span>&gt;财经写作</span>
      </div>
    </div>
    <div class="web_bottom">
      <div class="control">
        <div class="row clearfix" style="padding-bottom: 0">
          <div class="left">
            <div class="item">
              <span style="display: inline-block;width: 84px;">写作领域</span>
              <el-select v-model="filedName" placeholder="请选择" size="small" :disabled="true">
                <el-option value="财经" label="财经"></el-option>
              </el-select>
            </div>
            <div class="item">
              <span>写作字数</span>
              <el-select v-model="wordNumber" placeholder="请选择" size="small">
                <el-option v-for="item in wordList" :value="item.value" :label="item.label"
                           :key="item.value"></el-option>
              </el-select>
            </div>
            <div class="item">
              <span>素材采集时间</span>
              <el-select v-model="timeQuantum" placeholder="请选择" size="small">
                <el-option v-for="item in timeList" :value="item.value" :label="item.label"
                           :key="item.value"></el-option>
              </el-select>
            </div>
          </div>
          <div class="right">
            <el-button type="primary" plain size="small" @click="clickOpenDrafts">草稿箱</el-button>
          </div>
        </div>
        <div class="row clearfix">
          <div class="left">
            <div class="item">
              <span>请输入关键词</span>
              <el-input v-model="keyword" placeholder="请输入关键词" size="small" style="width: 490px;"></el-input>
              <p>备注：请输入5字以内关键词，最多输入三个，之间用空格隔开</p>
            </div>
          </div>
          <div class="right">
            <el-button type="primary" size="small" :loading="aiLoading" @click="clickWrite()">{{aiLoading ? '写作中' : '文章写作'}}</el-button>
          </div>
        </div>
      </div>

      <div class="write-content">
        <div class="left">
          <div class="row clearfix">
            <span class="left">文章标题</span>
            <el-input class="right title" v-model="title" size="small"
                      style="width: 490px;"
                      :maxlength="50"
                      :prefix-icon="titleLoading ? 'el-icon-loading' : ''"></el-input>
          </div>
          <div class="row row2 clearfix">
            <div class="left">
              <span>作者</span>
              <el-input v-model="author" size="small" style="width: 90px;" :maxlength="20"></el-input>
              <span style="width: 65px;margin-left: 8px;">文章时间</span>
              <el-date-picker v-model="time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择文章时间" size="small" style="width: 200px;" :editable="false"></el-date-picker>
            </div>
            <el-button class="right js-copy" type="primary" size="small" :data-clipboard-text="copyText">一键复制</el-button>
          </div>
          <div class="editor" :class="{'text-show':textShow}">
            <script id="editor" type="text/plain" style="height:660px;"></script>
            <p class="text">右侧“AI写作”是写作机器人写的文章，“资讯推荐”是相关资讯推荐~<span class="el-icon-close" @click="textShow=false"></span>
            </p>
          </div>
        </div>

        <div class="right">
          <div class="tabs">
            <a :class="{'active':active==1}" @click="tabsChange(1)" href="javascript:;">AI写作</a>
            <a :class="{'active':active==2,'disabled':hasNoAiList && hasNoNewsList}" @click="tabsChange(2)" href="javascript:;">推荐资讯</a>
          </div>
          <div class="items">
            <div class="item" v-show="active==1"  v-loading="aiLoading">
              <div class="search clearfix">
                <span class="left">这些AI文章满意么？还可以点击再次写作哦</span>
                <el-button class="right" type="primary" size="small" :disabled="hasNoAiList" @click="getAIListData()">再次写作</el-button>
              </div>
              <ul>
                <li v-for="item in aiListDataShow">
                  <p>{{item.summary}}</p>
                  <div class="clearfix">
                    <a href="javascript:;" @click="showAIDetail(item)">阅读全文</a>
                  </div>
                </li>
                <li class="no-news" v-show="hasNoAiList && !hasNoNewsList">非常抱歉，这个题目不会做。但我们也为您提供相关资讯内容，您也可以更换关键词！</li>
                <li class="no-news" v-show="hasNoAiList && hasNoNewsList">非常抱歉，这个题目不会做。</li>
              </ul>
              <div class="pagination">
                <el-pagination
                  @current-change="handleCurrentChange1"
                  :page-size="pageSize1"
                  :current-page="pageNum1"
                  :total="aiListData.length"
                  layout=" prev, pager, next" background small>
                </el-pagination>
              </div>

              <div class="detail" v-show="aiDetailShow">
                <div class="inner">
                  <div class="article" v-html="aiDetail"></div>
                  <a class="close" href="javascript:;" @click="closeAiDetail($event)">点击收起</a>
                </div>
              </div>

            </div>

            <div class="item" v-show="active==2" v-loading="newsLoading">
              <div class="search">
                <div class="clearfix">
                  <el-input class="left" v-model="newsKeyword" size="small" placeholder="请输入资讯关键词" :maxlength="30"></el-input>
                  <el-button class="right" type="primary" size="small" @click="getNewsListData(newsKeyword)">搜索资讯
                  </el-button>
                </div>
                <span style="width: auto;margin-top: 20px;">您还可以在这里搜索其他的资讯文章哦~</span>
              </div>
              <ul>
                <li v-for="item in newsListDataShow">
                  <h3>{{item.title}}</h3>
                  <p>{{item.summary}}</p>
                  <div class="clearfix">
                    <span>{{item.site}}</span>
                    <a href="javascript:;" @click="collectNewsList(item)">阅读全文</a>
                  </div>
                </li>
                <li class="no-news" v-show="hasNoNewsList">找不到相关资讯</li>
              </ul>
              <div class="pagination">
                <el-pagination
                  @current-change="handleCurrentChange2"
                  :page-size="pageSize2"
                  :current-page="pageNum2"
                  :total="newsListData.length"
                  layout=" prev, pager, next" background small>
                </el-pagination>
              </div>

              <div class="detail" style="top: 102px;" v-show="newsDetailShow">
                <div class="inner">
                  <div class="article" v-html="newsDetail"></div>
                  <a class="close" href="javascript:;" @click="closeNewsDetail($event)">点击收起</a>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      <div class="btns">
        <el-button type="primary" size="small" @click="saveDrafts">保存</el-button>
        <el-button type="primary" size="small" @click="downLoadWord">下载</el-button>
      </div>
    </div>


    <el-dialog class="drafts-box" title="草稿箱" :visible.sync="draftsShow" :lock-scroll="false"
               :close-on-click-modal="false">
      <table>
        <thead>
        <tr>
          <th width="40">序号</th>
          <th width="180">保存时间</th>
          <th>标题</th>
          <th width="100">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in draftsListData">
          <td>{{item.index}}</td>
          <td>{{item.create_time}}</td>
          <td>{{item.title}}</td>
          <td>
            <a href="javascript:;" @click="editDrafts(item.id)">编辑</a>
            <a href="javascript:;" @click="deleteDrafts(item.id)">删除</a>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange4"
          :page-size="pageSize4"
          :current-page="pageNum4"
          :total="totalCount4"
          layout=" prev, pager, next" background small>
        </el-pagination>
      </div>

    </el-dialog>


  </div>
</template>

<script>
  import $ from 'jquery';
  export default {
    data: function () {
      return {
        id: '',
        filedName: '财经',
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
        timeQuantum: 1,
        timeList: [
          {
            value: 1,
            label: '最近一周'
          }, {
            value: 2,
            label: '最近一月'
          }, {
            value: 3,
            label: '最近半年'
          }
        ],
        keyword: '',
        title: '',
        author: '',
        time: '',
        content: '',


        active: 1,

        aiListData: [],
        pageNum1: 1,
        pageSize1: 5,
        totalCount1: 50,
        aiDetail: {},
        aiDetailShow: false,
        hasNoAiList: false,

        newsKeyword: '',
        newsListData: [],
        pageNum2: 1,
        pageSize2: 5,
        newsDetail: {},
        newsDetailShow: false,
        hasNoNewsList: false,

        hasNoList:0,

        draftsShow: false,
        draftsListData: [],
        pageNum4: 1,
        pageSize4: 10,
        totalCount4: 5,


        textShow: false,
        titleLoading: false,
        aiLoading: false,
        newsLoading: false,
        fullLoading: false
      }
    },
    computed: {
      aiListDataShow: function () {
        return this.aiListData.slice((this.pageNum1 - 1) * this.pageSize1, this.pageNum1 * this.pageSize1);
      },
      newsListDataShow: function () {
        return this.newsListData.slice((this.pageNum2 - 1) * this.pageSize2, this.pageNum2 * this.pageSize2);
      },
      copyText:function(){
        var str='';

        if(!this.title){
          str='false-title'
        }else if(!this.author){
          str='false-author'
        }else if(!this.time){
          str='false-time'
        }else if(!this.content){
          str='false-content'
        }else {
          str='文章标题：'+this.title +'\n\r'
            + '作者：'+this.author +'\n\r'
            + '文章时间：'+this.time +'\n\r'
            + '文章内容：\n'+this.content +'\n'
        }
        return str
      }
    },
    watch:{
      hasNoList:function(val){
        if(val==2){
          if(this.hasNoNewsList && this.hasNoAiList){
            this.$alert('您输入的关键词无法进行写作，请尝试更改关键词进行写作！', '提示',{
              type:'error'
            });
          }
          this.hasNoList=0;
        }
      }
    },
    created: function () {

    },
    mounted: function () {
      this.editorInt();
    },
    destroyed: function () {
      this.editor.destroy();
    },
    methods: {

      //点击文章写作时调用
      clickWrite: function () {
        var self = this;

        if (self.keyword == '') {
          self.$alert('请输入至少一个写作关键词哦！', '提示',{
            type:'warning'
          });
          return false;
        }
        var arr=self.keyword.split(' ');
        if(arr.length>3){
          self.$alert('请按照正确规则输入写作关键词哦！', '提示',{
            type:'warning'
          });
          return false;
        }
        for(var i=0;i<arr.length;i++){
          if(arr[i].length>5){
            self.$alert('请按照正确规则输入写作关键词哦！', '提示',{
              type:'warning'
            });
            return false;
          }
        }
        self.id='';
        self.title='';
        self.author='';
        self.time='';
        self.content='';
        self.editor.setContent('');

        self.newsKeyword='';
        self.active=1;
        self.hasNoList=0;

        self.getAIListData(function (data) {

          if (self.aiListData.length > 0) {
            if(data.data.id) self.id=data.data.id;

            self.getTitle(self.aiListData[0].summary);
            self.time = self.getTime();

            //此处处理换行符在ueditor中无法正常换行，把\n替换成段落p标签
            var str = "<p>" + self.aiListData[0].summary.replace(/\n/g, "</p><p>") + "</p>";
            self.editor.setContent(str);
          }
        });

        self.getNewsListData(self.keyword)
      },


      //获取AI写作列表
      getAIListData: function (callback) {
        var self = this;
        if (self.keyword == '') {
          self.$alert('请输入至少一个写作关键词哦！', '提示',{
            type:'warning'
          });
          return false;
        }
        var arr=self.keyword.split(' ');
        if(arr.length>3){
          self.$alert('请按照正确规则输入写作关键词哦！', '提示',{
            type:'warning'
          });
          return false;
        }
        for(var i=0;i<arr.length;i++){
          if(arr[i].length>5){
            self.$alert('请按照正确规则输入写作关键词哦！', '提示',{
              type:'warning'
            });
            return false;
          }
        }


        self.aiListData = [];
        self.hasNoAiList = false;
        self.aiLoading = true;
        $.ajax({
          url: apiHost + "/industry-bulletin/writer_robot/info_writer/write",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            version: 1,
            keyword: self.keyword,
            time: self.timeQuantum,
            sl: self.wordNumber,
            cluster: "",
            tags: self.filedName,
            token: 0
          },
          success: function (data) {
            self.aiLoading=false;
            if (data.code == '0') {
              if (data.data && data.data.ai_data && data.data.ai_data.result && data.data.ai_data.result.length > 0) {
                self.aiListData = data.data.ai_data.result;
                if (callback) callback(data);
              } else {
                self.hasNoAiList = true;
                self.hasNoList++;
              }
            }else {
              self.hasNoAiList = true;
              self.hasNoList++;
            }
          },
          error: function (XMLHttpRequest) {
            self.aiLoading=false;
            if (XMLHttpRequest.status == "9001") {
              location.href = "./login.html";
            }
          }
        })
      },
      //标题生成
      getTitle: function (summary) {
        var self = this;
        self.titleLoading=true;
        $.ajax({
          url: apiHost + "/industry-bulletin/writer_robot/info_writer/headline_generation",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            article: summary
          },
          success: function (data) {
            self.titleLoading=false;
            if (data.code == '0') {
              self.title = data.data;
            }
          }
        })
      },
      //阅读AI全文
      showAIDetail: function (item) {
        this.aiDetail = "<p>" + item.summary.replace(/\n/g, "</p><p>") + "</p>";
        this.aiDetailShow = true;
      },
      //收起阅读全文
      closeAiDetail:function($event){
        var inner=$($event.target).parent();
        inner.scrollTop(0);
        this.aiDetailShow=false;
      },

      //获取资讯列表
      getNewsListData: function (keyword) {
        var self = this;
        self.newsListData = [];
        self.hasNoNewsList = false;
        self.newsLoading = true;
        $.ajax({
          url: apiHost + "/industry-bulletin/writer_robot/info_writer/news_search",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            keyword: keyword
          },
          success: function (data) {
            self.newsLoading = false;
            if (data.code == '0') {
              if (data.data && data.data.length > 0) {
                self.newsListData = data.data;
              } else {
                self.hasNoNewsList = true;
                self.hasNoList++;
              }
            }else {
              self.hasNoNewsList = true;
              self.hasNoList++;
            }
          },
          error: function (XMLHttpRequest) {
            self.newsLoading = false;
            if (XMLHttpRequest.status == "9001") {
              location.href = "./login.html";
            }
          }
        })
      },


      //保存草稿箱
      saveDrafts: function () {
        var self = this;
        self.content = self.editor.getContent();
        if (self.keyword == '') {
          self.$alert('请输入至少一个写作关键词哦！', '提示',{
            type:'warning'
          });
          return false;
        }
        var arr=self.keyword.split(' ');
        if(arr.length>3){
          self.$alert('请按照正确规则输入写作关键词哦！', '提示',{
            type:'warning'
          });
          return false;
        }
        for(var i=0;i<arr.length;i++){
          if(arr[i].length>5){
            self.$alert('请按照正确规则输入写作关键词哦！', '提示',{
              type:'warning'
            });
            return false;
          }
        }
        if (self.title == '') {
          self.$alert('请输入标题！', '提示', {
            type: 'warning'
          });
          return false;
        }
        if (self.author == '') {
          self.$alert('请输入作者！', '提示', {
            type: 'warning'
          });
          return false;
        }
        if (self.time == '') {
          self.$alert('请输入文章时间！', '提示', {
            type: 'warning'
          });
          return false;
        }
        if (self.content == '') {
          self.$alert('请输入文章内容！', '提示', {
            type: 'warning'
          });
          return false;
        }

        self.$confirm('您确定要将文章保存到草稿箱么？', '保存提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          $.ajax({
            url: apiHost + "/industry-bulletin/writer_robot/info_writer/draft_box_save",
            type: "POST",
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              id: self.id,
              keyword: self.keyword,
              title: self.title,
              author: self.author,
              time: self.time,
              content: self.content
            },
            success: function (data) {
              if (data.code == '0') {
                if(data.data) self.id=data.data;
                self.$message({
                  message: '已成功将文章保存到草稿箱！',
                  type: 'success'
                });
              }else {
                self.$message({
                  message: data.msg,
                  type: 'error'
                });
              }

              self.content = self.editor.getPlainTxt();
            }
          })
        }).catch(function () {

        });
      },
      //点击打开草稿箱
      clickOpenDrafts: function () {
        this.getDraftsListData();
        this.draftsShow = true;
      },
      //获取草稿箱列表
      getDraftsListData: function () {
        var self = this;
        $.ajax({
          url: apiHost + "/industry-bulletin/writer_robot/info_writer/draft_box_list",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            pageNo: self.pageNum4
          },
          success: function (data) {
            if (data.code == '0' && data.data) {
              if (data.data.result) self.draftsListData = data.data.result;
              if (data.data.totalCount) self.totalCount4 = data.data.totalCount;
              if (data.data.pageSize) self.pageSize4 = data.data.pageSize;
              for (var i = 0; i < self.draftsListData.length; i++) {
                self.draftsListData[i].index = (self.pageNum4 - 1) * self.pageSize4 + i + 1;
              }
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              location.href = "./login.html";
            }
          }
        })
      },
      //编辑草稿
      editDrafts:function(id){
        var self=this;
        self.id=id;
        self.active=1;
        self.newsKeyword='';
        self.hasNoList=0;
        self.hasNoAiList = false;
        self.hasNoNewsList = false;
        $.ajax({
          url: apiHost + "/industry-bulletin/writer_robot/info_writer/draft_box_edit",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            id: id
          },
          success: function (data) {
            if (data.code == '0' && data.data) {
              self.keyword=data.data.keyword;
              self.title=data.data.title;
              self.author=data.data.author;
              self.time=data.data.time;
              self.draftsShow = false;
              self.editor.setContent(data.data.content);
            }else {
              self.$message({
                message: data.msg,
                type: 'error'
              });
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              location.href = "./login.html";
            }
          }
        });

        self.getCollectNewsList(1);
        self.getCollectNewsList(2);
      },
      //删除草稿箱
      deleteDrafts: function (id) {
        var self=this;
        self.$confirm('您确定要删除此文章草稿么？', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          $.ajax({
            url: apiHost + "/industry-bulletin/writer_robot/info_writer/draft_box_delete",
            type: "POST",
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              id: id
            },
            success: function (data) {
              if (data.code == '0') {
                self.getDraftsListData();
                self.$message({
                  message: '已成功删除此文章草稿！',
                  type: 'success'
                });
              }else {
                self.$message({
                  message: data.msg,
                  type: 'error'
                });
              }
            },
            error: function (XMLHttpRequest) {
              if (XMLHttpRequest.status == "9001") {
                location.href = "./login.html";
              }
            }
          })
        }).catch(function () {

        });

      },

      //收藏资讯
      collectNewsList:function(item){
        var self=this;
        $.ajax({
          url: apiHost + "/industry-bulletin/writer_robot/info_writer/news_textcontent",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            newsid:item._id
          },
          success: function (data) {
            if (data.code == '0' && data.data && data.data.textcontent) {
              self.newsDetail = "<p>" + data.data.textcontent.replace(/\n/g, "</p><p>") + "</p>";
              self.newsDetailShow=true;
            }
          }
        });
        item.draftId=self.id;
        $.ajax({
          url: apiHost + "/industry-bulletin/writer_robot/info_writer/article_collect",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: item,
          success: function (data) {
            if (data.code == '0') {

            }
          }
        });
      },
      //收起阅读全文
      closeNewsDetail:function($event){
        var inner=$($event.target).parent();
        inner.scrollTop(0);
        this.newsDetailShow=false;
      },
      //获取草稿对应收藏的AI列表和咨询列表
      getCollectNewsList:function(type){
        var self=this;
        $.ajax({
          url: apiHost + "/industry-bulletin/writer_robot/info_writer/draft_box_article_show",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            draftId:self.id,
            type:type
          },
          success: function (data) {
            if (data.code == '0' && data.data) {
              if(type == 1){
                self.aiListData = data.data;
              }else {
                self.newsListData = data.data;
              }
            }
          }
        })
      },

      //导出word文档
      downLoadWord: function () {
        var self=this;
        self.content = self.editor.getPlainTxt();
        if (self.title == '') {
          self.$alert('请输入标题！', '提示', {
            type: 'warning'
          });
          return false;
        }
        if (self.author == '') {
          self.$alert('请输入作者！', '提示', {
            type: 'warning'
          });
          return false;
        }
        if (self.time == '') {
          self.$alert('请输入文章时间！', '提示', {
            type: 'warning'
          });
          return false;
        }
        if (self.content == '') {
          self.$alert('请输入文章内容！', '提示', {
            type: 'warning'
          });
          return false;
        }

        self.$confirm('您确定要下载此文章么？', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          $.ajax({
            url: apiHost + "/industry-bulletin/writer_robot/info_writer/save_word",
            type: "POST",
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              title: self.title,
              author: self.author,
              time: self.time,
              content: self.content
            },
            success: function (data) {
              if (data.code == '0' && data.data) {
                window.location.href=apiHost + '/industry-bulletin/writer_robot/info_writer/down_word?filename='+data.data;
              }else {
                self.$message({
                  message: data.msg,
                  type: 'error'
                });
              }
            },
            error: function (XMLHttpRequest) {
              if (XMLHttpRequest.status == "9001") {
                location.href = "./login.html";
              }
            }
          })
        }).catch(function () {

        });

      },

      tabsChange:function(active){
        if(this.hasNoAiList && this.hasNoNewsList){
          return false;
        }
        this.active=active;
      },


      handleCurrentChange1(val) {
        this.pageNum1 = val;
      },
      handleCurrentChange2(val) {
        this.pageNum2 = val;
      },
      handleCurrentChange4(val) {
        this.pageNum4 = val;
        this.getDraftsListData();
      },
      getTime() {
        var now = new Date();
        var y = now.getFullYear();
        var M = now.getMonth() + 1;
        if (M < 10) M = "0" + M;
        var d = now.getDate();
        if (d < 10) d = "0" + d;
        var h=now.getHours();
        if (h < 10) h = "0" + h;
        var m=now.getMinutes();
        if (m < 10) m = "0" + m;
        var s=now.getSeconds();
        if (s < 10) s = "0" + s;

        return  y + "-" + M + "-" + d + ' ' + h + ':' + m + ':' + s;
      },
      //富文本编辑器初始化程序
      editorInt: function () {
        var self = this;
        self.editor = UE.getEditor('editor', {
          toolbars: [[
            'source', '|',
            'undo', 'redo', '|',
            'pasteplain', 'removeformat', 'selectall', '|',
            'fontsize', 'forecolor', 'backcolor', 'bold', 'italic', 'underline', '|',
            'drafts', 'help'

          ], [
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
//            'simpleupload', 'insertimage', 'map', '|',
//            'inserttable',
            'horizontal', 'date', 'time', 'spechars', '|',
//            'link', 'unlink', '|',

          ]],
          fontsize: [10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42],
          saveInterval: 5000,
          wordCount : false,
          elementPathEnabled: false,
          autoHeightEnabled: false,
          retainOnlyLabelPasted: true
        });
        self.textShow=true;
        self.editor.addListener( 'contentChange', function( editor ) {
          self.content = self.editor.getPlainTxt();
        })
      }
    }
  }
</script>

<style>
  #write-robot {
    font-size: 14px;
    color: #333333;
  }

  #write-robot .left {
    float: left;
  }

  #write-robot .right {
    float: right;
  }

  #write-robot .web_bottom {
    margin-bottom: 100px;
  }

  #write-robot .web_bottom .control {
    background-color: #ffffff;
    margin-bottom: 10px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  #write-robot .web_bottom .control .row {
    padding: 20px 30px;
  }

  #write-robot .web_bottom .control .row .item {
    display: inline-block;
    margin-right: 35px;
  }

  #write-robot .web_bottom .control .row .item > span {
    margin-right: 5px;
  }

  #write-robot .web_bottom .control .row .item > p {
    line-height: 14px;
    font-size: 12px;
    color: #777;
    padding: 8px 0 0 100px;
  }

  #write-robot .write-content {
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    min-height: 900px;
  }

  #write-robot .write-content > .left {
    width: 60%;
    min-height: 875px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px 30px;
    border-radius: 5px;
  }

  #write-robot .write-content > .left .row {
    padding-bottom: 20px;
  }

  #write-robot .write-content > .left .row .left {
    line-height: 32px;
  }

  #write-robot .write-content > .left .row2 .left>span {
    width: 89px;
    display: inline-block;
  }
  #write-robot .write-content > .left .row .title .el-input__prefix{
    color: #000;
    font-size: 18px;
  }

  #write-robot .editor {
    position: relative;
  }

  #write-robot .editor .text {
    position: absolute;
    width: 92%;
    left: 4%;
    top: 78px;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #edf7ff;
    border-radius: 4px;
    z-index: 1000;
    display: none;
  }

  #write-robot .editor.text-show .text {
    display: block;
  }

  #write-robot .editor.text-show .text .el-icon-close {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 12px;
    height: 12px;
    border-radius: 12px;
    background-color: #dedede;
    color: #ffffff;
    cursor: pointer;
  }

  #write-robot .editor.text-show #edui1_iframeholder {
    padding-top: 55px;
  }

  #write-robot .write-content > .right {
    width: 39.2%;
    min-height: 875px;
    background-color: #fff;
    box-sizing: border-box;
    border-radius: 5px;
    padding-bottom: 20px;
  }

  #write-robot .write-content > .right .tabs {
    padding: 5px 30px 0;
    text-align: center;
    border-bottom: 1px solid #e5e5e5;
  }

  #write-robot .write-content > .right .tabs a {
    display: inline-block;
    height: 46px;
    line-height: 46px;
    font-weight: bold;
    padding: 0 4px;
    margin: 0 23px;
  }

  #write-robot .write-content > .right .tabs a.active {
    color: #409EFF;
    border-bottom: 2px solid #409EFF;
  }
  #write-robot .write-content > .right .tabs a.disabled{
    color: #cccccc;
    cursor: not-allowed;
  }

  #write-robot .write-content > .right .items {
    padding: 22px 28px 0;
  }

  #write-robot .write-content > .right .items .search {
    padding-bottom: 18px;
  }

  #write-robot .write-content > .right .items .search > span {
    font-size: 12px;
    display: block;
    line-height: 32px;
    text-align: center;
    width: 250px;
    height: 32px;
    background-color: #edf7ff;
    border-radius: 4px;
  }

  #write-robot .write-content > .right .items .search .el-input {
    width: 240px;
  }


  #write-robot .write-content > .right .item {
    position: relative;
  }

  #write-robot .write-content > .right .item > ul {
    min-height: 675px;
    position: relative;
  }

  #write-robot .write-content > .right .item > ul > li {
    padding: 10px 18px;
    background-color: #f5f5f5;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    margin-bottom: 15px;
  }

  #write-robot .write-content > .right .item > ul > li.no-news {
    background-color: transparent;
    border: none;
    position: absolute;
    left: 50%;
    top: 40%;
    width: 280px;
    margin-left: -158px;
    text-align: center;
  }

  #write-robot .write-content > .right .item > ul > li h3 {
    font-size: 16px;
    font-weight: bolder;
    line-height: 22px;
    height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  #write-robot .write-content > .right .item > ul > li p {
    text-indent: 2em;
    text-align: justify;
    font-size: 14px;
    line-height: 18px;
    max-height: 54px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }

  #write-robot .write-content > .right .item > ul > li > .clearfix {
    margin-top: 3px;
    font-size: 10px;
    line-height: 20px;
  }

  #write-robot .write-content > .right .item > ul > li span {
    float: left;
    color: #999999;
  }

  #write-robot .write-content > .right .item > ul > li a {
    float: right;
    color: #409EFF;
  }

  #write-robot .write-content > .right .item .detail {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    background-color: #f5f5f5;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    height: 680px;

  }

  #write-robot .write-content > .right .item .detail .inner {
    padding: 10px 18px 0;
    height: 623px;
    overflow-y: scroll;
  }

  #write-robot .write-content > .right .item .detail .inner::-webkit-scrollbar {
    width: 5px;
  }

  #write-robot .write-content > .right .item .detail .inner::-webkit-scrollbar-thumb {
    background-color: #ccc;
  }

  #write-robot .write-content > .right .item .detail h3 {
    font-size: 18px;
    line-height: 26px;
    padding: 16px 0;
    font-weight: bolder;
  }

  #write-robot .write-content > .right .item .detail .article,
  #write-robot .write-content > .right .item .detail .article p {
    font-size: 16px;
    line-height: 26px;
    padding-bottom: 10px;
    word-wrap: break-word;
  }

  #write-robot .write-content > .right .item .detail .close {
    position: absolute;
    right: 30px;
    bottom: 12px;
    font-size: 12px;
    color: #409EFF;
    line-height: 22px;
  }
  #write-robot .write-content > .right .item .detail.news-detail .inner{
    padding: 10px 0 0 18px;
    overflow: hidden;
  }
  #write-robot .write-content > .right .item .detail.news-detail .inner .article{
    width:100%;
    height: 100%;
  }
  #write-robot .write-content > .right .item .detail.news-detail .inner .article iframe{
    width:100%;
    height: 100%;
    overflow-y: scroll;
    border: none;
  }
  #write-robot .write-content > .right .item .detail.news-detail .inner .article iframe::-webkit-scrollbar {
    width: 5px;
  }
  #write-robot .write-content > .right .item .detail.news-detail .inner .article iframe::-webkit-scrollbar-thumb {
    background-color: #ccc;
  }

  #write-robot .pagination {
    float: none;
    text-align: center;
  }

  #write-robot .btns {
    padding-top: 30px;
    text-align: center;
  }

  #write-robot .btns .el-button + .el-button {
    margin-left: 17px;
  }

  #write-robot .drafts-box .el-dialog {
    width: 780px;
    border-radius: 4px;
  }

  #write-robot .drafts-box .el-dialog__header {
    padding: 18px 50px;
    border-bottom: 1px solid #d8d8d8;
  }

  #write-robot .drafts-box .el-dialog__title {
    font-size: 16px;
  }

  #write-robot .drafts-box .el-dialog__headerbtn {
    right: 50px;
  }

  #write-robot .drafts-box .el-dialog__headerbtn .el-dialog__close {
    font-size: 26px;
    font-weight: bolder;
    color: #333;
  }

  #write-robot .drafts-box .el-dialog__body {
    padding: 8px 50px 30px;
  }

  #write-robot .drafts-box .el-dialog__body table {
    width: 100%;
    text-align: center;
  }

  #write-robot .drafts-box .el-dialog__body th,
  #write-robot .drafts-box .el-dialog__body td {
    border-bottom: 1px solid #d8d8d8;
    line-height: 25px;
    padding: 12px;
  }

  #write-robot .drafts-box .el-dialog__body td a {
    color: #409EFF;
    margin: 0 5px;
  }

  /*样式覆盖*/
  #write-robot .el-select {
    width: 170px;
  }

  #write-robot .el-button {
    width: 110px;
  }
  #write-robot .is-loading,
  #write-robot .el-button.is-loading:before{
    cursor: not-allowed;
  }

</style>
