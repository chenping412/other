<template>
    <el-select
            v-model="selectValue"
            :placeholder="placeholder || '产品系列'"
            @change="selectChange"
            @clear="selectClear"
            :disabled="disabled"
            filterable
            clearable
            :loading="selectLoading">
        <el-option value="" label="全系列" v-if="showAllSeries"></el-option>
        <el-option v-for="(item,$index) in selectOption"
                   :key="$index"
                   :value="item.id"
                   :label="item.name">
        </el-option>
    </el-select>
</template>

<script>
    export default {
        props: ['brandProductSeries','brandProductSeriesId','brandUid','placeholder','disabled','showAllSeries'],
        data() {
            return {
                selectValue:'',

                selectLoading:false,
                selectOption:[],
            }
        },
        watch:{
            brandProductSeriesId(){
                this.init()
            },
            brandProductSeries(){
                this.init()
            },
            brandUid(){
                this.getOptionList()
            },
        },
        created() {
            this.init();
            this.getOptionList()
        },
        methods: {
            init(){
                if(this.brandProductSeriesId) {
                    this.selectValue = this.brandProductSeriesId;
                }else if(this.brandProductSeries && this.brandProductSeries.id) {
                    this.selectValue = this.brandProductSeries.id;
                }else {
                    this.selectValue = '';
                }
            },
            getOptionList() {
                let self = this;
                if(self.brandUid){
                    self.selectLoading=true;
                    self.$http({
                        url: self.$api.new_product_basic_product_brand + '/' + self.brandUid + '/series',
                        type: 'GET',
                        success: function (data) {
                            self.selectLoading = false;
                            if (data.msg) {
                                self.selectOption = data.msg;
                            }
                        },error(){
                            self.selectLoading = false;
                        }
                    });
                }
            },
            selectChange(val){
                this.$emit('update:brandProductSeriesId',val);
                this.selectOption.forEach((item)=>{
                    if(item.id === val){
                        this.$emit('update:brandProductSeries',item);
                        this.$emit('change',item);
                    }
                })
            },
            selectClear(){
                this.$emit('update:brandProductSeriesId',null);
                this.$emit('update:brandProductSeries',{});
                this.$emit('change',{});
            },
        },
    }
</script>
