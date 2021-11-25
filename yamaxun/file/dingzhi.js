/*
页面url:  https://sellercentral.amazon.com/gestalt/fulfillment/index.html?orderId=114-7941379-5480234&orderItemId=49431188394281&marketplaceId=ATVPDKIKX0DER
接口：
Request URL: https://sellercentral.amazon.com/gestalt/ajax/fulfillment/init?orderId=114-7941379-5480234&orderItemId=49431188394281&marketplaceId=ATVPDKIKX0DER
Request Method: GET
Status Code: 200
Remote Address: 13.249.165.34:443
Referrer Policy: strict-origin-when-cross-origin

requestHeader
:authority: sellercentral.amazon.com
:method: GET
:path: /gestalt/ajax/fulfillment/init?orderId=114-7941379-5480234&orderItemId=49431188394281&marketplaceId=ATVPDKIKX0DER
:scheme: https
accept: *
accept-encoding: gzip, deflate, br
accept-language: zh-CN,zh;q=0.9
cookie: session-id=132-7340847-9294925; ubid-main=131-0207542-5594450; s_pers=%20s_fid%3D2F7B27BE27FF8FBB-29EF365392E5C812%7C1763525362518%3B%20s_dl%3D1%7C1605760762519%3B%20s_ev15%3D%255B%255B%2527ELUSWP-www.amz123.com%2527%252C%25271605758962525%2527%255D%255D%7C1763525362525%3B; lc-main=en_US; sid="XxE/ZyMWEcpklkDINr9sxw==|UHX+OL8lFPJwMNJk1ODKG2SBgv7/+6xtyBX18TeWlcU="; i18n-prefs=USD; ux-tour=false; s_nr=1613805825239-New; s_vnum=2045805825240%26vn%3D1; s_dslv=1613805825241; sp-cdn="L5Z9:CN"; __Host_mlang=zh_CN; __Host-mselc=H4sIAAAAAAAAAKtWSs5MUbJSSsytyjPUS0xOzi/NK9HLBwrqORp6G7pGGvgZh5hFmgQr6SjlIqnMTS1KzkgEKcWiLhtZYQFISUhYgIu3p3eEgYtrkFItALV65tN1AAAA; csm-hit=tb:39MX6W57QCDJXHE6MF8H+s-AQ3RWYATZEWP6T9GJVJD|1637025634621&t:1637025634621&adb:adblk_no; session-id-time=2267745635l; x-main="UnJxL2GfQpOqd4@2yUgVXl9OMxKvSAVXVbP9jNAx?TnQRoLyfKDfB2isvOCvk8I8"; at-main=Atza|IwEBINi-A2jxowL7Z6v01fRMpXrXEVy3RG9InTR1hok-mplqrC42haQKePMhERfau2UVpw-3Oxk2du7vVB4ms0K-DwWyFpls1G6x4-fGFNd5mBfjMvnr8wwpwVg5Wvx4TBvNDVIy_io11mLYU8das8VzYleVwT_zhPrkXdxtxFOQxrpFFOn02iY2olTPG35adT-O4_vMezIYXe74BOt-ei5lsZYWjCEDiqglC7ti3SCJyZWdhA; sess-at-main="WfQVur9lnoL5u4zI/JXmETO8srzVJpx6kKx9asYP2RM="; sst-main=Sst1|PQHlAFCoLzg0tX_7jpyjIUAYCQBeL2W0ctwOV_KhVOHdmiKhiL1ypF3AESwe40zTzNnXckhEKR5scXkCF9Qk_bTGgxXhz6ustlzAI_x86-Am1Q9OCn8P8zQhQbwnx9NBXfsPm7XxLJhdkrL7tkD-artzVRWgKPUINsVW0pmTdUIXh0r3oJPcmMf4kDimDBvpDB0VLtWL7osfW_Gh64z-qIkKDP1G0i06QQRHukb-LiFw-38EzU87cfrEGlSLkYmYRUxT7XBxAb_4SESqMcLlggd0Cs2RxQ_-FJcSCZ1TX9PK6Ss; session-token=ZrOf5ds/1RXQ9YfoAp2VHQAnABRFsIN8JXJmmT1bz/Q/6zXRtO3S+mKrhfrfdu9VQvshr/8cW2qcaFISUwu7DGzinJE0zeHyBk9ggLDo8BD7sKqS+glMq4jbapPmtmLGH3g8d4X7w3wm+LPFOUxjVLJ69tcDrPVwn1C9cecEYLnf8MMMtQHZJ5uvfEi13vfwQf+EF0HGIsCjimXHva6BCDNbY8HwiqjTif7Utu/QT1g=
referer: https://sellercentral.amazon.com/gestalt/fulfillment/index.html?orderId=114-7941379-5480234&orderItemId=49431188394281&marketplaceId=ATVPDKIKX0DER
sec-ch-ua: "Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
sec-fetch-dest: empty
sec-fetch-mode: cors
sec-fetch-site: same-origin
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36

参数
orderId: 114-7941379-5480234
orderItemId: 49431188394281
marketplaceId: ATVPDKIKX0DER
*/


