<template>
    <div>
        <el-popover trigger="click" placement="left" width="600">
            <el-tag slot="reference" size="mini" type="primary" effect="plain" class="cursor-pointer">
                查看{{typeName}}
            </el-tag>

            <table class="table inquiry-quotation-product-show-parts-table">
                <thead>
                <tr>
                    <th style="width: 80px;">类型</th>
                    <th>型号</th>
                    <th>订货号</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(productItem,$index) in productList" :key="$index">
                    <td :rowspan="isRowspan ? productList.length : null" v-if="!isRowspan || $index===0">
                        {{typeName}}
                    </td>
                    <td>
                        <router-link class="blue" :to="'/product/product/detail?id='+productItem.id">
                            {{productItem.product_name}}
                        </router-link>
                    </td>
                    <td>
                        <router-link class="blue" v-if="productItem" :to="'/product/product/detail?id='+productItem.id">
                            {{productItem.product_order_no}}
                        </router-link>
                    </td>
                </tr>
                </tbody>
            </table>
        </el-popover>
    </div>
</template>

<script>

    export default {
        props: ['row', 'productList', 'isAlreadySignedContract', 'typeName', 'isRowspan'],
        data() {
            return {

            }
        },
        watch: {},
        created() {

        },
        methods: {

        }
    }
</script>

<style lang="scss">
    .table {
        &.inquiry-quotation-product-show-parts-table {
            width: 100%;

            th, td {
                border: 1px solid #dddddd;
                padding: 7px 10px;
            }
        }
    }
</style>
