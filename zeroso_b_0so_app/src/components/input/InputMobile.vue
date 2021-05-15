<template>
    <div class="input-mobile-component">
        <IntlTelInput @excountry="excountry" :toFront="toFront" :countryCode="countryCode"></IntlTelInput>
        <el-input class="mobile" v-model="mobile" :placeholder="placeholder || '手机号'"></el-input>
    </div>

</template>

<script>
    import IntlTelInput from './IntlTelInput/index'
    import countries from './IntlTelInput/countries.js'
    export default {
        props: ['value','rules','placeholder'],
        components:{
            IntlTelInput
        },
        data() {
            return {
                toFront:['cn','de','us','hk','tw','gb','fr','it','es'],
                countryCode:'cn',
                mobile:'',

                selectCountry:{},
            }
        },
        watch: {
            value() {
                this.init();
            },
            mobile(){
                this.checkRule()
            },
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                this.countryCode='cn';
                if(this.value){
                    this.mobile = this.value;
                    for(let key in countries){
                        if(this.value.indexOf('+'+countries[key].dialCode)>-1){
                            this.countryCode=key;
                            this.mobile = this.value.replace(/ /g,'').replace('+'+countries[key].dialCode,'');
                            break
                        }
                    }
                }else {
                    this.mobile = null;
                }

            },
            excountry(item){
                this.selectCountry = item;
                console.log(this.selectCountry);
                this.checkRule()
            },
            checkRule(){
                this.$emit('update:value', this.mobile ? '+' + this.selectCountry.dialCode + ' ' + this.mobile : null);
                // let rules=null;
                // if(!this.mobile){
                //     rules={required: false, trigger: 'change'};
                // }else {
                //     rules=[
                //         {required: true, validator: function (rule, value, callback) {
                //             if (self.mobile && self.selectCountry && self.selectCountry.phoneFormat && self.mobile.replace(/ /g,'').length !== self.selectCountry.phoneFormat.replace(/ /g,'').length) {
                //                 callback(new Error('手机号格式不正确！'));
                //             } else {
                //                 callback();
                //             }
                //         }, trigger: 'change'}
                //     ];
                // }
                // this.$emit('update:rules',rules)
            },
        },
    }
</script>

<style lang="scss">
.input-mobile-component{
    position: relative;
    .mobile{
        .el-input__inner{
            padding-left: 50px;
        }
    }
}
</style>