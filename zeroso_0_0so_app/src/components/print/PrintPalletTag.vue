<template>
    <el-button type="primary" @click="clickPrint">{{name || '打印标签'}}</el-button>
</template>

<script>
    import Mustache from 'mustache'
    export default {
        props: ['name','palletData'],
        data() {
            return {

            }
        },
        created() {
        },
        methods: {
            clickPrint(){
                let self = this;
                self.loading = true;
                self.$.ajax({
                    url: './static/printTemplate/PrintPalletTag.html',
                    success: function (result) {
                        self.loading = false;
                        let boxTag = Mustache.render(result, {pallet: self.palletData});
                        let popupWin = window.open(' ', '_blank');
                        popupWin.document.write(boxTag);
                        popupWin.print();
                        popupWin.close();
                    }
                })
            },
        },
    }
</script>

<style lang="scss">

</style>