<template>
    <div class="input-phone-component">
        <IntlTelInput @excountry="excountry" :toFront="toFront" :countryCode="countryCode"></IntlTelInput>
        <el-input class="phone" v-model="phone" :placeholder="placeholder || '电话号'"></el-input>
        <el-input class="phone-extension" v-model="phoneExtension" :placeholder="'分机号'"></el-input>
    </div>

</template>

<script>
    import IntlTelInput from './IntlTelInput/index'
    import countries from './IntlTelInput/countries.js'
    export default {
        props: ['value','suffixPhone','rules','placeholder'],
        components:{
            IntlTelInput
        },
        data() {
            return {
                toFront:['cn','de','us','hk','tw','gb','fr','it','es'],
                countryCode:'cn',
                phone:'',
                phoneExtension:'',

                selectCountry:{},
            }
        },
        watch: {
            value() {
                this.init();
            },
            phone(){
                this.checkRule()
            },
            phoneExtension(val){
                this.$emit('update:suffixPhone', val);
            },
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                this.countryCode='cn';
                if(this.value){
                    let str = this.value;
                    for(let key in countries){
                        if(this.value.indexOf('+'+countries[key].dialCode)>-1){
                            this.countryCode=key;
                            str = this.value.replace(/ /g,'').replace('+'+countries[key].dialCode,'');
                            break
                        }
                    }
                    this.phone = str;
                }else {
                    this.phone = '';
                }
                this.phoneExtension=this.suffixPhone;
            },
            excountry(item){
                this.selectCountry = item;
                console.log(this.selectCountry);
                this.checkRule()
            },
            checkRule(){
                let value = null;
                if(this.phone){
                    value = '+' + this.selectCountry.dialCode + ' ' + this.phone;
                }
                this.$emit('update:value', value);
                // let rules=null;
                // if(!this.phone){
                //     rules={required: false, trigger: 'change'};
                // }else {
                //     rules=[
                //         {required: true, validator: function (rule, value, callback) {
                //                 if (
                //                     self.phone && self.selectCountry && self.selectCountry.phoneFormat
                //                     && self.phone.replace(/ /g,'').length !== self.selectCountry.phoneFormat.replace(/ /g,'').length + 1
                //                     && self.phone.replace(/ /g,'').length !== self.selectCountry.phoneFormat.replace(/ /g,'').length
                //                     && self.phone.replace(/ /g,'').length !== self.selectCountry.phoneFormat.replace(/ /g,'').length-1
                //                 ) {
                //                     callback(new Error('格式不正确！'));
                //                 } else {
                //                     callback();
                //                 }
                //             }, trigger: 'change'}
                //     ];
                // }
                // this.$emit('update:rules',rules)
            },
        },
    }
</script>

<style lang="scss">
    .input-phone-component{
        position: relative;
        .phone{
            width: calc(100% - 105px);
            vertical-align: top;
            .el-input__inner{
                padding-left: 50px;
            }
        }
        .phone-extension{
            float: right;
            width: 100px;
        }
    }
</style>