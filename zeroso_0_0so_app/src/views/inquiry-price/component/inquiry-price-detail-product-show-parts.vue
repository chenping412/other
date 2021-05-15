<template>
    <el-popover trigger="click" placement="left" width="600">
        <el-tag  slot="reference" size="mini" type="primary" effect="plain" class="cursor-pointer">
            有主配件，点击查看
        </el-tag>

        <table class="table inquiry-price-product-show-parts-table">
            <thead>
            <tr>
                <th style="width: 80px;"></th>
                <th>型号</th>
                <th>订货号</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,$index) in productLine.parts_list" :key="$index">
                <td>
                    <el-tag :type="productLine.main_parts_id===item.id ? 'warning' : 'info'" effect="dark">
                        {{productLine.main_parts_id===item.id ? '主件' : '配件'}}
                    </el-tag>
                </td>
                <td>
                    <router-link class="blue" :to="'/product/product/detail?id='+item.id">
                        {{item.product_name}}
                    </router-link>
                </td>
                <td>
                    <router-link class="blue" v-if="item" :to="'/product/product/detail?id='+item.id">
                        {{item.product_order_no}}
                    </router-link>
                </td>
            </tr>
            </tbody>
        </table>
    </el-popover>
</template>

<script>

    export default {
        props: ['productLine'],
        data() {
            return {

            }
        },
        watch:{

        },
        created() {

        },
        methods: {

        }
    }
</script>

<style lang="scss">
    .table{
        &.inquiry-price-product-show-parts-table{
            width: 100%;
            th,td {
                border: 1px solid #dddddd;
                padding: 5px 10px ;
            }
        }
    }
</style>