let obj = {
    "clientFulfillmentPageConfiguration": {
        "clientDefinedStringIdsMap": {
            "downloadFulfillmentMaterialsDescriptionStringId": "ac-gestalt-download-fulfillment-materials-description",
            "headerStringId": "ac-gestalt-fulfillment-page-header",
            "noBuyerInputMessageStringId": "ac-gestalt-fulfillment-no-buyer-input-message",
            "previewImageDescriptionStringId": "ac-gestalt-fulfillment-preview-cont-customization-preview-image-description"
        }
    },
    "fulfillmentData": {
        "buyerImageUrlMap": {},
        "customizationData": "{\"type\":\"PageContainerCustomization\",\"identifier\":\"5799c330-4a94-000f-84b4-402e8889d1f7\",\"children\":[{\"type\":\"PreviewContainerCustomization\",\"identifier\":\"02a4b605-3872-45dc-7627-03aedf590dbf\",\"name\":\"表面 1\",\"label\":\"Select your favorite team from the drop-down box\",\"children\":[{\"type\":\"FlatContainerCustomization\",\"identifier\":\"025a3881-524f-89d9-9a32-ace2c4bbfe9f\",\"children\":[{\"type\":\"OptionCustomization\",\"identifier\":\"11c3007c-20e2-b0a5-4c8c-dd2a5d9c4f34\",\"name\":\"选项下拉列表 1\",\"label\":\"M-L-B Teams logo\",\"optionSelection\":{\"name\":\"St. Louis Cardinals\",\"label\":\"St. Louis Cardinals\",\"additionalCost\":{\"amount\":0,\"currency\":\"USD\"},\"thumbnailImage\":{\"imageUrl\":\"https://m.media-amazon.com/images/S/gestalt-seller-images-prod-us-east-1/ATVPDKIKX0DER/A1K1EY0N3T6Y4S/bf2abb29-1c29-4923-a055-e7cd6fd4d32c.png\",\"dimension\":{\"width\":600,\"height\":600}},\"overlayImage\":{\"imageUrl\":\"https://m.media-amazon.com/images/S/gestalt-seller-images-prod-us-east-1/ATVPDKIKX0DER/A1K1EY0N3T6Y4S/9fd2b28a-6de7-4ec5-b876-9af39d6ec198.jpg\",\"dimension\":{\"width\":1000,\"height\":1000}}}}]}],\"baseImage\":{\"imageUrl\":\"https://m.media-amazon.com/images/S/gestalt-seller-images-prod-us-east-1/ATVPDKIKX0DER/A1K1EY0N3T6Y4S/2610cc6f-c69f-447b-a4d1-914bd1494644.jpg\",\"dimension\":{\"width\":800,\"height\":800}},\"snapshot\":{\"imageName\":\"347ff784-a2ff-6c57-ab83-258aa889cd3a.jpg\",\"dimension\":{\"width\":400,\"height\":400}},\"svg\":\"9554cd95-7857-bf40-cbff-bdbd114743bd.svg\"}]}",
        "customizationUrl": "https://zme-caps.amazon.com/t/5bPlcAlxRNlb/pr4rNkwSwsEtoNOSohDUToqJCph-tbxOhP8FHqFluaQ/12",
        "fontFulfillmentUrlMap": {},
        "orderId": "114-7941379-5480234",
        "orderItemId": "49431188394281",
        "pcToken": "GT_AmazonCustom_1#58368b76-776c-48ce-bcda-b3c4db4734c9",
        "previewSnapshotUrlMap": {"02a4b605-3872-45dc-7627-03aedf590dbf": "https://gestalt-buyer-snapshot-prod-us-east-1.s3.amazonaws.com/ATVPDKIKX0DER/A1K1EY0N3T6Y4S/347ff784-a2ff-6c57-ab83-258aa889cd3a.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20211116T060706Z&X-Amz-SignedHeaders=host&X-Amz-Expires=60&X-Amz-Credential=AKIA5Q6VIVENWPAADDUQ%2F20211116%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ed5434c3bbd1c5112fcf0352ee8f9334241102499a4fb5088e22c3290f415625"},
        "quantity": 1
    },
    "localizedStrings": {
        "ac-gestalt-download-fulfillment-materials-description": "下载自定义项信息",
        "ac-gestalt-fulfillment-no-buyer-input-message": "客户未为此部分提供自定义信息。",
        "ac-gestalt-fulfillment-page-header": "自定义项信息",
        "ac-gestalt-fulfillment-preview-cont-customization-preview-image-description": "包含所有自定义项的这部分的预览",
        "gestalt-back-button-text": "返回",
        "gestalt-breadcrumbs-manage-orders": "管理订单",
        "gestalt-breadcrumbs-order-details": "订单详情",
        "gestalt-download-a-zip-file-button-text": "下载压缩文件",
        "gestalt-download-zip-file-button-text": "下载压缩文件",
        "gestalt-font-customization-download-font": "下载字体",
        "gestalt-fulfillment-initialization-error-header": "出错",
        "gestalt-fulfillment-initialization-error-message": "检索您的订单时出错。 请稍后重试。 如果错误仍然存在，请联系卖家支持。",
        "gestalt-order-summary-asin-label": "ASIN：",
        "gestalt-order-summary-order-id-label": "订单编号：",
        "gestalt-order-summary-order-item-id-label": "订单商品编号：",
        "gestalt-order-summary-product-image-alt": "商品图片",
        "gestalt-order-summary-quantity-label": "数量：",
        "gestalt-preview-cont-customization-preview-image-alt": "预览图片",
        "gestalt-preview-cont-customization-preview-image-description": "包含所有自定义项的这部分的预览",
        "gestalt-preview-cont-customization-preview-image-label": "预览图片：",
        "gestalt-preview-cont-customization-view-large-link-text": "预览大号",
        "gestalt-preview-image-modal-header": "预览图片"
    },
    "productData": {
        "asin": "B092DMN2TW",
        "imageUrl": "https://m.media-amazon.com/images/I/410BeLWCCqL._SL200_.jpg",
        "marketplaceId": "ATVPDKIKX0DER",
        "merchantId": "A1K1EY0N3T6Y4S",
        "sku": null,
        "title": "KALUOLAN Custom Baseball Teams Logo Protective Cover Compatible with Airpod Case 1&2,Personalized Your Favorite Baseball Teams Logo,Black with Keychain"
    }
}
