/*
页面url: https://sellercentral.amazon.com/orders-v3/order/114-7941379-5480234
接口：
Request URL: https://sellercentral.amazon.com/orders-api/order/114-7941379-5480234
Request Method: GET
Status Code: 200
Remote Address: 13.249.165.34:443
Referrer Policy: strict-origin-when-cross-origin

requestHeader
:authority: sellercentral.amazon.com
:method: GET
:path: /orders-api/order/114-7941379-5480234
:scheme: https
accept: application/json
accept-encoding: gzip, deflate, br
accept-language: zh-CN,zh;q=0.9
anti-csrftoken-a2z-request: true
content-type: application/json
cookie: session-id=132-7340847-9294925; ubid-main=131-0207542-5594450; s_pers=%20s_fid%3D2F7B27BE27FF8FBB-29EF365392E5C812%7C1763525362518%3B%20s_dl%3D1%7C1605760762519%3B%20s_ev15%3D%255B%255B%2527ELUSWP-www.amz123.com%2527%252C%25271605758962525%2527%255D%255D%7C1763525362525%3B; lc-main=en_US; sid="XxE/ZyMWEcpklkDINr9sxw==|UHX+OL8lFPJwMNJk1ODKG2SBgv7/+6xtyBX18TeWlcU="; i18n-prefs=USD; ux-tour=false; s_nr=1613805825239-New; s_vnum=2045805825240%26vn%3D1; s_dslv=1613805825241; sp-cdn="L5Z9:CN"; __Host_mlang=zh_CN; __Host-mselc=H4sIAAAAAAAAAKtWSs5MUbJSSsytyjPUS0xOzi/NK9HLBwrqORp6G7pGGvgZh5hFmgQr6SjlIqnMTS1KzkgEKcWiLhtZYQFISUhYgIu3p3eEgYtrkFItALV65tN1AAAA; csm-hit=tb:39MX6W57QCDJXHE6MF8H+s-AQ3RWYATZEWP6T9GJVJD|1637025634621&t:1637025634621&adb:adblk_no; session-id-time=2267745635l; x-main="UnJxL2GfQpOqd4@2yUgVXl9OMxKvSAVXVbP9jNAx?TnQRoLyfKDfB2isvOCvk8I8"; at-main=Atza|IwEBINi-A2jxowL7Z6v01fRMpXrXEVy3RG9InTR1hok-mplqrC42haQKePMhERfau2UVpw-3Oxk2du7vVB4ms0K-DwWyFpls1G6x4-fGFNd5mBfjMvnr8wwpwVg5Wvx4TBvNDVIy_io11mLYU8das8VzYleVwT_zhPrkXdxtxFOQxrpFFOn02iY2olTPG35adT-O4_vMezIYXe74BOt-ei5lsZYWjCEDiqglC7ti3SCJyZWdhA; sess-at-main="WfQVur9lnoL5u4zI/JXmETO8srzVJpx6kKx9asYP2RM="; sst-main=Sst1|PQHlAFCoLzg0tX_7jpyjIUAYCQBeL2W0ctwOV_KhVOHdmiKhiL1ypF3AESwe40zTzNnXckhEKR5scXkCF9Qk_bTGgxXhz6ustlzAI_x86-Am1Q9OCn8P8zQhQbwnx9NBXfsPm7XxLJhdkrL7tkD-artzVRWgKPUINsVW0pmTdUIXh0r3oJPcmMf4kDimDBvpDB0VLtWL7osfW_Gh64z-qIkKDP1G0i06QQRHukb-LiFw-38EzU87cfrEGlSLkYmYRUxT7XBxAb_4SESqMcLlggd0Cs2RxQ_-FJcSCZ1TX9PK6Ss; session-token=ZrOf5ds/1RXQ9YfoAp2VHQAnABRFsIN8JXJmmT1bz/Q/6zXRtO3S+mKrhfrfdu9VQvshr/8cW2qcaFISUwu7DGzinJE0zeHyBk9ggLDo8BD7sKqS+glMq4jbapPmtmLGH3g8d4X7w3wm+LPFOUxjVLJ69tcDrPVwn1C9cecEYLnf8MMMtQHZJ5uvfEi13vfwQf+EF0HGIsCjimXHva6BCDNbY8HwiqjTif7Utu/QT1g=
referer: https://sellercentral.amazon.com/orders-v3/order/114-7941379-5480234
sec-ch-ua: "Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
sec-fetch-dest: empty
sec-fetch-mode: cors
sec-fetch-site: same-origin
user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36

无参数
*/


