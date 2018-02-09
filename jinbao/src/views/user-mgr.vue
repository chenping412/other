<template>
  <div id="user-mgr">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="operate">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户ID">
          <el-input v-model="searchForm.keyword" placeholder="请输入用户ID" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUserList" size="small">查询</el-button>
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
        :data="userList"
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
          prop="user_name"
          label="用户名"
          width="">
        </el-table-column>
        <el-table-column
          align="center"
          prop="nike_name"
          label="用户别名"
          width="">
        </el-table-column>
        <el-table-column
          align="center"
          prop="create_time"
          label="创建时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          prop="update_time"
          label="修改时间"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="手机号码"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          align="center"
          prop="email"
          label="邮箱"
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
          prop="type"
          label="类型"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-show="scope.row.type==0">超级管理员</span>
            <span v-show="scope.row.type==1">管理员</span>
            <span v-show="scope.row.type==2">操作员</span>
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
          width="120">
          <template slot-scope="scope">
            <span class="btn" @click="updateModelOpen(scope.row.id)">修改</span>
            <span class="btn" @click="roleModelOpen(scope.row.id)">权限</span>
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
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="addForm.user_name" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="用户别名" prop="nike_name">
          <el-input v-model="addForm.nike_name" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addForm.phone" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="管理员类型" prop="type">
          <el-select v-model="addForm.type" size="small">
            <el-option label="超级管理员" value="0"></el-option>
            <el-option label="管理员" value="1"></el-option>
            <el-option label="操作员" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="addForm.description"></el-input>
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
        <el-form-item label="用户名" prop="user_name">
          <el-input v-model="updateForm.user_name" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="用户别名" prop="nike_name">
          <el-input v-model="updateForm.nike_name" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="updateForm.phone" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email" auto-complete="off" size="small"></el-input>
        </el-form-item>
        <el-form-item label="管理员类型" prop="type">
          <el-select v-model="updateForm.type" placeholder="请选择" size="small">
            <el-option label="超级管理员" value="0"></el-option>
            <el-option label="管理员" value="1"></el-option>
            <el-option label="操作员" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="updateForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateModel = false" size="small">取 消</el-button>
        <el-button type="primary" @click="update" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!--权限分配-->
    <el-dialog
      title="权限分配"
      :visible.sync="roleModel"
      width="45%">
      <el-transfer v-model="roleSelect" :data="allRoll" @change="powerChange"></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleModel = false" size="small">取 消</el-button>
        <el-button type="primary" @click="rollAllot" size="small">确 定</el-button>
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
        userList: [],
        addModel: false,
        updateModel: false,
        roleModel: false,
        addForm: {
          user_name: "",
          nike_name: "",
          phone: "",
          email: "",
          type: "0",
          description: "",
        },
        updateForm: {
          user_name: "",
          nike_name: "",
          phone: "",
          email: "",
          type: "",
          description: "",
        },
        userId: 11,
        deleteIds: "",
        roleSelect: [],
        allRoll: [],
        tempId: "",
        roleSelectIds: "",
      }
    },
    created: function () {
      this.getUserList();
    },
    methods: {
      //获取用户列表
      getUserList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/user/list",
          type: "post",
          data: {},
          success: function (data) {
            if (data.code == 0) {
              self.userList = data.data;
            }
          },
          error: function () {

          }
        })
      },
      //根据id获取用户信息
      getUserDetail(id) {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/user/get_user",
          type: "post",
          data: {
            id: id,
          },
          success: function (data) {
            if (data.code == 0) {
              self.updateForm.user_name = data.data.user_name;
              self.updateForm.nike_name = data.data.nike_name;
              self.updateForm.phone = data.data.phone;
              self.updateForm.email = data.data.email;
              self.updateForm.type = data.data.type;
              self.updateForm.description = data.data.description;
            }
          },
          error: function () {

          }
        })
      },
      //添加
      addModelOpen() {
        this.addModel = true;
      },
      add() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/user/add",
          type: "post",
          data: {
            userId: self.userId,
            user_name: self.addForm.user_name,
            nike_name: self.addForm.nike_name,
            phone: self.addForm.phone,
            email: self.addForm.email,
            type: self.addForm.type,
            description: self.addForm.description,
          },
          success: function (data) {
            if (data.code == 0) {
              self.addModel = false;
              self.getUserList();
            }
          },
          error: function () {

          }
        })
      },
      //修改
      updateModelOpen(id) {
        this.getUserDetail(id)
        this.updateModel = true;
        this.tempId = id;
      },
      update() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/user/update",
          type: "post",
          data: {
            userId: self.userId,
            id: self.tempId,
            user_name: self.updateForm.user_name,
            nike_name: self.updateForm.nike_name,
            phone: self.updateForm.phone,
            email: self.updateForm.email,
            type: self.updateForm.type,
            description: self.updateForm.description,
          },
          success: function (data) {
            if (data.code == 0) {
              self.updateModel = false;
              self.getUserList();
            }
          },
          error: function () {

          }
        })
      },
      //权限分配
      roleModelOpen(id) {
        this.roleModel = true;
        this.tempId = id;
        this.getHasRollList(id);
        this.getAllRollList(id);
      },
      //修改权限
      rollAllot() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/manage/user/add_role",
          type: "post",
          data: {
            userId: self.userId,
            userRoleId: self.tempId,
            ids: self.roleSelectIds,
          },
          success: function (data) {
            if (data.code == 0) {
              self.roleModel = false;
              self.getUserList();
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
      //已有权限变化
      powerChange(val) {
        var self = this;
        if (val) {
          self.roleSelectIds = val.join(",");
        }
      },
      //获取已有权限列表
      getHasRollList(id) {
        var self = this;
        self.roleSelect = [];
        $.ajax({
          url: self.apiHost + "/manage/user/role_right_list",
          type: "post",
          data: {
            user_id: id,
          },
          success: function (data) {
            if (data.code == 0) {
              data.data.map(function (item) {
                self.roleSelect.push(item.id)
              })
            }
          },
          error: function () {

          }
        })
      },
      //获取所有有权限列表
      getAllRollList(id) {
        var self = this;
        self.allRoll = [];
        $.ajax({
          url: self.apiHost + "/manage/role/list",
          type: "post",
          data: {
            user_id: id,
          },
          success: function (data) {
            if (data.code == 0) {
              data.data.map(function (item) {
                self.allRoll.push({
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
              url: self.apiHost + "/manage/user/del_all ",
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
                  self.getUserList();
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
            url: self.apiHost + "/manage/user/update_status",
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
                self.getUserList();
              }
            },
            error: function () {

            }
          })

        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取修改'
          });
        });
      },
      //查询
      search() {
        var self = this;
        var id = self.searchForm.keyword;
        self.getUserDetail(id)
        // $.ajax({
        //   url: self.apiHost + "/manage/user/list",
        //   type: "post",
        //   data: {},
        //   success: function (data) {
        //     if (data.code == 0) {
        //       self.userList = data.data;
        //     }
        //   },
        //   error: function () {
        //
        //   }
        // })
      },
      //表格checkbox选中状态变化，获取选中行的id
      handleSelectionChange(val) {
        var idArr = [];
        if (val.length > 0) {
          val.map((item) => {
            idArr.push(item.id)
          })
          this.deleteIds = idArr.join(",")
        }
      }
    }
  }
</script>

<style lang="less">
  #user-mgr {
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
