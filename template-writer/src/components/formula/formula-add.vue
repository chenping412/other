<template>
  <div id="formula-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/formula' }">公式管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{form.id=='' ? '新增公式' : '修改公式'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content clearfix">
      <div class="form left">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px" size="small">
          <el-form-item label="代码" prop="code" required :class="{'prefix': form.id==''}">
            <span class="pre">F_</span>
            <el-input v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item label="公式名称" prop="name" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="公式" prop="expression" required>
            <el-input v-model="form.expression" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description" required>
            <el-input v-model="form.description" type="textarea" :rows="4"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <router-link class="btn" to="/formula">取消</router-link>
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
          expression: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入公式名称'}
          ],
          description: [
            {required: true, message: '请输入描述'}
          ],
          code: [
            {required: true, message: '请输入代码'}
          ],
          expression: [
            {required: true, message: '请输入公式'}
          ]
        },

        searchText: '',
        listData: [],
        pageNum: 1,
        totalCount: 0

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
    },
    methods: {
      getDetail: function () {
        var self = this;
        $.ajax({
          url: apiHost + '/formula/detail',
          data: {
            id: self.form.id
          },
          type: "GET",
          success: function (data) {
            console.log(data)
            if (data.code == '0' && data.data) {
              self.form = data.data;
            }
          }
        })
      },

      onSubmit() {
        var self = this;
        var url = apiHost + '/formula/add';
        var text = '新增公式成功！';
        var code='F_'+self.form.code;

        if (self.form.id != '') {
          url = apiHost + '/formula/update';
          text = '修改公式成功！';
          code=self.form.code
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
                        self.$router.push('/formula');
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
      }

    }
  }
</script>

<style>
  #formula-add .content {
    padding-top: 30px;
    min-width: 1010px;
  }

  #formula-add .form {
    width: 600px;
  }
</style>
