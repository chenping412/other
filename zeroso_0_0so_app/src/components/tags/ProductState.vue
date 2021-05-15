<template>
    <el-tag v-if="item && item.code" effect="dark" :type="item.type">
        {{item.label}}
    </el-tag>
</template>

<script>
    export default {
        props: ['state'],
        data() {
            return {
                item: {},
            }
        },
        watch: {
            state() {
                this.init();
            }
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                this.item = {};
                this.$store.state.productState.forEach((item) => {
                    if (item.code === this.state) {
                        this.item = item;
                    }
                })
            }
        },
    }
</script>
