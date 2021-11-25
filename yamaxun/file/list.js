/*
页面url:  https://sellercentral.amazon.com/orders-v3/mfn/unshipped/ref=bb_myo_wos3_home?_encoding=UTF8&sort=status_desc&shipByDate=all&communicationDeliveryId=9b7a8bc1-8108-4b7b-8327-c81838075174&page=1

接口:
Request URL: https://sellercentral.amazon.com/orders-api/search?limit=15&offset=0&sort=status_desc&date-range=last-365&fulfillmentType=mfn&orderStatus=unshipped&shipByDate=all&forceOrdersTableRefreshTrigger=false
Request Method: GET
Status Code: 200

requestHeader
:authority: sellercentral.amazon.com
:method: GET
:path: /orders-api/search?limit=15&offset=0&sort=status_desc&date-range=last-365&fulfillmentType=mfn&orderStatus=unshipped&shipByDate=all&forceOrdersTableRefreshTrigger=false
:scheme: https
accept: application/json
accept-encoding: gzip, deflate, br
accept-language: zh-CN,zh;q=0.9
anti-csrftoken-a2z-request: true
content-type: application/json
cookie: session-id=132-7340847-9294925; ubid-main=131-0207542-5594450; s_pers=%20s_fid%3D2F7B27BE27FF8FBB-29EF365392E5C812%7C1763525362518%3B%20s_dl%3D1%7C1605760762519%3B%20s_ev15%3D%255B%255B%2527ELUSWP-www.amz123.com%2527%252C%25271605758962525%2527%255D%255D%7C1763525362525%3B; lc-main=en_US; sid="XxE/ZyMWEcpklkDINr9sxw==|UHX+OL8lFPJwMNJk1ODKG2SBgv7/+6xtyBX18TeWlcU="; i18n-prefs=USD; ux-tour=false; s_nr=1613805825239-New; s_vnum=2045805825240%26vn%3D1; s_dslv=1613805825241; sp-cdn="L5Z9:CN"; __Host_mlang=zh_CN; __Host-mselc=H4sIAAAAAAAAAKtWSs5MUbJSSsytyjPUS0xOzi/NK9HLBwrqORp6G7pGGvgZh5hFmgQr6SjlIqnMTS1KzkgEKcWiLhtZYQFISUhYgIu3p3eEgYtrkFItALV65tN1AAAA; csm-hit=tb:39MX6W57QCDJXHE6MF8H+s-AQ3RWYATZEWP6T9GJVJD|1637025634621&t:1637025634621&adb:adblk_no; session-id-time=2267745635l; x-main="UnJxL2GfQpOqd4@2yUgVXl9OMxKvSAVXVbP9jNAx?TnQRoLyfKDfB2isvOCvk8I8"; at-main=Atza|IwEBINi-A2jxowL7Z6v01fRMpXrXEVy3RG9InTR1hok-mplqrC42haQKePMhERfau2UVpw-3Oxk2du7vVB4ms0K-DwWyFpls1G6x4-fGFNd5mBfjMvnr8wwpwVg5Wvx4TBvNDVIy_io11mLYU8das8VzYleVwT_zhPrkXdxtxFOQxrpFFOn02iY2olTPG35adT-O4_vMezIYXe74BOt-ei5lsZYWjCEDiqglC7ti3SCJyZWdhA; sess-at-main="WfQVur9lnoL5u4zI/JXmETO8srzVJpx6kKx9asYP2RM="; sst-main=Sst1|PQHlAFCoLzg0tX_7jpyjIUAYCQBeL2W0ctwOV_KhVOHdmiKhiL1ypF3AESwe40zTzNnXckhEKR5scXkCF9Qk_bTGgxXhz6ustlzAI_x86-Am1Q9OCn8P8zQhQbwnx9NBXfsPm7XxLJhdkrL7tkD-artzVRWgKPUINsVW0pmTdUIXh0r3oJPcmMf4kDimDBvpDB0VLtWL7osfW_Gh64z-qIkKDP1G0i06QQRHukb-LiFw-38EzU87cfrEGlSLkYmYRUxT7XBxAb_4SESqMcLlggd0Cs2RxQ_-FJcSCZ1TX9PK6Ss; session-token=ZrOf5ds/1RXQ9YfoAp2VHQAnABRFsIN8JXJmmT1bz/Q/6zXRtO3S+mKrhfrfdu9VQvshr/8cW2qcaFISUwu7DGzinJE0zeHyBk9ggLDo8BD7sKqS+glMq4jbapPmtmLGH3g8d4X7w3wm+LPFOUxjVLJ69tcDrPVwn1C9cecEYLnf8MMMtQHZJ5uvfEi13vfwQf+EF0HGIsCjimXHva6BCDNbY8HwiqjTif7Utu/QT1g=
referer: https://sellercentral.amazon.com/orders-v3/mfn/unshipped?_encoding=UTF8&sort=status_desc&shipByDate=all&communicationDeliveryId=9b7a8bc1-8108-4b7b-8327-c81838075174&date-range=last-365&page=1
sec-ch-ua: "Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
sec-fetch-dest: empty
sec-fetch-mode: cors
sec-fetch-site: same-origin
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36

参数
limit: 15
offset: 0
sort: order_date_asc
date-range: last-365
fulfillmentType: mfn
orderStatus: unshipped
shipByDate: all
forceOrdersTableRefreshTrigger: false
*/


