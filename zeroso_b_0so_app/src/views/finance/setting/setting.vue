<template>
    <div class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>财务设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <el-card>
                <el-tabs type="card" v-model="tabIndex">
                    <el-tab-pane label="基本设置" lazy name="base">
                        <SettingBase></SettingBase>
                    </el-tab-pane>
                    <el-tab-pane label="第三方接入" lazy name="third">
                        <SettingThird></SettingThird>
                    </el-tab-pane>
                    <el-tab-pane label="银行账户" lazy name="bank">
                        <SettingBank></SettingBank>
                    </el-tab-pane>
                    <el-tab-pane label="科目设置" lazy name="account">
                        <SettingAccount></SettingAccount>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>

<script>
    import SettingBase from './component/setting-base'
    import SettingThird from './component/setting-third'
    import SettingBank from "./component/setting-bank";
    import SettingAccount from "./component/setting-account";
    export default {
        components:{SettingBase,SettingThird,SettingBank,SettingAccount},
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
