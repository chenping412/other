<template>
  <div id="task-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/template' }">任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{form.id=='' ? '新增任务' : '修改任务'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content clearfix">
      <div class="form left">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px" size="small">
          <el-form-item label="" prop="status" required>
            <el-radio v-model="form.status" label="0">启用</el-radio>
            <el-radio v-model="form.status" label="1">禁用</el-radio>
          </el-form-item>
          <el-form-item label="任务名称" prop="title" required>
            <el-input v-model="form.title"></el-input>
          </el-form-item>

          <el-form-item label="" prop="andOr" required>
            <el-radio v-model="form.andOr" label="0">and</el-radio>
            <el-radio v-model="form.andOr" label="1">or</el-radio>
          </el-form-item>

          <el-form-item label="写作时间" prop="time">
            <el-date-picker v-model="form.time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择文章时间" size="small" :editable="false"></el-date-picker>
          </el-form-item>

          <el-form-item label="描述" prop="description" required>
            <el-input v-model="form.description" type="textarea" :rows="4"></el-input>
          </el-form-item>

          <el-form-item label="模板" prop="content" required>
            <script id="editor" type="text/plain" style="height:400px;"></script>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="clickDetailShow">预览</el-button>
            <el-button type="primary" @click="onSubmit(0)">保存</el-button>
            <el-button type="primary" @click="onSubmit(1)" v-show="form.status!='1'">提交</el-button>
            <router-link class="btn" to="/template">取消</router-link>
          </el-form-item>
        </el-form>
      </div>

      <div class="example left">
        <el-tabs type="border-card">
          <el-tab-pane label="数据源列表">
            <div class="search">
              <el-input v-model="searchText" size="small" @input="searchList"></el-input>
              <el-button type="primary" size="small" @click="searchList">搜索</el-button>
            </div>
            <ul class="list">
              <li v-for="item in listData">
                <div class="title">
                  <span>{{item.code}}</span>
                  <a href="javascript:;" @click="item.isHide = !item.isHide">{{item.isHide ? '展示全部' : '收起全部'}}</a>
                </div>
                <p :class="{'hide':item.isHide}">{{item.description}}</p>
              </li>
            </ul>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="5"
                :current-page="pageNum"
                :total="totalCount"
                layout="pager,jumper" background small>
              </el-pagination>
            </div>

          </el-tab-pane>
          <el-tab-pane label="公式列表">
            <div class="search">
              <el-input v-model="searchText2" size="small" @input="searchList2"></el-input>
              <el-button type="primary" size="small" @click="searchList2">搜索</el-button>
            </div>
            <ul class="list">
              <li v-for="item in listData2">
                <div class="title">
                  <span>{{item.code}}</span>
                  <a href="javascript:;" @click="item.isHide = !item.isHide">{{item.isHide ? '展示全部' : '收起全部'}}</a>
                </div>
                <p :class="{'hide':item.isHide}">{{item.description}}</p>
              </li>
            </ul>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange2"
                @current-change="handleCurrentChange2"
                :page-size="5"
                :current-page="pageNum2"
                :total="totalCount2"
                layout=" pager,jumper" background small>
              </el-pagination>
            </div>

          </el-tab-pane>
          <el-tab-pane label="规则列表">
            <div class="search">
              <el-input v-model="searchText3" size="small" @input="searchList3"></el-input>
              <el-button type="primary" size="small" @click="searchList3">搜索</el-button>
            </div>
            <ul class="list">
              <li v-for="item in listData3">
                <div class="title">
                  <span>{{item.code}}</span>
                  <a href="javascript:;" @click="item.isHide = !item.isHide">{{item.isHide ? '展示全部' : '收起全部'}}</a>
                </div>
                <p :class="{'hide':item.isHide}">{{item.description}}</p>
              </li>
            </ul>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange3"
                @current-change="handleCurrentChange3"
                :page-size="5"
                :current-page="pageNum3"
                :total="totalCount3"
                layout=" pager,jumper" background small>
              </el-pagination>
            </div>

          </el-tab-pane>
          <el-tab-pane label="段落列表">
            <div class="search">
              <el-input v-model="searchText4" size="small" @input="searchList4"></el-input>
              <el-button type="primary" size="small" @click="searchList4">搜索</el-button>
            </div>
            <ul class="list">
              <li v-for="item in listData4">
                <div class="title">
                  <span>{{item.name}}</span>
                  <a href="javascript:;" @click="item.isHide = !item.isHide">{{item.isHide ? '展示全部' : '收起全部'}}</a>
                </div>
                <p :class="{'hide':item.isHide}" v-html="item.content"></p>
              </li>
            </ul>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange4"
                @current-change="handleCurrentChange4"
                :page-size="5"
                :current-page="pageNum4"
                :total="totalCount4"
                layout=" pager,jumper" background small>
              </el-pagination>
            </div>

          </el-tab-pane>

        </el-tabs>
        <!--<div class="task-list">
          <div class="top clearfix">
            <h3>任务管理器</h3>
            <el-button class="right" type="primary" size="small">新增</el-button>
          </div>
          <div class="search">
            <el-input v-model="searchText5" size="small" @input="searchList5"></el-input>
            <el-button type="primary" size="small" @click="searchList5">搜索</el-button>
          </div>
          <table class="list">
            <tbody>
            <tr v-for="item in listData5">
              <td width="170">{{item.title}}</td>
              <td>
                <a href="javascript:;">任务查看</a>
                <a href="javascript:;">任务修改</a>
                <a href="javascript:;">任务删除</a>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="pagination">
            <el-pagination
              @current-change="handleCurrentChange5"
              :page-size="5"
              :current-page="pageNum5"
              :total="totalCount5"
              layout="pager,jumper" background small>
            </el-pagination>
          </div>
        </div>-->
      </div>


    </div>


    <el-dialog title="预览" class="detail-show" :visible.sync="detailShow" width="800px">
      <div class="mid">
        <h2>{{detail.title}}</h2>
        <div v-html="detail.article"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="detailShow = false">取 消</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        form: {
          id: '',
          title: '',
          time:'',
          radio:'1',
          description: '',
          content: '',
          status: '',
          andOr: '',
        },
        rules: {
          title: [
            {required: true, message: '请输入任务名称'}
          ],
          description: [
            {required: true, message: '请输入描述'}
          ],
          content: [
            {required: true, message: '请输入模板'}
          ]
        },
        detail:{},
        detailShow:false,

        searchText: '',
        listData: [],
        pageNum: 1,
        totalCount: 0,

        searchText2: '',
        listData2: [],
        pageNum2: 1,
        totalCount2: 0,

        searchText3: '',
        listData3: [],
        pageNum3: 1,
        totalCount3: 0,

        searchText4: '',
        listData4: [],
        pageNum4: 1,
        totalCount4: 0,

        searchText5: '',
        listData5: [
          {
            title:'个股写作1',
            id:1
          },{
            title:'个股写作1',
            id:1
          },{
            title:'个股写作1',
            id:1
          },{
            title:'个股写作1',
            id:1
          },{
            title:'个股写作1',
            id:1
          },
        ],
        pageNum5: 1,
        totalCount5: 0
      }
    },
    created: function () {
      if (this.$route.query.id) {
        this.form.id = this.$route.query.id;
      }
      this.getListData();
      this.getListData2();
      this.getListData3();
      this.getListData4();
    },
    mounted: function () {
      this.editorInt();
    },
    destroyed: function () {
      this.editor.destroy();
    },
    methods: {
      getDetail: function () {
        var self = this;
        $.ajax({
          url: apiHost + '/template/detail',
          data: {
            id: self.form.id
          },
          type: "GET",
          success: function (data) {
            if (data.code == '0' && data.data) {
              self.form.title = data.data.title;
              self.form.description = data.data.description;
              self.form.status = data.data.status;
              console.log(self.form.status)
              self.editor.setContent(data.data.content)
            }
          }
        })
      },

      onSubmit(status) {
        var self = this;
        var url = apiHost + '/template/add';
        var text = '新增任务成功！';
        if (self.form.id != '') {
          url = apiHost + '/template/update';
          text = '修改任务成功！';
        }
        self.form.content = self.editor.getContent();

        if(self.form.title == '' || self.form.description == '' || self.form.content==''){
          self.$alert('有必填项未填写，请填写完整！', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          });
        }

        self.$refs.form.validate(function (valid) {
          if (valid) {
            $.ajax({
              url: url,
              data: {
                id: self.form.id,
                title: self.form.title,
                description: self.form.description,
                content: self.form.content,
                status: status
              },
              type: "POST",
              success: function (data) {
                if (data.code == '0') {
                  self.$alert(text, '提示', {
                    confirmButtonText: '确定',
                    type: 'success',
                    callback: function (action) {
                      if (action == 'confirm') {
                        self.$router.push('/template');
                      }
                    }
                  });
                }else {
                  self.$alert(data.msg, '提示', {
                    confirmButtonText: '确定',
                    type: 'error'
                  });
                }
              }
            })
          }
        });

      },
      //预览
      clickDetailShow:function(){
        var self = this;
        self.form.content = this.editor.getContent();
        if(!self.form.content){
          self.$alert('模板不能为空！', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          });
          return
        }
        $.ajax({
          url: apiHost + '/writer/template_writer',
          data: {
            template: self.form.content
          },
          type: "POST",
          success: function (data) {
            if (data.code == '0' && data.data) {
              self.detail = self.form;
              self.detail.article = data.data;
              self.detailShow = true;
            }else {
              self.$message({
                type: 'error',
                message: '预览失败！'
              });
            }
          },
          error:function(data){
            self.$message({
              type: 'error',
              message: '预览失败！'
            });
          }
        });
      },

      searchList:function(){
        var self=this;
        clearTimeout(self.timer);
        self.timer=setTimeout(function(){
          self.pageNum=1;
          self.getListData();
        },500);
      },
      //获取代码列表数据
      getListData: function () {
        var self = this;
        $.ajax({
          url: apiHost + '/datasource/list',
          data: {
            keyword: self.searchText,
            pageNo: self.pageNum,
            pageSize: 5
          },
          type: "POST",
          success: function (data) {
            if (data.code == '0' && data.data && data.data.data) {
              for(var i=0;i<data.data.data.length;i++){
                data.data.data[i].isHide=true;
              }

              self.listData = data.data.data
              self.totalCount = data.data.totalRecord
            }


          }
        })
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getListData();
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getListData();
      },

      searchList2:function(){
        var self=this;
        clearTimeout(self.timer2);
        self.timer2=setTimeout(function(){
          self.pageNum2=1;
          self.getListData2();
        },500);
      },
      //获取段落列表数据
      getListData2: function () {
        var self = this;
        $.ajax({
          url: apiHost + '/formula/list',
          data: {
            keyword: self.searchText2,
            pageNo: self.pageNum2,
            pageSize: 5
          },
          type: "POST",
          success: function (data) {
            if (data.code == '0' && data.data && data.data.data) {
              for (var i = 0; i < data.data.data.length; i++) {
                data.data.data[i].isHide = true;
              }
              self.listData2 = data.data.data;
              self.totalCount2 = data.data.totalRecord;
            }

          }
        })
      },
      handleSizeChange2(val) {
        this.pageSize2 = val;
        this.getListData2();
      },
      handleCurrentChange2(val) {
        this.pageNum2 = val;
        this.getListData2();
      },

      searchList3:function(){
        var self=this;
        clearTimeout(self.timer3);
        self.timer3=setTimeout(function(){
          self.pageNum3=1;
          self.getListData3();
        },500);
      },
      //获取代码列表数据
      getListData3: function () {
        var self = this;
        $.ajax({
          url: apiHost + '/rule/list',
          data: {
            keyword: self.searchText3,
            pageNo: self.pageNum3,
            pageSize: 5
          },
          type: "POST",
          success: function (data) {
            if (data.code == '0' && data.data && data.data.data) {
              for (var i = 0; i < data.data.data.length; i++) {
                data.data.data[i].isHide = true;
              }
              self.listData3 = data.data.data;
              self.totalCount3 = data.data.totalRecord;
            }

          }
        })
      },
      handleSizeChange3(val) {
        this.pageSize3 = val;
        this.getListData3();
      },
      handleCurrentChange3(val) {
        this.pageNum3 = val;
        this.getListData3();
      },

      searchList4:function(){
        var self=this;
        clearTimeout(self.timer4);
        self.timer4=setTimeout(function(){
          self.pageNum4=1;
          self.getListData4();
        },500);
      },
      //获取段落列表数据
      getListData4: function () {
        var self = this;
        $.ajax({
          url: apiHost + '/section/list',
          data: {
            keyword: self.searchText4,
            pageNo: self.pageNum4,
            pageSize: 5
          },
          type: "POST",
          success: function (data) {
            if (data.code == '0' && data.data && data.data.data) {
              for (var i = 0; i < data.data.data.length; i++) {
                data.data.data[i].isHide = true;
              }
              self.listData4 = data.data.data;
              self.totalCount4 = data.data.totalRecord;
            }

          }
        })
      },
      handleSizeChange4(val) {
        this.pageSize4 = val;
        this.getListData4();
      },
      handleCurrentChange4(val) {
        this.pageNum4 = val;
        this.getListData4();
      },

      searchList5:function(){
        var self=this;
        clearTimeout(self.timer5);
        self.timer5=setTimeout(function(){
          self.pageNum5=1;
          self.getListData5();
        },500);
      },
      //获取任务列表
      getListData5:function(){
        console.log('getListData5')
      },
      handleCurrentChange5(val) {
        this.pageNum5 = val;
        this.getListData5();
      },

      //富文本编辑器初始化程序
      editorInt: function () {
        var self = this;
        self.editor = UE.getEditor('editor', {
          toolbars: [[
            'fullscreen', 'source', '|',
            'undo', 'redo', '|',
            'pasteplain', 'removeformat', 'selectall', '|',
            'bold', 'underline', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
//            'simpleupload', 'insertimage', 'map', '|',
//            'inserttable',
            'horizontal', 'date', 'time', 'spechars', '|',
//            'link', 'unlink', '|',
            'drafts', 'help', '|'
          ]],
          fontsize: [10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42],
          saveInterval: 5000,
          maximumWords: 10000,
          elementPathEnabled: false,
          autoHeightEnabled: false,
          retainOnlyLabelPasted: true
        });
        self.editor.ready(function () {
          if (self.form.id != '') {
            self.getDetail();
          }
        })
      }
    }
  }
</script>

<style>
  #task-add .content {
    padding-top: 30px;
    min-width: 1260px;
  }

  #task-add .form {
    width: 800px;
  }

  #task-add .form .btn {
    margin-left: 10px;
  }
  #task-add .detail-show .mid{
    width: 90%;
    margin:0 auto;
  }
  #task-add .detail-show .mid h2{
    text-align: center;
    font-weight: bold;
    padding:10px 0;
  }
  #task-add .detail-show .el-dialog__footer{
    text-align: center;
  }
  #app #task-add .content .example{
    width: 410px;
  }


  #task-add .content .task-list{
    padding:15px;
    margin-top: 15px;
    background: #fff;
    border: 1px solid #dcdfe6;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  }
  #task-add .content .task-list .top{
    padding-bottom: 10px;
  }
  #task-add .content .task-list .top h3{
    float: left;
    line-height: 32px;
    font-size: 14px;
  }
  #task-add .content .task-list .list td{
    border-bottom: 1px solid #ccc;
    padding: 10px 0;
  }
  #task-add .content .task-list .list a{
    margin: 0 3px;
  }


</style>
