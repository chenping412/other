<template>
    <div class="screenfull-svg" @click="click" title="全屏">
        <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" />
    </div>
</template>

<script>
    import screenfull from 'screenfull'

    export default {
        name: 'screenfull',
        data() {
            return {
                isFullscreen: false
            }
        },
        mounted() {
            this.init();
        },
        beforeDestroy() {
            this.destroy()
        },
        methods: {
            click() {
                if (screenfull.isEnabled) {
                    screenfull.toggle();
                }else {
                    this.$message({
                        showClose: true,
                        message: '浏览器不支持！',
                        type: 'error'
                    });
                }
            },
            change() {
                this.isFullscreen = screenfull.isFullscreen
            },
            init() {
                if (screenfull.isEnabled) {
                    screenfull.on('change', this.change)
                }
            },
            destroy() {
                if (screenfull.isEnabled) {
                    screenfull.off('change', this.change)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/css/config";
    .screenfull-svg {
        display: inline-block;
        cursor: pointer;
        font-size: 18px;
        line-height: 0;
        vertical-align: middle;
        margin-right: 20px;
        transition: all 0.2s;
        &:hover{
            color: $color-main;
        }
    }
</style>
