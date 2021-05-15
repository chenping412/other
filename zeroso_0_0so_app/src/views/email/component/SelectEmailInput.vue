<template>
    <div class="select-email-input"  v-clickoutside="clickoutside">
        <div class="select-email-input-input scroll" id="select-email-input-input-scroll" :class="{'focus':isFocus}">
            <div class="address"
                 v-for="(item,$index) in selectValue"
                 :class="{'error':item.isError,'mouse-over':item.isMouseOver}"
                 @mouseover="item.isMouseOver=true"
                 @mouseout="item.isMouseOver=false"
                 :key="$index">
                <div v-if="!item.isEdit">
                    <span class="address-email" @dblclick="addressDblclick(item,$index)"
                          title="双击编辑">{{item.email}}</span>
                    <i class="el-icon-circle-close cursor-pointer" @click="addressClickDelete($index)"></i>
                </div>
                <input v-else :id="'address-edit-'+$index"
                       v-model="item.email"
                       @blur="addressEditChange(item)"
                       @keyup.enter="addressEditChange(item)">
            </div>
            <div class="address-input">
                <input class="address-input-keyword" id="address-input-keyword"
                       autocomplete="off"
                       :placeholder="multipleLimit && selectValue.length >= multipleLimit ? '已达到限制数量 '+multipleLimit : placeholder"
                       v-model="query"
                       :disabled="multipleLimit && selectValue.length >= multipleLimit"
                       @focus="inputFocus"
                       @blur="inputBlur"
                       @input="inputInput"
                       @keyup="inputKeyup($event)"
                       @keydown="inputKeydown($event)">
                <div class="address-input-keyword-show">{{query}}</div>
            </div>
        </div>
        <i class="clear-all el-icon-circle-close cursor-pointer" @click="clickClearAll"></i>

        <ul class="select-email-input-list" v-show="optionListShow && selectOption.length>0">
            <li v-for="(item,$index) in selectOption" :key="$index" @click="selectChange(item)">{{item}}</li>
        </ul>
    </div>
</template>

<script>
    import clickoutside from 'element-ui/src/utils/clickoutside'
    export default {
        props: ['email', 'placeholder', 'multipleLimit'],
        directives: {clickoutside},
        data() {
            return {
                selectValue: [],
                query: '',

                selectLoading: false,
                selectOption: [],
                optionListShow: false,


                isFocus: false,

                isCheckEmailList: [],
            }
        },
        watch: {
            email() {
                this.init()
            },
        },
        created() {
            this.init()
        },
        methods: {
            init() {
                this.selectValue = [];
                if (this.email) {
                    let arr = [];
                    this.email.forEach((item) => {
                        arr.push({
                            email: item,
                            isMouseOver: false,
                            isError: false,
                            isEdit: false,
                            isCheck: false,
                        });
                    });
                    this.selectValue = arr;

                    this.checkEmailAddress();
                }
            },
            checkEmailAddress() {
                let self = this;
                this.selectValue.forEach((item) => {
                    if (self.isCheckEmailList.indexOf(item.email) === -1 && !item.isCheck) {
                        self.$http({
                            url: self.$api.message_email_address_info_v4,
                            data: {
                                email_address: item.email
                            }, success() {
                                item.isCheck = true;
                                self.isCheckEmailList.push(item.email)
                            }, error(data) {
                                item.isCheck = true;
                                if (data.responseJSON && data.responseJSON.msg && data.responseJSON.msg.email_address) {
                                    item.isError = true;
                                }
                            }
                        })
                    }
                });
            },



            inputInput() {
                this.remoteMethod(this.query);
            },
            remoteMethod(query) {
                let self = this;
                self.query = query;
                if (query) {
                    if (this.timer) clearTimeout(this.timer);
                    this.timer = setTimeout(() => {
                        self.selectOption = [];
                        self.selectLoading = true;
                        self.$http({
                            url: self.$api.message_mail_email_search_v3,
                            type: 'GET',
                            data: {
                                text: query || ''
                            },
                            success: function (data) {
                                self.selectLoading = false;
                                if (data.msg && data.msg.items) {
                                    let arr = [];
                                    data.msg.items.forEach((item) => {
                                        arr.push(item.email);
                                    });
                                    self.selectOption = arr;
                                }
                            }
                        });
                    }, 100);
                }
            },
            inputFocus() {
                this.isFocus = true;
                this.optionListShow = true;
            },
            inputBlur() {
                this.isFocus = false;

            },
            inputKeyup($event) {
                //键盘keyCode对应按键：分号 186，enter 13
                if ($event && $event.keyCode && [186, 13].indexOf($event.keyCode) > -1) {
                    this.setSelectValue();
                }
            },
            inputKeydown($event) {
                //tab 9，tab按键只有在keydown的时候才能监听到
                if ($event && $event.keyCode && [9].indexOf($event.keyCode) > -1) {
                    this.setSelectValue();
                }
            },
            setSelectValue() {
                if (this.query && (this.selectValue.length < this.multipleLimit || !this.multipleLimit)) {
                    let arr = [];
                    arr = this.query.replace(/ /g, '').split(';');
                    let selectValue = JSON.parse(JSON.stringify(this.selectValue));
                    arr.forEach((item) => {
                        if (item) {
                            selectValue.push({
                                email: item,
                                isMouseOver: false,
                                isError: false,
                                isEdit: false,
                                isCheck: false,
                            });
                        }
                    });
                    this.selectValue = selectValue;
                    this.selectOption=[];
                    this.query = '';
                    this.updateData();
                    this.addressInputKeywordFocus();
                }
            },


            selectChange(val) {
                this.selectValue.push({
                    email: val,
                    isMouseOver: false,
                    isError: false,
                    isEdit: false,
                    isCheck: false,
                });
                this.query = '';
                this.selectOption=[];
                this.updateData();
                this.addressInputKeywordFocus();
            },

            clickClearAll() {
                this.selectValue = [];
                this.updateData();
            },


            addressClickDelete($index) {
                this.selectValue.splice($index, 1);
                this.updateData();
                this.addressInputKeywordFocus();
            },
            addressDblclick(item, $index) {
                item.isEdit = true;
                this.$nextTick(() => {
                    document.getElementById('address-edit-' + $index).focus()
                })
            },
            addressEditChange(item) {
                item.isEdit = false;
                item.isCheck = false;
                this.addressInputKeywordFocus();

                if (this.timer2) clearTimeout(this.timer2);
                this.timer2 = setTimeout(() => {
                    this.updateData();
                }, 200);
            },


            updateData() {
                //先去重
                let arr=[];
                this.selectValue.forEach((item) => {
                    let hasSame=false;
                    for(let i=0;i<arr.length;i++){
                        if(arr[i].email === item.email){
                            hasSame = true;
                        }
                    }
                    if(!hasSame){
                        arr.push(item);
                    }
                });
                this.selectValue = arr;

                //遍历出email地址，update
                let emailArr = [];
                this.selectValue.forEach((item) => {
                    emailArr.push(item.email);
                });
                this.$emit('update:email', emailArr);
                this.$emit('change', emailArr);
            },

            addressInputKeywordFocus(){
                this.$nextTick(()=>{
                    document.getElementById('select-email-input-input-scroll').scrollTop=100000000;
                    document.getElementById('address-input-keyword').focus();
                });
            },

            clickoutside() {
                this.optionListShow = false;
                this.setSelectValue();
            },
        },
    }
