<template>
  <div id="user-normal-api-detail">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">普通用户</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/user-index/user-normal/user-detail?id='+parentId }">用户详情</el-breadcrumb-item>
        <el-breadcrumb-item >接口详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="api-info box">
      <div class="top clearfix">
        <h3 class="left">基本资料</h3>
      </div>
      <div class="bot">
        <el-row >
          <el-col :span="8">服务名称：资讯搜索</el-col>
          <el-col :span="8">到期日期：2018-12-06</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">每日调用上限：50000</el-col>
          <el-col :span="8">超额计费：4元/1000次</el-col>
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

        <div id="echarts"></div>

        <el-table :data="statisticsTable" show-summary border style="width: 100%;">
          <el-table-column prop="date" label="日期" align="center"></el-table-column>
          <el-table-column prop="n1" label="调用量" align="center"></el-table-column>
          <el-table-column prop="n2" label="超额量" align="center"></el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="pageNum"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="totalPage" background>
          </el-pagination>
        </div>
      </div>
    </div>



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
        id:'',
        parentId:'',
        searchDate:'',
        dataScope:'1',
        statisticsTable:[
          {
            date:'2018-01-01',
            n1:40000,
            n2:10000
          },{
            date:'2018-01-01',
            n1:10000,
            n2:1235
          },{
            date:'2018-01-01',
            n1:60000,
            n2:10000
          },{
            date:'2018-01-01',
            n1:10000,
            n2:2000
          },{
            date:'2018-01-01',
            n1:100000,
            n2:10000
          },{
            date:'2018-01-01',
            n1:10000,
            n2:10000
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          },{
            date:'2018-01-01',
            n1:10000,
            n2:0
          }
        ],
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
        pageNum: 1,
        pageSize: 30,
        totalPage: 100,
        isStart:true,

      };
    },
    created() {
      if(this.$route.query.id){
        this.id=this.$route.query.id;
      }
      if(this.$route.query.parentId){
        this.parentId=this.$route.query.parentId;
      }

    },
    mounted:function(){
      this.getChart();
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
      //停用启用变化处理
      switchChange:function(){
        console.log(this.isStart);
        var self=this;
        if(!self.isStart){
          self.$confirm('停用后该用户无法使用该接口，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function() {
            self.$message({
              type: 'success',
              message: '该接口已停用!'
            });
          }).catch(function(){
            self.isStart=true;
          });
        }else {
          self.$message({
            type: 'success',
            message: '该接口已启用!'
          });
        }

      },
      //分页处理
      handleCurrentChange(val) {
        this.pageNum = val;
      }
    }
  };
</script>

<style>
  #user-normal-api-detail .api-info{
    padding:10px 0 30px;
  }
  #user-normal-api-detail .api-info .top{
    padding:10px 30px;
    font-size: 14px;
    line-height: 32px;
  }
  #user-normal-api-detail .api-info .bot{
    margin:0 30px;
    border:1px solid #ebeef5;
    padding: 10px;
  }
  #user-normal-api-detail .el-row{
    padding: 10px;
  }
  #user-normal-api-detail .api-statistics .bot{
    border: none;
    padding: 0;
  }

</style>
