<template>
    <el-tag effect="dark"
            v-show="item && item.code"
            class="product-detail-source-tag"
            :class="item.className">
        {{item.label}}
    </el-tag>
</template>

<script>
    export default {
        props: ['source'],
        data() {
            return {
                item: {},
            }
        },
        watch: {
            source() {
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.item = {};
                this.$store.state.productDetailSource.forEach((item) => {
                    if (item.code === this.source) {
                        this.item = item;
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    .product-detail-source-tag {
        vertical-align: middle;
        margin: 0 3px;
    }

    .product-detail-source-tag-blue {
        background: #409EFF !important;
        border-color: #409EFF !important;
    }

    .product-detail-source-tag-yellow {
        background: #E6A23C !important;
        border-color: #E6A23C !important;
    }

    .product-detail-source-tag-green {
        background: #67C23A !important;
        border-color: #67C23A !important;
    }

    .product-detail-source-tag-brown {
        background: #960 !important;
        border-color: #960 !important;
    }

    .product-detail-source-tag-red {
        background: #e74c3c !important;
        border-color: #e74c3c !important;
    }
</style>