</script>

<style lang="scss">
    @import "./../../../assets/css/config";

    .select-email-input {
        position: relative;

        .select-email-input-input {
            position: relative;
            background-color: #FFFFFF;
            border-radius: 4px;
            border: 1px solid $color-border;
            padding: 2px 30px 2px 10px;
            line-height: 24px;
            font-size: 12px;
            color: #333333;
            font-weight: normal;
            transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            display: flex;
            flex-wrap: wrap;
            max-height: 190px;
            &.focus {
                border-color: $color-main;
            }
            .address {
                display: inline-block;
                margin: 1px 5px 1px 0;
                vertical-align: top;
                background-color: #eeeeee;
                padding: 0 5px;
                border-radius: 4px;

                .address-email {
                    vertical-align: middle;
                }

                .el-icon-circle-close {
                    font-size: 15px;
                    line-height: 1;
                    vertical-align: middle;
                    margin-left: 5px;
                }

                input {
                    height: 22px;
                    width: 150px;
                    margin: 1px 0;
                    border: none;
                }

                &.error {
                    .address-email {
                        color: red;
                    }
                }

                &.mouse-over {
                    background-color: #dddddd;
                }
            }

            .address-input {
                flex-grow: 1;
                vertical-align: top;
                display: inline-block;
                position: relative;
                max-width: 100%;
                overflow: hidden;

                .address-input-keyword {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 27px;
                    line-height: 27px;
                    border: none;
                    background-color: transparent;
                    padding: 0;
                    font-size: 12px;
                    color: #333333;
                    font-weight: normal;
                }

                .address-input-keyword-show {
                    min-width: 100px;
                    height: 27px;
                    line-height: 27px;
                    white-space: nowrap;
                    padding: 0;
                    font-size: 12px;
                    color: transparent;
                    font-weight: normal;
                }
            }
        }
        .clear-all {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
            color: #999999;
        }
        .select-email-input-list {
            position: absolute;
            left: 0;
            top: 100%;
            z-index: 19;
            line-height: 32px;
            border-radius: 4px;
            border: 1px solid #EBEEF5;
            background-color: #FFFFFF;
            box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
            padding: 5px 0;
            min-width: 100%;

            li {
                min-width: 150px;
                padding: 0 10px;
                cursor: pointer;
                white-space: nowrap;

                &:hover {
                    background-color: $color-main;
                    color: #ffffff;
                }
            }
        }
    }
</style>