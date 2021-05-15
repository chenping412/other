<template>
    <el-row :gutter="30">
        <el-col :span="9">
            <el-form-item label="查价备注：">
                <el-input type="textarea" :rows="3" v-if="!queryId || isEdit" v-model="commentMap.pricelist" @change="commentChange()"></el-input>
                <pre v-else class="form-border-bottom">{{commentMap.pricelist}}</pre>
            </el-form-item>
            <el-form-item label="询价备注：">
                <el-input type="textarea" :rows="3" v-if="!queryId || isEdit" v-model="commentMap.inquiry" @change="commentChange()"></el-input>
                <pre v-else class="form-border-bottom">{{commentMap.inquiry}}</pre>
            </el-form-item>
            <el-form-item label="报价备注：">
                <el-input type="textarea" :rows="3" v-if="!queryId || isEdit" v-model="commentMap.quote" @change="commentChange()"></el-input>
                <pre v-else class="form-border-bottom">{{commentMap.quote}}</pre>
            </el-form-item>
            <el-form-item label="催价备注：">
                <el-input type="textarea" :rows="3" v-if="!queryId || isEdit" v-model="commentMap.push" @change="commentChange()"></el-input>
                <pre v-else class="form-border-bottom">{{commentMap.push}}</pre>
            </el-form-item>
        </el-col>
        <el-col :span="9">
            <el-form-item label="促单备注：">
                <el-input type="textarea" :rows="3" v-if="!queryId || isEdit" v-model="commentMap.promote" @change="commentChange()"></el-input>
                <pre v-else class="form-border-bottom">{{commentMap.promote}}</pre>
            </el-form-item>
            <el-form-item label="下单备注：">
                <el-input type="textarea" :rows="3" v-if="!queryId || isEdit" v-model="commentMap.order" @change="commentChange()"></el-input>
                <pre v-else class="form-border-bottom">{{commentMap.order}}</pre>
            </el-form-item>
            <el-form-item label="售后备注：">
                <el-input type="textarea" :rows="3" v-if="!queryId || isEdit" v-model="commentMap.after_sale" @change="commentChange()"></el-input>
                <pre v-else class="form-border-bottom">{{commentMap.after_sale}}</pre>
            </el-form-item>
            <el-form-item label="其他备注：">
                <el-input type="textarea" :rows="3" v-if="!queryId || isEdit" v-model="commentMap.other" @change="commentChange()"></el-input>
                <pre v-else class="form-border-bottom">{{commentMap.other}}</pre>
            </el-form-item>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "brand-detail-comment",
        props:['comment','queryId','isEdit'],
        data() {
            return {
                commentMap:{},
            }
        },
        watch: {
            'comment'() {
                this.init()
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                if(this.comment){
                    try {
                        this.commentMap = this.comment
                    } catch (e) {
                        this.commentMap = {
                            pricelist:'',
                            inquiry:'',
                            quote:'',
                            push:'',
                            promote:'',
                            order:'',
                            after_sale:'',
                            other:''
                        }
                    }

                }else {
                    this.commentMap = {
                        pricelist:'',
                        inquiry:'',
                        quote:'',
                        push:'',
                        promote:'',
                        order:'',
                        after_sale:'',
                        other:''
                    }
                }
            },
            commentChange(){
                this.$emit('update:comment',this.commentMap)
            }
        }
    }
</script>

<style scoped>

</style>