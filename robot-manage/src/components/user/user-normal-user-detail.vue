<template>
  <div id="user-normal-user-detail">
    <div class="breadcrumb">
      <el-breadcrumb separator="/" v-if="from!='agent'">
        <el-breadcrumb-item :to="{ path: '/' }">普通用户</el-breadcrumb-item>
        <el-breadcrumb-item >用户详情</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator="/" v-if="from=='agent'">
        <el-breadcrumb-item :to="{ path: '/user-index/user-agent' }">代理商</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/user-index/user-agent/agent-detail?id='+parentId }">代理商详情</el-breadcrumb-item>
        <el-breadcrumb-item >客户详情</el-breadcrumb-item>
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
        <table class="info-table">
          <tbody>
          <tr>
            <td class="col1">{{from=='agent' ? '客户账号' : '用户账号'}}</td>
            <td>zhisou</td>
            <td></td>
          </tr>
          <tr v-if="from!='agent'">
            <td class="col1">用户手机号</td>
            <td>15920033453</td>
            <td></td>
          </tr>
          <tr v-if="from=='agent'">
            <td class="col1">客户名称</td>
            <td>{{baseInfo.name}}</td>
            <td><a href="javascript:;" @click="baseInfoNameShow = true">修改</a></td>
          </tr>
          <tr>
            <td class="col1">SecretId</td>
            <td>chenping</td>
            <td rowspan="2"><a href="javascript:;" @click="resetSecretKey()">重置</a> </td>
          </tr>
          <tr>
            <td class="col1">SecretKey</td>
            <td>feabca98b2924596b5c28d345b895780</td>
          </tr>
          <tr>
            <td class="col1">备注</td>
            <td>{{baseInfo.comment}}</td>
            <td><a href="javascript:;" @click="commentShow = true">修改</a></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <el-tabs type="card">
      <el-tab-pane label="产品信息">
        <el-table
          :data="productTableData"
          :span-method="objectSpanMethod"
          border
          style="width: 100%;">
          <el-table-column
            label="应用"
            align="center">
            <template slot-scope="scope">
              <a href="javascript:;" @click="openProductDetail(scope.row.id)">{{scope.row.name}}<br>({{scope.row.id}})</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="robot"
            label="机器人" align="center">
          </el-table-column>
          <el-table-column
            prop="amount1"
            label="服务名称" align="center">
          </el-table-column>
          <el-table-column
            prop="amount2"
            label="规格" align="center">
          </el-table-column>
          <el-table-column
            prop="amount3"
            label="到期日期" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <router-link :to="{ path: '/user-index/user-normal/api-detail', query: {parentId:id ,id: scope.row.id ,from:from}}">查看接口详情</router-link>
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


      </el-tab-pane>
      <el-tab-pane label="订单信息">
        <el-table
          :data="orderTableData"
          border
          style="width: 100%;">
          <el-table-column
            prop="id"
            label="订单编号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="type"
            label="订单类型" align="center">
          </el-table-column>
          <el-table-column
            prop="creatTime"
            label="提交时间" align="center">
          </el-table-column>
          <el-table-column
            prop="product"
            label="应用" align="center">
          </el-table-column>
          <el-table-column
            prop="text"
            label="产品信息" align="center">
          </el-table-column>
          <el-table-column
            prop="price"
            label="订单金额" align="center">
          </el-table-column>
          <el-table-column
            prop="payType"
            label="支付方式" align="center">
          </el-table-column>
          <el-table-column
            prop="status"
            label="订单状态" align="center">
          </el-table-column>

          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <router-link :to="{ path: '/user-index/user-normal/user-detail', query: {id: scope.row.id}}">查看订单</router-link>
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


      </el-tab-pane>
    </el-tabs>

    <el-dialog class="product-detail" :title="productDetail.name" :visible.sync="productDetailShow" :lock-scroll="false" width="450px">
      <div class="content">
        <p>应用简介：</p>
        <p>{{productDetail.text}}</p>
        <h4>WEB</h4>
        <p>host：{{productDetail.host}}</p>
        <h4>IOS</h4>
        <p>应用名称：{{productDetail.iosName}}</p>
        <p>Bundle ID：{{productDetail.bundleID}}</p>
        <h4>Android</h4>
        <p>应用名称：{{productDetail.androidName}}</p>
        <p>应用签名：{{productDetail.sign}}</p>
        <p>应用包名：{{productDetail.package}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="productDetailShow = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改客户名称" :visible.sync="baseInfoNameShow" :lock-scroll="false" :close-on-click-modal="false" width="450px">
      <p>客户名称：</p>
      <el-input type="textarea" :rows="6" v-model="baseInfo.name"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="baseInfoNameShow = false">取 消</el-button>
        <el-button type="primary" @click="submitBaseInfoName()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改备注" :visible.sync="commentShow" :lock-scroll="false" :close-on-click-modal="false" width="450px">
      <p>备注：</p>
      <el-input type="textarea" :rows="6" v-model="baseInfo.comment"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="commentShow = false">取 消</el-button>
        <el-button type="primary" @click="submitComment()">确 定</el-button>
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
        parentId: '',
        from: 'normal',
        baseInfo:{
          name:'报业A',
          comment:'某某app使用'
        },
        productTableData: [{
          id: '5a5c8fb3',
          name: '天机智讯',
          robot:'采集机器人',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        }, {
          id: '5a5c8fb3',
          name: '天机智讯',
          robot:'采集机器人',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        }, {
          id: '5a5c8fb3',
          name: '天机智讯',
          robot:'编辑机器人',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        }, {
          id: '5a5c8fb3',
          name: '天机智讯',
          robot:'写作机器人',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        }, {
          id: '5a3cd006',
          name: '天机联盟',
          robot:'采集机器人',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        }, {
          id: '5a3cd006',
          name: '天机联盟',
          robot:'采集机器人',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        }, {
          id: '5a3cd006',
          name: '天机联盟',
          robot:'写作机器人',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        }],
        orderTableData:[
          {
            id:'201707196398345',
            type:'正式订单',
            creatTime:'2017-07-19 14:48:38',
            product:'天机智讯',
            text:'采集机器人-资讯搜索-相似资讯',
            price:'¥10000.00',
            payType:'银行转账',
            status:'1'
          },{
            id:'201707196398345',
            type:'正式订单',
            creatTime:'2017-07-19 14:48:38',
            product:'天机智讯',
            text:'采集机器人-资讯搜索-相似资讯',
            price:'¥10000.00',
            payType:'银行转账',
            status:'1'
          },{
            id:'201707196398345',
            type:'正式订单',
            creatTime:'2017-07-19 14:48:38',
            product:'天机智讯',
            text:'采集机器人-资讯搜索-相似资讯',
            price:'¥10000.00',
            payType:'银行转账',
            status:'1'
          },{
            id:'201707196398345',
            type:'正式订单',
            creatTime:'2017-07-19 14:48:38',
            product:'天机智讯',
            text:'采集机器人-资讯搜索-相似资讯',
            price:'¥10000.00',
            payType:'银行转账',
            status:'1'
          },{
            id:'201707196398345',
            type:'正式订单',
            creatTime:'2017-07-19 14:48:38',
            product:'天机智讯',
            text:'采集机器人-资讯搜索-相似资讯',
            price:'¥10000.00',
            payType:'银行转账',
            status:'1'
          },{
            id:'201707196398345',
            type:'正式订单',
            creatTime:'2017-07-19 14:48:38',
            product:'天机智讯',
            text:'采集机器人-资讯搜索-相似资讯',
            price:'¥10000.00',
            payType:'银行转账',
            status:'1'
          },
        ],
        pageNum: 1,
        pageSize: 10,
        totalPage: 100,
        baseInfoNameShow:false,
        commentShow:false,
        productDetailShow:false,
        productDetail:{
          name:'天机智讯',
          text:'天机智讯是索拉卡就分松雷肯德基分蓝思科技的分类接口阿死定了附近是了点击开发了继奎饲料店科技看就算了肯定就',
          host:'www.giiso.com',
          iosName:'天机智讯',
          bundleID:'sdsdsdsd45sd5s4ds4d56s',
          androidName:'天机智讯',
          sign:'sdsdsdsd45sd5s4ds4d56s',
          package:'sdsdsdsd45sd5s4ds4d56s'

        }
      };
    },
    created() {
      if(this.$route.query.id){
        this.id=this.$route.query.id;
      }
      if(this.$route.query.parentId){
        this.parentId=this.$route.query.parentId;
      }
      if(this.$route.query.from){
        this.from=this.$route.query.from;
      }
      console.log(this.from)
    },
    methods: {
      //提交修改客户名称
      submitBaseInfoName:function(){
        var self=this;
        self.baseInfoNameShow = false;
      },
      //提交修改备注
      submitComment:function(){
        var self=this;
        self.commentShow = false;
      },
      //重置密码
      resetPassword:function() {
        var self=this;
        self.$confirm('重置后密码为123456, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          self.$message({
            type: 'success',
            message: '重置密码成功!'
          });
        }).catch(function(){

        });
      },
      //重置SecretKey
      resetSecretKey:function() {
        var self=this;
        self.$confirm('您是否确认重置？重置后则无法使用该密钥', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          self.$message({
            type: 'success',
            message: '重置密钥成功!'
          });
        }).catch(function(){

        });
      },
      openProductDetail:function(id){
        this.productDetailShow=true;
      },

      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          var m=1;
          for(var i=rowIndex+1;i<this.productTableData.length;i++){
            if(this.productTableData[i].id==row.id){
              m++;
            }else {
              break;
            }
          }
          this.productTableData[rowIndex].rowspan=m;
          if(rowIndex>0 && this.productTableData[rowIndex-1].rowspan>1){
            return {
              rowspan: 0,
              colspan: 0
            }
          }else{
            return {
              rowspan: m,
              colspan: 1
            }
          }
        }
        if (columnIndex === 1) {
          var n=1;
          for(var i=rowIndex+1;i<this.productTableData.length;i++){
            if(this.productTableData[i].robot==row.robot){
              n++;
            }else {
              break;
            }
          }
          this.productTableData[rowIndex].rowspan1=n;
          if(rowIndex>0 && this.productTableData[rowIndex-1].rowspan1>1){
            return {
              rowspan: 0,
              colspan: 0
            }
          }else{
            return {
              rowspan: n,
              colspan: 1
            }
          }
        }
      },
      //分页处理
      handleCurrentChange(val) {
        this.pageNum = val;
      }
    }
  };
</script>

<style>
  #user-normal-user-detail .user-info{
    padding:10px 0 40px;
  }
#user-normal-user-detail .user-info .top{
  padding:10px 30px;
  font-size: 14px;
  line-height: 32px;
}
#user-normal-user-detail .user-info .bot{
  padding:0 30px;
}

  #user-normal-user-detail .el-tab-pane{
    padding:10px 30px;
  }
  #user-normal-user-detail .product-detail .content h4{
    font-weight: bold;
    line-height: 30px;
    padding-top: 5px;
  }
</style>
