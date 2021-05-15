<template>
    <span
            v-show="item && item.code"
            class="mark-message-tag el-icon-star-on"
            :class="item.className">
    </span>
</template>

<script>
    export default {
        props: ['lever'],
        data() {
            return {
                item: {},
            }
        },
        watch: {
            lever() {
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.item = {};
                this.$store.state.messageTagList.forEach((item) => {
                    if (item.code === this.lever) {
                        this.item = item;
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .mark-message-tag {
        line-height: 24px;
        vertical-align: middle;
        margin: 0 3px;
        text-shadow:-1px 0 #ffffff,
        0 1px #ffffff,
        1px 0 #ffffff,
        0 -1px #ffffff;
    }
    .mark-message-tag:before{
        font-size: 24px;
    }
    .mark-message-tag-blue {
        color: #409EFF;
    }
    .mark-message-tag-yellow {
        color: #E6A23C;
    }
    .mark-message-tag-green{
        color: #67C23A;
    }
</style>