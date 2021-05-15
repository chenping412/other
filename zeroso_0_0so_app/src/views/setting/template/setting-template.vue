<template>
    <div class="flex-box-column">
        <div class="container-control flex-item">
            <div class="control-bread">
                <el-breadcrumb>
                    <el-breadcrumb-item>设置 / 模板设置</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </div>
        <div class="container-content flex-item-scroll">
            <el-card>
                <el-tabs type="card" v-model="tabIndex" @tab-click="tabClick">
                    <el-tab-pane label="邮件模板" name="emailList"></el-tab-pane>
                </el-tabs>

                <TemplateEmailList v-if="tabIndex==='emailList'"> </TemplateEmailList>
                <TemplateEmailEdit v-if="tabIndex==='emailEdit'"> </TemplateEmailEdit>


            </el-card>
        </div>
    </div>
</template>

<script>
    import TemplateEmailList from './component/template-email-list'
    import TemplateEmailEdit from './component/template-email-edit'
    export default {
        components:{TemplateEmailList,TemplateEmailEdit},
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
