<template>
  <div id="stock-comment">
    <div class="top-else" style="padding: 0 30px;">
      <div class="breadcrumb">
        <router-link :to="{ path: '/' }">首页</router-link>
        <span>&gt;股票写作</span>
      </div>
    </div>
    <div class="web-content">
      <div class="control">
        <div class="row clearfix">
          <div class="left">
            <!--<div class="item">-->
              <!--<span>选择模板</span>-->
              <!--<el-select v-model="template" placeholder="选择模板" size="small">-->
                <!--<el-option value="看数据模板" label="看数据模板"></el-option>-->
              <!--</el-select>-->
            <!--</div>-->
            <div class="item">
              <span>选择日期</span>
              <el-date-picker
                v-model="date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"  size="small"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
            <div class="item">
              <span>选择时间</span>
              <el-select v-model="time" placeholder="选择时间" size="small">
                <el-option value="10:30" label="10:30"></el-option>
                <el-option value="11:30" label="11:30"></el-option>
                <el-option value="14:00" label="14:00"></el-option>
                <el-option value="15:00" label="15:00"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row clearfix">
          <div class="left">
            <div class="item">
              <span>打开涨停板家数</span>
              <el-input-number v-model="openLimitUp" controls-position="right" :min="0" :max="9999" size="small"></el-input-number>
            </div>
            <div class="item">
              <span>封涨停板家数</span>
              <el-input-number v-model="sealLimitUp" controls-position="right" :min="0" :max="9999" size="small"></el-input-number>
            </div>


          </div>
          <div class="right">
            <el-button type="primary" size="small" @click="clickWrite()">文章写作</el-button>
          </div>
        </div>
      </div>

      <div class="article-content">{{article}}</div>
      <div class="btns">
        <el-button class="js-copy" type="primary" size="small" :data-clipboard-text="article==''? 'false' : article">一键复制</el-button>
        <el-button type="primary" size="small" @click="downLoadWord">下载</el-button>
      </div>
    </div>


  </div>
</template>

<script>
  import $ from 'jquery';
  export default {
    data: function () {
      return {
        template:'看数据模板',
        date:'',
        pickerOptions:{
          disabledDate(time){
            if(time.getTime()>new Date().getTime()){
              return true;
            }
            var week=time.getDay();
            if(week == 0 || week ==6){
              return true;
            }
          }
        },

        time:'10:30',
        openLimitUp:0,
        sealLimitUp:0,
        article:''
      }
    },
    created:function(){
      this.date=this.getTime();
    },
    methods: {
      clickWrite:function(){
        var self = this;
        if (self.date == '' || !self.date) {
          self.$alert('请您选择日期后，点击文章写作！', '提示', {
            type: 'warning'
          });
          return false;
        }
        if (self.openLimitUp.toString().split('.').length>1 || self.openLimitUp.toString().length>4) {
          self.$alert('您输入打开涨停板家数格式错误，请输入4位以内正整数', '提示', {
            type: 'warning'
          });
          return false;
        }
        if (self.sealLimitUp.toString().split('.').length>1 || self.sealLimitUp.toString().length>4) {
          self.$alert('您输入封涨停板家数格式错误，请输入4位以内正整数', '提示', {
            type: 'warning'
          });
          return false;
        }
        $.ajax({
          url: apiHost + "/industry-bulletin/writer_robot/look_finance/content",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            date: self.date+' '+self.time + ':00',
            openLimitUp: self.openLimitUp,
            sealLimitUp: self.sealLimitUp
          },
          success: function (data) {
            if (data.code == '0' && data.data && data.data.d) {
              self.article=data.data.d;
            }else {
              self.$alert('您选择的时间无数据，请重新选择！', '提示', {
                type: 'warning'
              });
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              location.href = "./login.html";
            }
          }
        })
      },
      //导出word文档
      downLoadWord: function () {
        var self=this;

        if (self.article == '') {
          self.$alert('请先完成文章写作！', '提示', {
            type: 'warning'
          });
          return false;
        }

        self.$confirm('您确定要下载此文章么？', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          $.ajax({
            url: apiHost + "/industry-bulletin/writer_robot/info_writer/save_word",
            type: "POST",
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true,
            data: {
              title: self.template,
              author: '写作机器人',
              time: self.date+' '+self.time + ':00',
              content: self.article
            },
            success: function (data) {
              if (data.code == '0' && data.data) {
                window.location.href=apiHost + '/industry-bulletin/writer_robot/info_writer/down_word?filename='+data.data;
              }else {
                self.$alert(data.msg, '提示', {
                  type: 'error'
                });
              }
            },
            error: function (XMLHttpRequest) {
              if (XMLHttpRequest.status == "9001") {
                location.href = "./login.html";
              }
            }
          })
        }).catch(function () {

        });

      },

      getTime() {
        var now = new Date();
        var y = now.getFullYear();
        var M = now.getMonth() + 1;
        if (M < 10) M = "0" + M;
        var d = now.getDate();
        if (d < 10) d = "0" + d;

        return  y + "-" + M + "-" + d;
      }
    }
  }
</script>

<style>

  #stock-comment{
    font-size: 14px;
    color: #333333;
  }
  #stock-comment .left {
    float: left;
  }

  #stock-comment .right {
    float: right;
  }
  #stock-comment .web-content {
    padding: 20px 30px;
    background-color: #fff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    margin-bottom: 100px;
  }
  #stock-comment .web-content .control .row {
    padding-bottom: 30px;
  }
  #stock-comment .web-content .control .row .item {
    display: inline-block;
    margin-right: 17px;
  }
  #stock-comment .web-content .control .row .item>span{
    display: inline-block;
    width: 105px;
  }
  #stock-comment .web-content .control .row .item .el-input-number,
  #stock-comment .web-content .control .row .item .el-input{
    width: 170px;
  }

  #stock-comment .web-content .article-content{
    min-height: 600px;
    border:1px solid #e6e6e6;
    border-radius: 5px;
    padding: 20px;
    overflow-y: scroll;
    white-space: pre-line;
    font-size: 16px;
    line-height: 28px;
  }

  #stock-comment .el-button {
    width: 110px;
  }

  #stock-comment .btns {
    padding-top: 30px;
    text-align: center;
  }

  #stock-comment .btns .el-button + .el-button {
    margin-left: 17px;
  }

</style>
