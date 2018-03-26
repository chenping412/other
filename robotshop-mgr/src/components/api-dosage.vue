<template>
  <div id="api-dosage">
    <div class="breadcrumb">
      <a href="javascript:;">API用量</a>
    </div>
    <div class="table-list" v-show="!tryShow">
      <el-table
        :data="apiDosage"
        border
        :row-class-name="tableRowClassName"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="API名称"
          width="">
        </el-table-column>
        <el-table-column
          prop="used"
          label="已调用次数">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template scope="scope">
            <a href="javascript:;" @click="dialogVisible = true" style="color: #4378e6;">立即咨询</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="try-show" v-show="tryShow">
      <h2>您还没有开通服务</h2>
      <el-button type="primary" id="use-btn">申请试用</el-button>
    </div>


    <div class="model" id="use">
      <div class="model-content">
        <div class="model-header clearfix">
          <h3>申请试用</h3>
          <span class="close">×</span>
        </div>
        <div class="model-body">
          <div>
            <div class="form-row">
              <input type="text" placeholder="请输入您的联系方式" id="apply-tel">
              <span style="display: none;">手机号码不能为空</span>
              <span style="display: none;">手机号码格式错误</span>
            </div>
            <div class="form-row">
              <input type="text" placeholder="请输入您的姓名" id="apply-username">
              <span style="display: none;">用户姓名不能为空</span>
            </div>
            <div class="form-row">
              <input type="text" placeholder="请填写您的公司名称提高申请成功率" id="apply-company">
            </div>
            <div class="form-row">
              <input type="text" placeholder="请填写您的职务信息" id="user-post">
            </div>
            <div class="form-row">
              <textarea name="" id="trial-function" cols="30" rows="10" placeholder="请告诉我们您想试用的功能"></textarea>
              <span style="display: none;">试用功能描述不能为空</span>
            </div>
            <div class="form-row btn">
              <button @click="useApply()">申请试用</button>
            </div>
            <div class="form-row faild" style="display: none">
              <p style="font-size: 12px; text-align: center; color: red;">申请失败</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="model" id="apply_success">
      <div class="model-content">
        <div class="model-header clearfix">
          <h3>申请成功！</h3>
          <span class="close">×</span>
        </div>
        <div class="model-body">
          <div>
            <i class="el-notification__icon el-icon-circle-check"></i>
            <p>感谢您的申请，Giiso机器人商店的客服人员会在在接下来的几个工作日内联系您！</p>
            <p class="time-out" style="color: #4378e6;">本提示框将会在3秒内关闭</p>
          </div>
          <div class="btn">
            <el-button class="close" type="primary">确认</el-button>
          </div>
        </div>
      </div>
    </div>


    <el-dialog
      :visible.sync="dialogVisible"
      size="tiny">
      <h3>商务合作</h3>
      <ul>
        <li class="clearfix">
          <div class="boxname">咨询时间:</div>
          <div class="boxvalue">9:00 - 18:00</div>
        </li>
        <li class="clearfix">
          <div class="boxname">电话:</div>
          <div class="boxvalue">0755 - 22223970</div>
        </li>
        <li class="clearfix">
          <div class="boxname">QQ:</div>
          <div class="boxvalue">2020601975</div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
  import $ from 'jquery'

  export default {
    data() {
      return {
        apiHost: "",
        dialogVisible: false,
        apiDosage: [],
        loginState: false,
        tryShow: false,
      }
    },
    created() {
      var self = this;
      if (location.host != "robot.giiso.com") {
        self.apiHost = "http://robot.giiso.com"
      }
      self.getApiDosage();
      $(".el-dialog__close").hide();
    },
    mounted() {
      $(".el-dialog__close").hide();
      this.apply();
    },
    methods: {
      tableRowClassName(row, index) {
        if (index % 2 === 1) {
          return 'info-row';
        }
        return '';
      },
      //获取api用量信息列表
      getApiDosage() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/open-portal/api/use",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {},
          success: function (msg) {
            if (msg.data && msg.data.length > 0) {
              self.apiDosage = msg.data;
            } else {
              self.tryShow = true;
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "/";
                self.loginState = false;
              }, 2000)
            }
          }
        })
      },
      //申请试用申请试用申请试用申请试用申请试用申请试用申请试用申请试用申请试用申请试用申请试用申请试用申请试用申请试用
      apply: function () {


        $("#use-btn").click(function () {
          $("#apply-tel").val('')
          $("#apply-username").val('')
          $("#trial-function").val('')
          $("#apply-company").val('')
          $("#user-post").val('')
          $("#use .form-row span").hide();
          $("#use").show();
        })

        $("#use .close").click(function () {
          $("#use").hide();
        })

        $("#apply_success .close").click(function () {
          $("#apply_success").hide();
        })

        //手机号验证
        $("#apply-tel").on("input", function () {
          if ($("#apply-tel").val() == "" || $("#apply-tel").val() == undefined) {
            $(this).parent().find("span").eq(0).fadeIn();
            $(this).parent().find("span").eq(1).hide();
          } else if (!(/^1[34578]\d{9}$/.test($("#apply-tel").val()))) {
            $(this).parent().find("span").eq(1).fadeIn();
            $(this).parent().find("span").eq(0).hide();
          } else {
            $(this).parent().find("span").fadeOut();
          }
        })

        //用户姓名验证
        $("#apply-username").on("input", function () {
          if ($("#apply-username").val() == "" || $("#apply-username").val() == undefined) {
            $(this).parent().find("span").fadeIn();
          } else {
            $(this).parent().find("span").fadeOut();
          }
        })

        //试用功能描述
        $("#trial-function").on("input", function () {
          if ($("#trial-function").val() == "" || $("#trial-function").val() == undefined) {
            $(this).parent().find("span").fadeIn();
          } else {
            $(this).parent().find("span").fadeOut();
          }
        })
      },
      //试用申请
      useApply: function () {
        if ($("#apply-tel").val() == "" || $("#apply-tel").val() == undefined) {
          $("#apply-tel").parent().find("span").eq(0).fadeIn();
          $("#apply-tel").parent().find("span").eq(1).hide();
          return;
        } else if (!(/^1[34578]\d{9}$/.test($("#apply-tel").val()))) {
          $("#apply-tel").parent().find("span").eq(1).fadeIn();
          $("#apply-tel").parent().find("span").eq(0).hide();
          return;
        } else if ($("#apply-username").val() == "" || $("#apply-username").val() == undefined) {
          $("#apply-username").parent().find("span").fadeIn();
          return;
        } else if ($("#trial-function").val() == "" || $("#trial-function").val() == undefined) {
          $("#trial-function").parent().find("span").fadeIn();
          return;
        } else {
          $.ajax({
            url: this.apiHost + "/open-portal/common/trialApply",
            type: "POST",
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              mobile: $("#apply-tel").val(),
              username: $("#apply-username").val(),
              remark: $("#trial-function").val(),
              company: $("#apply-company").val(),
              position: $("#user-post").val(),
            },
            success: function (res) {
              if (res.code == 0) {
                $("#use").hide();
                $("#apply_success").show();
                var m=3;
                self.timer=setInterval(function(){
                  m--;
                  if(m>0){
                    $("#apply_success").find('.time-out').html('本提示框将会在'+m+'秒内关闭');
                  }else {
                    $("#apply_success").hide();
                    clearInterval(self.timer);
                  }
                },1000);
              } else {
                $("#use .faild").show();
              }
            }
          })
        }
      }

    }
  }
