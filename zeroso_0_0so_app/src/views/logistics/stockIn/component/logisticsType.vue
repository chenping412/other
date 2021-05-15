<template>
    <div class="inline-block" v-loading="loading">
        <el-radio-group v-model="custom_type" @change="customTypeChange">
            <el-radio v-for="item in typeList" :key="item.value" :label="item.value">{{item.name}}</el-radio>
        </el-radio-group>
    </div>
</template>

<script>
    export default {
        props: ['type','orderId','isOrder'],
        data() {
            return {
                custom_type:null,
                typeList: [
                    {
                        "value": "sz",
                        "name": "SZ"
                    },
                    {
                        "value": "dg",
                        "name": "DG"
                    }
                ],

                loading:false,
            }
        },
        watch:{
            type(){
              this.init();
          }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                this.custom_type = this.type;
            },
            customTypeChange(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.isOrder ? self.$api.order_order_orders + '/' + self.orderId + '/lw_custom_type_action' : self.$api.order_incoming_transfers + '/' + self.orderId + '/lw_custom_type_action',
                    type: 'PUT',
                    requestBody:true,
                    data: {
                        key: "custom_type",
                        custom_type: self.custom_type,
                        order_id: self.orderId,
                    },
                    success: function () {
                        self.loading = false;
                        self.$emit('update')
                    }
                })
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>