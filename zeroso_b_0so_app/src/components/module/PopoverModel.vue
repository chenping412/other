<template>
    <div class="popover">
        <slot name="reference"></slot>
        <div style="position: relative;">
            <el-card class="popover-model">
                <slot></slot>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PopoverModel"
    }
</script>

<style lang="scss" scoped>
    .popover {
        display: inline-block;
        vertical-align: middle;
        .popover-model {
            display: none;
            position: absolute;
            left: 50%;
            top: 0;
            z-index: 999;
            transform: translateX(-50%);
        }
        &:hover .popover-model {
            display: block;
        }
    }
</style>