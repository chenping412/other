let permissionConfig = {
    //管理员权限
    'AdminNeed': {
        menu: ['zero-menu-pending',
            'zero-menu-mail',
            'zero-menu-order',
            'zero-menu-partner',
            'zero-menu-brand',
            'zero-menu-import',
            'zero-menu-logistics',
            'zero-menu-accounting',
            'zero-menu-setting',
            'zero-menu-product',
            'zero-menu-operation'
        ],
        buttons: [
            {permissionId: 'zero-button-partner-adminEdit', show: true},
            {permissionId: 'zero-button-partner-changePassword', show: true},
            {permissionId: 'zero-button-logistics-boxMoveTo', show: true},
            {permissionId: 'zero-button-order-deleteMargeOrder', show: true},
            {permissionId: 'zero-button-order-revert', show: true},
            {permissionId: 'zero-button-accounting-openPeriod', show: true},
        ],
        fields: []
    },
    'LoginNeed': {
        menu: ['zero-menu-pending',
            'zero-menu-mail',
            'zero-menu-order',
            'zero-menu-partner',
            'zero-menu-brand',
            'zero-menu-import',
            'zero-menu-logistics',
            'zero-menu-product'
        ],
        buttons: [],
        fields: [
            {permissionId: 'zero-field-product-productInfo', show: true},

        ]
    },
    //消息权限
    'MessageReadNeed': {
        menu: ['zero-menu-pending', 'zero-menu-mail'],
        buttons: [],
        fields: []
    },
    //财务权限
    'AccountingNeed': {
        menu: ['zero-menu-pending', 'zero-menu-accounting'],
        buttons: [
            {permissionId: 'zero-button-accounting-adminAction', show: true},
            {permissionId: 'zero-button-accounting-Action', show: true},
        ],
        fields: []
    },
    //产品管理权限
    'ProductManageNeed': {
        menu: ['zero-menu-product'],
        buttons: [],
        fields: [
            {permissionId: 'zero-field-orderLine-weightEdit', disable: false},
            {permissionId: 'zero-field-product-productInfo', disable: false, show: true},
        ],
    },
    //修改记账金额权限
    'BookMoneyAdminNeed': {
        menu: ['zero-menu-pending',
            'zero-menu-mail',
            'zero-menu-accounting',
            'zero-menu-order',
            'zero-menu-partner',
            'zero-menu-brand',
            'zero-menu-import',
            'zero-menu-logistics',
            'zero-menu-accounting',
            'zero-menu-product'],
        buttons: [
            {permissionId: 'zero-button-accounting-editBookMoney', show: true},

        ],
        fields: [],
    },
    //强制完成订单权限
    'ForceDoneOrderNodeNeed': {
        menu: [],
        buttons: [
            {permissionId: 'zero-button-order-stateDone', disable: false},
        ],
        fields: [],
    },
    //'编辑联系人所属银行帐号'
    'BankAccountAccountUserEditNeed': {
        menu: [],
        buttons: [
            {permissionId: 'zero-button-partner-bankAccount', show: true},
        ],
        fields: [],
    },
    //'手动创建，编辑，删除付款'
    'ManualBankStatementRelationNeed': {
        menu: [],
        buttons: [],
        fields: [],
    },
    'LogisticGroupNeed': {
        menu: [],
        buttons: [{permissionId: 'zero-button-customType', show: true}],
        fields: [],
    },
    //订单发送模板邮件权限
    'OrderSendSupplierEmailNeed': {
        buttons: [{permissionId: 'zero-button-order-mailTemplate', show: true}],
    },
    //出库单删除附件权限
    'FileDeletedInOutgoingTransferNeed': {
        buttons: [{permissionId: 'zero-button-logistics-outgoingDeleteFile', show: true}],
    },
    //库存管理
    'StockBoxManageNeed': {
        buttons: [
            {permissionId: 'zero-button-stock-deleteBox', show: true},
            {permissionId: 'zero-button-stock-editBox', show: true},
            {permissionId: 'zero-button-stock-createBox', show: true}
        ],
    },

    'ZerosoAdminAccountUserManagerNeed': {
        menu: [],
        buttons: [{permissionId: 'zero-button-partner-superAdmin', show: true}],
        fields: [{permissionId: 'zero-field-partner-user-id', show: true}, {permissionId: 'zero-field-partner-user-position', show: false}],
    },

    'ZerosoAdBrandRelationManagerNeed': {
        fields: [{permissionId: 'zero-field-partner-user-photo', show: true}]
    }

};


let menuList={};
let buttonList={};
let fieldList={};
for(let perKey in permissionConfig){
    if(permissionConfig[perKey].menu && permissionConfig[perKey].menu.length>0){
        permissionConfig[perKey].menu.forEach((item)=>{
            menuList[item] = true;
        })
    }
    if(permissionConfig[perKey].buttons && permissionConfig[perKey].buttons.length>0){
        permissionConfig[perKey].buttons.forEach((item)=>{
            buttonList[item.permissionId] = item;
        })
    }
    if(permissionConfig[perKey].fields && permissionConfig[perKey].fields.length>0){
        permissionConfig[perKey].fields.forEach((item)=>{
            fieldList[item.permissionId] = item;
        })
    }
}

export default {
    permissionWhiteList:{
        menuList,
        buttonList,
        fieldList,
    }
}