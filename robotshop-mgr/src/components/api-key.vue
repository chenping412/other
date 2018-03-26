<template>
  <div id="api-key">
    <div class="breadcrumb">
      <a href="javascript:;">API密钥</a>
    </div>
    <div class="key">
      <el-button class="btn" @click="addKeyClick">新增密钥</el-button>
      <!-- <a href="javascript:;">API秘钥使用指南</a> -->
    </div>
    <div class="reminder">
      <p>
        Tips：最多能创建3个密钥
      </p>
    </div>
    <div class="table-list">
      <el-table
        :data="keyList"
        border
        :row-class-name="tableRowClassName"
        style="width: 100%">
        <el-table-column
          prop="secret_id"
          label="SecretId"
          width="">
        </el-table-column>
        <el-table-column
          prop="secret_key"
          label="SecretKy"
          width="">
          <template scope="scope">
            <span href="javascript:;" v-show="scope.row.show">
              ******
              <a href="javascript:;" @click="scope.row.show=false" style="color: #4378e6;">显示</a>
            </span>
            <span href="javascript:;" v-show="!scope.row.show">
              {{ scope.row.secret_key }}
              <a href="javascript:;" @click="scope.row.show=true" style="color: #4378e6;">隐藏</a>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="enabled"
          label="状态">
          <template scope="scope">
            <span href="javascript:;" v-show="scope.row.enabled ==0">启用</span>
            <span href="javascript:;" v-show="scope.row.enabled ==1">禁用</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template scope="scope">
            <el-button v-show="scope.row.enabled ==0" @click="updateClick(scope.row.id, scope.row.enabled)" class="btn1" size="small">禁用</el-button>
            <el-button v-show="scope.row.enabled ==1" @click="updateClick(scope.row.id, scope.row.enabled)" class="btn2" size="small">启用</el-button>
            <el-button @click="moveClick(scope.row.id)" class="btn3" :disabled="scope.row.enabled ==1 || keyList.length < 2" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :visible.sync="moveModelShow"
      size="tiny">
      <h3>确定删除密钥？</h3>
      <p>
        删除API密钥会使当前密钥失效
        并无法恢复使用当前秘钥的程序将无法连接API服务。
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="moveSure" class="sure">确 定</el-button>
        <el-button @click="moveModelShow = false" class="cancel">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="updateModelShow"
      size="tiny">
      <h3 v-show="enabled==1">确定禁用密钥？</h3>
      <h3 v-show="enabled==0">确定启用密钥？</h3>
      <p v-show="enabled==1">
        禁用API密钥会使当前密钥失效
        使用当前秘钥的程序将无法连接API服务
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateSure" class="sure">确 定</el-button>
        <el-button @click="updateModelShow = false" class="cancel">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="addKeyModelShow"
      size="tiny">
      <h3 v-show="keyNum<3">确定创建密钥？</h3>
      <h3 v-show="keyNum>=3">您的密钥已经到达上限</h3>
      <p v-show="keyNum<3">
        Tips：创建密钥后需要添加白名单才能使用API服务
      </p>
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="addKeySure">确 定</el-button>
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
        updateModelShow: false,
        moveModelShow: false,
        addKeyModelShow: false,
        keyList: [],
        keyNum: 0,
        id: "",
        enabled: "",
        loginState: false
      }
    },
    created() {
      if(location.host != "robot.giiso.com") {
        this.apiHost = "http://robot.giiso.com"
      }
      this.getKeyList();
    },
    mounted () {
      $(".el-dialog__close").hide();
    },
    watch: {
      keyList: function () {
        var self = this;
        self.keyNum = self.keyList.length;
        console.log(self.keyNum)
      }
    },
    methods: {
      tableRowClassName(row, index) {
        if (index % 2 === 1) {
          return 'info-row';
        }
        return '';
      },
      addKeyClick() {
        var self = this;
        self.addKeyModelShow = true;
      },
      addKeySure() {
        var self = this;
        if (self.keyNum >= 3) {
          self.addKeyModelShow = false;
          return;
        }
        $.ajax({
          url: self.apiHost + "/open-portal/secret/add",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            secret_id: "",
            secret_key: "",
            addenabled: "",
            explain: "测试组"
          },
          success: function (msg) {
            if (msg.data && msg.data.length > 0) {
              for (var i = 0; i < msg.data.length; i++) {
                self.$set(msg.data[i], "show", true)
              }
              self.keyList = msg.data;
              self.addKeyModelShow = false;
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "/";
                self.loginState = false;
              },2000)
            }
          }
        })
      },
      getKeyList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/open-portal/secret/list",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {},
          success: function (msg) {
            if (msg.data && msg.data.length > 0) {
              for (var i = 0; i < msg.data.length; i++) {
                self.$set(msg.data[i], "show", true)
              }
              self.keyList = msg.data;
              self.keyNum = msg.data.length;
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "/";
                self.loginState = false;
              },2000)
            }
          }
        })
      },
      moveClick(id) {
        var self = this;
        self.id = id;
        self.moveModelShow = true;
      },
      moveSure() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/open-portal/secret/delete",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            id: self.id
          },
          success: function (msg) {
            if (msg.data && msg.data.length > 0) {
              for (var i = 0; i < msg.data.length; i++) {
                self.$set(msg.data[i], "show", true)
              }
              self.keyList = msg.data;
              self.moveModelShow = false;
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "/";
                self.loginState = false;
              },2000)
            }
          }
        })
      },
      updateClick(id, enabled) {
        var self = this;
        self.id = id;
        self.enabled = enabled;
        self.updateModelShow = true;
      },
      updateSure() {
        var self = this;
        var enable = 0;
        if (self.enabled == 0) {
          enable = 1;
        }
        $.ajax({
          url: self.apiHost + "/open-portal/secret/update",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            id: self.id,
            enabled: enable
          },
          success: function (msg) {
            if (msg.data && msg.data.length > 0) {
              for (var i = 0; i < msg.data.length; i++) {
                self.$set(msg.data[i], "show", true)
              }
              self.keyList = msg.data;
            }
            self.updateModelShow = false;
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              self.loginState = true;
              setTimeout(function () {
                location.href = "/";
                self.loginState = false;
              },2000)
            }
          }
        })
      },
    },
  }
