<template>
    <div>
        <p class="button-sort" :class="{'hover':isHover}" @click="click()">
            <span>{{label}}</span>
            <i :class="by==='asc'?'el-icon-arrow-up':'el-icon-arrow-down'"> </i>
        </p>
    </div>
</template>

<script>
    export default {
        props: ['label','field_name'],
        data() {
            return {
                by:'', //降序：desc，升序：asc
                isHover:false,
            }
        },
        watch: {
            '$route'() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                this.by = '';
                this.isHover = false;
                if(this.$route.query.order_by){
                    let order_by = JSON.parse(decodeURIComponent(this.$route.query.order_by));
                    if(order_by.field_name === this.field_name){
                        this.by = order_by.by;
                        this.isHover = true;
                    }
                }
            },
            click(){
                if(this.field_name){
                    if(this.by === 'desc'){
                        this.by = 'asc';
                    }else {
                        this.by = 'desc';
                    }

                    let order_by={
                        field_name: this.field_name,
                        by: this.by
                    };

                    let query = JSON.parse(JSON.stringify(this.$route.query));
                    query.order_by = encodeURIComponent(JSON.stringify(order_by));
                    this.$router.push({
                        path: this.$route.path,
                        query: query
                    })
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/css/config";
.button-sort{
    display: inline-block;
    cursor: pointer;
    &.hover{
        color: $color-main;
    }
    i{
        font-size: 14px;
        font-weight: bolder;
        vertical-align: middle;
        margin: 0 0 0 5px;
        color: inherit;
        transition: all 0.2s;
    }
}
</style>