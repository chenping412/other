import Vue from 'vue'

import ImageUpload from "./file/ImageUpload";
import ImageShow from "./file/ImageShow";
import FileListShow from "./file/FileListShow";
import FileUpload from "./file/FileUpload";

import InputNumber from "./input/InputNumber";
import InputPhone from "./input/InputPhone";
import InputMobile from "./input/InputMobile";

import SelectPartner from "./select/SelectPartner";
import SelectPartnerCompanyOnly from "./select/SelectPartnerCompanyOnly";
import SelectBrand from "./select/SelectBrand";
import SelectProduct from "./select/SelectProduct";
import SelectProductSingle from "./select/SelectProductSingle";
import SelectLoginUser from "./select/SelectLoginUser";
import SelectChinaCustomsCode from "./select/SelectChinaCustomsCode";
import SelectChinaProductTradeName from "./select/SelectChinaProductTradeName";
import SelectEmailAddress from "./select/SelectEmailAddress";
import SelectInternalCompany from "./select/SelectInternalCompany";
import SelectInternalUserBindCompany from "./select/SelectInternalUserBindCompany";
import SelectAllInternalUser from "./select/SelectAllInternalUser";
import SelectAccount from "./select/SelectAccount";
import SelectCompanyLoginUser from "./select/SelectCompanyLoginUser";

import AutoCompleteBrand from "./autoComplete/AutoCompleteBrand";
import AutoCompleteProduct from "./autoComplete/AutoCompleteProduct";

import TableControlPagination from "./module/TableControlPagination";
import DetailPagination from "./module/DetailPagination";
import ControlSearch from "./module/ControlSearch";
import OrderDataStatisticsModel from "./orderDataStatistics/OrderDataStatisticsModel";
import OrderDataStatisticsBase from "./orderDataStatistics/OrderDataStatisticsBase";
import CompanyType from "./tags/CompanyType";
import BrandLever from "./tags/BrandLever";
import TagsListEdit from "./tags/TagsListEdit";
import OrderInquiryPriority from "./tags/OrderInquiryPriority";
import isEuCountry from "./tags/isEuCountry";
import MessageTag from "./tags/MessageTag";
import EmailState from "./tags/EmailState";

import ButtonDelete from "./button/ButtonDelete";
import ButtonEdit from "./button/ButtonEdit";
import ButtonSort from "./button/ButtonSort";

import SelectEmailTemplate from "./selectReportTemplate/SelectEmailTemplate";
import SelectEmailTemplateInquiry from "./selectReportTemplate/SelectEmailTemplateInquiry";
import SelectContractTemplateInquiry from "./selectReportTemplate/SelectContractTemplateInquiry";
import SelectReportTemplate from "./selectReportTemplate/SelectReportTemplate";


import WangEditor from "./wangEditor/WangEditor";
import PopoverModel from "./module/PopoverModel";

import PrintBoxTag from "./print/PrintBoxTag";
import PrintPalletTag from "./print/PrintPalletTag";
import PrintSfExpressTicket from "./print/PrintSfExpressTicket";


import ExpressLogs from "./expressLogs/ExpressLogs";



Vue.component('ImageUpload',ImageUpload);
Vue.component('ImageShow',ImageShow);
Vue.component('FileListShow',FileListShow);
Vue.component('FileUpload',FileUpload);

Vue.component('InputNumber',InputNumber);
Vue.component('InputPhone',InputPhone);
Vue.component('InputMobile',InputMobile);

Vue.component('SelectPartner',SelectPartner);
Vue.component('SelectPartnerCompanyOnly',SelectPartnerCompanyOnly);
Vue.component('SelectBrand',SelectBrand);
Vue.component('SelectProduct',SelectProduct);
Vue.component('SelectProductSingle',SelectProductSingle);
Vue.component('SelectLoginUser',SelectLoginUser);
Vue.component('SelectChinaCustomsCode',SelectChinaCustomsCode);
Vue.component('SelectChinaProductTradeName',SelectChinaProductTradeName);
Vue.component('SelectEmailAddress',SelectEmailAddress);
Vue.component('SelectInternalCompany',SelectInternalCompany);
Vue.component('SelectInternalUserBindCompany',SelectInternalUserBindCompany);
Vue.component('SelectAllInternalUser',SelectAllInternalUser);
Vue.component('SelectAccount',SelectAccount);
Vue.component('SelectCompanyLoginUser',SelectCompanyLoginUser);

Vue.component('AutoCompleteBrand',AutoCompleteBrand);
Vue.component('AutoCompleteProduct',AutoCompleteProduct);

Vue.component('TableControlPagination',TableControlPagination);
Vue.component('DetailPagination',DetailPagination);
Vue.component('ControlSearch',ControlSearch);
Vue.component('OrderDataStatisticsModel',OrderDataStatisticsModel);
Vue.component('OrderDataStatisticsBase',OrderDataStatisticsBase);
Vue.component('CompanyType',CompanyType);
Vue.component('BrandLever',BrandLever);
Vue.component('TagsListEdit',TagsListEdit);
Vue.component('OrderInquiryPriority',OrderInquiryPriority);
Vue.component('isEuCountry',isEuCountry);
Vue.component('MessageTag',MessageTag);
Vue.component('EmailState',EmailState);


Vue.component('ButtonDelete',ButtonDelete);
Vue.component('ButtonEdit',ButtonEdit);
Vue.component('ButtonSort',ButtonSort);

Vue.component('SelectEmailTemplate',SelectEmailTemplate);
Vue.component('SelectEmailTemplateInquiry',SelectEmailTemplateInquiry);
Vue.component('SelectContractTemplateInquiry',SelectContractTemplateInquiry);
Vue.component('SelectReportTemplate',SelectReportTemplate);

Vue.component('WangEditor',WangEditor);
Vue.component('PopoverModel',PopoverModel);

Vue.component('PrintBoxTag',PrintBoxTag);
Vue.component('PrintPalletTag',PrintPalletTag);
Vue.component('PrintSfExpressTicket',PrintSfExpressTicket);

Vue.component('ExpressLogs',ExpressLogs);