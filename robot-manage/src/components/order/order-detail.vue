<template>
  <div id="order-detail">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/order' }">订单列表</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="order-status clearfix">
      <div class="box-left">
        <p v-for="item in statusList" v-if="orderInfo.status == item.code">当前订单状态：{{item.name}}</p>
      </div>
      <div class="box-right">
        <div v-show="status == 1 || true">
          <el-button type="primary" size="small" @click="updateProduct">修改产品信息</el-button>
          <el-button type="primary" size="small" @click="updateRemark">修改备注</el-button>
          <el-button type="primary" size="small" @click="updateCostModel">修改费用</el-button>
          <el-button type="primary" size="small" @click="updateOrderModel">修改订单状态</el-button>
        </div>
        <div v-show="status != 1">
          <el-button type="primary" size="small" @click="updateRemark">修改备注</el-button>
        </div>
      </div>
    </div>
    <div class="div-row">
      <h3>基本信息</h3>
      <div class="table">
        <el-table :data="orderInfo" border style="width: 100%">
          <el-table-column prop="orderNo" label="订单编号" align="center"></el-table-column>
          <el-table-column label="账号" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.username}}</span>
              <router-link :to="{path: '/home/user-index/user-normal/user-detail', query: {id: scope.row.appId}}">查看</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" align="center"></el-table-column>
          <el-table-column prop="appName" label="应用" align="center"></el-table-column>
        </el-table>
        <el-table :data="orderInfo" border style="width: 100%">
          <el-table-column label="订单类型" align="center">
            <template slot-scope="scope">
              <span v-show="scope.row.type == 1">试用订单</span>
              <span v-show="scope.row.type == 0">正式订单</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="下单时间" align="center"></el-table-column>

          <el-table-column label="支付方式" align="center">
            <template slot-scope="scope">
              <span v-show="scope.row.payType == 1">银行转账</span>
              <span v-show="scope.row.payType == 2">在线支付</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="div-row">
      <h3>商品信息</h3>
      <div class="table">
        <el-table :data="apiCartData" border style="width: 100%">
          <el-table-column property="id" label="套餐编号" width="" align="center"></el-table-column>
          <el-table-column property="name" label="套餐名称" width="" align="center"></el-table-column>
          <el-table-column property="type" label="类型" width="" align="center"></el-table-column>
          <el-table-column property="sdk" label="机器人" width="" align="center"></el-table-column>
          <el-table-column property="api" label="服务" width="" align="center"></el-table-column>
          <el-table-column property="size" label="规格" width="" align="center"></el-table-column>
          <el-table-column property="startTime" label="生效时间" width="" align="center"></el-table-column>
          <el-table-column property="endTime" label="到期时间" width="" align="center"></el-table-column>
          <el-table-column property="price" label="单价/￥" align="center"></el-table-column>
          <el-table-column property="count" label="数量" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="product-bot">
        <p>订单金额：¥{{totalCount}}</p>
        <p>实付金额：¥30000.00</p>
      </div>
    </div>
    <div class="div-row">
      <h3>操作记录</h3>
      <div class="table">
        <el-table :data="logList" border style="width: 100%">
          <el-table-column prop="operator" label="操作者" align="center"></el-table-column>
          <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
          <el-table-column prop="status" label="订单状态" align="center">
            <template slot-scope="scope">
              <span v-for="item in statusList" v-show="scope.row.status == item.code">{{item.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="操作内容" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <!--修改订单--><!--修改订单--><!--修改订单--><!--修改订单--><!--修改订单--><!--修改订单--><!--修改订单--><!--修改订单--><!--修改订单--><!--修改订单-->

    <el-dialog
      title="修改订单状态"
      :visible.sync="updateOrderShow"
      :close-on-click-modal="false" :lock-scroll="false"
      width="30%">
      <el-form :model="orderUpdateForm" ref="orderUpdateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="订单状态：" prop="status" required>
          <el-select v-model="orderUpdateForm.status" size="small">
            <el-option v-for="item in statusList" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式：" prop="status" required>
          <span v-show="orderUpdateForm.payType == 1">银行转账</span>
          <span v-show="orderUpdateForm.payType == 2">在线支付</span>
        </el-form-item>
        <el-form-item label="操作备注：" prop="remark">
          <el-input size="small" type="textarea" :rows="4" :maxlength="150" placeholder="请输入内容" v-model="orderUpdateForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateOrderShow = false" size="small">取 消</el-button>
        <el-button type="primary" @click="updateOrder()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改备注-->
    <el-dialog
      title="修改备注"
      :visible.sync="updateRemarkShow"
      :close-on-click-modal="false" :lock-scroll="false"
      width="30%">
      <el-form :model="orderUpdateForm" ref="orderUpdateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="操作备注：" prop="remark">
          <el-input
            size="small"
            type="textarea"
            :rows="4"
            :maxlength="150"
            placeholder="请输入内容"
            v-model="orderUpdateForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateRemarkShow = false" size="small">取 消</el-button>
        <el-button type="primary" @click="updateOrder()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改费用信息--><!--修改费用信息--><!--修改费用信息--><!--修改费用信息--><!--修改费用信息--><!--修改费用信息--><!--修改费用信息--><!--修改费用信息-->
    <el-dialog
      title="修改费用信息"
      :visible.sync="updateCostShow"
      :close-on-click-modal="false" :lock-scroll="false"
      width="30%">
      <el-table :data="costInfo" border style="width: 100%">
        <el-table-column prop="hejiAmount" label="商品合计" width="" align="center">
          <template slot-scope="scope">
            <span>{{totalCount}}</span>
          </template>
        </el-table-column>
        <el-table-column label="实付金额" width="" align="center">
          <template slot-scope="scope">
            <el-input type="number" v-model="orderUpdateForm.realAmount" placeholder="请输入内容" size="small"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateCostShow = false" size="small">取 消</el-button>
        <el-button type="primary" @click="updateOrder()" size="small">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import $ from "jquery";

export default {
  data() {
    return {
      loginState: false,
      updateOrderShow: false,
      updateRemarkShow: false,
      updateCostShow: false,
      orderUpdateForm: {
        status: "",
        realAmount: "",
        payType: "1",
        remark: ""
      },
      id: "",
      status: "",
      discount: "",
      orderInfo: [],
      goodsInfo: [],
      apiCartData: [
        {
          id:'1',
          sdk:'采集机器人',
          api:'资讯搜索',
          name:'资讯搜索-年包',
          type:'正式包',
          size:'使用时长:365天每日调用上限：50000超额计费：4元/1000次',
          startTime:'2017-12-12',
          endTime:'2018-12-12',
          price:13456.23,
          count:1
        },{
          id:'2',
          sdk:'采集机器人',
          api:'资讯搜索',
          name:'资讯搜索-年包',
          type:'正式包',
          size:'使用时长:365天每日调用上限：50000超额计费：4元/1000次',
          startTime:'2017-12-12',
          endTime:'2018-12-12',
          price:123.11,
          count:1
        },{
          id:'3',
          sdk:'采集机器人',
          api:'资讯搜索',
          name:'资讯搜索-年包',
          type:'正式包',
          size:'使用时长:365天每日调用上限：50000超额计费：4元/1000次',
          startTime:'2017-12-12',
          endTime:'2018-12-12',
          price:453.23,
          count:1
        },{
          id:'4',
          sdk:'采集机器人',
          api:'资讯搜索',
          name:'资讯搜索-年包',
          type:'正式包',
          size:'使用时长:365天每日调用上限：50000超额计费：4元/1000次',
          startTime:'2017-12-12',
          endTime:'2018-12-12',
          price:786.65,
          count:1
        }
      ],
      logList:[],
      statusList:[
        {
          name:'未支付',
          code:'1'
        },{
          name:'已支付',
          code:'2'
        },{
          name:'已关闭',
          code:'3'
        },{
          name:'已取消',
          code:'4'
        }
      ],
      costInfo: [{}]
    };
  },
  computed:{
    totalCount:function(){
      var num = 0;
      for (var i = 0; i < this.apiCartData.length; i++) {
        num += Number(this.apiCartData[i].price) * Number(this.apiCartData[i].count);
      }
      return num;
    }
  },
  created() {
    if(this.$route.query.id){
      this.id = this.$route.query.id;
      this.getDetailData();
      this.getProductListData();
      this.getlogListData();
    }

  },
  methods: {
    //获取订单详情
    getDetailData() {
      var self = this;
      self.$http({
        url: apiHost + "/order/detail",
        type: 'post',
        data: {
          orderId: self.id
        },
        success: function (data) {
          if (data.code == 0 && data.data) {
            self.orderInfo=[data.data];
          }
        }
      });
    },
    //获取商品信息
    getProductListData() {
      var self = this;
      self.$http({
        url: apiHost + "/order/goods/getByOrderId",
        type: 'post',
        data: {
          orderId: self.id
        },
        success: function (data) {
          if (data.code == 0 && data.data) {

          }
        }
      });
    },
    //获取操作日期
    getlogListData() {
      var self = this;
      self.$http({
        url: apiHost + "/order/log/getByOrderId",
        type: 'post',
        data: {
          orderId: self.id
        },
        success: function (data) {
          if (data.code == 0 && data.data) {
            self.logList=data.data;
          }
        }
      });
    },
    //修改产品信息，跳转导航
    updateProduct(){
      this.$router.push('/home/order/list/add?id='+this.id);
    },
    //修改备注
    updateRemark(){
      this.updateRemarkShow=true;
      this.orderUpdateForm.remark=this.orderInfo[0].remark;
    },
    //修改订单状态
    updateOrderModel() {
      this.updateOrderShow = true;
      this.orderUpdateForm.status = this.orderInfo[0].status;
      this.orderUpdateForm.payType = this.orderInfo[0].payType;
      this.orderUpdateForm.remark = this.orderInfo[0].remark;
    },
    //修改费用
    updateCostModel() {
      this.orderUpdateForm.realAmount = 0;
      this.updateCostShow = true;
    },
    //修改订单
    updateOrder() {
      var self = this;
      self.$refs.orderUpdateForm.validate(function(valid) {
        if (valid) {
          self.$http({
            url: apiHost + "/order/update",
            type: 'post',
            data: {
              orderId: self.id,
              remark: self.orderUpdateForm.remark,
              realAmount: self.orderUpdateForm.realAmount,
              status: self.orderUpdateForm.status
            },
            success: function (data) {
              if (data.code == 0) {
                self.getDetailData();
                self.updateRemarkShow = true;
                self.updateOrderShow = true;
                self.updateCostShow = true;
                self.$message({
                  type: 'success',
                  message: '修改成功!'
                });
              }else {
                self.$message({
                  message: data.msg,
                  type: "error"
                });
              }

            }
          });
        }
      });
    }

  }
};
</script>

<style>
#order-detail .order-status {
  padding-left: 18px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-right: 18px;
  box-shadow: 0 4px 5px #f5f5f5;
  margin-bottom: 5px;
}

#order-detail .order-status .box-left {
  float: left;
}

#order-detail .order-status .box-left p {
  color: red;
  line-height: 32px;
  font-size: 16px;
}

#order-detail .order-status .box-right {
  float: right;
}

#order-detail .table {
  box-shadow: 0 4px 5px #f5f5f5;
  margin-bottom: 10px;
}
  #order-detail .product-bot{
    text-align: right;
    color: red;
    font-size: 16px;
  }
</style>
