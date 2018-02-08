<template>
  <div id="section-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/section' }">段落管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{form.id=='' ? '新增段落' : '修改段落'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content clearfix">
      <div class="form left">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
          <el-form-item label="段落名称" prop="name" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description" required>
            <el-input v-model="form.description" type="textarea" :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="模板" prop="content" required>
            <script id="editor" type="text/plain" style="height:400px;"></script>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit()">提交</el-button>
            <router-link class="btn" to="/section">取消</router-link>
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
                  layout=" pager,jumper" background small>
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
        </el-tabs>
      </div>


    </div>


  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        form: {
          id: '',
          name: '',
          description: '',
          content: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入段落名称'}
          ],
          description: [
            {required: true, message: '请输入描述'}
          ],
          content: [
            {required: true, message: '请输入模板'}
          ]
        },
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
        totalCount3: 0
      }
    },
    created: function () {
      if (this.$route.query.id) {
        this.form.id = this.$route.query.id;
      }
      this.getListData();
      this.getListData2();
      this.getListData3();
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
          url: apiHost + '/section/detail',
          data: {
            id: self.form.id
          },
          type: "GET",
          success: function (data) {
            if (data.code == '0' && data.data) {
              self.form = data.data;
              self.editor.setContent(data.data.content)
            }
          }
        })
      },

      onSubmit() {
        var self = this;
        var url = apiHost + '/section/add';
        var text = '新增段落成功！';
        if (self.form.id != '') {
          url = apiHost + '/section/update';
          text = '修改段落成功！';
        }
        self.form.content = self.editor.getContent();

        if(self.form.name == '' || self.form.description == '' || self.form.content==''){
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
                name: self.form.name,
                description: self.form.description,
                content: self.form.content,
                status: '0'
              },
              type: "POST",
              success: function (data) {
                if (data.code == '0') {
                  self.$alert(text, '提示', {
                    confirmButtonText: '确定',
                    type: 'success',
                    callback: function (action) {
                      if (action == 'confirm') {
                        self.$router.push('/section');
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
  #section-add .content {
    padding-top: 30px;
    min-width: 1200px;
  }

  #section-add .form {
    width: 800px;
  }

  #section-add .form .btn {
    margin-left: 10px;
  }
  #section-add .detail-show .mid{
    width: 90%;
    margin:0 auto;
  }
  #section-add .detail-show .mid h2{
    text-align: center;
    font-weight: bold;
    padding:10px 0;
  }
  #section-add .detail-show .el-dialog__footer{
    text-align: center;
  }







</style>
