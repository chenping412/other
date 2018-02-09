<template>
  <div id="role-mgr">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
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
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <el-table
        ref="multipleTable"
        :data="roleList"
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
          prop="name"
          label="权限名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="权限名称"
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
          prop="description"
          label="描述"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="btn" @click="updateModelOpen(scope.row.id)">修改</span>
            <span class="btn" @click="funcModelOpen(scope.row.id)">功能</span>
            <span class="btn" @click="updateStatus(scope.row.id, scope.row.status)">状态</span>
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
        <el-form-item label="code" prop="code">
          <el-input v-model="addForm.code" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="name" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="description" prop="description">
          <el-input v-model="addForm.description" auto-complete="off" size="small"></el-input>
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
      width="35%">
      <el-form :model="updateForm" ref="updateForm" label-width="100px">
        <el-form-item label="code" prop="code">
          <el-input v-model="updateForm.code" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="name" prop="name">
          <el-input v-model="updateForm.name" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="update_id" prop="create_id">
          <el-input v-model="updateForm.update_id" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="description" prop="description">
          <el-input v-model="updateForm.description" auto-complete="off" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateModel = false" size="small">取 消</el-button>
        <el-button type="primary" @click="update" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!--功能分配-->
    <el-dialog
      title="功能分配"
      :visible.sync="funcModel"
      width="45%">
      <el-transfer v-model="funcSelect" :data="funcAll" :titles="['未有功能', '已有功能']"
                   @change="funcChange"></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="funcModel = false" size="small">取 消</el-button>
        <el-button type="primary" @click="funcAllot" size="small">确 定</el-button>
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
        roleList: [],
        addModel: false,
        updateModel: false,
        funcModel: false,
        addForm: {
          code: "",
          name: "",
          create_id: "",
          description: "",
        },
        updateForm: {
          code: "",
          name: "",
          create_id: "",
          description: "",
        },
        deleteIds: "",
        userId: 11,
        tempId: "",
        funcSelect: [],
        funcAll: [],
        funcIds: "",
      }
    },
    created: function () {
      this.getRoleList();
    },
    methods: {
      //获取权限列表
      getRoleList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/role/list",
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
      //根据id获取权限信息
      getRoleDetail(id) {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/role/get_role",
          type: "post",
          data: {
            id: id,
          },
          success: function (data) {
            if (data.code == 0) {
              self.updateForm.code = data.data.code;
              self.updateForm.name = data.data.name;
              self.updateForm.update_id = data.data.update_id;
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
      },
      add() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/role/add",
          type: "post",
          data: {
            code: self.addForm.code,
            name: self.addForm.name,
            userId: self.userId,
            description: self.addForm.description,
          },
          success: function (data) {
            if (data.code == 0) {
              self.addModel = false;
              self.getRoleList();
            }
          },
          error: function () {

          }
        })
      },
      //修改
      updateModelOpen(id) {
        this.getRoleDetail(id);
        this.tempId = id;
        this.updateModel = true;
      },
      update() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/role/update",
          type: "post",
          data: {
            userId: self.userId,
            id: self.tempId,
            code: self.updateForm.code,
            name: self.updateForm.name,
            description: self.updateForm.description,
          },
          success: function (data) {
            if (data.code == 0) {
              self.updateModel = false;
              self.getRoleList();
            }
          },
          error: function () {

          }
        })
      },
      //打开分配功能模态框
      funcModelOpen(id) {
        this.funcModel = true;
        this.tempId = id;
        this.getHasFuncList(id);
        this.getAllFuncList(id);
      },
      //分配功能
      funcAllot() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/func/add_role_func",
          type: "post",
          data: {
            userId: self.userId,
            roleId: self.tempId,
            ids: self.funcselectIds,
          },
          success: function (data) {
            if (data.code == 0) {
              self.funcModel = false;
              self.getRoleList();
              self.$message({
                type: "success",
                message: "权限修改成功",
                showClose: true,
              })
            }
          },
          error: function () {

          }
        })
      },
      //已有功能变化
      funcChange(val) {
        var self = this;
        if (val) {
          self.funcselectIds = val.join(",");
        }
      },
      //获取已有功能
      getHasFuncList(id) {
        var self = this;
        self.funcSelect = [];
        $.ajax({
          url: self.apiHost + "/manage/user/get_right_func_list",
          type: "post",
          data: {
            roleId: id,
          },
          success: function (data) {
            if (data.code == 0) {
              data.data.map(function (item) {
                self.funcSelect.push(item.id)
              })
            }
          },
          error: function () {

          }
        })
      },
      //获取所有功能列表
      getAllFuncList(id) {
        var self = this;
        self.funcAll = [];
        $.ajax({
          url: self.apiHost + "/manage/func/list",
          type: "post",
          data: {
            func_id: id,
          },
          success: function (data) {
            if (data.code == 0) {
              data.data.map(function (item) {
                self.funcAll.push({
                  key: item.id,
                  label: item.name,
                })
              })
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
              url: self.apiHost + "/manage/role/del_all",
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
                  self.getRoleList();
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
      //修改状态
      updateStatus(id, status) {
        var self = this;
        self.$confirm('此操作将更改数据状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $.ajax({
            url: self.apiHost + "/manage/role/update_status",
            type: "post",
            data: {
              userId: self.userId,
              id: id,
              status: status,
            },
            success: function (data) {
              if (data.code == 0) {
                self.$message({
                  type: 'success',
                  message: '修改成功!',
                  showClose: true,
                });
                this.getRoleList();
              }
            },
            error: function () {

            }
          })

        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消修改'
          });
        });
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
              // self.powerList = data.data;
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
        }
      },
    }
  }
</script>

<style lang="less">
  #role-mgr {
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
