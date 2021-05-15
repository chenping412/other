<template>
    <div>
        <div class="control-item" v-for="(item,$index) in allowFilterFieldsList" :key="$index" :title="item.translate">
            <span class="label" v-if="isMore">{{item.translate}}</span>

            <div class="operation" v-if="isMore && item.fieldMudelType!=='date' && item.fieldMudelType!=='datetime' && item.fieldMudelType!=='boolean' && item.operators && item.operators.length>0">
                <el-select v-model="item.operator">
                    <el-option
                            v-for="(operator,opIndex) in item.operators"
                            :key="opIndex"
                            :value="operator"
                            :label="operator | searchOperationFilter">
                    </el-option>
                </el-select>
            </div>

            <div class="item-content">
                <el-input v-if="item.fieldMudelType === 'string'" v-model="item[item.field_name]" clearable :placeholder="item.translate" @keyup.enter.native="clickSearch" @clear="clickSearch"></el-input>
                <InputNumber v-if="item.fieldMudelType === 'integer' || item.fieldMudelType === 'decimal'" :value.sync="item[item.field_name]" :integer="item.fieldMudelType === 'integer'" :clearable="true" :placeholder="item.translate" @keyup.enter.native="clickSearch" @clear="clickSearch"></InputNumber>

                <el-select v-if="item.fieldMudelType === 'selection'" v-model="item[item.field_name]" clearable :placeholder="item.translate" @change="clickSearch">
                    <el-option v-for="option in item.selections" :label="option[1]" :value="option[0]" :key="option[0]"></el-option>
                </el-select>

                <el-date-picker
                        v-if="item.fieldMudelType === 'date' || item.fieldMudelType === 'datetime'"
                        v-model="item[item.field_name]"
                        type="daterange"
                        range-separator="至"
                        :start-placeholder="item.translate+'开始'"
                        :end-placeholder="item.translate+'结束'"
                        value-format="yyyy-MM-dd"
                        unlink-panels
                        @change="clickSearch"
                        :picker-options="$store.state.dateRangeOptions">
                </el-date-picker>

                <el-select v-if="item.fieldMudelType === 'boolean'" v-model="item[item.field_name]" clearable :placeholder="item.translate" @change="clickSearch">
                    <el-option label="是" :value="true"></el-option>
                    <el-option label="不是" :value="false"></el-option>
                </el-select>

                <SelectPartner v-if="item.fieldMudelType === 'partner' && partner_is_company_user" :partner.sync="item[item.field_name]" :option="item[item.field_name]?[item[item.field_name]]:null" @change="clickSearch" :placeholder="item.translate"></SelectPartner>
                <SelectPartnerCompanyOnly v-if="item.fieldMudelType === 'partner' && !partner_is_company_user" :partner.sync="item[item.field_name]" :option="item[item.field_name]?[item[item.field_name]]:null" @change="clickSearch" :placeholder="item.translate"></SelectPartnerCompanyOnly>

                <SelectInternalCompany v-if="item.fieldMudelType === 'internal_company'" :internalCompany.sync="item[item.field_name]" :option="item[item.field_name]?[item[item.field_name]]:null" @change="clickSearch" :placeholder="item.translate"></SelectInternalCompany>

                <SelectBrand v-if="item.fieldMudelType === 'brand'" :brand.sync="item[item.field_name]" :option="item[item.field_name]?[item[item.field_name]]:null" @change="clickSearch" :placeholder="item.translate"></SelectBrand>

                <SelectEmailAddress v-if="item.fieldMudelType === 'emailuser'" :emailId.sync="item[item.field_name]" @change="clickSearch" :placeholder="item.translate"></SelectEmailAddress>

                <SelectProductSingle v-if="item.fieldMudelType === 'product'" :product.sync="item[item.field_name]" :option="item[item.field_name]?[item[item.field_name]]:null" @change="clickSearch" :placeholder="item.translate"></SelectProductSingle>

                <SelectLoginUser v-if="item.fieldMudelType === 'login_user'" :user.sync="item[item.field_name]" :option="item[item.field_name]?[item[item.field_name]]:null" :loginUserShowNull="loginUserShowNull" @change="clickSearch" :placeholder="item.translate"></SelectLoginUser>

                <SelectAccount v-if="item.fieldMudelType === 'account'" :account.sync="item[item.field_name]" :option="item[item.field_name]?[item[item.field_name]]:null" @change="clickSearch" :placeholder="item.translate"></SelectAccount>

                <SelectAllInternalUser v-if="item.fieldMudelType === 'user'" :user.sync="item[item.field_name]" :option="item[item.field_name]?[item[item.field_name]]:null" :showNull="true" @change="clickSearch" :placeholder="item.translate"></SelectAllInternalUser>

                <el-select v-if="item.fieldMudelType === 'country'" v-model="item[item.field_name]" filterable clearable :placeholder="item.translate" @change="clickSearch">
                    <el-option v-for="option in $store.state.country"
                               :label="option.chinese_name"
                               :value="option.code2"
                               :key="option.code2">
                    </el-option>
                </el-select>

                <SelectInternalUserBindCompany v-if="item.fieldMudelType === 'internal_user_bind_company'" :company.sync="item[item.field_name]" :option="item[item.field_name]?[item[item.field_name]]:null" @change="clickSearch" :placeholder="item.translate"></SelectInternalUserBindCompany>

            </div>

            <div class="item-add" v-if="isMore">
                <el-button type="text" v-if="!item.isAdd" @click="clickAddRow(item)">
                    添加
                </el-button>
                <el-button type="text" v-if="item.isAdd" @click="clickDeleteRow($index)"><span class="red">删除</span></el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['allowFilterFieldsList','isMore','partner_is_company_user','loginUserShowNull'],
        filters:{
            searchOperationFilter(operation) {
                // 过滤条件有： 包含，不包含，等于，不等于，大于，小于，大于或等于，小于或等于，是，不是，为真，为假 等
                let translateLable = {
                    "=": "是",
                    "!=": "不是",

                    "like": "包含",
                    "not like": "不包含",

                    "in": "包含",
                    "not in": "不包含",

                    ">": "大于",
                    "<": "小于",
                    ">=": "大于等于",
                    "<=": "小于等于",
                };
                return translateLable[operation] || operation;
            }
        },
        methods: {
            clickSearch(){
                if(!this.isMore){
                    this.$emit('clickSearch')
                }
            },
            clickAddRow(row){
                let allowFilterFieldsList = JSON.parse(JSON.stringify(this.allowFilterFieldsList));
                let index=0;
                for(let i=0;i<allowFilterFieldsList.length;i++){
                    if(allowFilterFieldsList[i].field_name === row.field_name){
                        index = i;
                    }
                }
                let rowCopy = JSON.parse(JSON.stringify(row));
                rowCopy.isAdd = true;
                allowFilterFieldsList.splice(index+1,0,rowCopy);
                this.$emit('update:allowFilterFieldsList',allowFilterFieldsList);
            },
            clickDeleteRow($index){
                let allowFilterFieldsList = JSON.parse(JSON.stringify(this.allowFilterFieldsList));
                allowFilterFieldsList.splice($index,1);
                this.$emit('update:allowFilterFieldsList',allowFilterFieldsList);
            },
        }
    }
</script>

<style lang="scss">


</style>