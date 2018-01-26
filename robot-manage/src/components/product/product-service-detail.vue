<template>
  <div id="order-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/product/service' }">服务列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/product/service/detail' }">服务详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="div-row">
      <div class="top clearfix">
        <h3 class="left">基本信息</h3>
        <router-link class="btn right" :to="{path: '/product/service/add', query: {parentId:id}}">添加规格</router-link>
      </div>
      <table class="info-table">
        <tbody>
        <tr>
          <td class="col1">服务名称：</td>
          <td>相似资讯</td>
        </tr>
        <tr>
          <td class="col1">累计正式接入客户量：</td>
          <td>100</td>
        </tr>
        <tr>
          <td class="col1">累计试用接入客户量：</td>
          <td>100</td>
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
                :picker-options="pickerOptions2"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-button type="primary" size="small">查询</el-button>
            </div>

            <div class="right">
              <el-radio-group v-model="dataScope" size="small">
                <el-radio-button label="1">7天</el-radio-button>
                <el-radio-button label="2">30天</el-radio-button>
                <el-radio-button label="3">365天</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div id="echarts" class="echarts"></div>

          <el-table :data="statisticsTable" show-summary border style="width: 100%;">
            <el-table-column prop="date" label="日期" align="center"></el-table-column>
            <el-table-column prop="n1" label="调用客户量" align="center"></el-table-column>
            <el-table-column prop="n2" label="调用客户量" align="center"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              @current-change="handleCurrentChange1"
              :current-page.sync="pageNum1"
              :page-size="pageSize1"
              layout="prev, pager, next, jumper"
              :total="totalPage1" background>
            </el-pagination>
          </div>


        </div>
      </el-tab-pane>
      <el-tab-pane label="WebAPI">
        <div class="padding20">
          <el-table :data="apiList" border style="width: 100%;">
            <el-table-column prop="date" label="规格编号" align="center"></el-table-column>
            <el-table-column prop="n1" label="规格名称" align="center"></el-table-column>
            <el-table-column prop="n2" label="类型" align="center"></el-table-column>
            <el-table-column prop="n2" label="规格属性" align="center"></el-table-column>
            <el-table-column prop="n2" label="销量" align="center"></el-table-column>
            <el-table-column prop="n2" label="状态" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <router-link :to="{path: '/product/service/add', query: {id: scope.row.id , parentId:id}}">编辑</router-link>
                <a href="javascript:;">上架</a>
                <a href="javascript:;">下架</a>
                <a href="javascript:;">删除</a>
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
      <el-tab-pane label="SDK">
        <div class="padding20">
          <el-table :data="sdkList" border style="width: 100%;">
            <el-table-column prop="date" label="规格编号" align="center"></el-table-column>
            <el-table-column prop="n1" label="规格名称" align="center"></el-table-column>
            <el-table-column prop="n2" label="类型" align="center"></el-table-column>
            <el-table-column prop="n2" label="规格属性" align="center"></el-table-column>
            <el-table-column prop="n2" label="销量" align="center"></el-table-column>
            <el-table-column prop="n2" label="状态" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <router-link :to="{path: '/product/service/add', query: {id: scope.row.id , parentId:id}}">编辑</router-link>
                <a href="javascript:;">上架</a>
                <a href="javascript:;">下架</a>
                <a href="javascript:;">删除</a>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              @current-change="handleCurrentChange3"
              :current-page.sync="pageNum3"
              :page-size="pageSize3"
              layout="prev, pager, next, jumper"
              :total="totalPage3" background>
            </el-pagination>
          </div>

        </div>


      </el-tab-pane>
    </el-tabs>


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
  // 引入 ECharts 主模块
  var echarts = require('echarts/lib/echarts');

  export default {
    data() {
      return {
        loginState: false,
        id: '',
        searchDate: '',
        pickerOptions2: {
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
        dataScope:'1',
        statisticsTable:[
          {
            date:'2018-01-01',
            n1:40000,
            n2:10000
          }
        ],
        pageNum1: 1,
        pageSize1: 30,
        totalPage1: 100,

        apiList:[
          {
            id:'654',
            date:'2018-01-01',
            n1:40000,
            n2:10000
          }
        ],
        pageNum2: 1,
        pageSize2: 30,
        totalPage2: 100,

        sdkList:[
          {
            id:'123',
            date:'2018-01-01',
            n1:40000,
            n2:10000
          }
        ],
        pageNum3: 1,
        pageSize3: 30,
        totalPage3: 100
      };
    },
    created() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id;
      }
      console.log(this.id)
    },
    mounted:function(){
      var self=this;
      setTimeout(function(){
        self.getChart();
      },1000)
    },
    methods: {
      //日期选择
      dateChange(val) {
        console.log(this.searchDate);
      },
      getChart () {
        var self = this;
        self.chart = echarts.init(document.getElementById('echarts'));
        var option = {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            name : '日期',
            type: 'category',
            boundaryGap: false,
            data: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7']
          },
          yAxis: {
            name : '调用次数/次',
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          },
          series: [
            {
              name:'该时段内调用次数',
              type: 'line',
              data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        };
        self.chart.setOption(option);
      },
      //分页处理
      handleCurrentChange1(val) {
        this.pageNum1 = val;
      },
      handleCurrentChange2(val) {
        this.pageNum2 = val;
      },
      handleCurrentChange3(val) {
        this.pageNum3 = val;
      }
    }
  };
</script>

<style>

</style>
