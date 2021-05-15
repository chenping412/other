<template>
    <div class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>设置 / 权限设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <el-card>
                <el-tabs type="card" v-model="tabIndex" @tab-click="tabClick">
                    <el-tab-pane label="部门与职务" name="group"></el-tab-pane>
                    <el-tab-pane label="用户" name="user"></el-tab-pane>
                </el-tabs>

                <PermissionGroup v-if="tabIndex==='group'"></PermissionGroup>

                <PermissionGroupEdit v-if="tabIndex==='groupEdit'"></PermissionGroupEdit>

                <PermissionUser v-if="tabIndex==='user'"></PermissionUser>


            </el-card>
        </div>
    </div>
</template>

<script>
    import PermissionGroup from './component/permission-group'
    import PermissionGroupEdit from './component/permission-group-edit'
    import PermissionUser from './component/permission-user'
    export default {
        components:{PermissionGroup,PermissionGroupEdit,PermissionUser},
        data() {
            return {
                tabIndex:this.$route.params.tabIndex,
            }
        },
        watch:{
            '$route'() {
                this.tabIndex=this.$route.params.tabIndex;
            }
        },
        methods:{
            tabClick(){
                this.$router.push(this.tabIndex);
            },
        }
    }
</script>

<style lang="scss">


</style>
