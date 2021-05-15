<template>
    <el-button size="mini" @click="clickPrint">{{name || '打印标签'}}</el-button>
</template>

<script>
    import Mustache from 'mustache'
    export default {
        props: ['name','boxData'],
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
                    url: './static/printTemplate/PrintBoxTag.html',
                    success: function (result) {
                        self.loading = false;
                        let boxData = JSON.parse(JSON.stringify(self.boxData))
                        for(let i=0;i<boxData.box_lines.length;i++){
                            boxData.box_lines[i].index = i + 1
                        }
                        let boxTag = Mustache.render(result, {box: boxData});
                        let popupWin = window.open('', '_blank');
                        popupWin.document.write(boxTag);
                        let qrcodeElement = popupWin.document.getElementById('qrcode');
                        // eslint-disable-next-line no-undef
                        new QRCode(qrcodeElement, {
                            text: "https://www.0so.com",
                            width: 120,
                            height: 120,
                            colorDark: "#000000",
                            colorLight: "#ffffff",
                            // eslint-disable-next-line no-undef
                            correctLevel: QRCode.CorrectLevel.H
                        });
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