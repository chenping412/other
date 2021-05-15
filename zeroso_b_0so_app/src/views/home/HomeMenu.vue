<template>
    <div :class="[ layoutMode =='vertical'? 'menu-bar-vertical scroll' : 'menu-bar-horizontal']">
        <el-menu
                :mode="layoutMode"
                text-color="#606266"
                active-text-color="#00b9bc"
                :collapse="isCollapse"
                :collapse-transition="false"
                :router="false"
                :default-active="pathActive">
            <template v-for="item1 in menuList">
                <el-submenu :index="item1.name" :key="item1.name" v-if="item1.show && item1.children">
                    <div class="inline-block" slot="title" @click="menuClick(item1)">
                        <span :class="item1.icon"></span>
                        <span>{{item1.name}}</span>
                        <el-badge v-if="item1.badge" :value="item1.badge"></el-badge>
                    </div>
                    <template v-for="item2 in item1.children">
                        <el-menu-item :index="item2.index || item2.path"
                                      @click="menuClick(item2,item1)"
                                      :key="item2.name"
                                      v-if="item2.show">
                            <span slot="title">
                                <span>{{item2.name}}</span>
                                <el-badge v-if="item2.badge" :value="item2.badge"></el-badge>
                            </span>
                        </el-menu-item>
                    </template>
                </el-submenu>

                <el-menu-item :key="item1.name" :index="item1.index || item1.path"
                              @click="menuClick(item1)"
                              v-if="item1.show && !item1.children">
                    <span :class="item1.icon"></span>
                    <span>{{item1.name}}</span>
                    <el-badge v-if="item1.badge" :value="item1.badge"></el-badge>
                </el-menu-item>
            </template>
        </el-menu>

        <edit-email :show.sync="editEmailShow" :emailTemplate="emailTemplate"></edit-email>
    </div>
</template>

