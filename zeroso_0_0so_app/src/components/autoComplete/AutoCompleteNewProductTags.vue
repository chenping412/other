<template>
    <el-autocomplete
            v-model="inputValue"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelect"
            @clear="handleClear"
            @input="handleInput"
            @blur="handleBlur"
            value-key="name"
            :size="size"
            :maxlength="maxlength"
            :trigger-on-focus="false"
            placeholder="标签名称">
    </el-autocomplete>
</template>

<script>
    export default {
        props: ['tagId', 'tagName', 'tag','size','maxlength'],
        data() {
            return {
                inputValue: '',

                selectLoading: false,
                selectOption: [],
            }
        },
        watch: {
            tagName() {
                this.init()
            }
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                this.inputValue = this.tagName;
            },
            querySearchAsync(query, callback) {
                let self = this;
                self.$http({
                    url: self.$api.new_product_basic_product_label_base_q,
                    type: 'GET',
                    data: {
                        name: query || null
                    },
                    success: function (data) {
                        if (data.msg && data.msg) {
                            self.selectOption = data.msg;
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
                    this.$emit('update:tagId', item.id);
                    this.$emit('update:tagName', item.name);
                    this.$emit('update:tag', item);
                    this.$emit('select', item);
                }, 100);
            },
            handleClear() {
                this.$emit('update:tagId', null);
                this.$emit('update:tagName', null);
                this.$emit('update:tag', {});
                this.$emit('select', {});
            },
            handleInput() {
                this.$emit('update:tagId', null);
                this.$emit('update:tagName', this.inputValue);
                this.$emit('update:tag', {
                    name: this.inputValue
                });
                this.$emit('select', {
                    name: this.inputValue
                });
            },
            handleBlur() {
                if (!this.tagId && this.inputValue) {
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
   
</style>