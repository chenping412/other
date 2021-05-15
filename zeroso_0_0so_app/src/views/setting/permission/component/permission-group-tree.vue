<template>
    <div v-loading="loading">
        <div class="permission-group-tree-item" v-for="item in treeData" :key="item.id">
            <div class="group-this">
                <div class="tree-button">
                    <span @click="clickEditGroup(item)">{{item.name}}</span>

                    <i class="add-button el-icon-circle-plus-outline cursor-pointer" @click="clickAddGroup(item)"></i>
                    <i class="delete-button el-icon-remove-outline cursor-pointer" v-if="item.id" @click="clickDeleteGroup(item)"></i>
                </div>
                <div class="group-user" v-if="item.account_users">
                    <span v-for="user in item.account_users" :key="user.id">{{user.name}}</span>
                </div>
            </div>

            <PermissionGroupTree
                    v-if="item.sub_groups && item.sub_groups.length>0"
                    :treeData="item.sub_groups"
                    @update="$emit('update')">
            </PermissionGroupTree>

        </div>
    </div>
</template>

<script>
    import PermissionGroupTree from './permission-group-tree'
    export default {
        name:'PermissionGroupTree',
        props:['treeData'],
        components: {PermissionGroupTree},
        data() {
            return {
                loading: false,
            }
        },
        methods: {
            clickEditGroup(item) {
                if(!item.id) {
                    return
                }
                this.$router.push({
                    path:'/setting/permission/groupEdit',
                    query:{
                        id:item.id,
                        parentId:item.parent_permission_group_id
                    }
                })
            },
            clickAddGroup(item) {
                this.$router.push({
                    path:'/setting/permission/groupEdit',
                    query:{
                        parentId:item.id
                    }
                })
            },
            clickDeleteGroup(item) {
                let self=this;
                if((item.account_users && item.account_users.length>0) || (item.sub_groups && item.sub_groups.length>0)){
                    self.$message({
                        showClose: true,
                        message: '该组已存在子组或存在用户，不可删除！',
                        type: 'error'
                    });
                    return
                }
                self.loading = true;
                self.$http({
                    url: self.$api.partner_v2_self_permission_group + '/' + item.id,
                    type: 'DELETE',
                    success: function () {
                        self.loading = false;
                        self.$message({
                            showClose: true,
                            message: '删除成功！',
                            type: 'success'
                        });
                        self.$emit('update');
                    }
                });
            },
        }
    }
</script>

<style lang="scss">
    @import "src/assets/css/config";
    .permission-group-tree-item {
        padding: 8px 0;
        margin-left: 55px;
        border-left: 1px solid #999999;
        .group-this{
            display: flex;
            .tree-button{
                flex-shrink:0;
                position: relative;
                margin-left: 25px;
                span{
                    border: 1px solid #999999;
                    font-weight: bolder;
                    display: block;
                    padding: 7px 20px;
                    height: 20px;
                    min-width: 20px;
                    cursor: default;
                }
                i{
                    position: absolute;
                    top: -6px;
                    font-size: 20px;
                    border-radius: 50%;
                    background-color: #ffffff;
                    display: none;
                }
                &:hover{
                    span{
                        background-color: $color-main;
                        color: #ffffff;
                    }
                    i{
                        display: block;
                    }
                }
                .add-button{
                    left: -10px;
                }
                .delete-button{
                    right: -10px;
                }
                &:before{
                    content: '';
                    position: absolute;
                    left: -25px;
                    top: 17px;
                    width: 25px;
                    border-bottom: 1px solid #999999;
                }
            }
            .group-user{
                padding: 4px 10px 4px 25px;
                span{
                    border: 1px solid $color-border;
                    display: inline-block;
                    padding: 2px 10px;
                    margin: 0 10px 5px 0;
                }
            }
        }
    }
</style>