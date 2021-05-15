<template>
    <el-tag style="margin-left: 5px;" v-if="!isEuCountry" effect="dark" type="warning" size="mini">非欧盟</el-tag>
</template>

<script>

    export default {
        props: ['country'],
        data() {
            return {
                EuCountry: [
                    '奥地利',
                    '比利时',
                    '保加利亚',
                    '克罗地亚',
                    '塞浦路斯',
                    '捷克',
                    '丹麦',
                    '爱沙尼亚',
                    '芬兰',
                    '法国',
                    '德国',
                    '希腊',
                    '匈牙利',
                    '爱尔兰',
                    '意大利',
                    '拉脱维亚',
                    '立陶宛',
                    '卢森堡',
                    '马耳他',
                    '荷兰',
                    '波兰',
                    '葡萄牙',
                    '罗马尼亚',
                    '斯洛伐克',
                    '斯洛文尼亚',
                    '西班牙',
                    '瑞典',
                ],

                isEuCountry:false,

            }
        },
        watch: {
            country() {
                this.init()
            }
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                let str = '';
                this.$store.state.country.forEach((item) => {
                    if (item.code2 === this.country) {
                        str = item.chinese_name;
                    }
                });
                this.isEuCountry = !!(str && this.EuCountry.indexOf(str) > -1)
            }
        },
    }
</script>

<style lang="scss" scoped>
    .brand-lever-component {
        vertical-align: middle;
        display: inline-block;

        .brand-level-tag {
            height: 24px;
            padding: 0 8px;
            line-height: 22px;
            display: inline-block;
            font-size: 12px;
            color: #00b9bc;
            border-width: 1px;
            border-style: solid;
            border-radius: 4px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            white-space: nowrap;
        }

        .brand-level-tag-black-gray {
            background: #bdc3c7 !important;
            color: #000 !important;
        }

        .brand-level-tag-blue {
            background: #3498db;
        }

        .brand-level-tag-lightblue {
            background: #0cf;
        }

        .brand-level-tag-gray {
            background: #bdc3c7;
        }

        .brand-level-tag-ligthgray {
            background: #ecf0f1;
        }

        .brand-level-tag-red {
            background: #e74c3c;
        }

        .brand-level-tag-brown {
            background: #960;
        }

        .brand-level-tag-orange {
            background: #e67e22;
        }

        .brand-level-tag-darkred {
            background: #c0392b;
        }

        .brand-level-tag-green {
            background: #093;
        }

        .brand-level-tag-lightgreen {
            background: #2ecc71;
        }

        .brand-level-tag-darkblue {
            background: #06c;
        }
    }
</style>