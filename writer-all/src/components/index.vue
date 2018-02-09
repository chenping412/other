<template>
  <div id="index">
    <div class="aside-menu">
      <ul>
        <li v-for="item in classList">
          <router-link :to="{ path: item.path }">{{item.class_name}}</router-link>
        </li>
      </ul>
    </div>
    <div class="index-main">
      <router-view :classList="classList"></router-view>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  export default {
    data() {
      return {
        classList: []
      }
    },
    created() {
      this.getMenuList();
    },
    methods: {
      getMenuList() {
        var self = this;
        $.ajax({
          url: apiHost + "/industry-bulletin/writer_robot/robot_list",
          type: "POST",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true,
          data: {
            class_id: 0
          },
          success: function (data) {
            if (data.code == 0) {
              self.classList = data.data;
              for(var i=0;i<self.classList.length;i++){
                if(self.classList[i].class_id==1){
                  self.classList[i].path='/index/write';
                }
                if(self.classList[i].class_id==2){
                  self.classList[i].path='/index/resource';
                }
                if(self.classList[i].class_id==3){
                  self.classList[i].path='/index/data';
                }
              }
            }
          },
          error: function (XMLHttpRequest) {
            if (XMLHttpRequest.status == "9001") {
              location.href = "./login.html";
            }
          }
        })
      }
    }
  }
</script>

<style>
  #index {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
  }

  #index .aside-menu {
    float: left;
    width: 165px;
    height: 650px;
    background-color: #fff;
    box-shadow: 3px 6px 6px #ebebeb;
  }

  #index .aside-menu ul li a {
    display: block;
    line-height: 45px;
    font-size: 14px;
    color: #333333;
    text-align: center;
  }

  #index .aside-menu ul li a.router-link-exact-active {
    color: #0874ea;
    background-color: #f5f5f5;
    border-left: 2px solid #0784ea;
  }

  #index .index-main {
    width: 898px;
    float: right;
  }
</style>
