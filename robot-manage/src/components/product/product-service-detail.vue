<template>
  <div id="order-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home/product/service' }">服务列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/product/service/detail' }">服务详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="div-row">
      <div class="top clearfix">
        <h3 class="left">基本信息</h3>
        <router-link class="btn right" :to="{path: '/home/product/package/add', query: {apiId:id,from:'service'}}">添加商品</router-link>
      </div>
      <table class="info-table">
        <tbody>
        <tr>
          <td class="col1">服务名称：</td>
          <td>{{baseInfo.name}}</td>
        </tr>
        <tr>
          <td class="col1">可接入类型：</td>
          <td>
            <span v-if="baseInfo.type == '1'">API</span>
            <span v-if="baseInfo.type == '2'">SDK</span>
            <span v-if="baseInfo.type == '3'">API+SDK</span>
          </td>
        </tr>
        <tr>
          <td class="col1">累计正式接入客户量：</td>
          <td>{{baseInfo.formalNumber}}</td>
        </tr>
        <tr>
          <td class="col1">累计试用接入客户量：</td>
          <td>{{baseInfo.trailNumber}}</td>
        </tr>
        </tbody>
      </table>
    </div>


    <el-tabs type="card">
      <el-tab-pane label="统计信息">
        <div class="padding20">

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
          <div id="echarts" class="echarts"></div>

          <el-table :data="tableDataShow" border style="width: 100%;">
            <el-table-column prop="date" label="日期" align="center" width="291"></el-table-column>
            <el-table-column prop="times" label="调用客户量" align="center" width="290"></el-table-column>
            <el-table-column prop="totalTimes" label="总调用次数" align="center" width="290"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              @current-change="handleCurrentChange1"
              :current-page.sync="pageNum1"
              :page-size="pageSize1"
              layout="prev, pager, next, jumper"
              :total="tableDataHasNum.length" background>
            </el-pagination>
          </div>


        </div>
      </el-tab-pane>
      <el-tab-pane label="商品">
        <div class="padding20">
          <el-table :data="productList" border style="width: 100%;">
            <el-table-column prop="id" label="商品编号" align="center"></el-table-column>
            <el-table-column prop="name" label="商品名称" align="center"></el-table-column>
            <el-table-column label="规格" align="center">
              <template slot-scope="scope">
                <p>使用时长:{{scope.row.period}}天</p>
                <p>每日调用上限：{{scope.row.times}}</p>
                <p>每秒并发量：{{scope.row.concurrency}}</p>
                <p>超额计费：{{scope.row.extraFee}}元/1000次</p>
              </template>
            </el-table-column>
            <el-table-column prop="salesVol" label="销量" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0">上架</span>
                <span v-if="scope.row.status == 1">下架</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <router-link :to="{ path: '/home/product/package/add', query: {id: scope.row.id,from:'service'}}">编辑</router-link>
                <a href="javascript:;" v-if="scope.row.status == 1" @click="changeStatus(scope.row.id,0)">上架</a>
                <a href="javascript:;" v-if="scope.row.status == 0" @click="changeStatus(scope.row.id,1)">下架</a>
                <a href="javascript:;" @click="deleteProduct(scope.row.id)">删除</a>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              @current-change="handleCurrentChange2"
              :current-page.sync="pageNum2"
              :page-size="pageSize2"
              layout="prev, pager, next, jumper"
              :total="totalPage2" background>
            </el-pagination>
          </div>

        </div>
      </el-tab-pane>

    </el-tabs>

  </div>
</template>

<script>
  // 引入 ECharts 主模块
  var echarts = require('echarts/lib/echarts');

  export default {
    data() {
      return {
        loginState: false,
        id: '',
        baseInfo: {},
        searchDate: [],
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
        dataScope:365,
        statisticsTable:[],
        pageNum1: 1,
        pageSize1: 10,

        productList:[],
        pageNum2: 1,
        pageSize2: 10,
        totalPage2: 0

      };
    },
    computed: {
      tableDataHasNum: function () {
        var arr = [];
        for (var i = 0; i < this.statisticsTable.length; i++) {
          if (this.statisticsTable[i].times || this.statisticsTable[i].overTimes) {
            arr.push(this.statisticsTable[i]);
          }
        }
        return arr;
      },
      tableDataShow: function () {
        return this.tableDataHasNum.slice((this.pageNum1 - 1) * this.pageSize1, this.pageNum1 * this.pageSize1)
      }
    },
    created() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id;
      }
      this.getDetail();

      this.searchDate = this.getStartEndDate(this.dataScope);
      this.getApiUseList();
      this.getProductList();
    },
    mounted:function(){

    },
    methods: {
      //获取详情
      getDetail(){
        var self = this;
        self.$http({
          url: apiHost + "/api/detail",
          type: 'post',
          data: {
            id: self.id
          },
          success: function (data) {
            if (data.code == 0) {
              self.baseInfo = data.data;
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
          url: apiHost + "/apiuse/summary",
          data: {
            apiId: self.id,
            startTime: startTime,
            endTime: endTime,
          },
          success: function (data) {
            if (data.code == 0) {
              if (data.data && data.data) {
                self.statisticsTable = data.data;

              }else {
                self.statisticsTable = [];
              }
              self.setEchart(self.statisticsTable);
            }
          }
        });
      },
      setEchart (list) {
        this.chart = echarts.init(document.getElementById('echarts'));
        var xData = [];
        var yData = [];
        for (var i = 0; i < list.length; i++) {
          xData.push(list[i].date);
          yData.push(list[i].totalTimes);
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
      },
      //分页处理
      handleCurrentChange1(val) {
        this.pageNum1 = val;
      },

      //接口使用情况数据统计
      getProductList: function () {
        var self = this;
        self.$http({
          url: apiHost + "/goods/query",
          data: {
            apiId: self.id,
            pageNo: self.pageNum2,
            pageSize: self.pageSize2
          },
          success: function (data) {
            if (data.code == 0) {
              if (data.data && data.data.data) {
                self.productList = data.data.data;
                self.totalPage2 = data.data.totalRecord;
              }else {
                self.productList = [];
                self.totalPage2 = 0;
              }
            }
          }
        });
      },
      handleCurrentChange2(val) {
        this.pageNum2 = val;
        this.getProductList();
      },

      //禁用和启用用户
      changeStatus(id,status) {
        var self = this;
        self.$confirm( status==1 ? '是否下架该商品？' : '是否上架该商品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function(){
          self.$http({
            url: apiHost + "/goods/update",
            type: 'post',
            data: {
              id: id,
              status: status
            },
            success: function (data) {
              if (data.code == 0) {
                self.getProductList();
                self.$message({
                  message: '操作成功！',
                  type: "success"
                });
              } else {
                self.$message({
                  message: data.msg,
                  type: "error"
                });
              }
            }
          });

        }).catch(function(){

        });
      },
      //删除商品
      deleteProduct(id) {
        var self = this;
        self.$confirm( '是否删除该商品？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function(){
          self.$http({
            url: apiHost + "/goods/update",
            type: 'post',
            data: {
              id: id,
              isDelete: 1
            },
            success: function (data) {
              if (data.code == 0) {
                self.getProductList();
                self.$message({
                  message: '操作成功！',
                  type: "success"
                });
              } else {
                self.$message({
                  message: data.msg,
                  type: "error"
                });
              }
            }
          });

        }).catch(function(){

        });
      }
    }
  };
</script>

<style>

</style>
