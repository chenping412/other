<template>
  <div id="order-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/" v-if="id==''">
        <el-breadcrumb-item :to="{ path: '/product/package' }">套餐管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加套餐</el-breadcrumb-item>
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
        <el-form :model="baseInfoForm" :rules="baseInfoRules" ref="baseInfoForm" label-width="150px">
          <el-form-item label="套餐类型：" prop="type" required>
            <el-radio v-model="baseInfoForm.type" label="1">正式</el-radio>
            <el-radio v-model="baseInfoForm.type" label="2">试用</el-radio>
          </el-form-item>
          <el-form-item label="套餐名称：" prop="name" required>
            <el-input v-model="baseInfoForm.name" size="small" placeholder="套餐名称"></el-input>
          </el-form-item>
          <el-form-item label="价格：" prop="price" required>
            <el-input v-model="baseInfoForm.price" size="small" placeholder="价格"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="div-row">
      <div class="top clearfix">
        <el-button class="right" type="primary" size="small" @click="apiModel=true">添加规格</el-button>
      </div>
      <el-table :data="apiCartData" style="width: 100%">
        <el-table-column property="id" label="规格编号" width="" align="center"></el-table-column>
        <el-table-column property="sdk" label="机器人" width="" align="center"></el-table-column>
        <el-table-column property="api" label="服务" width="" align="center"></el-table-column>
        <el-table-column property="name" label="规格名称" width="" align="center"></el-table-column>
        <el-table-column property="type" label="类型" width="" align="center"></el-table-column>
        <el-table-column property="size" label="规格属性" width="" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <a href="javascript:;" @click="deleteList(scope.$index)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="add">
      <el-button type="primary" size="small" @click="apiCarSubmit">提交套餐</el-button>
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
      <div class="padding20">
        <h3>1、选择添加的机器人服务</h3>
        <el-cascader style="width: 400px;" :options="serviceOptions" v-model="service" filterable @change="serviceChange"></el-cascader>
      </div>
      <div class="padding20">
        <h3>2、选择服务内的规格</h3>
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
      </div>
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
        baseInfoForm: {
          type: "1",
          name: "",
          price:''
        },
        baseInfoRules: {
          name: [
            {required: true, message: '请输入套餐名称', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入价格', trigger: 'blur'}
          ]
        },
        service:[],
        serviceOptions: [
          {
            value: '1',
            label: '采集机器人',
            children: [
              {
                value: '1-1',
                label: '资讯搜索1',
                children:[
                  {
                    value:'a',
                    label:'SDK'
                  },{
                    value:'b',
                    label:'WebApi'
                  }
                ]
              },{
                value: '1-2',
                label: '资讯搜索2',
                children:[
                  {
                    value:'a',
                    label:'SDK'
                  },{
                    value:'b',
                    label:'WebApi'
                  }
                ]
              },{
                value: '1-3',
                label: '资讯搜索3',
                children:[
                  {
                    value:'a',
                    label:'SDK'
                  },{
                    value:'b',
                    label:'WebApi'
                  }
                ]
              }
            ]
          },
          {
            value: '2',
            label: '写作机器人',
            children: [
              {
                value: '2-1',
                label: '写作聚合1',
                children:[
                  {
                    value:'a',
                    label:'SDK'
                  },{
                    value:'b',
                    label:'WebApi'
                  }
                ]
              },{
                value: '2-2',
                label: '写作聚合2',
                children:[
                  {
                    value:'a',
                    label:'SDK'
                  },{
                    value:'b',
                    label:'WebApi'
                  }
                ]
              },{
                value: '2-3',
                label: '写作聚合3',
                children:[
                  {
                    value:'a',
                    label:'SDK'
                  },{
                    value:'b',
                    label:'WebApi'
                  }
                ]
              }
            ]
          }
        ],
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
    created() {
      if(this.$route.query.id){
        this.id=this.$route.query.id;
      }
      console.log(this.id)
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
      serviceChange(){
        var self=this;
        console.log(this.service)
        self.loading=true;
        setTimeout(function(){
          self.loading=false;
        },1000)
      },
      //API选择
      apiChoose(index) {
        this.apiCartData.push(this.apiListData[index]);
        this.apiModel = false;
      },
      deleteList(index){
        this.apiCartData.splice(index,1);
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
    text-align: center;
    margin-top: 20px;
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
