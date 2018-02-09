<template>
  <div id="func-mgr">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">功能管理</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="operate">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户ID">
          <el-input v-model="searchForm.keyword" placeholder="请输入用户ID" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" size="small">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addModelOpen" size="small">新增</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="danger" size="small" @click="remove()">删除</el-button>
          <!--<el-button type="primary" @click="" size="small">批量删除</el-button>-->
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <el-table
        ref="multipleTable"
        :data="funcList"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          align="center"
          type="selection"
          width="30">
        </el-table-column>
        <el-table-column
          align="center"
          prop="code"
          label="code"
          width="">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="功能名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="create_time"
          width="">
        </el-table-column>
        <el-table-column
          align="center"
          label="更新时间"
          prop="update_time"
          width="">
        </el-table-column>
        <el-table-column
          align="center"
          prop="description"
          label="描述"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          prop="status"
          label="状态"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-show="scope.row.status==0" style="color: green;">启用</span>
            <span v-show="scope.row.status==1" style="color: red;">停用</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="btn" @click="updateModelOpen(scope.row.id)">修改</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--新增-->
    <el-dialog
      title="新增"
      :visible.sync="addModel"
      width="30%">
      <el-form :model="addForm" ref="addForm" label-width="100px">
        <el-form-item label="role" prop="code">
          <el-select v-model="addForm.parentId" placeholder="请选择" size="small">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="code" prop="code">
          <el-input v-model="addForm.code" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="name" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="icon" prop="icon">
          <el-input v-model="addForm.icon" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="status" prop="status">
          <el-select v-model="addForm.status">
            <el-option label="启用" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="type" prop="type">
          <el-select v-model="addForm.type" placeholder="请选择">
            <el-option label="按钮" value="1"></el-option>
            <el-option label="小图标" value="2"></el-option>
            <el-option label="URL连接" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="description" prop="description">
          <el-input type="textarea" v-model="addForm.description" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addModel = false" size="small">取 消</el-button>
        <el-button type="primary" @click="add" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改-->
    <el-dialog
      title="修改"
      :visible.sync="updateModel"
      width="30%">
      <el-form :model="updateForm" ref="updateForm" label-width="100px">
        <el-form-item label="role" prop="code">
          <el-select v-model="updateForm.parentId" placeholder="请选择" size="small">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="code" prop="code">
          <el-input v-model="updateForm.code" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="name" prop="name">
          <el-input v-model="updateForm.name" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="icon" prop="icon">
          <el-input v-model="updateForm.icon" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="status" prop="status">
          <el-select v-model="updateForm.status">
            <el-option label="启用" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="type" prop="type">
          <el-select v-model="updateForm.type" placeholder="请选择">
            <el-option label="按钮" value="1"></el-option>
            <el-option label="小图标" value="2"></el-option>
            <el-option label="URL连接" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="description" prop="description">
          <el-input type="textarea" v-model="updateForm.description" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateModel = false" size="small">取 消</el-button>
        <el-button type="primary" @click="update" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        searchForm: {
          keyword: ""
        },
        funcList: [],
        addModel: false,
        updateModel: false,
        roleList: [],
        userId: 11,
        addForm: {
          parentId: "",
          code: "",
          name: "",
          icon: "",
          status: "0",
          type: "",
          description: "",
        },
        updateForm: {
          parentId: "",
          code: "",
          name: "",
          icon: "",
          status: "0",
          type: "",
          description: "",
        },
        tempId: "",
        deleteIds: "",
      }
    },
    created: function () {
      this.getFuncList();
    },
    methods: {
      //获取功能列表
      getFuncList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/func/list",
          type: "post",
          data: {},
          success: function (data) {
            if (data.code == 0) {
              self.funcList = data.data;
            }
          },
          error: function () {

          }
        })
      },
      //根据id获取功能信息
      getFuncDetail(id) {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/func/get_func",
          type: "post",
          data: {
            id: id,
          },
          success: function (data) {
            if (data.code == 0) {
              self.updateForm.parentId = data.data.parent_id;
              self.updateForm.code = data.data.code;
              self.updateForm.name = data.data.name;
              self.updateForm.status = data.data.status;
              self.updateForm.type = data.data.type;
              self.updateForm.description = data.data.description;
            }
          },
          error: function () {

          }
        })
      },
      //新增
      addModelOpen() {
        this.addModel = true;
        this.getRoleList();
      },
      add() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/func/add",
          type: "post",
          data: {
            userId: self.userId,
            parent_id: self.addForm.parentId,
            code: self.addForm.code,
            name: self.addForm.name,
            status: Number(self.addForm.status),
            type: Number(self.addForm.type),
            description: self.addForm.description,
          },
          success: function (data) {
            if (data.code == 0) {
              self.addModel = false;
              self.getFuncList();
            }
          },
          error: function () {

          }
        })
      },
      //修改
      updateModelOpen(id) {
        this.getFuncDetail(id)
        this.getRoleList();
        this.updateModel = true;
        this.tempId = id;
      },
      update() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/func/update",
          type: "post",
          data: {
            userId: self.userId,
            id: self.tempId,
            parent_id: self.updateForm.parentId,
            code: self.updateForm.code,
            name: self.updateForm.name,
            status: self.updateForm.status,
            type: self.updateForm.type,
            description: self.updateForm.description,
          },
          success: function (data) {
            if (data.code == 0) {
              self.updateModel = false;
              self.getFuncList();
            }
          },
          error: function () {

          }
        })
      },
      //删除
      remove() {
        var self = this;
        if (self.deleteIds) {
          self.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $.ajax({
              url: self.apiHost + "/manage/func/del_All",
              type: "post",
              data: {
                ids: self.deleteIds,
              },
              success: function (data) {
                if (data.code == 0) {
                  self.$message({
                    type: 'success',
                    message: '删除成功!',
                    showClose: true,
                  });
                  self.getFuncList();
                }
              },
              error: function () {

              }
            })

          }).catch(() => {
            self.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        } else {
          self.$message({
            type: 'warning',
            message: '请先选中需要删除的数据!',
            showClose: true,
          });
        }
      },
      //查询
      search() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/user/list",
          type: "post",
          data: {},
          success: function (data) {
            if (data.code == 0) {
              self.funcList = data.data;
            }
          },
          error: function () {

          }
        })
      },
      handleSelectionChange(val) {
        var idArr = [];
        if (val.length > 0) {
          val.map((item) => {
            idArr.push(item.id)
          })
          this.deleteIds = idArr.join(",")
          console.log(typeof this.ids)
        }
      },
      //功能下拉框接口
      getRoleList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/func/get_func_by_pid",
          type: "post",
          data: {},
          success: function (data) {
            if (data.code == 0) {
              self.roleList = data.data;
            }
          },
          error: function () {

          }
        })
      },
    }
  }
</script>

<style lang="less">
  #func-mgr {
    .operate {
      padding: 15px 0;
      .fr {
        float: right;
      }
    }
    .btn {
      color: #0874ea;
      cursor: pointer;
    }
  }
</style>
