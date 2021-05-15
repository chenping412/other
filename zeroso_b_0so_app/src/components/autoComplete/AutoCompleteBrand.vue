<template>
    <el-autocomplete
            popper-class="auto-complete-brand"
            v-model="inputValue"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect"
            @clear="handleClear"
            @input="handleInput"
            @blur="handleBlur"
            value-key="name"
            :trigger-on-focus="false"
            placeholder="品牌关键词">

        <template slot-scope="scope">
            <span class="col">{{scope.item.name}}</span>
            <span class="col col2">{{scope.item.country | country}}</span>
        </template>

    </el-autocomplete>
</template>

<script>
    export default {
        props: ['brandId', 'brandName', 'brand'],
        data() {
            return {
                inputValue: '',

                selectLoading: false,
                selectOption: [],
            }
        },
        watch: {
            brandName() {
                this.init()
            }
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                this.inputValue = this.brandName;
            },
            querySearchAsync(query, callback) {
                let self = this;
                if (/[\u4E00-\u9FA5\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF]+/g.test(query)) {
                    self.selectOption = [];
                    callback(self.selectOption);
                    self.$message({
                        showClose: true,
                        message: '请输入品牌名原文，不支持中文品牌名！',
                        type: 'warning'
                    });
                    self.inputValue = null;
                    self.handleClear();
                    return
                }
                self.$http({
                    url: self.$api.product_brands_search,
                    type: 'GET',
                    data: {
                        brand_name: query || null
                    },
                    success: function (data) {
                        if (data.msg && data.msg.items && data.msg.items.length > 0) {
                            self.selectOption = data.msg.items;
                        } else {
                            self.selectOption = [];
                        }
                        callback(self.selectOption);
                    }, error() {
                        self.selectOption = [];
                        callback(self.selectOption);
                    }
                });
            },
            handleSelect(item) {
                if (this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.$emit('update:brandId', item.id);
                    this.$emit('update:brandName', item.name);
                    this.$emit('update:brand', item);
                    this.$emit('select', item);
                }, 100);
            },
            handleClear() {
                this.$emit('update:brandId', null);
                this.$emit('update:brandName', null);
                this.$emit('update:brand', {});
                this.$emit('select', {});
            },
            handleInput() {
                this.$emit('update:brandId', null);
                this.$emit('update:brandName', this.inputValue);
                this.$emit('update:brand', {
                    name: this.inputValue
                });
                this.$emit('select', {
                    name: this.inputValue
                });
            },
            handleBlur() {
                if (!this.brandId && this.inputValue) {
                    this.selectOption.forEach((item) => {
                        if (item.name.replace(/ /g,'') === this.inputValue.replace(/ /g,'')) {
                            this.handleSelect(item)
                        }
                    })
                }
            },
        },
    }
</script>

<style lang="scss">
    .auto-complete-brand {
        width: auto !important;
        min-width: 200px;

        .el-autocomplete-suggestion__list li {
            white-space: nowrap;
            line-height: 0;

            .col {
                display: inline-block;
                min-width: 190px;
                margin-right: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 36px;
            }

            .col2 {
                min-width: 100px;
            }
        }
    }
</style>