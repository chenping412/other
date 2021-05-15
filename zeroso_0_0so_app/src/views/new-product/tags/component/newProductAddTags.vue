<template>
    <div class="tags-list-component" v-loading="loading">
        <el-tag
                v-for="(tag,$index) in dynamicTags"
                :key="$index"
                :closable="isEdit"
                size="medium"
                @close="clickDelete(tag.id)">
            {{tag.name}}
        </el-tag>
        <div class="inline-block" v-if="isEdit">
            <AutoCompleteNewProductTags
                    style="width: 120px"
                    :tagName.sync="inputValue"
                    :maxlength="10"
                    size="mini">
            </AutoCompleteNewProductTags>
        </div>

        <el-button class="margin-left-10" type="primary" size="mini" v-if="!isEdit" @click="isEdit=true">编辑</el-button>
        <el-button class="margin-left-10" type="success" size="mini" v-if="isEdit" @click="clickAdd">添加</el-button>
        <el-button size="mini" v-if="isEdit" @click="isEdit=false">取消</el-button>
    </div>
</template>

<script>
    export default {
        props: ['queryId','type'],
        data() {
            return {
                dynamicTags: [],
                inputValue: '',
                isEdit:false,
                loading:false,
                urlMap:{
                    brand:this.$api.new_product_basic_product_brand + '/' + this.queryId + '/labels',
                    product:this.$api.new_product_catalog_product_product + '/' + this.queryId + '/labels',
                }
            }
        },
        watch:{
            queryId(){
                this.init();
            },
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                this.dynamicTags = [];
                this.isEdit=false;
                this.inputValue="";
                this.loading=false;
                if(this.queryId){
                    this.getTagsList()
                }
            },
            
            getTagsList(){
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.urlMap[self.type],
                    type: 'GET',
                    success: function (data) {
                        self.loading = false;
                        if (data.msg) {
                            self.dynamicTags = data.msg;
                        } else {
                            self.dynamicTags = [];
                        }
                    }
                })
            },
            //新增标签
            clickAdd() {
                let self = this;
                if (!self.inputValue) {
                    self.$message({
                        showClose: true,
                        message: '不能为空！',
                        type: 'error'
                    });
                    return
                }
                for(let i=0;i<self.dynamicTags.length;i++){
                    if(self.dynamicTags[i].name === self.inputValue){
                        self.$message({
                            showClose: true,
                            message: '已经添加了相同标签，不能重复添加！',
                            type: 'error'
                        });
                        return
                    }
                }
                self.loading = true;
                self.$http({
                    url: self.urlMap[self.type],
                    type: 'PUT',
                    requestBody:true,
                    data:{
                        label:self.inputValue
                    },
                    success () {
                        self.loading = false;
                        self.inputValue = "";
                        self.$message({
                            showClose: true,
                            message: '添加成功！',
                            type: 'success'
                        });
                        self.getTagsList();
                    }
                })
            },
            //删除标签
            clickDelete(id) {
                let self = this;
                self.$confirm('确定删除吗？', '提示', {
                    confirmButtonText: '确定删除',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action === 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.urlMap[self.type] + '/' + id,
                                type: 'DELETE',
                                requestBody: true,
                                success: function () {
                                    self.loading = false;
                                    self.$message({
                                        showClose: true,
                                        message: '删除成功！',
                                        type: 'success'
                                    });
                                    self.getTagsList();
                                }
                            });
                        }
                    }
                })
            },

        },
    }
</script>

<style lang="scss">

</style>