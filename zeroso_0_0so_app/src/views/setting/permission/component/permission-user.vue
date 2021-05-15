<template>
    <div v-loading="loading">

        <div class="padding-bottom-10">
            <el-input style="width: 400px;" v-model="searchKeyword" clearable
                      placeholder="输入姓名或公司ID，不区分大小写，自动筛选"></el-input>
        </div>

        <el-table :data="listDataShow" border v-loading="loading" size="mini">
            <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
            <el-table-column label="姓名" prop="name" width="220px"></el-table-column>
            <el-table-column label="部门与职位">
                <template slot-scope="scope" v-if="scope.row.groups">
                    <span v-for="item in scope.row.groups" :key="item.id">{{item.name}}，</span>
                </template>
            </el-table-column>
            <el-table-column width="180px">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="clickEdit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog title="选择用户" :visible.sync="dialogShow" width="900px" :close-on-click-modal="false"
                   v-loading="loading">

            <el-form label-width="100px">
                <el-form-item label="用户">
                    {{editRow.name}}
                </el-form-item>
                <el-form-item label="部门与职位">
                    <div class="check-group-scroll">
                        <el-checkbox-group v-model="groupChecked">
                            <el-checkbox
                                    v-for="(item,$index) in groupList"
                                    :label="item.id"
                                    :key="$index">
                                {{item.name}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveDate()">确 定</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>


    </div>
</template>

<script>

    export default {
        data() {
            return {
                searchKeyword: '',

                listData: [],

                dialogShow: false,
                groupList: [],
                groupChecked: [],
                editRow:{},

                loading: false,
            }
        },
        computed: {
            listDataShow() {
                let arr = [];
                this.listData.forEach((item) => {
                    if (!this.searchKeyword || (this.searchKeyword && item.name.toLowerCase().indexOf(this.searchKeyword.toLowerCase()) > -1)) {
                        arr.push(item)
                    }
                });
                return arr
            },
        },
        created() {
            this.getListData();
            this.getGroupList();
        },
        methods: {
            getListData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_v2_self_permission_user,
                    success: function (data) {
                        self.loading = false;
                        if (data.msg && data.msg.items) {
                            self.listData = data.msg.items;
                        }
                    }
                })
            },

            getGroupList() {
                let self = this;
                self.$http({
                    url: self.$api.partner_v2_self_permission_group,
                    success: function (data) {
                        if (data.msg) {
                            self.groupList = data.msg;
                        }
                    }
                })
            },


            clickEdit(row) {
                this.editRow = row;
                let groupChecked = [];
                if (row.groups) {
                    row.groups.forEach((item) => {
                        groupChecked.push(item.id);
                    })
                }
                this.groupChecked = groupChecked;
                this.dialogShow = true;
            },


            clickSaveDate() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_v2_self_permission_user + '/' + self.editRow.id + '/group',
                    type: 'PUT',
                    requestBody: true,
                    data: {
                        group_ids: self.groupChecked,
                        userId: self.editRow.id,
                    },
                    success: function () {
                        self.loading = false;
                        self.getListData();
                        self.dialogShow = false;
                        self.$message({
                            showClose: true,
                            message: '保存成功！',
                            type: 'success'
                        });
                    }
                });
            },

        }
    }
</script>

<style lang="scss">

    .check-group-scroll {
        max-height: 600px;
        overflow-y: auto;

        .el-checkbox {
            min-width: 230px;
            margin-right: 15px;
            margin-bottom: 5px;
        }
    }
</style>
