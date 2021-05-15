<template>
    <el-autocomplete
            class="auto-complete-product-component"
            popper-class="auto-complete-product"
            v-model="inputValue"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect"
            @clear="handleClear"
            @input="handleInput"
            @blur="handleBlur"
            :disabled="disabled"
            :value-key="valueKey || 'product_name'"
            :trigger-on-focus="false"
            :placeholder="valueKey==='product_order_no'?'订货号':'型号'">
        <template slot-scope="scope">
            <p :class="{'is_valid':scope.item.is_valid === 0 || scope.item.is_replaced === 1 || scope.item.is_3C === 1}">
                <span class="col col1" :title="scope.item.brand ? scope.item.brand.name : null">{{scope.item.brand ? scope.item.brand.name : ''}}</span>
                <span class="col" :title="scope.item.product_name" v-html="scope.item.product_name_boder"> </span>
                <span class="col" :title="scope.item.product_order_no"
                      v-html="scope.item.product_order_no_boder"> </span>
                <span class="col">
                    <el-tag type="warning" v-if="scope.item.is_valid !== 0 && scope.item.is_replaced !== 1 && scope.item.is_3C !== 1 && scope.item.state">
                        {{scope.item.state | productState}}
                    </el-tag>
                    <el-tag type="danger" v-if="scope.item.is_valid === 0">无效产品</el-tag>
                    <el-tag type="danger" v-if="scope.item.is_replaced === 1">被替代产品</el-tag>
                    <el-tag type="danger" v-if="scope.item.is_3C === 1">3C产品</el-tag>

                    <el-tooltip placement="top" v-if="(scope.item.is_valid === 0 || scope.item.is_replaced === 1) && scope.item.correct_product">
                        <el-tag  type="warning">{{scope.item.is_valid === 0 ? '查看正确产品' : '查看替代产品'}}</el-tag>
                        <span slot="content">
                            型号：{{scope.item.correct_product.product_name}}<br>
                            订货号：{{scope.item.correct_product.product_order_no}}
                        </span>
                    </el-tooltip>
                </span>
            </p>
        </template>
    </el-autocomplete>
</template>

<script>
    export default {
        props: ['productId', 'productName', 'productOrderNo', 'product', 'data', 'valueKey', 'notSearch','disabled'],
        data() {
            return {
                inputValue: '',

                selectOption: [],
            }
        },
        watch: {
            productName() {
                this.init()
            },
            productOrderNo() {
                this.init()
            },
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                if (this.valueKey === 'product_order_no') {
                    this.inputValue = this.productOrderNo;
                } else {
                    this.inputValue = this.productName;
                }
            },
            querySearchAsync(query, callback) {
                let self = this;
                if (self.notSearch) {
                    callback([]);
                    return
                }
                self.$http({
                    url: self.$api.product_products_search,
                    type: 'GET',
                    data: {
                        name: query || '',
                        ...self.data || {},
                    },
                    success: function (data) {
                        if (data.msg && data.msg.items) {
                            let selectOption = data.msg.items;
                            for (let i = 0; i < selectOption.length; i++) {
                                if (selectOption[i].product_name) {
                                    selectOption[i].product_name_boder = self.replaceBolder(selectOption[i].product_name, query);
                                }
                                if (selectOption[i].product_order_no) {
                                    selectOption[i].product_order_no_boder = self.replaceBolder(selectOption[i].product_order_no, query);
                                }
                            }
                            self.selectOption = selectOption
                            callback(self.selectOption);
                        }
                    }
                });
            },

            replaceBolder(text, keyWord) {
                if (!text || !keyWord) return text;
                let text2 = text.toLowerCase().replace(/^\s+|\s+$/gm, '');
                let keyWord2 = keyWord.toLowerCase().replace(/^\s+|\s+$/gm, '');
                let index = text2.indexOf(keyWord2);
                if (index > -1) {
                    let start = index;
                    let end = index + keyWord2.length;
                    return text.slice(0, start) + '<b>' + text.slice(start, end) + '</b>' + text.slice(end)
                } else {
                    return text;
                }
            },


            handleSelect(item) {
                this.$emit('update:productId', item.id);
                this.$emit('update:productName', item.product_name);
                this.$emit('update:productOrderNo', item.product_order_no);
                this.$emit('update:product', item);
                this.$emit('select', item);
            },
            handleClear() {
                this.$emit('update:productId', null);
                if (this.valueKey === 'product_order_no') {
                    this.$emit('update:productOrderNo', null);
                } else {
                    this.$emit('update:productName', null);
                }
                this.$emit('update:product', null);
                this.$emit('select', {});
            },
            handleInput() {
                this.$emit('update:productId', null);
                if (this.valueKey === 'product_order_no') {
                    this.$emit('update:productOrderNo', this.inputValue);
                } else {
                    this.$emit('update:productName', this.inputValue);
                }
                this.$emit('update:product', null);
                this.$emit('select', {});
            },
            handleBlur() {
                this.$emit('blur', this.selectOption);
            },
        },
    }
</script>

<style lang="scss">
    @import "src/assets/css/config";

    .auto-complete-product-component {
        width: 100%;
    }

    .auto-complete-product {
        width: auto !important;
        min-width: 200px;

        .el-autocomplete-suggestion__list li {
            white-space: nowrap;
            line-height: 0;

            .col {
                display: inline-block;
                width: 220px;
                margin-right: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 36px;

                b {
                    color: $color-main;
                }
            }

            .col1 {
                width: 130px;
            }

            .is_valid {
                background-color: #dddddd !important;
                color: #999999;
                cursor: not-allowed;
            }
        }
    }
</style>