let list = {
    "appliedSearchFilters": [{"key": "date-range", "selectedValues": ["last-365"]}, {
        "key": "fulfillmentType",
        "selectedValues": ["mfn"]
    }, {"key": "limit", "selectedValues": ["15"]}, {"key": "offset", "selectedValues": ["0"]}, {
        "key": "orderStatus",
        "selectedValues": ["unshipped"]
    }, {"key": "shipByDate", "selectedValues": ["all"]}, {"key": "sort", "selectedValues": ["status_desc"]}],
    "debugInfo": null,
    "exceptions": [],
    "featureList": [],
    "offset": 0,
    "orders": [{
        "actions": ["buyShipping", "confirmShipment", "editMerchantOrderId", "manageFeedback", "manageSellerNotes", "printPackingSlip", "contactBuyer", "cancelOrder", "canViewOrderHistory"],
        "alerts": ["eudrPackageSplitting"],
        "amazonOrderId": "114-7941379-5480234",
        "awaitingVerification": false,
        "badgeList": ["CustomOrder"],
        "badgesWithTooltips": null,
        "blob": "AAAAAAAAAABtN7Svvv0uIRUonVxTxkLJ+gAAAAAAAAAaTRk/5HPG+bkO0W5bgNLZ+IdGTDF3lg1T8EKleWqMM0cAZhb/nrrgO5LXaZ6X7JRgJ+i38a5aVuJ3VfI6Jc6/EQoFZLNkNjA0wsEItaJQ7mbBOvFBuMHuPXesoqq8+VhukYWF0UYQDD6VX3pNkiJm8AXlXn3QY27LrOqZuoL5AJYVKa+1maT/GFSj4TAqN9X/eUt7nczlEFUCNwitoKbsMOABd4YJAsez2+uk2DF+QHxEEzFFO40TmQHLmGMho0ldpk5jyFwDfYCEGHQgmEu3VsupG6+KG11VNUzBKYyU3PsYY4CRtYN2RvJZJ8Gazia1PcaoXK//Wpgj",
        "cancellationDate": 1.638172799E9,
        "cancellationFees": null,
        "complexActions": {},
        "deliveryNoteMetadata": null,
        "earliestDeliveryDate": 1.6391232E9,
        "earliestShipDate": 1.6370496E9,
        "electronicInvoiceAwaitingUpload": false,
        "electronicInvoiceStatus": null,
        "fulfillmentMethod": "Ship",
        "homeMarketplaceId": "ATVPDKIKX0DER",
        "inProgressAction": null,
        "invoiceNotUploaded": false,
        "invoiceUploadMetadata": null,
        "isAccessPointOrder": false,
        "isMerchantFulfilled": true,
        "isShipmentInjection": false,
        "latestDeliveryDate": 1.640851199E9,
        "latestShipDate": 1.637222399E9,
        "maximumTransitTimeDisplayUnit": "Day",
        "orderDate": 1.636992286776E9,
        "orderFulfillmentStatus": "Unshipped",
        "orderItems": [{
            "asin": "B092DMN2TW",
            "associatedItems": [],
            "billingCountry": null,
            "conditionNote": null,
            "conditionSubtype": null,
            "conditionType": "New",
            "customerOrderItemCode": "VJtVTTcMNGGDH5fnPPdtUKp9pEgFbL9IfLAVtmU65kk+VCrwLIv25Q==",
            "extendedTitle": "KALUOLAN Custom Baseball Teams Logo Protective Cover Compatible with Airpod Case 1&2,Personalized Your Favorite Baseball Teams Logo,Black with Keychain",
            "giftMessageText": null,
            "giftWrapType": null,
            "harmonizedCode": null,
            "imageSourceSarek": false,
            "imageUrl": "https://images-na.ssl-images-amazon.com/images/I/410BeLWCCqL._SCLZZZZZZZ__SX55_.jpg",
            "isGift": false,
            "isHeavyOrBulky": false,
            "listingId": null,
            "orderItemId": "19161702420218",
            "productLink": "https://www.amazon.com/gp/product/B092DMN2TW",
            "productName": "KALUOLAN Custom Baseball Teams Logo Protective Cover Compatible with Airpod Case 1&2,Personalized Your Favorite Baseball Teams Logo,Black with Keychain",
            "quantityOrdered": 1,
            "quantityShipped": 0,
            "quantityUnShipped": 1,
            "scheduledDeliveryEndDate": null,
            "scheduledDeliveryStartDate": null,
            "scheduledDeliveryTimeZone": null,
            "sellerSku": "Pods custom",
            "signatureRecommended": false,
            "transparencyItem": false,
            "unitPrice": {"Amount": 11.99, "CurrencyCode": "USD", "EncryptedAmount": null}
        }],
        "pickupDate": null,
        "pickupReadyDate": null,
        "pluginBadges": [],
        "pluginOrderStatus": null,
        "relativeOrderDate": "14 小时 前",
        "salesChannel": "Amazon.com",
        "sellerOrderId": null,
        "shippingService": "Standard",
        "shippingServiceOption": null,
        "shippingServiceStringId": "shipping-speed-standard_3248",
        "timeZoneDetailsMap": {
            "earliestDeliveryDate": {"offset": -28800000, "shortenedTzString": "PST"},
            "earliestShipDate": {"offset": -28800000, "shortenedTzString": "PST"},
            "latestDeliveryDate": {"offset": -28800000, "shortenedTzString": "PST"},
            "latestShipDate": {"offset": -28800000, "shortenedTzString": "PST"},
            "orderDate": {"offset": -28800000, "shortenedTzString": "PST"}
        }
    }],
    "requestId": "JATRT6F0R0SR1SNTXW5J",
    "total": 1
}
