<template>
  <div id="user-normal-user-detail">
    <div class="breadcrumb">
      <el-breadcrumb separator="/" v-if="from!='agent'">
        <el-breadcrumb-item :to="{ path: '/home' }">普通用户</el-breadcrumb-item>
        <el-breadcrumb-item>用户详情</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator="/" v-if="from=='agent'">
        <el-breadcrumb-item :to="{ path: '/home/user-index/user-agent' }">代理商</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/user-index/user-agent/agent-detail?id='+parentId }">代理商详情
        </el-breadcrumb-item>
        <el-breadcrumb-item>客户详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="user-info box">
      <div class="top clearfix">
        <h3 class="left">基本资料</h3>
        <div class="right">
          <el-button type="primary" size="small" @click="resetPassword()">重置密码</el-button>
        </div>
      </div>
      <div class="bot">
        <table class="info-table">
          <tbody>
          <tr>
            <td class="col1">{{from=='agent' ? '客户账号' : '用户账号'}}</td>
            <td>{{baseInfo.username}}</td>
            <td></td>
          </tr>
          <tr>
            <td class="col1">{{from=='agent' ? '客户手机号' : '用户手机号'}}</td>
            <td>{{baseInfo.mobile}}</td>
            <td></td>
          </tr>
          <tr>
            <td class="col1">SecretId</td>
            <td>{{baseInfo.secretId}}</td>
            <td rowspan="2">
              <!--<a href="javascript:;" @click="resetSecretKey()">重置</a> -->
            </td>
          </tr>
          <tr>
            <td class="col1">SecretKey</td>
            <td>{{baseInfo.secretKey}}</td>
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
    <el-tabs type="card">
      <el-tab-pane label="产品信息">
        <div class="top clearfix">
          <h3 class="left">当前使用产品服务</h3>
          <div class="right">
            <el-button type="primary" size="small" @click="addProductShow=true">添加应用</el-button>
          </div>
        </div>
        <el-table
          :data="productTableData"
          :span-method="objectSpanMethod"
          border
          style="width: 100%;">
          <el-table-column
            label="应用"
            align="center">
            <template slot-scope="scope">
              <a href="javascript:;" @click="openProductDetail(scope.row.appId)">{{scope.row.appName}}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="robotName"
            label="机器人" align="center">
          </el-table-column>
          <el-table-column
            prop="goodsName"
            label="服务名称" align="center">
          </el-table-column>
          <el-table-column
            label="规格" align="center">
            <template slot-scope="scope">
              <p>使用时长:{{scope.row.period}}天</p>
              <p>每日调用上限：{{scope.row.times}}</p>
              <p>每秒并发量：{{scope.row.concurrency}}</p>
              <p>超额计费：{{scope.row.extraFee}}元/1000次</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="expireDate"
            label="到期日期" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <router-link
                :to="{ path: '/home/user-index/user-normal/api-detail', query: { parentId:id  , orderId:scope.row.orderId , apiId:scope.row.apiId , goodsId:scope.row.goodsId , from:from}}">
                查看接口详情
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @current-change="productHandleCurrentChange"
            :current-page.sync="productPageNum"
            :page-size="productPageSize"
            layout="prev, pager, next, jumper"
            :total="productTotalPage" background>
          </el-pagination>
        </div>


      </el-tab-pane>
      <el-tab-pane label="订单信息">
        <el-table :data="orderTableData" border style="width: 100%;">
          <el-table-column prop="orderNo" label="订单编号" align="center"></el-table-column>
          <el-table-column label="订单类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type == 0">正式订单</span>
              <span v-if="scope.row.type == 1">试用订单</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="提交时间" align="center"></el-table-column>
          <el-table-column prop="appName" label="应用" align="center"></el-table-column>
          <el-table-column prop="goodsName" label="订单信息" align="center"></el-table-column>
          <el-table-column prop="realAmount" label="订单金额" align="center"></el-table-column>
          <el-table-column label="支付方式" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.payType == 1">银行转账</span>
              <span v-if="scope.row.payType == 2">在线支付</span>
              <span v-if="!scope.row.payType">无</span>
            </template>
          </el-table-column>

          <el-table-column label="订单状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">待支付</span>
              <span v-if="scope.row.status == 2">已支付</span>
              <span v-if="scope.row.status == 3">订单关闭</span>
              <span v-if="scope.row.status == 4">订单取消</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <router-link :to="{ path: '/home/order/list/detail', query: {id: scope.row.id}}">查看订单</router-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @current-change="orderHandleCurrentChange"
            :current-page.sync="orderPageNum"
            :page-size="orderPageSize"
            layout="prev, pager, next, jumper"
            :total="orderTotalPage" background>
          </el-pagination>
        </div>


      </el-tab-pane>
    </el-tabs>

    <el-dialog class="product-detail" :title="productDetail.app_name" :visible.sync="productDetailShow"
               :lock-scroll="false" width="450px">
      <div class="content">
        <p>应用简介：</p>
        <p>{{productDetail.remark}}</p>
        <h4>WEB</h4>
        <p>host：{{productDetail.sign}}</p>
        <h4>IOS</h4>
        <p>应用名称：{{productDetail.app_name}}</p>
        <p>Bundle ID：{{productDetail.bundleID}}</p>
        <h4>Android</h4>
        <p>应用名称：{{productDetail.app_name}}</p>
        <p>应用签名：{{productDetail.sign1}}</p>
        <p>应用包名：{{productDetail.package}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="productDetailShow = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改客户名称" :visible.sync="baseInfoNameShow" :lock-scroll="false" :close-on-click-modal="false"
               width="450px">
      <p>客户名称：</p>
      <el-input type="textarea" :rows="6" v-model="baseInfo.name"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="baseInfoNameShow = false">取 消</el-button>
        <el-button type="primary" @click="submitBaseInfoName()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改备注" :visible.sync="remarkShow" :lock-scroll="false" :close-on-click-modal="false" width="450px">
      <p>备注：</p>
      <el-input type="textarea" :rows="6" v-model="remark"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkShow = false">取 消</el-button>
        <el-button type="primary" @click="submitRemark()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加应用" :visible.sync="addProductShow" :lock-scroll="false" :close-on-click-modal="false" width="450px">
      <p>备注：</p>
      <el-form :model="addProductForm" ref="addProductForm" label-width="100px">
        <el-form-item label="应用名称" prop="name" required>
          <el-input v-model="addProductForm.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="应用平台" prop="platform">
          <el-radio v-model="addProductForm.platform" :label="1">WEB</el-radio>
        </el-form-item>
        <el-form-item label="host" prop="sign">
          <el-input v-model="addProductForm.sign" size="small"></el-input>
          <p>若不使用SDK则无需填写</p>
        </el-form-item>
        <el-form-item label="应用分类" prop="type">
          <el-select v-model="addProductForm.type" placeholder="请选择" size="small">
            <el-option v-for="item in addProductTypes" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            v-model="addProductForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="addProduct()">创建</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        loginState: false,
        id: '',
        parentId: '',
        from: 'normal',
        baseInfo: {
          name: '',
          remark: ''
        },
        remark: '',
        productTableData: [],
        productPageNum: 1,
        productPageSize: 10,
        productTotalPage: 0,
        orderTableData: [],
        orderPageNum: 1,
        orderPageSize: 10,
        orderTotalPage: 0,
        baseInfoNameShow: false,
        remarkShow: false,
        productDetailShow: false,
        productDetail: {},
        addProductShow:false,
        addProductForm:{
          name:'',
          sign:'',
          remark:'',
          platform:1,
          type:1
        },
        addProductTypes:[
          {
            name:'分类1',
            code:1
          },{
            name:'分类2',
            code:2
          }
        ]
      };
    },
    created() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id;
      }
      if (this.$route.query.parentId) {
        this.parentId = this.$route.query.parentId;
      }
      if (this.$route.query.from) {
        this.from = this.$route.query.from;
      }
      this.getDetailData();
      this.getProductListData();
      this.getOrderListData();
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
              self.baseInfo = data.data;
            } else {

            }
          }
        });
      },
      //提交修改客户名称
      submitBaseInfoName: function () {
        var self = this;
        self.baseInfoNameShow = false;
      },
      //打开修改备注
      changeRemark(){
        this.remarkShow = true;
        this.remark = this.baseInfo.remark;
      },
      //提交修改备注
      submitRemark: function () {
        var self = this;
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
              self.$message({
                type: 'success',
                message: '修改备注成功!'
              });
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
      resetPassword: function () {
        var self = this;
        self.$confirm('重置后密码为123456, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
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

        }).catch(function () {

        });
      },
      //重置SecretKey
      resetSecretKey: function () {
        var self = this;
        self.$confirm('您是否确认重置？重置后则无法使用该密钥', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          self.$http({
            url: apiHost + "/secret/reset",
            type: 'post',
            data: {
              memberId: self.id,
              secretId: self.baseInfo.secretId,
              secretKey: self.baseInfo.secretKey
            },
            success: function (data) {
              if (data.code == 0) {
                self.getDetailData();
                self.$message({
                  type: 'success',
                  message: '重置密钥成功!'
                });
              } else {
                self.$message({
                  message: data.msg,
                  type: "error"
                });
              }
            }
          });

        }).catch(function () {

        });
      },

      //获取用户产品信息
      getProductListData() {
        var self = this;
        self.$http({
          url: apiHost + "/member/goodsInfo",
          type: 'get',
          data: {
            mid: self.id,
            pageNo: self.productPageNum,
            pageSize: self.productPageSize
          },
          success: function (data) {
            if (data.code == 0 && data.data) {
              if (data.data.data) {
                self.productTableData = data.data.data;
              }
              if (data.data.totalRecord) {
                self.productTotalPage = data.data.totalRecord;
              }

            }
          }
        });
      },


      //打开应用详情
      openProductDetail: function (id) {
        var self = this;
        self.$http({
          url: apiHost + "/app/detail",
          data: {
            id: id
          },
          success: function (data) {
            if (data.code == 0 && data.data) {
              self.productDetail = data.data;
              self.productDetailShow = true;
            }
          }
        });
      },

      //添加应用
      addProduct(){
        var self = this;
        self.$refs.addProductForm.validate(function(valid){
          if (valid) {
            self.$confirm('确认添加应用？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(function () {
              self.addProductForm.mid=self.id;
              self.$http({
                url: apiHost + "/app/add",
                type: 'post',
                data: self.addProductForm,
                success: function (data) {
                  if (data.code == 0) {
                    self.getProductListData();
                    self.addProductShow=false;
                    self.$message({
                      type: 'success',
                      message: '重置密钥成功!'
                    });
                  } else {
                    self.$message({
                      message: data.msg,
                      type: "error"
                    });
                  }
                }
              });

            }).catch(function () {

            });
          }
        });

      },

      //获取用户订单信息
      getOrderListData() {
        var self = this;
        self.$http({
          url: apiHost + "/member/orderInfo",
          type: 'get',
          data: {
            mid: self.id,
            pageNo: self.orderPageNum,
            pageSize: self.orderPageSize
          },
          success: function (data) {
            if (data.code == 0 && data.data) {
              if (data.data.data) {
                self.orderTableData = data.data.data;
              }
              if (data.data.totalRecord) {
                self.orderTotalPage = data.data.totalRecord;
              }

            }
          }
        });
      },

      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          var m = 1;
          for (var i = rowIndex + 1; i < this.productTableData.length; i++) {
            if (this.productTableData[i].appName == row.appName) {
              m++;
            } else {
              break;
            }
          }
          this.productTableData[rowIndex].rowspan = m;
          if (rowIndex > 0 && this.productTableData[rowIndex - 1].rowspan > 1) {
            return {
              rowspan: 0,
              colspan: 0
            }
          } else {
            return {
              rowspan: m,
              colspan: 1
            }
          }
        }
        if (columnIndex === 1) {
          var n = 1;
          for (var i = rowIndex + 1; i < this.productTableData.length; i++) {
            if (this.productTableData[i].robotName == row.robotName) {
              n++;
            } else {
              break;
            }
          }
          this.productTableData[rowIndex].rowspan1 = n;
          if (rowIndex > 0 && this.productTableData[rowIndex - 1].rowspan1 > 1) {
            return {
              rowspan: 0,
              colspan: 0
            }
          } else {
            return {
              rowspan: n,
              colspan: 1
            }
          }
        }
      },
      //分页处理
      productHandleCurrentChange(val) {
        this.productPageNum = val;
        this.getProductListData();
      },
      orderHandleCurrentChange(val) {
        this.orderPageNum = val;
        this.getOrderListData();
      }
    }
  };
</script>

<style>
  #user-normal-user-detail .user-info {
    padding: 10px 0 40px;
  }

  #user-normal-user-detail .user-info .top {
    padding: 10px 30px;
    font-size: 14px;
    line-height: 32px;
  }

  #user-normal-user-detail .user-info .bot {
    padding: 0 30px;
  }

  #user-normal-user-detail .el-tab-pane {
    padding: 10px 30px;
  }
  #user-normal-user-detail .el-tabs .top {
    padding: 0 0 10px;
    font-size: 14px;
    line-height: 32px;
  }

  #user-normal-user-detail .product-detail .content h4 {
    font-weight: bold;
    line-height: 30px;
    padding-top: 5px;
  }

</style>
