<template>
    <el-button type="primary" plain v-if="isShow" @click="openOrder">
        <slot></slot>
    </el-button>
</template>

<script>

    export default {
        components: {},
        props: ['brand_id', 'product_id', 'exclude_order_id', 'product'],
        data() {
            return {
                isShow: false,
            }
        },
        computed: {},
        watch: {
            'brand_id'() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                if (this.brand_id && this.exclude_order_id) {
                    this.getDetailData()
                }
            },
            getDetailData() {
                let self = this;
                self.$http({
                    url: self.$api.order_order_accurate_search,
                    data: {
                        brand_id: this.brand_id,
                        product_id: this.product_id,
                        exclude_order_id: this.exclude_order_id,
                        account_company_id: this.$store.state.currentCompany.account_company_id,
                    },
                    success: function (data) {
                        if (data.err_code.length === 0 && data.msg) {
                            self.isShow = true;
                        }
                    }
                })
            },
            openOrder() {
                let query = {
                    order_by: encodeURIComponent(JSON.stringify({"field_name": "write_time", "by": "desc"})),
                };
                if (this.product_id) {
                    query.filter = encodeURIComponent(JSON.stringify([
                        ["product", "=", {
                            "id": this.product.id,
                            "product_name": this.product.product_name,
                            "product_order_no": this.product.product_order_no,
                        }]
                    ]))
                } else {
                    query.filter = encodeURIComponent(JSON.stringify([
                        ["brand", "=", {
                            "id": this.product.brand.id,
                            "name": this.product.brand.name,
                            "state": this.product.brand.state
                        }]
                    ]))
                }
                this.$router.push({
                    path: '/order/order/all/list',
                    query: query
                });
            },

        }
    }
</script>

<style lang="scss">

</style>
