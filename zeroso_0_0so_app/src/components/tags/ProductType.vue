<template>
    <div class="inline-block">
        <template v-if="productTypeCheck.length>0">
            <el-tag type="danger" effect="dark"  v-for="(item,$index) in productTypeCheck" :key="$index">
                {{item | productType}}
            </el-tag>
        </template>
    </div>
</template>

<script>
    export default {
        props: ['type'],
        data() {
            return {
                productTypeCheck:[],
            }
        },
        watch: {
            type() {
                this.computedProductType();
            }
        },
        created() {
            this.computedProductType();
        },
        methods: {
            computedProductType(){
                this.productTypeCheck=[];
                if(this.type){
                    let typeString = this.type.toString(2);
                    let typeStringArr = typeString.split('');
                    typeStringArr.reverse();
                    for(let i=0;i<typeStringArr.length;i++){
                        if(typeStringArr[i]==='1'){
                            let str = '1';
                            for(let k=0;k<i;k++){
                                str += '0'
                            }
                            this.productTypeCheck.push(parseInt(str,2).toString()) //parseInt(str,2)表示二进制转为十进制
                        }
                    }
                }
            },
        },
    }
</script>
