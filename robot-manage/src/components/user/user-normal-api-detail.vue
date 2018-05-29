<template>
  <div id="user-normal-api-detail">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">普通用户</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/user-index/user-normal/user-detail?id='+parentId }">用户详情
        </el-breadcrumb-item>
        <el-breadcrumb-item>接口详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="api-info box">
      <div class="top clearfix">
        <h3 class="left">基本资料</h3>
      </div>
      <div class="bot">
        <el-row>
          <el-col :span="8">服务名称：{{baseInfo.name}}</el-col>
          <el-col :span="8">到期日期：{{baseInfo.expireDate}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">每日调用上限：{{baseInfo.times}}</el-col>
          <el-col :span="8">超额计费：{{baseInfo.extraFee}}元/1000次</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span style="margin-right: 15px;">接口状态：</span>
            <el-switch
              v-model="isStart"
              @change="switchChange"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="停用">
            </el-switch>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="api-info api-statistics">
      <div class="top clearfix">
        <h3 class="left">接口统计</h3>
      </div>
      <div class="bot">
        <div class="control clearfix">
          <div class="left">
            <el-date-picker
              v-model="searchDate"
              size="small"
              type="daterange"
              value-format="yyyy-MM-dd"
              @change="dateChange"
              :editable="false"
              :clearable="false"
              :picker-options="pickerOptions2"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" size="small" @click="getApiUseList()">查询</el-button>
          </div>

          <div class="right">
            <el-radio-group v-model="dataScope" @change="dataScopeChange" size="small">
              <el-radio-button :label="7">7天</el-radio-button>
              <el-radio-button :label="30">30天</el-radio-button>
              <el-radio-button :label="365">365天</el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div id="echarts"></div>

        <el-table :data="tableDataShow" border style="width: 100%;">
          <el-table-column prop="date" label="日期" align="center" width="291"></el-table-column>
          <el-table-column prop="times" label="调用量" align="center" width="290"></el-table-column>
          <el-table-column prop="overTimes" label="超额量" align="center" width="290"></el-table-column>
        </el-table>

        <div v-show="tableDataHasNum.length>0"
          class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition"
             style="width: 100%;border-top: none;">
          <div class="el-table__body-wrapper is-scrolling-none">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 871px;">
              <colgroup>
                <col name="el-table_1_column_1" width="291">
                <col name="el-table_1_column_2" width="290">
                <col name="el-table_1_column_3" width="290">
              </colgroup>
              <tbody>
              <tr class="el-table__row">
                <td class="el-table_1_column_1 is-center ">
                  <div class="cell">总计</div>
                </td>
                <td class="el-table_1_column_2 is-center ">
                  <div class="cell">{{totalTime}}</div>
                </td>
                <td class="el-table_1_column_3 is-center ">
                  <div class="cell">{{totalOverTime}}</div>
                </td>
              </tr>
              </tbody>
            </table>
            </div>
        </div>
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="tableDataHasNum.length" background>
          </el-pagination>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import $ from "jquery";
  // 引入 ECharts 主模块
  var echarts = require('echarts/lib/echarts');

  export default {
    data() {
      return {
        loginState: false,
        parentId: '',
        orderId: '',
        apiId: '',
        goodsId: '',
        from: '',
        baseInfo: {},
        searchDate: [],
        dataScope: 7,
        tableData: [],
        totalTime:'',
        totalOverTime:'',
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        pageNum: 1,
        pageSize: 10,
        isStart: false

      };
    },
    computed: {
      tableDataHasNum: function () {
        var arr = [];
        for (var i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i].times|| this.tableData[i].overTimes) {
            arr.push(this.tableData[i]);
          }
        }
        return arr;
      },
      tableDataShow: function () {
        return this.tableDataHasNum.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize)
      }
    },
    created() {
      if (this.$route.query.parentId) {
        this.parentId = this.$route.query.parentId;
      }
      if (this.$route.query.orderId) {
        this.orderId = this.$route.query.orderId;
      }
      if (this.$route.query.apiId) {
        this.apiId = this.$route.query.apiId;
      }
      if (this.$route.query.goodsId) {
        this.goodsId = this.$route.query.goodsId;
      }
      this.getApiDetail();

      this.searchDate = this.getStartEndDate(this.dataScope);
      this.getApiUseList();
    },
    mounted: function () {
      this.chart = echarts.init(document.getElementById('echarts'));
    },
    methods: {
      //接口详情
      getApiDetail(){
        var self = this;
        self.$http({
          url: apiHost + "/member/goodsDetail",
          type: 'post',
          data: {
            mid: self.parentId,
            orderId: self.orderId,
            apiId: self.apiId,
            goodsId: self.goodsId
          },
          success: function (data) {
            if (data.code == 0) {
              self.baseInfo = data.data;
              if (self.baseInfo.status == 1) {
                self.isStart = true;
              }
            } else {

            }
          }
        });
      },

      //停用启用变化处理
      switchChange: function () {
        console.log(this.isStart);
        var self = this;
        if (!self.isStart) {
          self.$confirm('停用后该用户无法使用该接口，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function () {
            self.switchChangePost(0);
          }).catch(function () {
            self.isStart = true;
          });
        } else {
          self.switchChangePost(1);
        }

      },
      //停用启用请求函数
      switchChangePost: function (status) {
        var self = this;
        self.$http({
          url: apiHost + "/member/apiEnable",
          data: {
            mid: self.parentId,
            apiId: self.apiId,
            status: status
          },
          success: function (data) {
            if (data.code == 0) {
              if (status == 0) {
                self.$message({
                  type: 'success',
                  message: '该接口已停用!'
                });
              } else {
                self.$message({
                  type: 'success',
                  message: '该接口已启用!'
                });
              }
            } else {
              self.isStart = !self.isStart;
              self.$message({
                message: data.msg,
                type: "error"
              });
            }
          }
        });
      },

      //日期选择
      dateChange(val) {
        console.log(this.searchDate);
        this.getApiUseList();
      },
      dataScopeChange(val){
        this.searchDate = this.getStartEndDate(val);
        this.getApiUseList();
      },

      //接口使用情况数据统计
      getApiUseList: function () {
        var self = this;
        var startTime = self.searchDate[0] || '';
        var endTime = self.searchDate[1] || '';
        self.$http({
          url: apiHost + "/apiuse/list",
          data: {
            mid: self.parentId,
            apiId: self.apiId,
            goodsId: self.goodsId,
            startTime: startTime,
            endTime: endTime
          },
          success: function (data) {
            if (data.code == 0) {
              if (data.data && data.data.tableData) {
                self.tableData = data.data.tableData;
                self.totalTime=data.data.totalTime;
                self.totalOverTime=data.data.totalOverTime;
              }else {
                self.tableData =[];
                self.totalTime='';
                self.totalOverTime='';
              }
              self.setEchart(self.tableData);
            }
          }
        });
      },
      setEchart (list) {
        var xData = [];
        var yData = [];
        for (var i = 0; i < list.length; i++) {
          xData.push(list[i].date);
          yData.push(list[i].times);
        }
        var option = {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            name: '日期',
            type: 'category',
            boundaryGap: false,
            data: xData
          },
          yAxis: {
            name: '调用次数/次',
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          },
          series: [
            {
              name: '该时段内调用次数',
              type: 'line',
              data: yData
            }
          ]
        };
        this.chart.setOption(option);
      },
      //分页处理
      handleCurrentChange(val) {
        this.pageNum = val;
      },
      //获取7， 30， 365天的日期
      getStartEndDate(n) {
        //获取昨天
        var ss = new Date().getTime() - n * 24 * 60 * 60 * 1000;
        ss = new Date(ss);
        var sy = ss.getFullYear();
        var sm = ss.getMonth() + 1;
        if (sm < 10) {
          sm = "0" + sm;
        }
        var sd = ss.getDate();
        if (sd < 10) {
          sd = "0" + sd;
        }
        var sdate = sy + "-" + sm + "-" + sd

        //获取前n天
        var ee = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
        ee = new Date(ee);
        var ey = ee.getFullYear();
        var em = ee.getMonth() + 1;
        if (em < 10) {
          em = "0" + em;
        }
        var ed = ee.getDate();
        if (ed < 10) {
          ed = "0" + ed;
        }
        var edate = ey + "-" + em + "-" + ed;
        return [sdate, edate];
      }
    }
  };
</script>

<style>
  #user-normal-api-detail .api-info {
    padding: 10px 0 30px;
  }

  #user-normal-api-detail .api-info .top {
    padding: 10px 30px;
    font-size: 14px;
    line-height: 32px;
  }

  #user-normal-api-detail .api-info .bot {
    margin: 0 30px;
    border: 1px solid #ebeef5;
    padding: 10px;
  }

  #user-normal-api-detail .el-row {
    padding: 10px;
  }

  #user-normal-api-detail .api-statistics .bot {
    border: none;
    padding: 0;
  }

</style>
