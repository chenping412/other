<template>
  <div id="user-normal-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">普通用户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="form box">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="用户账号">
          <el-input v-model="searchForm.username" placeholder="用户ID/账号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input v-model="searchForm.mobile" placeholder="用户手机号" size="small"></el-input>
        </el-form-item>
        <el-form-item label="用户渠道">
          <el-select v-model="searchForm.channel" placeholder="请选择" size="small">
            <el-option v-for="item in searchForm.channelList" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="注册时间">
          <el-date-picker
            v-model="searchForm.registerDate"
            size="small"
            type="daterange"
            value-format="yyyy-MM-dd"
            @change="registerDateChange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getUserListData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="add">
      <el-button type="primary" size="small" @click="openAddUser">添加用户</el-button>
    </div>
    <div class="table">
      <el-table
        :data="userListData"
        style="width: 100%">
        <el-table-column
          prop="username"
          label="用户账号"
          width=""
          align="center">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="用户手机号"
          width="115"
          align="center">
        </el-table-column>
        <el-table-column
          prop="c"
          label="用户渠道"
          align="center">
          <template slot-scope="scope">
            <span v-for="item in searchForm.channelList" v-show="scope.row.channel == item.code">{{item.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="注册时间"
          width="170"
          align="center">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="最近登录时间"
          width="170"
          align="center">
        </el-table-column>
        <el-table-column
          label="账户启用状态"
          align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.status == 1">启用</span>
            <span v-show="scope.row.status == 0">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140">
          <template slot-scope="scope">
            <router-link :to="{ path: '/home/order/list/add', query: {uid: scope.row.id}}">下单</router-link>
            <router-link :to="{ path: '/home/user-index/user-normal/user-detail', query: {id: scope.row.id}}">详情</router-link>
            <a href="javascript:;" v-if="scope.row.status == 0" @click="changeUserStatus(scope.row.id,1)">启用</a>
            <a href="javascript:;" v-if="scope.row.status == 1" @click="changeUserStatus(scope.row.id,0)">禁用</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page.sync="pageNo"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="totalPage" background>
      </el-pagination>
    </div>

    <div class="model" v-show="loginState">
      <div class="content">
        <a href="javascript:;">
          <b>!</b>
          登陆过期，请重新登陆。
        </a>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        loginState: false,
        showAddUser: false,
        pageNo: 1,
        pageSize: 10,
        totalPage: 0,
        searchForm: {
          username: "",
          mobile: "",
          channel:'',
          channelList:[
            {
              name:'官网注册',
              code:'0'
            },{
              name:'手动注册',
              code:'1'
            },{
              name:'大客户',
              code:'2'
            },{
              name:'杭州前方',
              code:'3'
            },{
              name:'U传播',
              code:'4'
            }
          ],
          registerDate: ""
        },
        userListData: []
      };
    },
    created() {
      var self = this;
      self.getUserListData();
    },
    methods: {
      //获取用户列表数据
      getUserListData() {
        var self = this;
        var startTime = "";
        var endTime = "";
        if (self.searchForm.registerDate) {
          startTime = self.searchForm.registerDate[0];
          endTime = self.searchForm.registerDate[1];
        }
        self.$http({
          url: apiHost + "/member/query",
          type: 'post',
          data: {
            type:0,
            channel: self.searchForm.channel,
            username: self.searchForm.username,
            mobile: self.searchForm.mobile,
            startTime: startTime,
            endTime: endTime,
            pageNo: self.pageNo,
            pageSize: self.pageSize
          },
          success: function (data) {
            if (data.code == 0 && data.data && data.data.data) {
              self.userListData = data.data.data;
              self.totalPage = data.data.totalRecord;
            } else {
              self.userListData = [];
            }
          }
        });
      },
      //日期选择
      registerDateChange(val) {
        var self = this;
        console.log(val);
        self.searchForm.registerDate = val;
      },
      //分页处理
      handleCurrentChange(val) {
        var self = this;
        self.pageNo = val;
        self.getUserListData();
      },
      //打开添加用户model
      openAddUser() {
        this.$router.push('/home/user-index/user-normal/add')
      },

      //禁用和启用用户
      changeUserStatus(id,status) {
        var self = this;

        self.$confirm( status==1 ? '是否启用该用户？' : '是否禁用该用户？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function(){
          self.$http({
            url: apiHost + "/member/update",
            type: 'post',
            data: {
              id: id,
              status: status
            },
            success: function (data) {
              if (data.code == 0) {
                self.getUserListData();
              } else {
                self.$message({
                  message: data.msg,
                  type: "error"
                });
              }
            }
          });

        }).catch(function(){

        });
      }


    }
  };
</script>

<style>

</style>
