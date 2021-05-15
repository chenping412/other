<template>
    <div class="header">
        <div class="header-left">
            <div class="logo">
                <router-link to="/home">
                    <img v-show="!isCollapse" src="../../assets/images/zeroso_logo.png" alt=""/>
                    <span v-show="isCollapse" style="color:rgba(0,0,0,0.85)">0so</span>
                </router-link>
            </div>
            <!--      <div class="control">-->
            <!--        <el-button type="text" class="collapse-btn" icon="el-icon-view" @click="clickLayoutModeChange()"/>-->
            <!--        <el-button type="text" class="collapse-btn" :icon="isCollapse ? 'el-icon-s-unfold' :'el-icon-s-fold'" v-if="layoutMode === 'vertical'" @click="clickCollapseChange()"/>-->
            <!--      </div>-->
            <HomeMenu v-if="layoutMode === 'horizontal'"/>
        </div>

        <div class="header-right">
            <el-select
                    class="current-company"
                    v-if="$store.state.currentCompanyList.length>0"
                    v-model="selectCurrentUserId"
                    @change="selectCurrentUserIdChange">
                <el-option v-for="option in $store.state.currentCompanyList"
                           :label="option.company_name + '，' + option.name"
                           :value="option.user_id"
                           :key="option.user_id"></el-option>
            </el-select>

            <el-dropdown placement="bottom" trigger="click" style="line-height: 24px;" v-if="$store.state.system==='0' && $store.state.permissionsMap['AdminNeed']">
                <i class="el-icon-s-tools el-icon-normal"></i>
                <el-dropdown-menu slot="dropdown">
                    <router-link
                            v-for="(item,$index) in settingMenu"
                            :key="$index"
                            :to="item.path">
                        <el-dropdown-item>{{item.name}}</el-dropdown-item>
                    </router-link>
                </el-dropdown-menu>
            </el-dropdown>

            <el-dropdown class="user" placement="bottom" trigger="click">
                <div class="avatar-wrapper">
                    <i class="el-icon-user-solid"></i>
                    <span class="name">{{userInfo.nick_name}}</span>
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu class="user-dropdown" slot="dropdown">
                    <router-link class="inlineBlock" to="/user-base">
                        <el-dropdown-item>
                            <i class="el-icon-user"></i>
                            个人中心
                        </el-dropdown-item>
                    </router-link>
                    <el-dropdown-item>
                        <i class="el-icon-connection"></i>
                        <exchange-rate title="汇率查询"></exchange-rate>
                    </el-dropdown-item>

                    <el-dropdown-item v-if="$store.state.system === '0'">
                        <price-calculator :autoSave="true">
                            <i class="el-icon-receiving"></i>
                            价格计算器
                        </price-calculator>
                    </el-dropdown-item>

                    <el-dropdown-item divided>
                        <p @click="logout">
                            <i class="el-icon-switch-button"></i>
                            退出
                        </p>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <Screenfull></Screenfull>
        </div>
    </div>
</template>

<script>

    import Screenfull from "./ScreenFull";
    import HomeMenu from "./HomeMenu";
    import ExchangeRate from "../user/exchangeRate";
    import PriceCalculator from "../user/priceCalculator";

    export default {
        components: {
            PriceCalculator,
            ExchangeRate,
            HomeMenu,
            Screenfull
        },
        props:['isRouterAlive'],
        inject: ['reload'],
        data() {
            return {
                menuIndex: '1',
                isFullscreen: false,
                selectCurrentUserId: '',

                settingMenu:[
                    {
                        name: '模板设置',
                        path: '/setting/template/emailList',
                    },{
                        name: '物流设置',
                        path: '/setting/logistics',
                    },{
                        name: '订单设置',
                        path: '/setting/order',
                    },{
                        name: '零搜公司设置',
                        path: '/setting/zeroSoCompany',
                    },{
                        name: '账户设置',
                        path: '/setting/user',
                    },{
                        name: '权限设置',
                        path: '/setting/permission/group',
                    },
                ]
            }
        },
        computed: {
            userInfo() {
                return this.$store.state.userInfo
            },
            isCollapse() {
                return this.$store.state.isCollapse
            },
            layoutMode() {
                return this.$store.state.layoutMode
            },
        },
        watch: {
            '$store.state.currentCompany'() {
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.$store.state.currentCompany) {
                    this.selectCurrentUserId = this.$store.state.currentCompany.user_id;
                }
            },

            //退出
            logout() {
                let self = this;
                self.$confirm('您确认退出账号吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            //退出时，自动跳转到钉钉扫码登录页面
                            self.$utils.goToDingDingLoginPage();
                            self.$http({
                                url: self.$api.account_logout
                            })
                        }
                    }
                })
            },

            clickCollapseChange() {
                this.$store.commit('setIsCollapse', !this.isCollapse);
            },
            clickLayoutModeChange() {
                this.$store.commit('setLayoutMode', this.layoutMode === 'vertical' ? 'horizontal' : 'vertical');
                this.$store.commit('setIsCollapse', false);
            },

            selectCurrentUserIdChange() {

                for (let i = 0; i < this.$store.state.currentCompanyList.length; i++) {
                    if (this.$store.state.currentCompanyList[i].user_id === this.selectCurrentUserId) {
                        this.$store.commit('setCurrentCompany', this.$store.state.currentCompanyList[i]);
                        this.$store.dispatch('storeInit').then(()=>{
                            this.reload();
                        });
                        break
                    }
                }
            },

        }
    }
</script>

<style lang="scss">

    #home {
        &.menu-collapse {
            .header {
                .logo {
                    width: 64px;
                }
            }
        }

        .header {
            z-index: 9;
            line-height: 60px;
            height: 60px;
            background: #ffffff;
            transition: all 0.2s;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #dddddd;
            -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
            box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

            .header-left {
                display: flex;
                justify-content: flex-start;
            }

            .header-right {
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }

            .logo {
                text-align: center;
                line-height: 60px;
                color: #ffffff;
                font-size: 18px;
                font-weight: bolder;
                height: 60px;
                white-space: nowrap;
                overflow: hidden;
                border-bottom: 1px solid #dddddd;
                transition: all 0.2s;
                flex-shrink: 0;
                padding: 0 20px;

                img {
                    height: 48px;
                }
            }

            .control {
                float: left;
                padding: 0 15px;

                .collapse-btn {
                    font-size: 26px;
                    vertical-align: middle;
                }
            }

            .header-menu {
                .el-menu-item,
                .el-submenu__title {
                    /*height: 50px;*/
                    /*line-height: 50px;*/
                }

                .el-menu.el-menu--horizontal {
                    border-bottom: none;
                }
            }

            .current-company {
                margin-right: 20px;
                width: 280px;
                vertical-align: middle;
                line-height: 0;
            }

            .user {
                display: inline-block;
                line-height: 20px;
                vertical-align: middle;
                margin-right: 20px;

                .avatar-wrapper {
                    font-size: 14px;
                    white-space: nowrap;
                    i {
                        font-size: 20px;
                    }
                    .name {
                        margin-left: 10px;
                    }
                }

            }
        }
    }
    @media screen and (max-width:1600px) {
        #home .header .current-company{
            width: 220px;
        }
    }
</style>
