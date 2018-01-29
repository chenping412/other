<template>
  <div id="resource">
    <div class="classify-item">
      <div class="title">写作类</div>
      <div class="resource-list">
        <ul class="clearfix">
          <li v-for="list in menuList" :class="[list.permission == 0 ? 'not development' : 'normal']"
              @click="router(list.name)">
            <div class="li-left">
              <img :src="'static/pub/images/write_' + list.id + '_x.png'" v-if="list.permission == 0">
              <img :src="'static/pub/images/write_' + list.id + '.png'" v-if="list.permission == 1">
            </div>
            <div class="li-right">
              <h3>{{list.name}}</h3>
              <p>{{list.explain}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="contact">
      <h3>联系我们</h3>
      <p>如使用过程中有任何问题，欢迎联系售后部门</p>
      <p>电话：0755-86720697</p>
      <p>邮箱：contact@giiso.com</p>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        menuList: []
      }
    },
    created() {
      this.getMenuList();
    },
    mounted: function () {
      // this.getMenuList();
    },
    methods: {
      getMenuList() {
        var self = this;
        $.ajax({
          // url: "http://172.16.1.31:9092/industry-bulletin//writer_robot/robot_list",
          url: apiHost + "/industry-bulletin//writer_robot/robot_list",
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
              self.menuList = data.data[1].class_data
            }
          }
        })
      },
      router(name) {
        var self = this;
        if (name == "资讯写作") {
          self.$router.push('/write-robot');
        }
      }
    }
  }
</script>

<style scoped>
  #resource {
    width: 100%;
  }

  #resource .classify-item {
    width: 100%;
    background-color: #fff;
    box-shadow: 3px 6px 6px #ebebeb;
    border-radius: 4px;
  }

  #resource .classify-item .title {
    padding-left: 30px;
    line-height: 45px;
    border-bottom: 2px solid #f5f5f5;
    color: #333333;
    font-size: 14px;
  }

  #resource .classify-item .resource-list {
    padding: 10px;
  }

  #resource .classify-item .resource-list ul li {
    float: left;
    width: 412px;
    height: 106px;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    display: table;
    background-color: #f5f5f5;
    cursor: pointer;
    margin: 10px 12px;
    position: relative;
  }

  #resource .classify-item .resource-list ul li.development:after {
    display: block;
    content: "";
    width: 58px;
    height: 58px;
    position: absolute;
    top: 0;
    right: 0;
    /*background: url("../assets/images/development_icon.png");*/
    background: url("../assets/images/not_open.png");
  }

  #resource .classify-item .resource-list ul li.not {
    cursor: not-allowed;
  }

  #resource .classify-item .resource-list ul li.normal:hover {
    border-color: #0874ea
  }

  #resource .classify-item .resource-list ul li.normal:hover .li-right h3, #resource .classify-item .resource-list ul li.normal:hover .li-right p {
    color: #0874ea;
  }

  #resource .classify-item .resource-list ul li .li-left, #resource .classify-item .resource-list ul li .li-right {
    display: table-cell;
  }

  #resource .classify-item .resource-list ul li .li-left {
    width: 140px;
    vertical-align: middle;
  }

  #resource .classify-item .resource-list ul li .li-left img {
    margin-left: 32px;
    width: 80px;
  }

  #resource .classify-item .resource-list ul li .li-right {
    padding-right: 20px;
  }

  #resource .classify-item .resource-list ul li .li-right h3 {
    margin-top: 13px;
    font-size: 16px;
    color: #303030;
    line-height: 30px;
  }

  #resource .classify-item .resource-list ul li .li-right p {
    font-size: 16px;
    color: #808080;
    line-height: 20px;
    margin-top: 5px;
  }

  #resource .contact {
    padding: 15px 30px 20px 30px;
    background-color: #fff;
    background-color: #fff;
    box-shadow: 3px 6px 6px #ebebeb;
    margin-top: 10px;
    border-radius: 4px;
  }

  #resource .contact h3 {
    /*margin-top: 13px;*/
    font-size: 14px;
    color: #303030;
    line-height: 26px;
  }

  #resource .contact p {
    font-size: 12px;
    color: #808080;
    line-height: 18px;
    margin-top: 5px;
  }
</style>
