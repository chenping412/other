<template>
  <div id="order-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/" v-if="id==''">
        <el-breadcrumb-item :to="{ path: '/order' }">订单列表</el-breadcrumb-item>
        <el-breadcrumb-item>增加订单</el-breadcrumb-item>
      </el-breadcrumb>
      <el-breadcrumb separator="/" v-if="id!=''">
        <el-breadcrumb-item :to="{ path: '/order' }">订单列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/order/list/detail?id='+id }">订单详情</el-breadcrumb-item>
        <el-breadcrumb-item>修改产品信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="div-row box">
      <h3>基本信息</h3>
      <div class="form">
        <el-form :model="baseInfoForm" :rules="baseInfoRules" ref="baseInfoForm" label-width="150px" class="demo-ruleForm">
          <el-form-item label="用户账号/手机号：" prop="name" required>
            <span>{{baseInfoForm.name}}</span>
          </el-form-item>
          <el-form-item label="选择应用：" prop="productCode">
            <el-select v-model="baseInfoForm.productCode" :disabled="id!=''" placeholder="请选择" size="small">
              <el-option v-for="item in baseInfoForm.products" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单类型：" prop="type" required>
            <el-radio v-model="baseInfoForm.type" label="1" :disabled="id!=''">试用订单</el-radio>
            <el-radio v-model="baseInfoForm.type" label="2" :disabled="id!=''">正式订单</el-radio>
          </el-form-item>
          <el-form-item label="订单备注：" prop="remark">
            <el-input type="textarea" :rows="4" v-model="baseInfoForm.remark">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="div-row">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>产品信息</span>
          <el-button style="float: right;" type="primary" size="small" @click="apiModel=true">添加</el-button>
        </div>
        <el-table :data="apiCartData" style="width: 100%">
          <el-table-column property="id" label="套餐编号" width="" align="center"></el-table-column>
          <el-table-column property="name" label="套餐名称" width="" align="center"></el-table-column>
          <el-table-column property="type" label="类型" width="" align="center"></el-table-column>
          <el-table-column property="sdk" label="机器人" width="" align="center"></el-table-column>
          <el-table-column property="api" label="服务" width="" align="center"></el-table-column>
          <el-table-column property="size" label="规格" width="" align="center"></el-table-column>
          <el-table-column property="price" label="单价/￥" align="center"></el-table-column>
          <el-table-column label="数量" align="center" width="150">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.count" @change="changeCount" :min="0"  size="mini"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <p class="total">合计: <span>￥{{isNaN(totalCount) ? 0 : totalCount}}</span></p>
        <div class="add" style="text-align: center; margin-top: 15px;">
          <el-button type="primary" size="small" @click="apiCarSubmit">提交</el-button>
        </div>
      </el-card>
    </div>
    <div class="model" v-show="loginState">
      <div class="content">
        <a href="javascript:;">
          <b>!</b>
          登陆过期，请重新登陆。
        </a>
      </div>
    </div>

    <el-dialog title="添加套餐" :visible.sync="apiModel" :close-on-click-modal="false" :lock-scroll="false" width="900px">
      <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="套餐名称：">
          <el-input v-model="apiNameSearch" placeholder="套餐名称" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getApiListData">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="apiListData" v-loading="loading" element-loading-background="rgba(255, 255, 255, 0.5)">
        <el-table-column property="id" label="套餐编号" width="" align="center"></el-table-column>
        <el-table-column property="name" label="套餐名称" width="" align="center"></el-table-column>
        <el-table-column property="type" label="类型" width="" align="center"></el-table-column>
        <el-table-column property="sdk" label="机器人" width="" align="center"></el-table-column>
        <el-table-column property="api" label="服务" width="" align="center"></el-table-column>
        <el-table-column property="size" label="规格" width="" align="center"></el-table-column>
        <el-table-column property="price" label="单价" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="apiChoose(scope.$index)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>


  </div>
</template>

