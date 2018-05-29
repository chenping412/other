<template>
  <div class="loading-model" v-show="status != 0 || loading">
    <div class="inner">
      <div class="icon">
        <i></i>
        <span>{{num}}%</span>
      </div>
      <p v-show="status==1 || status==0">小智收到主人的指令，好开森~~~</p>
      <p v-show="status==2">小智正在努力搜索资料哦，请耐心等候...</p>
      <p v-show="status==3">小智正在帮主人构思中，写呀写~~~</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['loading'],
    data: function () {
      return {
        status:0,
        num:0,
        timer:null
      }
    },
    watch:{
      loading:function(val,oldVal){
        var self=this;
        if(val){
          clearInterval(self.timer);
          self.status=1;
          self.timer=setTimeout(function(){
            self.status=2;
          },1000)
        }else {
          if(self.status ==1 || self.status ==0){
            clearInterval(self.timer);
            self.status=2;
            self.timer=setTimeout(function(){
              self.status=3;
              self.timer= setTimeout(function(){
                self.status=0;
              },500)
            },500)
          }else {
            self.status=3;
            self.timer= setTimeout(function(){
              self.status=0;
            },500)
          }


        }
      },
      status:function(val,oldVal){
        if(val == 0){
          this.num=0;
        }else if(val==1 && val>oldVal){
          this.numAdd(30);
        }else if(val==2 && val>oldVal){
          this.numAdd(60);
        }else if(val==3 && val>oldVal){
          this.numAdd(100);
        }
      }
    },
    methods: {
      numAdd:function(to){
        var self=this;
        var m=(parseInt(to)-parseInt(self.num))/10;
        var timer=setInterval(function(){
          self.num+=parseInt(m);
          if(self.num>=to) clearInterval(timer);
          if(self.num>100) self.num=100;
        },30)
      }
    }
  }
</script>

<style>

  #app .loading-model {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    min-width: 1240px;
    z-index: 5000;
  }

  #app .loading-model .inner {
    position: fixed;
    top: 50%;
    left: 43%;
    width: 390px;
    height: 196px;
    padding-top: 39px;
    margin: -118px 0 0 -195px;
    background: rgba(22, 35, 58, 0.89);
    border-radius: 6px;
    z-index: 1;
  }

  #app .loading-model .icon {
    width: 112px;
    height: 124px;
    margin: 0 auto 16px;
    background: url("./../assets/images/loading-bg.png") no-repeat;
    position: relative;
  }

  #app .loading-model .icon i {
    position: absolute;
    right: 26px;
    bottom: 10px;
    width: 60px;
    height: 60px;
    background: url("./../assets/images/loading.png") no-repeat center;
    animation: loading 1s linear infinite;
  }

  @keyframes loading {
    0% {
      transform: rotateZ(0deg);
    }
    25% {
      transform: rotateZ(90deg);
    }
    50% {
      transform: rotateZ(180deg);
    }
    75% {
      transform: rotateZ(270deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }

  #app .loading-model .icon span {
    font-size: 14px;
    color: #FFFFFF;
    line-height: 20px;
    text-align: center;
    position: absolute;
    width: 100%;
    height: 20px;
    left: 0;
    bottom: 30px;
  }

  #app .loading-model p {
    font-size: 14px;
    color: #FFFFFF;
    line-height: 20px;
    text-align: center;
  }
</style>
