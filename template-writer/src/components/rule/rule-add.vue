<template>
  <div id="rule-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">规则管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{form.id=='' ? '新增规则' : '修改规则'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content clearfix">
      <div class="form left">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px" size="small">
          <el-form-item label="代码" prop="code" required :class="{'prefix': form.id==''}">
            <span class="pre">R_</span>
            <el-input v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item label="规则名称" prop="name" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="条件" prop="expression" required>
            <el-input v-model="form.expression" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <el-form-item label="true" prop="then_sentence" required>
            <el-input v-model="form.then_sentence" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <el-form-item label="false" prop="else_sentence" required>
            <el-input v-model="form.else_sentence" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description" required>
            <el-input v-model="form.description" type="textarea" :rows="4"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <r
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
          code: '',
          expression: '',
          then_sentence: '',
          else_sentence: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入规则名称'}
          ],
          description: [
            {required: true, message: '请输入描述'}
          ],
          code: [
            {required: true, message: '请输入代码'}
          ],
          expression: [
            {required: true, message: '请输入条件'}
          ],
          then_sentence: [
            {required: true, message: '请输入one'}
          ],
          else_sentence: [
            {required: true, message: '请输入two'}
          ]
        },

        searchText: '',
        listData: [],
        pageNum: 1,
        totalCount: 0,

        searchText2: '',
        listData2: [],
        pageNum2: 1,
        totalCount2: 0
      }
    },
    created: function () {
      if (this.$route.query.id) {
        this.form.id = this.$route.query.id;
      }
      if (this.form.id != '') {
        this.getDetail();
      }
      this.getListData();
      this.getListData2();
    },
    methods: {
      getDetail: function () {
        var self = this;
        $.ajax({
          url: apiHost + '/rule/detail',
          data: {
            id: self.form.id
          },
          type: "GET",
          success: function (data) {
            console.log(data)
            if (data.code == '0' && data.data) {
              self.form.name = data.data.name;
              self.form.description = data.data.description;
              self.form.code = data.data.code;
              self.form.expression = data.data.expression;
              self.form.then_sentence = data.data.thenSentence;
              self.form.else_sentence = data.data.elseSentence;
            }
          }
        })
      },

      onSubmit() {
        var self = this;
        var url = apiHost + '/rule/add';
        var text = '新增规则成功！';
        var code='R_'+self.form.code;
        if (self.form.id != '') {
          url = apiHost + '/rule/update';
          text = '修改规则成功！';
          code=self.form.code;
        }

        self.$refs.form.validate(function (valid) {
          if (valid) {
            $.ajax({
              url: url,
              data: {
                id:self.form.id,
                name:self.form.name,
                description:self.form.description,
                expression:self.form.expression,
                then_sentence:self.form.then_sentence,
                else_sentence:self.form.else_sentence,
                code:code
              },
              type: "POST",
              success: function (data) {
                if (data.code == '0') {
                  self.$alert(text, '提示', {
                    confirmButtonText: '确定',
                    type: 'success',
                    callback: function (action) {
                      if(action == 'confirm'){
                        self.$router.push('/rule');
                      }
                    }
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

    }
  }
</script>

<style>
  #rule-add .content {
    padding-top: 30px;
    min-width: 1010px;
  }

  #rule-add .form {
    width: 600px;
  }
</style>
