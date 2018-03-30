<template>
  <div id="datasource-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/datasource' }">数据源管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{form.id=='' ? '新增数据源' : '修改数据源'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content clearfix">
      <div class="form left">
        <el-form ref="form" :model="form" :rules="rules" label-width="150px" size="small">
          <el-form-item label="代码" prop="code" required :class="{'prefix': form.id==''}">
            <span class="pre">D_</span>
            <el-input v-model="form.code"></el-input>
          </el-form-item>
          <el-form-item label="数据源名称" prop="name" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="当前值" prop="value" required>
            <el-input v-model="form.value" type="textarea" :rows="2"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description" required>
            <el-input v-model="form.description" type="textarea" :rows="4"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <router-link class="btn" to="/datasource">取消</router-link>
          </el-form-item>
        </el-form>
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
          value: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入数据源名称'}
          ],
          description: [
            {required: true, message: '请输入描述'}
          ],
          code: [
            {required: true, message: '请输入代码'}
          ],
          value: [
            {required: true, message: '请输入当前值'}
          ]
        }

      }
    },
    created: function () {
      if (this.$route.query.id) {
        this.form.id = this.$route.query.id;
      }
      if (this.form.id != '') {
        this.getDetail();
      }
    },
    methods: {
      getDetail: function () {
        var self = this;
        $.ajax({
          url: apiHost + '/datasource/detail',
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
        var url = apiHost + '/datasource/add';
        var text = '新增数据源成功！';
        var code='D_'+self.form.code;
        if (self.form.id != '') {
          url = apiHost + '/datasource/update';
          text = '修改数据源成功！';
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
                value:self.form.value,
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
                        self.$router.push('/datasource');
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

      }

    }
  }
</script>

<style>
  #datasource-add .content {
    padding-top: 30px;
    min-width: 1010px;
  }

  #datasource-add .form {
    width: 600px;
  }
</style>
