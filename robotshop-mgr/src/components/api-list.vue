<template>
  <div id="api-list">
    <div class="breadcrumb">
      <a href="javascript:;">API白名单</a>
    </div>
    <div class="reminder">
      <p>只有该白名单中的IP才能成功发起API调用</p>
    </div>
    <div class="table-list">
      <el-table
        :data="dataList"
        border
        :row-class-name="tableRowClassName"
        empty-text="你还没购买API，请先购买API再添加白名单"
        style="width: 100%">
        <el-table-column
          prop="api_name"
          label="API名称"
          width="">
        </el-table-column>
        <el-table-column
          prop="ip"
          label="白名单详情"
          width="">
          <template scope="scope">
            <p v-for="(list, index) in scope.row.ip">{{ list }}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template scope="scope">
            <a href="javascript:;" @click="editClick(scope.row.api_id, scope.row.id, scope.row.ip)" style="color: #4378e6;">编辑</a>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="资讯搜索 --- 白名单"
      :visible.sync="editModelShow"
      class="editModel"
      size="tiny">
      <h3>详情白名单</h3>
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="textareaValue">
      </el-input>
      <p style="color: #f44444; line-height: 30px;" v-show="showWarning"> 当前输入含有不合法的地址</p>
      <p style="color: #f44444; line-height: 30px;" v-show="showWarning5"> IP地址不能大于5个</p>
      <div class="warning">
        <p>最多输入5个IP地址</p>
        <p>格式说明：请填写IP地址或IP前缀网段</p>
        <p> 一行写一个IP地址，如:</p>
        <p>192.168.1.124</p>
        <p>192.168.1.246</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSure">确 定</el-button>
        <el-button @click="editModelShow = false" class="cancel">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="consultModelShow"
      class="consultModel"
      title=" "
      size="tiny">
      <h3>商务合作</h3>
      <ul>
        <li class="clearfix">
          <div class="boxname">咨询时间：</div>
          <div class="boxvalue">9:00 - 18:00</div>
        </li>
        <li class="clearfix">
          <div class="boxname">电话：</div>
          <div class="boxvalue">0755 - 22223972</div>
        </li>
        <li class="clearfix">
          <div class="boxname">QQ：</div>
          <div class="boxvalue">9326008</div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="consultModelShow = false">确 定</el-button>
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
  import { MessageBox } from "element-ui"
  export default {
    data() {
      return {
        apiHost: "",
        consultModelShow: false,
        apiId: "",
        id: "",
        ip: [],
        textareaValue: "",
        editModelShow: false,
        dataList: [],
        showWarning: false,
        showWarning5: false,
        loginState: false
      }
    },
    created () {
      if(location.host != "robot.giiso.com") {
        this.apiHost = "http://172.16.33.4:8081"
      }
      this.getList();
    },
    mounted () {
      var self = this;
      $(".el-table__empty-text").append("<a href='javascript:;' id='isConsultModelShow'>立即咨询</a>");
      $("#isConsultModelShow").click(function () {
        self.consultModelShow = true
      })
    },
    methods: {
      tableRowClassName(row, index) {
        if (index % 2 === 1) {
          return 'info-row';
        }
        return '';
      },
      editClick (apiId, id, ip) {
        var self = this;
        self.editModelShow = true;
        self.showWarning = false;
        self.showWarning5 = false;
        self.apiId = apiId;
        self.id = id;
        self.textareaValue = ip.join("\n");
        console.log(ip)
      },
      editSure () {
        var self = this;
        if(!self.textareaValue) {
          MessageBox({
            title: "提示",
            message: "ip 不能为空",
            type: "warning"
          })
          return;
        }else {
          var txtValue = self.textareaValue.split("\n");
          for(var i=0; i<txtValue.length; i++) {
            if(txtValue[i] == "" || typeof(txtValue[i]) === "undefined") {
              txtValue.splice(i,1);
              i = i-1;
            }
          }
          if(txtValue.length > 5) {
            self.showWarning5 = true;
            return;
          }else {
            self.showWarning5 = false
          }
          var ip=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
          for(var i=0; i<txtValue.length; i++) {
            if(!ip.test(txtValue[i])) {
              self.showWarning = true;
              return;
            } else {
              self.showWarning = false;
            }
          }
          self.textareaValue = txtValue.join(",")
        }
        $.ajax({
          url: self.apiHost + "/open-portal/whitelist/edit",
          type: "POST",
          data: {
            api_id: self.apiId,
            id: self.id,
            ip: self.textareaValue
          },
          success: function (msg) {
            self.dataList = msg.data;
            self.editModelShow = false;
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "/console/login.html";
                self.loginState = false;
              },2000)
            }
          }
        })

      },
      getList () {
        var self =this;
        $.ajax({
          url: self.apiHost + "/open-portal/whitelist/list",
          type: "POST",
          data: {},
          success: function (msg) {
            self.dataList = msg.data;
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "/console/login.html";
                self.loginState = false;
              },2000)
            }
          }
        })
      }
    }
  }
</script>

<style lang="less" type="text/less">
  #api-list {
    .model {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0,0,0, 0.3);
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
    .reminder {
      p {
        background: #FFF5E0;
        border: 1px solid #FFD091;
        border-radius: 2px;
        line-height: 40px;
        padding-left: 14px;
        font-size: 12px;
        color: #f44444;
        margin-bottom: 10px;
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
    .editModel {
      .el-dialog {
        width: 560px;
        .el-dialog__header {
          padding-top: 25px;
          padding-bottom: 25px;
          border-bottom: 1px solid #ddd;
        }
        .el-dialog__body {
          h3 {
            font-size: 14px;
            color: #111;
            line-height: 25px;
            margin-top:30px;
            margin-left:10px;
            margin-bottom: 10px;
          }
          .el-textarea__inner {
            width: 500px;
            min-height: 161px;
          }
          .warning {
            margin-top: 21px;
            p {
              line-height: 17px;
              color: #555;
              font-size: 12px;
            }
          }
        }
      }
    }
    .consultModel {
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
          .cancel {
            border: 1px solid #999999;
            color: #555;
            background-color: #e5e5e5;
            border-radius: 2px;
          }
        }
      }
    }
    .el-table__empty-text a{
      color: #4378E6;
    }
  }
</style>