<script>
    import MenuList from "./menuList"
    import EditEmail from "../email/editEmail";

    export default {
        components: {EditEmail},
        props: [],
        inject: ['reload'],
        data() {
            return {
                menuList: MenuList,
                pathActive: '/',


                editEmailShow: false,
                emailTemplate: {},
            }
        },
        computed: {
            userInfo() {
                return this.$store.state.userInfo
            },
            permissionsMap() {
                return this.$store.state.permissionsMap
            },
            isCollapse() {
                return this.$store.state.isCollapse
            },
            layoutMode() {
                return this.$store.state.layoutMode
            },
        },
        watch: {
            permissionsMap() {
                this.setMenuListPerm();
            },
            '$route'() {
                this.menuActive();
            }
        },
        created() {
            this.setMenuListPerm();
            this.menuActive();
        },
        methods: {
            //检测设置菜单权限
            setMenuListPerm() {
                let self = this;
                for (let i = 0; i < self.menuList.length; i++) {
                    self.menuList[i].show = false;
                    if (!self.menuList[i].permissionsCode || self.menuList[i].permissionsCode.length === 0) {
                        self.menuList[i].show = true;
                    } else {
                        for (let m = 0; m < self.menuList[i].permissionsCode.length; m++) {
                            if (self.permissionsMap[self.menuList[i].permissionsCode[m]]) {
                                self.menuList[i].show = true;
                            }
                        }
                    }

                    if (self.menuList[i].children) {
                        for (let j = 0; j < self.menuList[i].children.length; j++) {
                            self.menuList[i].children[j].show = false;
                            if (!self.menuList[i].children[j].permissionsCode || self.menuList[i].children[j].permissionsCode.length === 0) {
                                self.menuList[i].children[j].show = true;
                            } else {
                                for (let n = 0; n < self.menuList[i].children[j].permissionsCode.length; n++) {
                                    if (self.permissionsMap[self.menuList[i].children[j].permissionsCode[n]]) {
                                        self.menuList[i].children[j].show = true;
                                    }
                                }
                            }
                        }
                    }
                }
                self.menuList = JSON.parse(JSON.stringify(self.menuList));
                self.submitCallback();
            },


            //菜单位置
            menuActive: function () {
                this.pathActive = this.$route.path;
            },


            menuClick(item, parentItem) {
                if (item.action && this[item.action]) {
                    this[item.action](item, parentItem);
                }
                if (item.path) {
                    this.$router.push(item.path).catch(() => {
                        this.reload();
                    })
                }
            },
            clickWriteEmail() {
                this.emailTemplate = {
                    mail_to: [],
                    mail_cc: [],
                    mail_bcc: [],
                    message_subject: '',
                    mail_from: '',
                    updateFiles: [],
                    message_body_html: '',

                    isAdd: true,
                };
                this.editEmailShow = true;
            },
            goToSelfCompany() {
                this.$router.push({
                    path: "/partner/detail",
                    query: {
                        id: this.$store.state.currentCompany.account_company_id
                    }
                })
            },

            submitCallback() {
                let self = this;
                if (self.timer) clearTimeout(self.timer);
                self.timer = setTimeout(() => {
                    for (let i = 0; i < self.menuList.length; i++) {
                        if (self.menuList[i].show && self.menuList[i].callback) {
                            self[self.menuList[i].callback](self.menuList[i]);
                        }
                        if (self.menuList[i].children) {
                            for (let j = 0; j < self.menuList[i].children.length; j++) {
                                if (self.menuList[i].children[j].show && self.menuList[i].children[j].callback) {
                                    self[self.menuList[i].children[j].callback](self.menuList[i].children[j], self.menuList[i]);
                                }
                            }
                        }
                    }
                }, 500);
            },
            pendingTotalCallback(item) {
                if (item.children) {
                    let m = 0;
                    for (let i = 0; i < item.children.length; i++) {
                        if (item.children[i].badge) {
                            m += item.children[i].badge
                        }
                    }
                    item.badge = m;
                }
            },
            pendingEmailCallback(item, parentItem) {
                item.badge = 0;
                this.pendingEmailCallbackSubmit(item, parentItem);
                if (this.pendingEmailCallbackTimer) clearInterval(this.pendingEmailCallbackTimer);
                this.pendingEmailCallbackTimer = setInterval(() => {
                    this.pendingEmailCallbackSubmit(item, parentItem)
                }, 300000)
            },
            pendingEmailCallbackSubmit(item, parentItem) {
                let self = this;
                self.$http({
                    url: self.$api.message_mail_search_filter_v3 + '/waiting',
                    type: 'POST',
                    requestBody: true,
                    data: {
                        "box": "waiting",
                        "key": "message_mail_waiting"
                    },
                    success(data) {
                        if (data.msg) {
                            item.badge = data.msg.total;
                            self.pendingTotalCallback(parentItem);
                        }
                    }
                })
            },
            pendingMessageAction(item, parentItem) {
                this.$router.push({
                    path: '/related/message-list/waiting',
                    query: {
                        order_by: encodeURIComponent(JSON.stringify({
                            "field_name": "create_time",
                            "by": "asc"
                        })),
                        filter: encodeURIComponent(JSON.stringify([
                            ["deal", "=", "NO"],
                            ["to_user", "=", {
                                "account_user_id": this.$store.state.currentCompany.user_id,
                                "name": this.$store.state.currentCompany.name,
                                "account_company_id": this.$store.state.currentCompany.account_company_id,
                                "company_name": this.$store.state.currentCompany.company_name,
                            }],
                        ]))
                    }
                });
                this.pendingMessageCallback(item, parentItem)
            },
            pendingMessageCallback(item, parentItem) {
                item.badge = 0;
                this.pendingMessageCallbackSubmit(item, parentItem);
                if (this.pendingMessageCallbackTimer) clearInterval(this.pendingMessageCallbackTimer);
                this.pendingMessageCallbackTimer = setInterval(() => {
                    this.pendingMessageCallbackSubmit(item, parentItem)
                }, 300000)
            },
            pendingMessageCallbackSubmit(item, parentItem) {
                let self = this;
                let requestFilter = [
                    ["deal", "=", "NO"],
                    ["to_user", "=", {
                        "account_user_id": this.$store.state.currentCompany.user_id,
                        "name": this.$store.state.currentCompany.name,
                        "account_company_id": this.$store.state.currentCompany.account_company_id,
                        "company_name": this.$store.state.currentCompany.company_name,
                    }],
                ];
                if (self.$store.state.system === '0') {
                    requestFilter.push(['is_from_0', '=', true]);
                }
                self.$http({
                    url: self.$api.message_v4_message_search_filter,
                    type: 'POST',
                    requestBody: true,
                    data: {
                        "filter": requestFilter,
                        "key": "message_message_waiting"
                    },
                    success(data) {
                        if (data.msg) {
                            item.badge = data.msg.total;
                            self.pendingTotalCallback(parentItem);
                        }
                    }
                })
            },

        }
    }
</script>

<style lang="scss">
    #home {
        &.menu-collapse {
            .menu-bar-vertical {
                width: 64px;
            }
        }

        .menu-bar-vertical {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 2;
            width: 200px;
            height: 100%;
            min-height: calc(100vh - 61px);
            transition: all 0.2s;
            background-color: white;
            -webkit-box-shadow: 2px 0px 8px 0px rgba(29, 35, 41, 0.05);
            box-shadow: 2px 0px 8px 0px rgba(29, 35, 41, 0.05);

            .el-menu {
                border: none;
            }
        }

        .menu-bar-horizontal {
            z-index: 2;
            height: 60px;
            transition: all 0.2s;
            overflow: hidden;

            &:hover {
                overflow: initial;
            }

            .el-submenu__title,
            .el-menu-item {
                padding: 0 10px;
            }
        }

    }

    .el-menu, .el-menu--horizontal {
        .el-badge__content {
            vertical-align: text-bottom;
            margin-left: 3px;
            line-height: 16px;
            height: 16px;
        }
    }

    @media screen and (max-width: 1600px) {
        #home {
            .menu-bar-horizontal {
                .el-submenu__title,
                .el-menu-item {
                    padding: 0 8px;
                }
            }
        }
    }

</style>
