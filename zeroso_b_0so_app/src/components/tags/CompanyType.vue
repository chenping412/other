<template>
    <span class="company-type-component">
        <i class="icon-vipicon" v-if="type == 'internal'"></i>
        <i class="icon-vip-b" v-if="type == 'little_v'"></i>
    </span>
</template>

<script>
    export default {
        props: ['type'],
        data() {
            return {

            }
        },

        methods: {

        },
    }
</script>

<style lang="scss">
    .company-type-component {
        vertical-align: middle;
        margin: 0 2px;
        &>i{
            width: 16px;
            height: 13px;
            display: inline-block;
            background-image: url('../../assets/images/sprite.png');
        }
        .icon-vipicon {
            background-position: 0 -220px;
        }
        .icon-vip-b {
            background-position: 0 -148px;
        }
        .icon-vip-g {
            background-position: 0 -166px;
        }
    }
</style>