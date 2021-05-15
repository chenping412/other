<template>
    <div class="permission-group" v-loading="loading">
        <permission-group-tree :treeData="treeData" @update="getTreeData"> </permission-group-tree>
    </div>
</template>

<script>

    import PermissionGroupTree from "./permission-group-tree";
    export default {
        components: {PermissionGroupTree},
        data() {
            return {
                treeData: [],

                loading: false,

            }
        },
        created() {
            this.getTreeData();
        },
        methods: {
            getTreeData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.partner_v2_self_permission_group,
                    data: {
                        display_in_tree: true
                    },
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.treeData = [{
                                id: 0,
                                name: " ",
                                sub_groups: data.msg,
                            }];
                        }
                    }
                })
            },

        }
    }
</script>

<style lang="scss">
    .permission-group {

    }
</style>
