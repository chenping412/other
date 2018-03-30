<template>
  <div id="api-order">
    <div class="breadcrumb">
      <a href="javascript:;">API订单</a>
    </div>
    <div class="table-list">
      <el-table
        :data="orderList"
        border
        :row-class-name="tableRowClassName"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="订单号"
          width="">
        </el-table-column>
        <el-table-column
          prop="name"
          label="API名称"
          width="">
        </el-table-column>
        <el-table-column
          prop="address"
          label="计费类型">
        </el-table-column>
        <el-table-column
          prop="address"
          label="规格">
        </el-table-column>
        <el-table-column
          prop="address"
          label="金额">
        </el-table-column>
        <el-table-column
          prop="address"
          label="购买时间">
        </el-table-column>
        <el-table-column
          prop="address"
          label="到期时间">
        </el-table-column>
      </el-table>
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
          <div class="boxvalue">0755 - 22223972</div>
        </li>
        <li class="clearfix">
          <div class="boxname">QQ:</div>
          <div class="boxvalue">9326008</div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="dialogVisible = false">取 消</el-button>-->
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    data() {
      return {
        apiHost: "",
        dialogVisible: false,
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '1000'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '1000'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '1000'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '1000'
        }]
      }
    },
    created () {
      if(location.host != "robot.giiso.com") {
        this.apiHost = "http://172.16.33.4:8081"
      }
      this.getOrderList();
    },
    methods: {
      tableRowClassName(row, index) {
        if (index % 2 === 1) {
          return 'info-row';
        }
        return '';
      },
      getOrderList () {
        var self =this;
        $.ajax({
          url: self.apiHost + "/open-portal/whitelist/list",
          type: "POST",
          data: {},
          success: function (msg) {
            self.orderList = msg.data
          }
        })
      }
    },
  }
</script>

<style lang="less" type="text/less">
  #api-order {
    .breadcrumb {
      padding-left: 30px;
      margin: 52px 0 21px 0;
      a {
        display: block;
        line-height: 30px;
        color: #141414;
        font-size: 24px;
      }
    }
    .table-list {
      padding-left: 30px;
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
    .el-dialog__body {
      h3 {
        font-size: 18px;
        color: #111;
        line-height: 25px;
        margin-bottom: 10px;
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
  }
</style>