</script>

<style lang="less" type="text/less">
  #api-dosage {

  .model {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 99999999;

  .content {
    width: 260px;
    height: 60px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -30px;
    margin-left: -130px;
    background-color: #fff;
    border-radius: 4px;

  a {
    display: block;
    text-align: center;
    line-height: 20px;
    margin-top: 20px;

  b {
    display: inline-block;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    color: #f44444;
    border: 1px solid #f44444;
    margin-right: 10px;
  }

  }
  }
  }
  .breadcrumb {
    margin: 52px 0 21px 0;

  a {
    display: block;
    line-height: 30px;
    color: #141414;
    font-size: 24px;
  }

  }
  .table-list {

  .el-table td, .el-table th {
    height: 50px;
    text-align: center;
  }

  .el-table th {
    background: #F4F6FA;
    box-shadow: 0 1px 0 0 #D9D9D9;
  }

  .el-table th .cell {
    font-size: 14px;
    color: #111;
    font-weight: bold;
    background: #F4F6FA;
  }

  .el-table td .cell {
    font-size: 14px;
    color: #302525;
  }

  .el-table .info-row {
    background: #F4F6FA;
    box-shadow: 0 1px 0 0 #D9D9D9;
  }

  }
  .el-dialog {
    width: 400px;

  .el-dialog__header {
    padding: 10px 20px 10px 20px;
  }

  .el-dialog__body {
    padding-top: 0;

  h3 {
    font-size: 18px;
    color: #111;
    line-height: 25px;
    margin-bottom: 10px;
    margin-top: 20px;
  }

  ul {
    width: 195px;

  li {
    line-height: 20px;
    font-size: 14px;
    color: #555;

  .boxname {
    float: left;
    text-align: right;
    width: 70px;
  }

  .boxvalue {
    float: right;
    text-align: left;
    width: 113px;
  }

  }
  }
  }
  .el-dialog__footer {
    padding-top: 17px;
    padding-bottom: 17px;
    background-color: #f3f5f6;

  .el-button {
    width: 80px;
    background: #477EF8;
    border-radius: 2px;
  }

  }
  }
  }
  #api-dosage .try-show {
    text-align: center;
  }

  #api-dosage .try-show h2 {
    font-size: 24px;
    font-weight: bolder;
    margin-bottom: 20px;
  }

  .model {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999999999;
    display: none;
  }

  .model-content {
    display: inline-block;
    width: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -200px;
    background-color: #fff;
  }

  #use .model-content {
    min-height: 516px;
    margin-top: -258px;
  }

  #apply_success .model-content {
    margin-top: -200px;
    min-height: 200px;
  }
  #apply_success .el-notification__icon{
    display: block;
    color: #67C23A;
    margin: 0 15px 30px 0;
  }
  #apply_success .model-body>div>p{
    font-size: 14px;
  }
  #apply_success .btn{
    text-align: right;
  }

  .model-header {
    width: 340px;
    padding: 0 30px;
    height: 70px;
    line-height: 70px;
    border-bottom: 1px solid #ddd;
  }

  .model-header h3 {
    float: left;
    font-size: 18px;
    color: #111111;
  }

  .model-header span {
    float: right;
    display: block;
    color: #ccc;
    font-size: 20px;
    cursor: pointer;
  }

  .model-body {
    width: 340px;
    padding: 30px
  }

  .model-body .form-row {
    margin-bottom: 12px;
  }

  .model-body .form-row.faild p {
    font-size: 12px;
  }

  .model-body .form-row input {
    width: 328px;
    height: 34px;
    padding-left: 10px;
    background-color: #FFFFFF;
    border: 1px solid #B1B1B1;
    border-radius: 2px;
  }

  .model-body .form-row span {
    color: red;
    line-height: 22px;
    font-size: 12px;
    display: none;
  }

  .model-body .btn {
    padding-top: 8px;
  }

  .model-body .form-row button {
    background: #477EF8;
    border-radius: 2px;
    width: 340px;
    height: 36px;
    border: none;
    font-size: 14px;
    color: #FFFFFF;
    cursor: pointer;
  }

  .model-body .form-row .btn_register[disabled=disabled] {
    background-color: #CCCCCC;
    cursor: not-allowed
  }

  .model-body .checkbox {
    text-align: center;
    font-size: 12px;
    color: #555555;
    line-height: 20px;
  }

  .model-body .form-row input[type=checkbox] {
    display: block;
    float: left;
    width: 12px;
    height: 12px;
    background-color: #477EF8;
    border-radius: 2px;
    margin-top: 5px;
    margin-right: 4px;
    margin-left: 95px;
  }

  .model-body .checkbox p {
    float: left;
  }

  .model-body .checkbox p.register_error {
    width: 100%;
    text-align: center;
    line-height: 22px;
    color: red;
    display: none;
  }

  .model-body .checkbox p a {
    color: #477EF8;
  }

  .model-body .checkbox span {
    display: block;
  }

  .model-body .form-row .fl {
    float: left;
    font-size: 12px;
    color: #555555;
    line-height: 17px;
  }

  .model-body .form-row .fr {
    float: right;
    font-size: 12px;
    color: #477EF8;
    line-height: 17px;
  }

  .model-body .form-row textarea {
    width: 308px;
    height: 90px;
    resize: none;
    padding: 15px;
  }

</style>