<script>
  import $ from "jquery"

  export default {
    data() {
      return {
        loading:false,
        loginState: false,
        id:'',
        uid:'',
        baseInfoForm: {
          type: "1",
          name: "1592003343",
          productCode:'1',
          products:[
            {
              name:'天机智讯',
              code:'1'
            },{
              name:'资讯联盟',
              code:'2'
            }
          ],
          remark:''
        },
        baseInfoRules: {
          productCode: [
            {required: true, message: '请选择应用', trigger: 'blur'}
          ]
        },
        apiCartData: [],
        apiModel: false,
        apiNameSearch:'',
        apiListData: [
          {
            id:'1',
            sdk:'采集机器人',
            api:'资讯搜索',
            name:'资讯搜索-年包',
            type:'正式包',
            size:'使用时长:365天每日调用上限：50000超额计费：4元/1000次',
            price:13456.23
          },{
            id:'2',
            sdk:'采集机器人',
            api:'资讯搜索',
            name:'资讯搜索-年包',
            type:'正式包',
            size:'使用时长:365天每日调用上限：50000超额计费：4元/1000次',
            price:123.11
          },{
            id:'3',
            sdk:'采集机器人',
            api:'资讯搜索',
            name:'资讯搜索-年包',
            type:'正式包',
            size:'使用时长:365天每日调用上限：50000超额计费：4元/1000次',
            price:453.23
          },{
            id:'4',
            sdk:'采集机器人',
            api:'资讯搜索',
            name:'资讯搜索-年包',
            type:'正式包',
            size:'使用时长:365天每日调用上限：50000超额计费：4元/1000次',
            price:786.65
          }
        ],
        goodsId: []
      }
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
        this.id=this.$route.query.id;
      }
      if(this.$route.query.uid){
        this.uid=this.$route.query.uid;
      }
      console.log('id:'+this.id)
      console.log('uid:'+this.uid)
      this.getApiListData();
    },
    methods: {

      //获取所有api数据列表
      getApiListData() {
        var self = this;
        self.loading=true;
        $.ajax({
          url: apiHost + "/product/list",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            pageSize: "100"
          },
          success: function (data) {
            self.loading=false;
            if (data.code == 0) {
//              self.apiListData = data.data.data
            }
          },
          error: function (XMLHttpRequest) {
            self.loading=false;
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = backToLogin;
                self.loginState = false;
              }, 2000)
            }
          }
        })
      },

      //API选择
      apiChoose(index) {
        var self = this;
        var item=this.apiListData[index];
        self.apiModel = false;
        for(var i=0;i<this.apiCartData.length;i++){
          if(this.apiCartData[i].id == item.id){
            this.apiCartData[i].count++;
            this.apiCartData=this.apiCartData.slice(0);
            return
          }
        }
        item.count=1;
        this.apiCartData.push(item);
      },
      changeCount:function(){
        this.apiCartData=this.apiCartData.slice(0);
      },

      //获取api购物车数据
      getApiCartData(id) {
        var self = this;
        $.ajax({
          url: apiHost + "/goods/detail",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            id: id
          },
          success: function (data) {
            if (data.code == 0) {
              self.apiCartData.push(data.data);
              self.goodsId.push(id)
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = backToLogin;
                self.loginState = false;
              }, 2000)
            }
          }
        })
      },
      //增加api订单提交
      apiCarSubmit() {
        var self = this;
        var goodsInfo = [];
        for (var i = 0; i < self.apiCartData.length; i++) {
          goodsInfo.push(
            {
              goodsId: self.goodsId[i],
              quantity: self.apiCartData[i].count,
              discountPrice: self.apiCartData[i].price,
            }
          )
        }
        self.$refs['baseInfoForm'].validate(function(valid) {
          if (valid) {
            if (goodsInfo.length > 0) {
              $.ajax({
                url: apiHost + "/order/add",
                type: "POST",
                xhrFields: {
                  withCredentials: true
                },
                crossDomain: true,
                data: {
                  type: self.baseInfoForm.type,
                  mid: self.baseInfoForm.name,
                  payType: self.baseInfoForm.payType,
                  effectTime: self.baseInfoForm.startDate,
                  goodsInfo: JSON.stringify(goodsInfo)
                },
                success: function (data) {
                  if (data.code == 0) {
                    self.$alert('添加成功', '标题名称', {
                      confirmButtonText: '确定',
                      callback: function(action) {
                        if(action == "confirm") {
                          self.$router.push({ path: '/order' })
                        }
                      }
                    });
                  }
                },
                error: function (XMLHttpRequest) {
                  if (XMLHttpRequest.status == "9001") {
                    self.loginState = true;
                    setTimeout(function () {
                      location.href = backToLogin;
                      self.loginState = false;
                    }, 2000)
                  }
                }
              })
            }
          }
        })
      }
    }
  }
</script>

<style>
  #order-add h3 {
    font-size: 14px;
    margin: 15px 0;
  }

  #order-add .form {
    width: 50%;
  }

  #order-add .add {
    padding-left: 10px;
    margin-bottom: 15px;
  }

  #order-add .table {
    padding-left: 10px;
    margin-bottom: 15px;
  }

  #order-add .div-row .total {
    font-size: 16px;
    color: #111111;
    text-align: right;
    margin-top: 10px;
  }

  #order-add .div-row .total span {
    color: red;
  }
  #order-add .box{
    padding-bottom: 10px;
  }
</style>
