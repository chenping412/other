<template>
  <div id="user-agent-agent-detail">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">代理商</el-breadcrumb-item>
        <el-breadcrumb-item >代理商详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="user-info box">
      <div class="top clearfix">
        <h3 class="left">基本资料</h3>
        <div class="right">
          <el-button type="primary" size="small"  @click="resetPassword()">重置密码</el-button>
        </div>
      </div>
      <div class="bot">
        <table>
          <tbody>
          <tr>
            <td class="col1">代理商名称</td>
            <td>{{baseInfo.name}}</td>
            <td></td>
          </tr>
          <tr>
            <td class="col1">代理商账号</td>
            <td>{{baseInfo.username}}</td>
            <td></td>
          </tr>
          <tr>
            <td class="col1">备注</td>
            <td>{{baseInfo.remark}}</td>
            <td><a href="javascript:;" @click="changeRemark()">修改</a></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="user-list">
      <div class="top clearfix">
        <h3 class="left">客户列表</h3>
        <div class="right">
          <el-button type="primary" size="small"  @click="openAddUser()">添加客户</el-button>
        </div>
      </div>
      <div class="bot">
        <el-table :data="userListData" style="width: 100%">
          <el-table-column prop="name" label="客户名称" align="center"></el-table-column>
          <el-table-column prop="uid" label="客户账号" align="center"></el-table-column>
          <el-table-column prop="product" label="已接入应用" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <router-link :to="{ path: '/home/user-index/user-agent/user-detail', query: {id: scope.row.id , parentId:id , from:'agent'}}">详情</router-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="totalPage" background>
          </el-pagination>
        </div>
      </div>
    </div>




    <el-dialog title="修改备注" :visible.sync="remarkShow" width="450px">
      <p>备注：</p>
      <el-input type="textarea" :rows="6" v-model="remark"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkShow = false">取 消</el-button>
        <el-button type="primary" @click="submitRemark()">确 定</el-button>
      </span>
    </el-dialog>


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
  import $ from "jquery";

  export default {
    data() {
      return {
        loginState: false,
        id: '',
        baseInfo:{
          remark:''
        },
        remark:'',
        userListData:[
          {
            id:'1',
            uid:'kehua',
            name:'客户A',
            product:'全橙智媒'
          },{
            id:'2',
            uid:'kehua',
            name:'客户A',
            product:'全橙智媒'
          },{
            id:'3',
            uid:'kehua',
            name:'客户A',
            product:'全橙智媒'
          },{
            id:'4',
            uid:'kehua',
            name:'客户A',
            product:'全橙智媒'
          },{
            id:'5',
            uid:'kehua',
            name:'客户A',
            product:'全橙智媒'
          },
        ],
        pageNum: 1,
        pageSize: 20,
        totalPage: 100,
        remarkShow:false

      };
    },
    created() {
      if(this.$route.query.id){
        this.id=this.$route.query.id;
      }
      this.getDetailData();
    },
    methods: {
      //获取用户详情
      getDetailData() {
        var self = this;
        self.$http({
          url: apiHost + "/member/detail",
          type: 'post',
          data: {
            id: self.id
          },
          success: function (data) {
            if (data.code == 0) {
              self.baseInfo=data.data;
            } else {

            }
          }
        });
      },
      //打开修改备注
      changeRemark(){
        this.remarkShow = true;
        this.remark=this.baseInfo.remark;
      },
      //提交修改备注
      submitRemark:function(){
        var self=this;
        self.$http({
          url: apiHost + "/member/update",
          type: 'post',
          data: {
            id: self.id,
            remark: self.remark
          },
          success: function (data) {
            if (data.code == 0) {
              self.getDetailData();
              self.remarkShow = false;
            } else {
              self.$message({
                message: data.msg,
                type: "error"
              });
            }
          }
        });
      },
      //重置密码
      resetPassword:function() {
        var self=this;
        self.$confirm( '重置后密码为123456, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function(){
          self.$http({
            url: apiHost + "/member/update",
            type: 'post',
            data: {
              id: self.id,
              password: '123456'
            },
            success: function (data) {
              if (data.code == 0) {
                self.$message({
                  type: 'success',
                  message: '重置密码成功!'
                });
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
      },
      //打开添加客户
      openAddUser() {
        this.$router.push('/home/user-index/user-agent/add-customer?id='+this.id)
      },
      //分页处理
      handleCurrentChange(val) {
        this.pageNum = val;
      }
    }
  };
</script>

<style>
  #user-agent-agent-detail .user-info{
    padding:10px 0 40px;
  }
#user-agent-agent-detail .top{
  padding:10px 30px;
  font-size: 14px;
  line-height: 32px;
}
#user-agent-agent-detail .bot{
  padding:0 30px;
}
#user-agent-agent-detail .user-info .bot table{
  width: 100%;
  border-collapse: collapse;
}
#user-agent-agent-detail .user-info .bot table td{
  padding: 12px;
  border:1px solid #ebeef5;
}
#user-agent-agent-detail .user-info .bot .col1{
  background-color: #f5f7fa;
  width: 150px;
}
  #user-agent-agent-detail .el-tab-pane{
    padding:10px 30px;
  }
  #user-agent-agent-detail .product-detail .content h4{
    font-weight: bold;
    line-height: 30px;
    padding-top: 5px;
  }
  #user-agent-agent-detail .user-list .el-table{
    border-right: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
  }
</style>
