<template>
    <div class="flex-box-column">
        <el-card>
            <related-message-detail-content
                    :orderName="orderName"
                    :inquiryQuotationId="inquiryQuotationId"
                    :inquiryId="inquiryId"
                    :sendBrandId="sendBrandId"
                    :module_id="module_id"
                    :module_name="module_name"
                    :subsystem="subsystem">
            </related-message-detail-content>
        </el-card>
    </div>
</template>

<script>

    import RelatedMessageDetailContent from "./component/related-message-detail-content";
    export default {
        components: {
            RelatedMessageDetailContent,
        },
        data() {
            return {
                orderName: null,
                inquiryQuotationId: null,
                inquiryId: null,
                "module_id": null,
                "module_name": null,
                "subsystem": null,

                sendBrandId: null,
            }
        },

        watch: {
            '$route'() {
                this.init()
            },
        },
        created() {
            this.init();
        },
        methods: {
            init() {
                let self = this;
                self.sendBrandId = this.$route.query.brandId ? this.$route.query.brandId * 1 : null;
                self.orderName = this.$route.query.orderName;
                if (self.orderName) {
                    self.module_id = self.orderName;
                    self.module_name = 'order';
                    self.subsystem = 'platform';
                } else {
                    self.module_id = self.$route.query.module_id;
                    self.module_name = self.$route.query.module_name;
                    self.subsystem = self.$route.query.subsystem;
                    self.inquiryQuotationId = self.$route.query.inquiryQuotationId;
                    self.inquiryId = self.$route.query.inquiryId;
                }
            },

        },
    }
</script>