</script>

<style lang="less" type="text/less">
  #api-key {
    .btn1 {
      color: #f44444;
      background-color: transparent;
      border-color: transparent;
      margin: 0;
      margin-left: 10px;
    }
    .btn2 {
      color: #4378e6;
      background-color: transparent;
      border-color: transparent;
      margin: 0;
      margin-left: 10px;
    }
    .btn3 {
      color: #4378E6;
      margin: 0;
      background-color: transparent;
      border-color: transparent;
      margin-left: 10px;
    }
    .el-button.is-disabled {
      color: #999;
    }
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
    .el-button--primary {
      background-color: #477EF8;
      width: 80px;
      height: 36px;
      border-radius: 2px;
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
    .key {
      margin-bottom: 20px;
      .btn {
        background: #477EF8;
        border-radius: 2px;
        border-color: #477EF8;
        color: #fff;
        height: 36px;
        width: 100px;
      }
      a {
        text-decoration: underline;
        font-size: 12px;
        color: #555;
        margin-left: 10px;
      }
    }
    .reminder {
      p {
        background: #FFF5E0;
        border: 1px solid #FFD091;
        border-radius: 2px;
        line-height: 20px;
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
      p {
        line-height: 20px;
        font-size: 14px;
        color: #555555;
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
      .sure {
        background-color: #f44444!important;
        border-color: #f44444;
        color: #fff;
      }
      .cancel {
        border: 1px solid #999999;
        color: #555;
        background-color: #e5e5e5;
        border-radius: 2px;
      }
    }
  }
</style>
