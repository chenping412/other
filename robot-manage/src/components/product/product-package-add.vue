<template>
  <div id="product-service-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home/product/service' }">商品列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/product/service/detail?id='+id }">商品详情</el-breadcrumb-item>
        <el-breadcrumb-item>{{id=='' ? '添加商品' : '编辑商品'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="add">
      <el-form :model="formData" ref="formData" :rules="addRules" label-width="200px" class="demo-ruleForm">

        <el-form-item label="服务：" prop="apiId" required>
          <el-cascader :options="serviceOptions" v-model="formData.apiId" :props="props"></el-cascader>
        </el-form-item>
        <el-form-item label="可接入类型：" prop="type" required>
          <el-radio v-model="formData.type" label="1">API</el-radio>
          <el-radio v-model="formData.type" label="2">SDK</el-radio>
          <el-radio v-model="formData.type" label="3">API+SDK</el-radio>
        </el-form-item>
        <el-form-item label="商品名称：" prop="name" required>
          <el-input v-model="formData.name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="使用时长：" prop="period" required>
          <el-input-number v-model="formData.period" controls-position="right" :min="0" size="small"></el-input-number>
          <span>天</span>
        </el-form-item>
        <el-form-item label="每日调用上限：" prop="times" required>
          <el-input-number v-model="formData.times" controls-position="right" :min="0" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="每秒并发量：" prop="concurrency" required>
          <el-input-number v-model="formData.concurrency" controls-position="right" :min="0" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="新闻源数量：" prop="siteNum" required>
          <el-input-number v-model="formData.siteNum" controls-position="right" :min="0" size="small"></el-input-number>
        </el-form-item>
        <el-form-item label="商品价格：" prop="price" required>
          <el-input v-model="formData.price" type="number" size="small"></el-input>
        </el-form-item>
        <el-form-item label="超额计费：" prop="extraFee" required>
          <el-input v-model="formData.extraFee" type="number" size="small"></el-input>
          <span>元/1000次</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="submitDate()">完成</el-button>
        </el-form-item>
      </el-form>
    </div>


  </div>
</template>

<script>

  export default {
    data() {
      return {
        id: '',
        apiId: '',
        from: '',
        formData: {
          apiId: [],
          type: "1",
          name: "",
          period: 0,
          times: 0,
          concurrency: 0,
          price: "",
          extraFee: "",
          siteNum: 0
        },
        serviceOptions:[],
        props:{
          value:'id',
          label:'name',
          children:'apiList'
        },
        addRules: {
          apiId: [
            {required: true, message: '请选择服务'}
          ],name: [
            {required: true, message: '请输入商品名称'}
          ],price: [
            {required: true, message: '请输入商品价格'}
          ],extraFee: [
            {required: true, message: '请输入超额计费'}
          ],
        },
        userListData: []
      };
    },
    created() {
      if (this.$route.query.apiId) {
        this.apiId = this.$route.query.apiId;
      }
      if (this.$route.query.from) {
        this.from = this.$route.query.from;
      }
      this.getServiceDate();
    },
    methods: {
      //提交数据
      submitDate() {
        var self = this;
        var url=apiHost + "/goods/add";
        if(self.id!=''){
          url=apiHost +'/goods/update';
        }

        self.$refs.formData.validate(function (valid) {
          if (valid) {
            self.$http({
              url: url,
              data: {
                id:self.id,
                apiId:self.formData.apiId[1],
                type:self.formData.type,
                name:self.formData.name,
                period:self.formData.period,
                times:self.formData.times,
                concurrency:self.formData.concurrency,
                price:self.formData.price,
                extraFee:self.formData.extraFee,
                siteNum:self.formData.siteNum
              },
              success: function (data) {
                if (data.code == '0') {
                  var word='添加';
                  if(self.id!='')word='修改';
                  var url='/home/product/package';
                  var text=word+'成功，点击确认跳转至商品管理';
                  if(self.from != ''){
                    url='/home/product/service/detail?id='+self.apiId;
                    text=word+'成功，点击确认跳转至服务详情'
                  }
                  self.$confirm(text, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                  }).then(function(){
                    self.$router.push(url);
                  }).catch(function(){

                  });
                } else {
                  self.$alert(data.msg, '提示', {
                    confirmButtonText: '确定',
                    type: 'error'
                  });
                }
              }
            });
          }
        });
      },
      //获取商品详情
      getProductDetail:function(){
        var self = this;
        self.$http({
          url: apiHost + "/goods/detail",
          data: {
            id:self.id
          },
          success: function (data) {
            if (data.code == 0 && data.data) {
              if(data.data.type)self.formData.type=data.data.type;
              if(data.data.name)self.formData.name=data.data.name;
              if(data.data.period)self.formData.period=data.data.period;
              if(data.data.times)self.formData.times=data.data.times;
              if(data.data.concurrency)self.formData.concurrency=data.data.concurrency;
              if(data.data.price)self.formData.price=data.data.price;
              if(data.data.extraFee)self.formData.extraFee=data.data.extraFee;
              if(data.data.siteNum)self.formData.siteNum=data.data.siteNum;

              if(data.data.apiId)self.apiId=data.data.apiId;

              for(var i=0;i<self.serviceOptions.length;i++){
                if(self.serviceOptions[i].apiList){
                  for(var j=0;j<self.serviceOptions[i].apiList.length;j++){
                    if(self.serviceOptions[i].apiList[j].id == self.apiId){
                      self.formData.apiId=[self.serviceOptions[i].id,parseInt(self.apiId)];
                      break
                    }
                  }
                }
              }
            }
          }
        });
      },
      //获取服务级联菜单
      getServiceDate:function(){
        var self = this;
        self.$http({
          url: apiHost + "/robot/activeApiList",
          data: {

          },
          success: function (data) {
            if (data.code == 0 && data.data) {
              self.serviceOptions=data.data;

              if(self.apiId!=''){
                for(var i=0;i<self.serviceOptions.length;i++){
                  if(self.serviceOptions[i].apiList){
                    for(var j=0;j<self.serviceOptions[i].apiList.length;j++){
                      if(self.serviceOptions[i].apiList[j].id == self.apiId){
                        self.formData.apiId=[self.serviceOptions[i].id,parseInt(self.apiId)];
                        break
                      }
                    }
                  }
                }
              }
              if (self.$route.query.id) {
                self.id = self.$route.query.id;
                self.getProductDetail();
              }
            }
          }
        });
      }
    }
  };
</script>

<style>
  #product-service-add .add {
    /*width: 400px;*/
    margin-left: 100px;
    padding: 30px 0;
  }
  #product-service-add .add .el-input-number,
  #product-service-add .add .el-input{
    width: 260px;
  }
</style>
