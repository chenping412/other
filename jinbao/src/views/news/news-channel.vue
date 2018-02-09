<template>
  <div id="news-channel">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">资讯管理</el-breadcrumb-item>
        <el-breadcrumb-item>普通频道</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="news-channel-main">
      <el-tabs v-model="activeName">
        <el-tab-pane label="普通频道" name="normalChannel">
          <div class="top clearfix">
            <el-button type="primary" size="small" class="btn" @click="addNormalChannelModel">新增频道</el-button>
          </div>
          <div class="table-list">
            <el-table
              ref="multipleTable"
              :data="normalChannelList"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="">
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                align="center"
                prop="channelName"
                label="频道"
                width="">
              </el-table-column>
              <el-table-column
                align="center"
                prop="nickName"
                label="资讯数量"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="createName"
                label="创建人"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="createTime"
                label="创建时间"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="status"
                label="状态"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-show="scope.row.status == 0">正常</span>
                  <span v-show="scope.row.status == 1">屏蔽</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作"
                width="130">
                <template slot-scope="scope">
                  <span class="btn-text" @click="openUpdateModel(scope.row.id, scope.row.channelName)">编辑</span>
                  <span class="btn-text" v-show="scope.row.status == 0"
                        @click="updateStatus(scope.row.id, scope.row.status)">屏蔽</span>
                  <span class="btn-text" v-show="scope.row.status == 1"
                        @click="updateStatus(scope.row.id, scope.row.status)">正常</span>
                  <span class="btn-text" @click="remove(scope.row.id)">删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="地方频道" name="localChannel">
          <div class="top clearfix">
            <el-button type="primary" size="small" class="btn" @click="addLocalChannelModel">新增频道</el-button>
          </div>
          <div class="table-list">
            <el-table
              ref="multipleTable"
              :data="localChannelList"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="">
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                align="center"
                prop="channelName"
                label="频道"
                width="">
              </el-table-column>
              <el-table-column
                align="center"
                prop="nickName"
                label="资讯数量"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="createName"
                label="创建人"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="createTime"
                label="创建时间"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                align="center"
                prop="status"
                label="状态"
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-show="scope.row.status == 0">正常</span>
                  <span v-show="scope.row.status == 1">屏蔽</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="操作"
                width="130">
                <template slot-scope="scope">
                  <span class="btn-text" @click="openUpdateModel(scope.row.id, scope.row.channelName)">编辑</span>
                  <span v-show="scope.row.status == 0" class="btn-text"
                        @click="updateStatus(scope.row.id, scope.row.status)">屏蔽</span>
                  <span v-show="scope.row.status == 1" class="btn-text"
                        @click="updateStatus(scope.row.id, scope.row.status)">正常</span>
                  <span class="btn-text" @click="remove(scope.row.id)">删除</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>


    </div>
    <!--新增普通频道-->
    <el-dialog
      title="新增普通频道"
      :visible.sync="addNormalChannelVisible"
      width="30%">
      <el-form :model="addNormalChannelForm" ref="addNormalChannelForm" label-width="100px">
        <el-form-item label="频道名称" prop="channelName">
          <el-input type="text" v-model="addNormalChannelForm.channelName" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addNormalChannelVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addNormalChannel" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!--新增地方频道-->
    <el-dialog
      title="新增地方频道"
      :visible.sync="addLocalChannelVisible"
      width="30%">
      <el-form :model="addLocalChannelForm" ref="addLocalChannelForm">
        <el-form-item prop="channelName">
          <el-row>
            <el-col :span="11" class="channel-type-class">
              <el-select v-model="addLocalChannelForm.city"placeholder="请选择" size="small"
                         @change="cityChange">
                <el-option
                  v-for="item in cities"
                  :key="item.areaNo"
                  :label="item.areaName"
                  :value="item.areaNo">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2"> &nbsp;</el-col>
            <el-col :span="11">
              <el-select v-model="addLocalChannelForm.town" placeholder="请选择" size="small">
                <el-option
                  v-for="item in towns"
                  :key="item.areaNo"
                  :label="item.areaName"
                  :value="item.areaNo">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addLocalChannelVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="addLocalChannel" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改普通频道-->
    <el-dialog
      title="修改普通频道"
      :visible.sync="updateVisible"
      width="30%">
      <el-form :model="updateForm" ref="updateForm" label-width="100px">
        <el-form-item label="频道名称" prop="channelName">
          <el-input type="text" v-model="updateForm.channelName" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="update" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import $ from 'jquery'

  export default {
    data() {
      return {
        activeName: "normalChannel",
        userId: 11,
        searchForm: {
          keyword: ""
        },
        normalChannelList: [],
        localChannelList: [],
        addNormalChannelVisible: false,
        addLocalChannelVisible: false,
        addNormalChannelForm: {
          channelName: "",
        },
        addLocalChannelForm: {
          city: "",
          town: "",
        },
        updateVisible: false,
        updateForm: {
          channelName: "",
        },
        updateId: "",
        cities: "",
        towns: "",
      }
    },
    created: function () {
      this.getNormalChannelList();
      this.getLocalChannelList();
      this.getCities();
    },
    methods: {
      //获取普通频道列表数据
      getNormalChannelList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/news/channel/list",
          type: "post",
          data: {
            type: 0,
          },
          success: function (data) {
            if (data.code == 0) {
              self.normalChannelList = data.data;
            }
          },
          error: function (err) {
          }
        })
      },
      //获取地方频道列表数据
      getLocalChannelList() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/news/channel/list",
          type: "post",
          data: {
            type: 1,
          },
          success: function (data) {
            if (data.code == 0) {
              self.localChannelList = data.data;
            }
          },
          error: function (err) {}
        })
      },
      //新增普通频道
      addNormalChannelModel() {
        this.addNormalChannelVisible = true;
      },
      addNormalChannel() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/news/channel/add",
          type: "post",
          data: {
            channelName: self.addForm.channelName
          },
          success: function (data) {
            if (data.code == 0) {
              self.getNormalChannelList();
              self.addNormalChannelVisible = false;
              self.$message({
                type: "success",
                message: "新增成功",
                showClose: "true",
              })
            }
          },
          error: function (err) {
          }
        })
      },
      //新增地方频道
      addLocalChannelModel() {
        this.addLocalChannelVisible = true;
      },
      addLocalChannel() {
        var self = this;
        var channelName;
        if(self.addLocalChannelForm.town == "") {
          self.cities.map(function (item) {
            if(item.areaNo == self.addLocalChannelForm.city) {
              channelName = item.areaName;
            }
          })
        }else {
          self.towns.map(function (item) {
            if(item.areaNo == self.addLocalChannelForm.town) {
              channelName = item.areaName;
            }
          })
        }
        $.ajax({
          url: self.apiHost + "/news/channel/add",
          type: "post",
          data: {
            type: 1,
            channelName: channelName
          },
          success: function (data) {
            if (data.code == 0) {
              self.getNormalChannelList();
              self.addLocalChannelVisible = false;
              self.$message({
                type: "success",
                message: "新增成功",
                showClose: "true",
              })
            }
          },
          error: function (err) {
          }
        })
      },
      //修改频道
      openUpdateModel(id, name) {
        this.updateForm.channelName = name;
        this.updateVisible = true;
        this.updateId = id;
      },
      update() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/news/channel/update",
          type: "post",
          data: {
            userId: self.userId,
            id: self.updateId,
            channelName: self.updateForm.channelName
          },
          success: function (data) {
            if (data.code == 0) {
              self.getNormalChannelList();
              self.updateVisible = false;
              self.$message({
                type: "success",
                message: "修改成功",
                showClose: "true",
              })
            }
          },
          error: function (err) {
          }
        })
      },
      //修改频道状态
      updateStatus(id, code) {
        var self = this;
        var status = code == 0 ? 1 : 0;
        self.$confirm('此操作将修改该条数据状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $.ajax({
            url: self.apiHost + "/news/channel/update_status",
            type: "post",
            data: {
              userId: self.userId,
              id: id,
              status: status
            },
            success: function (data) {
              if (data.code == 0) {
                self.getNormalChannelList();
                self.$message({
                  type: 'success',
                  message: '修改成功!',
                  showClose: "true",
                });
              }
            },
            error: function (err) {
              console.log("请求错误，修改失败")
            }
          })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消修改',
            showClose: "true",
          });
        });
      },
      //删除普通频道
      remove(id) {
        var self = this;
        self.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $.ajax({
            url: self.apiHost + "/news/channel/del",
            type: "post",
            data: {
              userId: self.userId,
              id: id,
            },
            success: function (data) {
              if (data.code == 0) {
                self.getNormalChannelList();
                self.$message({
                  type: 'success',
                  message: '删除成功!',
                  showClose: "true",
                });
              }
            },
            error: function (err) {
              console.log("请求错误，删除失败")
            }
          })
        }).catch(() => {
          self.$message({
            type: 'info',
            message: '已取消删除',
            showClose: "true",
          });
        });
      },
      //获取城市列表
      getCities() {
        var self = this;
        $.ajax({
          url: self.apiHost + "/news/channel/get_city",
          type: "post",
          data: {},
          success: function (data) {
            if (data.code == 0) {
              self.cities = data.data;
              if (data.data.length > 0) {
                self.city = data.data[0].areaNo
                self.getTowns(data.data[0].areaNo)
              }
            }
          },
          error: function (err) {
          }
        })
      },
      cityChange(val) {
        this.getTowns(val)
      },
      //获取区列表
      getTowns(townCode) {
        var self = this;
        $.ajax({
          url: self.apiHost + "/news/channel/get_parentno",
          type: "post",
          data: {
            parentNo: townCode
          },
          success: function (data) {
            if (data.code == 0) {
              self.towns = data.data;
              if (data.data.length > 0) {
                self.town = data.data[0].areaNo;
              }
            }
          },
          error: function (err) {
          }
        })
      },
    }
  }
</script>

<style lang="less">
  #news-channel {
    .news-channel-main {
      .top {
        padding: 10px 0;
        border-bottom: 1px solid #ddd;
        .demo-form-inline {
          float: right;
          .el-form-item {
            margin-bottom: 0;
          }
        }
        .btn {
          float: left;
          margin-top: 4px;
        }
      }
      .table-list {
        border-bottom: 1px solid #ddd;
        .btn-text {
          color: #0784ea;
          cursor: pointer;
        }
      }
    }
  }
</style>
