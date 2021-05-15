<template>
    <div class="email-content">
        <iframe ref="iframe"></iframe>
    </div>
</template>

<script>
    export default {
        name: "email-detail-content",
        props:['bodyHtml'],
        data() {
            return {

            }
        },
        watch: {
            'bodyHtml'() {
                this.init()
            }
        },
        mounted() {
            this.$refs.iframe.contentDocument.head.innerHTML = '<style type="text/css">*{word-break: break-all}</style>';
            this.init();
        },
        methods: {
            init(){
                this.$nextTick(()=>{
                    this.$refs.iframe.contentDocument.body.innerHTML = this.bodyHtml
                })
            }
        }
    }
</script>

<style scoped>
.email-content iframe{
    height: 600px;
    width: 100%;
    border: 1px solid #dddddd;
    box-sizing: border-box;
}
</style>