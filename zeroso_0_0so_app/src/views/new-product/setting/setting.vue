<template>
    <div class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>产品中心设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <el-card>
                <el-tabs type="card" v-model="tabIndex">
                    <el-tab-pane label="扩展字段设置" lazy name="additional-key">
                        <SettingAdditionalKey></SettingAdditionalKey>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>

<script>
    import SettingAdditionalKey from "./component/setting-additional-key";
    export default {
        components:{SettingAdditionalKey},
        data() {
            return {
                tabIndex:this.$route.params.tabIndex,
            }
        },
        watch:{
            tabIndex(val){
                this.$router.push(val);
            },
            '$route'() {
                this.tabIndex=this.$route.params.tabIndex;
            }
        },
    }
</script>

<style lang="scss">


</style>