let obj = {
    "debugInfo": null,
    "featureList": [],
    "order": {
        "actions": ["buyShipping", "confirmShipment", "editMerchantOrderId", "manageFeedback", "manageSellerNotes", "printPackingSlip", "contactBuyer", "cancelOrder", "canViewOrderHistory"],
        "addressType": "Residential",
        "alertMessages": [],
        "alerts": ["eudrPackageSplitting"],
        "amazonInvoiced": false,
        "amazonOrderId": "114-7941379-5480234",
        "assignedShipFromLocationAddressId": "ZHMKRRQFRGF7GBXNIR5IG124Y6T3N0YE1A1K1EY0N3T6Y4SPXTQ2EIA2OXNPHHWF",
        "automatedShippingSettings": {
            "automatedCarrierName": null,
            "automatedCarrierStringId": null,
            "automatedShipFromLocationAddressId": null,
            "automatedShipMethodName": null,
            "automatedShipMethodStringId": null,
            "hasAutomatedShippingSettings": false
        },
        "awaitingVerification": false,
        "badges": ["CustomOrder"],
        "badgesWithTooltips": [{"badge": "CustomOrder", "tooltip": null}],
        "billingCountry": null,
        "billingCountryFlagUrl": null,
        "blob": "AAAAAAAAAABtN7Svvv0uIRUonVxTxkLJfQQAAAAAAABOMY/MP9+dxijHjEeKTUp/IHp2Vw/d4/2gSfuyp9LHD/MsIeJF88nFpNPRbVedxy6NH45RfxEihgJ5moEtDlD+ljfYJLgXl7+lXEE8NvhJKwH7cxw3sSVkBVPDokfWBaIAoyH8DTxp+hRf+8JHrz1lXKrS7P7gKrgTKRnXTMtpFqaALjLO8vulwognY0vglSLfBk5wEXFRolwaCKlnQkncsU9O4nz8Wq3z9pp1rsOtIQYiWzXuSJKG2FVXtvsWjBos6sPSAKna4lhuBfSYQvqt9Qa6ARI0O4x+qhUVETckzTi3TV8BSdwHoBzBMrz3byR/fvwrg9oqJy8eU6bLqsIEu1D+P/b5flQqzxKGwH/KgERNON2Tb6jXwH5vitpY+RvNJwjXCIzpS619i7dyk22UVIj5I7ALpuirZuVF47WF9W8k6+Eecaok+YC35Ds7HkwUzQBHcIbd2Itj9LqmpiSkVNvQyUVWtM+0XhxBvybfk/LeKCMTi4jTfBVnP1aKEXZa/4VH5JPi0rJLzYvCXAdJa45J9/aWvA4SN4fKTbOxfZvHMzMlE60Fxzfnx2bNs5Q5Uncak4ryM50fZz4q93Nbw9fKlgLf+mAy3I7J+PEqQBKZeJ6RZL7tWA5D4Brd3UgP4kURN376UUpuHmg9pnYeciGnihITRkyfx0Qj3vossBDfpkTLqXZ1k29axmYe1919ovVPIDDx37pZIxF71E+NdHgrOM9wV44cBjyMe7303/h9rJF2xyJVsYzOWeMLmmwDsj9iB5c2l9u8weKG6gQqkbWuNgVJXHx/hudZAGJjkUWMowLDhVVtGag2KsUxBN5gnwxIDSpGFKj4g3C4kvGo90gc5Xo7XNO1CSU5/cKT6SJtWltXGI78r4Gi8VqdD9lV/JfahpXZCsI1Hz4zfnHki7OOdxPSPQ1QDegTHzezTwJ5NTP7x6H+EMKwjVMWbsEDFW1kNruqsNUWBuaceowfsUGca/rJsiK2l69suXTRYfeVvRttbtqBSVgNMtx0MR0d5N5l3Q6S9wEMkhCJ1ZuMm9L9EzEwslLJV0HEsjCrDF0r1S3u+I+S+Ov1+JYunooR/xUZLT0UffTHv8ZB3e97vCa4R1jwyREFsZnwIx93ibLHovSeOj50lBBKxkS7D7iUqoL1culVBUNNNDchc+CC5+bndq5VSuCQZfOzOTPs5wDxV2fn2lBPAnP5IqFg2ouVApcWH655ryWghw5p+zY33sIUwmpZggUyp6QVSmWUSW+wDYBMzstNRiC6A8LsKlA1Iim1RpDvJmIY/9nak/InfWjEUv93lSajVleZKnJUZk66MCVjlV87VLuajhbnXTx4Ut6Mgh3rSttpOrvWaJRwcGQEYF+syJtCBQT5py/ph0NzRCEXzZuM1mjBDs1mdjHGT9zRW3nqZDKo0RsrfJwx9ilQwc7aF9MjCrkDRzWTr61I5SAvxRsnidF88TxU+073h0d9KY8+Z9rKjnveo2aKM7JISQvEyR9xMi5mBj6t9CvJQFJsuVeRLbbnu9o=",
        "buyerCompanyName": null,
        "buyerPONumber": null,
        "buyerProxyEmail": "jjy7lv5tzkg3h19@marketplace.amazon.com",
        "cancelOrderDetails": null,
        "cancellationDate": 1.638172799E9,
        "cancellationFees": null,
        "cod": false,
        "complexActions": {},
        "deemedResellerCategory": null,
        "deliveryNoteMetadata": null,
        "earliestDeliveryDate": 1.6391232E9,
        "earliestShipDate": 1.6370496E9,
        "euDeemedReseller": true,
        "filterShipFromLocations": true,
        "fulfillmentChannel": "Seller",
        "handoverAddressDetails": null,
        "hasSensitiveRights": true,
        "hasSystemUnknownPromiseDate": false,
        "invoiceUploadMetadata": null,
        "iossNumber": null,
        "isAccessPointOrder": false,
        "isBuybackOrder": false,
        "isIBAOrder": false,
        "labelRefundPackages": null,
        "latestDeliveryDate": 1.640851199E9,
        "latestShipDate": 1.637222399E9,
        "marketplaceTaxingSeller": null,
        "maximumTransitTimeDisplayUnit": "Day",
        "orderChannel": null,
        "orderCost": {
            "CODCollectible": null,
            "CODGrandTotal": {"Amount": 16.98, "CurrencyCode": "USD", "EncryptedAmount": null},
            "CODTotal": null,
            "CODTotalTax": null,
            "CancelableRefundTotal": null,
            "ExportChargeTotal": null,
            "ExportChargeTotalTax": null,
            "GiftWrapTotal": null,
            "GiftWrapTotalTax": null,
            "GrandTotal": {"Amount": 16.98, "CurrencyCode": "USD", "EncryptedAmount": null},
            "NetSalesProceeds": null,
            "PaymentMethodFeeTotal": null,
            "PaymentMethodFeeTotalTax": null,
            "Prepaid": null,
            "PromotionTotal": null,
            "PromotionTotalTax": null,
            "RefundAppliedTotal": null,
            "RefundPendingTotal": null,
            "RefundTotal": null,
            "ShippingTotal": {"Amount": 4.99, "CurrencyCode": "USD", "EncryptedAmount": null},
            "ShippingTotalTax": null,
            "TaxTotal": null,
            "Total": {"Amount": 11.99, "CurrencyCode": "USD", "EncryptedAmount": null},
            "TotalTax": null
        },
        "orderItems": [{
            "ASIN": "B092DMN2TW",
            "AssociatedItems": [],
            "BuyerRequestedCancel": null,
            "Condition": "New",
            "ConditionNote": null,
            "ConditionSubtype": null,
            "CustomerOrderItemCode": "VJtVTTcMNGGDH5fnPPdtUKp9pEgFbL9IfLAVtmU65kk+VCrwLIv25Q==",
            "CustomizationInfoMap": {
                "customized_url": "https://zme-caps.amazon.com/t/5bPlcAlxRNlb/pr4rNkwSwsEtoNOSohDUToqJCph-tbxOhP8FHqFluaQ/12",
                "numberOfItems": "1",
                "product_custom_page_url": "https://a.co/hgqKjg8",
                "product_customization_token": "GT_AmazonCustom_1#58368b76-776c-48ce-bcda-b3c4db4734c9"
            },
            "Gift": false,
            "GiftMessage": null,
            "GiftWrapType": null,
            "HarmonizedCode": null,
            "ImageSourceSarek": false,
            "ImageUrl": "https://images-na.ssl-images-amazon.com/images/I/410BeLWCCqL._SCLZZZZZZZ__SX55_.jpg",
            "InvoiceData": null,
            "ItemCost": {
                "COD": null,
                "CODGrandTotal": {"Amount": 16.98, "CurrencyCode": "USD", "EncryptedAmount": null},
                "CODTax": null,
                "ExportCharge": null,
                "ExportChargeTax": null,
                "GiftWrap": null,
                "GiftWrapTax": null,
                "NetSalesProceeds": null,
                "PaymentMethodFee": null,
                "PaymentMethodFeeTax": null,
                "Promotion": null,
                "PromotionTax": null,
                "Refund": null,
                "RefundApplied": null,
                "RefundPending": null,
                "Shipping": {"Amount": 4.99, "CurrencyCode": "USD", "EncryptedAmount": null},
                "ShippingTax": null,
                "Subtotal": {"Amount": 11.99, "CurrencyCode": "USD", "EncryptedAmount": null},
                "SubtotalTax": null,
                "Tax": null,
                "Total": {"Amount": 16.98, "CurrencyCode": "USD", "EncryptedAmount": null},
                "UnitPrice": {"Amount": 11.99, "CurrencyCode": "USD", "EncryptedAmount": null},
                "UnitPriceExclTax": null
            },
            "ItemCustomizations": {
                "CustomId": null,
                "CustomPageLabel": "定制信息",
                "CustomPageUrl": "https://sellercentral.amazon.com/gestalt/fulfillment/index.html?orderId=114-7941379-5480234&orderItemId=49431188394281&marketplaceId=ATVPDKIKX0DER",
                "EncodeOnDisplay": true,
                "HeaderLabelId": "自定义：",
                "ModificationGroups": [{
                    "Modifications": [{
                        "Name": "M-L-B Teams logo",
                        "NameId": null,
                        "Properties": {},
                        "RenderType": "string",
                        "Scope": ["ALL"],
                        "Value": "St. Louis Cardinals"
                    }],
                    "Name": "Select your favorite team from the drop-down box",
                    "NameId": null,
                    "PreviewImageUrls": []
                }],
                "ReplacementThumbnailImageUrl": null,
                "ReplacementTitle": null
            },
            "ItemHeight": null,
            "ItemLength": null,
            "ItemPointsSummary": {"PointsGranted": null, "Reversals": null},
            "ItemStatus": {
                "CancelStatus": "None",
                "InvoiceNotSent": false,
                "InvoiceSent": false,
                "ItemStatus": "Unshipped"
            },
            "ItemWeight": null,
            "ItemWidth": null,
            "LegacyListingId": null,
            "OrderItemId": "19161702420218",
            "PriceDesignation": null,
            "ProductCustomizations": null,
            "ProductLink": "https://www.amazon.com/gp/product/B092DMN2TW",
            "QuantityCanceled": 0,
            "QuantityOrdered": 1,
            "QuantityShipped": 0,
            "QuantityUnshipped": 1,
            "SellerSKU": "Pods custom",
            "ShipmentIdLists": null,
            "SignatureRecommended": false,
            "Title": "KALUOLAN Custom Baseball Teams Logo Protective Cover Compatible with Airpod Case 1&2,Personalized Your Favorite Baseball Teams Logo,Black with Keychain",
            "heavyOrBulky": false,
            "transparencyItem": false
        }],
        "orderMarketplaceId": "ATVPDKIKX0DER",
        "orderPointsSummary": {"PointsGranted": null, "Reversals": {"PointsReturned": null}},
        "orderStatus": {
            "AtRiskOfCancellation": false,
            "InvoiceNotSent": false,
            "InvoiceNotUploaded": false,
            "InvoiceSent": false,
            "Late": false,
            "OrderStatus": "Unshipped",
            "RefundApplied": false,
            "RefundPending": false
        },
        "orderType": null,
        "packages": null,
        "paymentMethodDetails": ["Standard"],
        "pluginActions": {
            "requestAReview": {
                "displayText": "请求评论",
                "isAvailable": false,
                "properties": {},
                "reason": "ReasonNotShippedOrder",
                "url": "/messaging/reviews?orderId=114-7941379-5480234&marketplaceId=ATVPDKIKX0DER"
            }
        },
        "pluginAlertMessages": [],
        "pluginBadges": [],
        "pluginOrderStatus": null,
        "pluginValuePairs": [],
        "possibleCancelReasons": ["NoInventory", "BuyerCanceled", "GeneralAdjustment", "ShippingAddressUndeliverable", "CustomerExchange", "PricingError"],
        "promiseResponseDueDate": null,
        "purchaseDate": 1.636992286776E9,
        "replacedOrderId": null,
        "rootMarketplaceId": "ATVPDKIKX0DER",
        "salesChannel": "Amazon.com",
        "salesChannelFlagUrl": "https://images-na.ssl-images-amazon.com/images/G/01/rainier/nav/USAmazon._CB485934361_.png",
        "scheduledDeliveryEndDateUtc": null,
        "scheduledDeliveryStartDateUtc": null,
        "scheduledDeliveryTimeZone": null,
        "sellerNotes": null,
        "sellerOrderId": null,
        "shippingFromCountry": "CN",
        "shippingService": "Standard",
        "shippingServiceOption": null,
        "shouldDisplayInFBA": false,
        "shouldEnableTradewindUX": false,
        "showRecalculatingProceedsAlert": false,
        "showShipFromAddressChangeWarning": true,
        "showVATNotFinalWarning": false,
        "taxCollectionModel": null,
        "taxLabelStrings": {
            "IncludedTax": "含消费税",
            "Tax": "税务",
            "TaxExclusive": "（不含增值税）",
            "TaxInclusive": "（含增值税）",
            "TaxTotal": "税费总计"
        },
        "taxResponsiblePartyName": null,
        "timeZoneDetailsMap": {
            "cancellationDate": {"offset": -28800000, "shortenedTzString": "PST"},
            "earliestDeliveryDate": {"offset": -28800000, "shortenedTzString": "PST"},
            "earliestShipDate": {"offset": -28800000, "shortenedTzString": "PST"},
            "latestDeliveryDate": {"offset": -28800000, "shortenedTzString": "PST"},
            "latestShipDate": {"offset": -28800000, "shortenedTzString": "PST"},
            "purchaseDate": {"offset": -28800000, "shortenedTzString": "PST"}
        },
        "verifiedBusinessBuyer": false
    }, "protips": [], "requestId": "8XNKTRM3ARHR82W14XKF", "responseCodes": []
}
