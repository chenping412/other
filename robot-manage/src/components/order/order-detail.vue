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
        <p v-if="status == 1">当前订单状态：未支付</p>
        <p v-if="status == 2" style="color: #3BB19C;">当前订单状态：已支付</p>
        <p v-if="status == 3">当前订单状态：已关闭</p>
      </div>
      <div class="box-right">
        <div v-show="status == 1">
          <el-button type="primary" size="small" @click="updateProduct">修改产品信息</el-button>
          <el-button type="primary" size="small" @click="updateRemarkShow=true">修改备注</el-button>
          <el-button type="primary" size="small" @click="updateCostModel">修改费用</el-button>
          <el-button type="primary" size="small" @click="updateOrderModel">修改订单状态</el-button>
        </div>
        <div v-show="status != 1">
          <el-button type="primary" size="small" @click="updateRemarkShow=true">修改备注</el-button>
        </div>
      </div>
    </div>
    <div class="div-row">
      <h3>基本信息</h3>
      <div class="table">
        <el-table :data="orderInfo" border style="width: 100%">
          <el-table-column prop="order_no" label="订单编号" width="95" align="center"></el-table-column>
          <el-table-column prop="member_id" label="用户账号" width="" align="center"></el-table-column>
          <el-table-column prop="member_id" label="用户手机号" width="" align="center"></el-table-column>
          <el-table-column prop="member_id" label="应用" width="" align="center"></el-table-column>
          <el-table-column prop="type" label="订单类型" align="center">
            <template slot-scope="scope">
              <span v-show="scope.row.type == 1">商务订单</span>
              <span v-show="scope.row.type == 2">在线订单</span>
            </template>
          </el-table-column>
          <el-table-column prop="pay_type" label="支付方式" align="center">
            <template slot-scope="scope">
              <span v-show="scope.row.pay_type == 1">银行转账</span>
              <span v-show="scope.row.pay_type == 2">在线支付</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="订单提交时间" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="div-row">
      <h3>产品信息</h3>
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
      <h3>操作日志</h3>
      <div class="table">
        <el-table :data="logList" border style="width: 100%">
          <el-table-column prop="user" label="操作者" align="center"></el-table-column>
          <el-table-column prop="time" label="操作时间" align="center"></el-table-column>
          <el-table-column prop="orderStatus" label="订单状态" align="center"></el-table-column>
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
      <el-form :model="orderStatusForm" ref="orderStatusForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="订单状态：" prop="status" required>
          <el-select v-model="orderStatusForm.status" size="small">
            <el-option label="未支付" value="1"></el-option>
            <el-option label="已支付" value="2"></el-option>
            <el-option label="已关闭" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式：" prop="status" required v-show="orderStatusForm.status == '2'">
          <el-select v-model="orderStatusForm.payType" size="small">
            <el-option label="银行转账" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作备注：" prop="explain">
          <el-input size="small" type="textarea" :rows="4" :maxlength="150" placeholder="请输入内容" v-model="orderStatusForm.explain">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateOrderShow = false" size="small">取 消</el-button>
        <el-button type="primary" @click="updateOrder('orderStatusForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改备注-->
    <el-dialog
      title="修改备注"
      :visible.sync="updateRemarkShow"
      :close-on-click-modal="false" :lock-scroll="false"
      width="30%">
      <el-form :model="orderStatusForm" ref="orderStatusForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="操作备注：" prop="explain">
          <el-input
            size="small"
            type="textarea"
            :rows="4"
            :maxlength="150"
            placeholder="请输入内容"
            v-model="orderStatusForm.explain">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateRemarkShow = false" size="small">取 消</el-button>
        <el-button type="primary" @click="updateOrder('orderStatusForm')" size="small">确 定</el-button>
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
        </el-table-column>
        <el-table-column label="实付金额" width="" align="center">
          <template slot-scope="scope">
            <el-input type="number" v-model="scope.row.updateDiscount" placeholder="请输入内容" size="small"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateCostShow = false" size="small">取 消</el-button>
        <el-button type="primary" @click="updateCost" size="small">确 定</el-button>
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
      updateOrderShow: false,
      updateRemarkShow: false,
      updateCostShow: false,
      orderStatusForm: {
        status: "",
        payType: "1",
        explain: ""
      },
      searchForm: {
        keyword: "",
        classify: "",
        status: ""
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
      logList:[
        {
          user:'chenping',
          time:'2018-01-25 18:00:45',
          orderStatus:'1',
          content:'修改费用：¥30000.00'
        },{
          user:'chenping',
          time:'2018-01-25 18:00:45',
          orderStatus:'1',
          content:'修改费用：¥30000.00'
        },{
          user:'chenping',
          time:'2018-01-25 18:00:45',
          orderStatus:'1',
          content:'修改费用：¥30000.00'
        },
      ],
      costInfo: []
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
    var self = this;
    self.id = self.$route.query.id;
    self.getApiBaseData();
  },
  methods: {
    //获取订单详情
    getApiBaseData() {
      var self = this;
      self.orderInfo = [];
      $.ajax({
        url: apiHost + "/order/detail",
        type: "POST",
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        data: {
          orderId: self.id
        },
        success: function(data) {
          console.log(data);
          if (data.code == 0) {
            self.goodsInfo = data.data.goodsInfo;
            self.orderInfo.push(data.data.orderInfo);
            self.status = data.data.orderInfo.status;
            self.discount = data.data.orderInfo.discount;
            self.explain = data.data.orderInfo.remark;
          }
        },
        error: function(XMLHttpRequest) {
          if (XMLHttpRequest.status == "9001") {
            self.loginState = true;
            setTimeout(function() {
              location.href = backToLogin;
              self.loginState = false;
            }, 2000);
          }
        }
      });
    },
    //修改产品信息，跳转导航
    updateProduct(){
      this.$router.push('/order/list/add?id='+this.id);
    },
    updateOrderModel() {
      var self = this;
      self.updateOrderShow = true;
      self.orderStatusForm.status = self.status;
      self.orderStatusForm.explain = self.explain;
    },
    //修改订单
    updateOrder(formName) {
      var self = this;
      self.$refs[formName].validate(function(valid) {
        if (valid) {
          $.ajax({
            url: apiHost + "/order/update",
            type: "POST",
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              orderId: self.id,
              status: self.orderStatusForm.status,
              explain: self.orderStatusForm.explain
            },
            success: function(data) {
              console.log(data);
              if (data.code == 0) {
                self.getApiBaseData();
                self.updateOrderShow = false;
              }
            },
            error: function(XMLHttpRequest) {
              if (XMLHttpRequest.status == "9001") {
                self.loginState = true;
                setTimeout(function() {
                  location.href = backToLogin;
                  self.loginState = false;
                }, 2000);
              }
            }
          });
        }
      });
    },
    updateCostModel() {
      var self = this;
      self.costInfo = [];
      self.costInfo = self.orderInfo;
      self.costInfo[0].updateDiscount = self.orderInfo[0].discount;
      console.log(self.costInfo);
      self.updateCostShow = true;
    },
    //修改费用
    updateCost() {
      var self = this;
      $.ajax({
        url: apiHost + "/order/fee/update",
        type: "POST",
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        data: {
          orderId: self.id,
          discount: self.costInfo[0].updateDiscount
        },
        success: function(data) {
          if (data.code == 0) {
            self.getApiBaseData();
            self.updateCostShow = false;
          }
        },
        error: function(XMLHttpRequest) {
          if (XMLHttpRequest.status == "9001") {
            self.loginState = true;
            setTimeout(function() {
              location.href = backToLogin;
              self.loginState = false;
            }, 2000);
          }
        }
      });
    },
    //删除订单
    removeOrder() {
      var self = this;
      self.$confirm("此操作将删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(function() {
          $.ajax({
            url: apiHost + "/order/delete",
            type: "POST",
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              orderId: self.id
            },
            success: function(data) {
              if (data.code == 0) {
                if (data.data.status == true) {
                  self.$message({
                    type: "success",
                    message: "删除成功!"
                  });
                  self.$router.push({ path: "/order" });
                }
              }
            },
            error: function(XMLHttpRequest) {
              if (XMLHttpRequest.status == "9001") {
                self.loginState = true;
                setTimeout(function() {
                  location.href = backToLogin;
                  self.loginState = false;
                }, 2000);
              }
            }
          });
        })
        .catch(function() {
          self.$message({
            type: "info",
            message: "已取消删除"
          });
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
