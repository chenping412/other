<template>
    <div class="control-search" v-loading="loading">
        <div class="control-fast-component clearfix">

            <div class="left margin-right-10">
                <el-button class="margin-right-10" type="primary" plain v-if="allowFilterFieldsMoreCopy && allowFilterFieldsMoreCopy.length>0"
                           @click="controlMoreShow=true">更多筛选
                </el-button>

                <ControlSearchGroup
                        v-if="groupConfig && allowGroupFieldsList.length>0"
                        :allowGroupFieldsList="allowGroupFieldsList"
                        :groupConfig="groupConfig"
                        :filterKey="filterKey"
                        :allowFilterFieldsUrl="allowFilterFieldsUrl">
                </ControlSearchGroup>

                <el-dropdown class="collection-filter" trigger="click" placement="bottom-start" @command="clickCommand"
                             v-if="filterKey">
                    <el-button type="primary" plain>
                        <span>收藏&emsp;</span>
                        <i class="el-icon-arrow-down"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                                class="collection-filter-item"
                                v-for="(item,$index) in collectionFilterList"
                                :key="$index"
                                :class="{'active':item.id == collectionFilterId}"
                                :command="item.id">
                            <span>{{item.name}}</span>
                            <i class="el-icon-close" @click.stop="deleteCollection(item.id)"></i>
                        </el-dropdown-item>

                        <el-dropdown-item command="add">保存当前筛选条件</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>

            <ControlSearchItems
                    :allowFilterFieldsList.sync="allowFilterFieldsFastCopy"
                    :partner_is_company_user="partner_is_company_user"
                    :loginUserShowNull="loginUserShowNull"
                    @clickSearch="clickSearch">
            </ControlSearchItems>

            <div class="control-item">
                <el-button type="primary" @click="clickSearch()">查询</el-button>
                <el-button type="primary" plain @click="clickReset()">重置</el-button>
            </div>


        </div>


        <el-drawer
                title="更多筛选"
                :visible.sync="controlMoreShow"
                size="540px"
                direction="ltr"
                custom-class="control-more-drawer"
                append-to-body
                v-if="allowFilterFieldsMoreCopy && allowFilterFieldsMoreCopy.length>0">
            <div class="control-more-component scroll">
                <ControlSearchItems
                        :isMore="true"
                        :allowFilterFieldsList.sync="allowFilterFieldsMoreCopy"
                        :partner_is_company_user="partner_is_company_user"
                        :loginUserShowNull="loginUserShowNull"
                        @clickSearch="clickSearch">
                </ControlSearchItems>
            </div>
            <div class="control-more-button">
                <el-button type="primary" @click="clickSearch()">查 询</el-button>
                <el-button plain @click="controlMoreShow=false">关 闭</el-button>
            </div>
        </el-drawer>


        <el-dialog title="添加收藏" :visible.sync="dialogShow" width="500px" :close-on-click-modal="false"
                   v-loading="loading">
            <el-form :model="addForm" :rules="addFormRule" ref="form" label-width="110px">
                <el-form-item label="收藏名称" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <p style="width: 280px;line-height: 1.5em;">注意：如果新名称和现有的收藏名称相同，会更新已有的收藏</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="clickSaveCollection()">提 交</el-button>
                <el-button @click="dialogShow = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ControlSearchItems from "./ControlSearchItems";
    import ControlSearchGroup from "./ControlSearchGroup";

    export default {
        components: {ControlSearchGroup, ControlSearchItems},
        props: ['filterKey', 'allowFilterFieldsUrl','groupConfig','allowFilterFieldsMore', 'allowFilterFieldsFast', 'partner_is_company_user', 'showAllFilter', 'loginUserShowNull'],
        data() {
            return {
                controlMoreShow: false,
                filter: [],
                allowFilterFieldsFastCopy: [],
                allowFilterFieldsMoreCopy: [],


                collectionFilterList: [],
                collectionFilterId: null,

                dialogShow: false,
                addForm: {
                    name: '',
                },
                addFormRule: {
                    name: [
                        {required: true, message: '请输入收藏名称！'}
                    ],
                },


                allowGroupFieldsList: [],

                loading: false,
            }
        },
        watch: {
            allowFilterFieldsUrl() {
                this.getSearControlItemListData();
            },
            filterKey() {
                if (this.filterKey) this.getCollectionFilterList();
            },
            '$route'() {
                if (this.allowFilterFieldsUrl) {
                    this.init(this.allowFilterFieldsFastCopy, this.allowFilterFieldsMoreCopy);
                } else if (this.allowFilterFieldsFast && this.allowFilterFieldsMore) {
                    this.init(this.allowFilterFieldsFast, this.allowFilterFieldsMore);
                }
            },
        },
        created() {
            if (this.allowFilterFieldsUrl) {
                this.getSearControlItemListData();
            } else if (this.allowFilterFieldsFast && this.allowFilterFieldsMore) {
                this.init(this.allowFilterFieldsFast, this.allowFilterFieldsMore);
            }
            if (this.filterKey) this.getCollectionFilterList();
        },
        methods: {
            init(allowFilterFieldsFast, allowFilterFieldsMore) {
                this.collectionFilterId = this.$route.query.collectionFilterId;

                this.filter = this.$route.query.filter ? JSON.parse(decodeURIComponent(this.$route.query.filter)) : [];
                let filter = this.filter;
                let filterObj = {};

                if (filter && filter.length > 0) {
                    let m = 0;
                    let n = 0;
                    filter.forEach((item) => {
                        if (item === '|') {
                            m++;
                        } else if (item === '&') {
                            n++;
                        } else {
                            if (!filterObj[item[0]]) {
                                filterObj[item[0]] = {
                                    key: item[0],
                                    type: '=',
                                    value: [],
                                }
                            }
                            filterObj[item[0]].value.push({
                                value: item[2],
                                operator: item[1],
                            });

                            if (m > 0) {
                                filterObj[item[0]].type = '|';
                                m--;
                            }
                            if (n > 0) {
                                filterObj[item[0]].type = '&';
                                n--;
                            }
                        }
                    })
                }
                allowFilterFieldsFast = this.initSet(allowFilterFieldsFast, filterObj);
                allowFilterFieldsMore = this.initSet(allowFilterFieldsMore, filterObj);

                this.allowFilterFieldsFastCopy = JSON.parse(JSON.stringify(allowFilterFieldsFast));
                this.allowFilterFieldsMoreCopy = JSON.parse(JSON.stringify(allowFilterFieldsMore));
            },
            initSet(allowFilterList, filterObj) {
                let arrList = [];
                for (let i = 0; i < allowFilterList.length; i++) {
                    if (!allowFilterList[i].is_hidden) {
                        allowFilterList[i].fieldMudelType = allowFilterList[i].type;
                        allowFilterList[i][allowFilterList[i].field_name] = null;
                        if (allowFilterList[i].operators && allowFilterList[i].operators[0]) {
                            allowFilterList[i].operator = allowFilterList[i].operators[0];
                        } else {
                            allowFilterList[i].operator = '=';
                        }
                        arrList.push(allowFilterList[i])
                    }
                }
                allowFilterList = arrList;


                for (let key in filterObj) {
                    if (filterObj[key].type === '=') {
                        for (let i = 0; i < allowFilterList.length; i++) {
                            if (allowFilterList[i].field_name === key) {
                                allowFilterList[i][key] = filterObj[key].value[0].value;
                                allowFilterList[i].operator = filterObj[key].value[0].operator;
                                break
                            }
                        }
                    } else if (filterObj[key].type === '&') {
                        for (let i = 0; i < allowFilterList.length; i++) {
                            if (allowFilterList[i].field_name === key) {
                                if(filterObj[key].value.length>=2){
                                    let valueArr2 = [];
                                    filterObj[key].value.forEach((valueItem, valueIndex) => {
                                        if (valueIndex % 2 === 0) {
                                            valueArr2.push([])
                                        }
                                        valueArr2[valueArr2.length - 1].push(valueItem.value);
                                    });

                                    let objBase = JSON.parse(JSON.stringify(allowFilterList[i]));
                                    valueArr2.forEach((valueItem, valueIndex) => {
                                        let obj = JSON.parse(JSON.stringify(objBase));
                                        obj[key] = valueItem;
                                        obj.operator = '=';
                                        if (valueIndex > 0) obj.isAdd = true;
                                        allowFilterList.splice(i + valueIndex, valueIndex === 0 ? 1 : 0, obj);
                                    });
                                }else {
                                    allowFilterList[i][key] = filterObj[key].value[0].value;
                                    allowFilterList[i].operator = '='
                                }
                                break
                            }
                        }
                    } else if (filterObj[key].type === '|') {
                        for (let i = 0; i < allowFilterList.length; i++) {
                            if (allowFilterList[i].field_name === key) {
                                let objBase = JSON.parse(JSON.stringify(allowFilterList[i]));
                                filterObj[key].value.forEach((valueItem, valueIndex) => {
                                    let obj = JSON.parse(JSON.stringify(objBase));
                                    obj[key] = valueItem.value;
                                    obj.operator = valueItem.operator;
                                    if (valueIndex > 0) obj.isAdd = true;
                                    allowFilterList.splice(i + valueIndex, valueIndex === 0 ? 1 : 0, obj);
                                });
                                break
                            }
                        }
                    }
                }

                return allowFilterList
            },

            //获取搜索条件列表
            getSearControlItemListData() {
                let self = this;
                self.$http({
                    url: self.allowFilterFieldsUrl,
                    success: function (data) {
                        if (data.msg) {
                            let allowFilterFieldsFast = [];
                            let allowFilterFieldsMore = [];
                            if (data.msg.allow_fast_filter_fields) {
                                allowFilterFieldsFast = data.msg.allow_fast_filter_fields;
                            }
                            if (data.msg.allow_filter_fields) {
                                for (let i = 0; i < data.msg.allow_filter_fields.length; i++) {
                                    if (data.msg.allow_filter_fields[i].items) {
                                        allowFilterFieldsMore = allowFilterFieldsMore.concat(data.msg.allow_filter_fields[i].items);
                                    }
                                }

                            }
                            self.init(allowFilterFieldsFast, allowFilterFieldsMore)

                            let allowGroupFieldsList=[];
                            if (data.msg.allow_group_fields) {
                                for (let i = 0; i < data.msg.allow_group_fields.length; i++) {
                                    if (data.msg.allow_group_fields[i].items) {
                                        allowGroupFieldsList = allowGroupFieldsList.concat(data.msg.allow_group_fields[i].items);
                                    }
                                }

                            }
                            self.allowGroupFieldsList = allowGroupFieldsList;
                        }
                    }
                })
            },


            clickSearch() {
                let query = JSON.parse(JSON.stringify(this.$route.query));
                let filter = this.formatQueryFilter();
                query.filter = filter ? encodeURIComponent(JSON.stringify(filter)) : undefined;
                if (query.pageNum) query.pageNum = 1;
                this.$router.push({
                    path: this.$route.path,
                    query: query
                }).catch(() => {
                    this.$emit('clickSearch')
                });
                this.controlMoreShow = false;
            },
            formatQueryFilter(){
                let arr = this.allowFilterFieldsFastCopy.concat(this.allowFilterFieldsMoreCopy);
                let filter = [];
                arr.forEach((item) => {
                    if (item[item.field_name] || item[item.field_name] === false) {
                        if (JSON.stringify(item[item.field_name]) !== "{}") {
                            filter.push([
                                item.field_name,
                                item.operator || '=',
                                item[item.field_name].id === '无' ? '无' : item[item.field_name]
                            ])
                        }
                    }
                });

                let obj = {};
                for (let i = 0; i < filter.length; i++) {
                    if (!obj[filter[i][0]]) obj[filter[i][0]] = [];
                    obj[filter[i][0]].push(filter[i])
                }

                let arr2 = [];
                for (let key in obj) {
                    if (obj[key].length > 1) {
                        for (let k = 0; k < obj[key].length - 1; k++) {
                            arr2.push('|')
                        }
                    }
                    for (let k = 0; k < obj[key].length; k++) {
                        arr2.push(obj[key][k])
                    }
                }

                let arr3 = [];
                for (let i = 0; i < arr2.length; i++) {
                    if (arr2[i][2] && Object.prototype.toString.call(arr2[i][2]) === '[object Array]' && arr2[i][2].length > 0) {
                        for (let k = 0; k < arr2[i][2].length - 1; k++) {
                            arr3.push('&')
                        }
                        for (let k = 0; k < arr2[i][2].length; k++) {
                            arr3.push([
                                arr2[i][0],
                                k % 2 === 0 ? '>=' : '<=',
                                arr2[i][2][k]
                            ])
                        }
                    } else {
                        arr3.push(arr2[i])
                    }
                }
                return arr3 && arr3.length>0 ? arr3 : null
            },


            clickReset() {
                let query = JSON.parse(JSON.stringify(this.$route.query));
                query.filter = undefined;
                query.pageNum = undefined;
                this.$router.push({
                    path: this.$route.path,
                    query: query
                }).catch(() => {
                    this.$emit('clickSearch')
                });
                this.controlMoreShow = false;
            },


            //获取收藏列表
            getCollectionFilterList() {
                let self = this;
                self.collectionFilterList = [];
                self.$http({
                    url: self.$api.partner_self_user_filters,
                    data: {
                        key: this.filterKey
                    },
                    success: function (data) {
                        if (data.msg && data.msg.items) {
                            self.collectionFilterList = data.msg.items;
                        }
                    }
                })
            },
            clickCommand(value) {
                if (value === 'add') {
                    this.clickAddCollection()
                } else {
                    this.selectCollectionFilter(value)
                }
            },
            clickAddCollection() {
                if (!this.filterKey) {
                    this.$message({
                        showClose: true,
                        message: '缺少filterKey！',
                        type: 'error'
                    });
                    return
                }
                this.dialogShow = true;
                let order_by = this.$route.query.order_by ? [JSON.parse(decodeURIComponent(this.$route.query.order_by))] : undefined;
                this.addForm = {
                    name: '',
                    key: this.filterKey,
                    value: {
                        filter: this.$utils.formatSearchFilter(this.filter),
                        order_by: order_by,
                        key: this.filterKey
                    }
                }
            },
            clickSaveCollection() {
                let self = this;
                self.$refs.form.validate(function (valid) {
                    if (valid) {
                        self.loading = true;
                        self.$http({
                            url: self.$api.partner_self_user_filters,
                            type: 'POST',
                            requestBody: true,
                            data: self.addForm,
                            success: function (data) {
                                self.loading = false;
                                if (data.msg) {
                                    self.$message({
                                        showClose: true,
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    self.getCollectionFilterList();
                                    self.dialogShow = false;
                                } else {
                                    self.$message({
                                        showClose: true,
                                        message: '保存失败！',
                                        type: 'error'
                                    });
                                }
                            }
                        });
                    }
                });
            },

            selectCollectionFilter(id) {
                this.collectionFilterList.forEach((item) => {
                    if (item.id === id && item.value && item.value.filter) {
                        let query = JSON.parse(JSON.stringify(this.$route.query));
                        query.filter = encodeURIComponent(JSON.stringify(item.value.filter));
                        if (item.value.order_by) {
                            query.order_by = encodeURIComponent(JSON.stringify(item.value.order_by[0]));
                        }
                        if (query.pageNum) query.pageNum = 1;
                        query.collectionFilterId = id;
                        query.group_by = undefined;
                        this.$router.push({
                            path: this.$route.path,
                            query: query
                        }).catch(() => {
                            this.$emit('clickSearch')
                        })
                    }
                })
            },
            deleteCollection(id) {
                let self = this;
                self.$confirm('确定删除这个自定义的收藏？一旦删除不可以恢复', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: function (action) {
                        if (action == 'confirm') {
                            self.loading = true;
                            self.$http({
                                url: self.$api.partner_self_user_filters + '/' + id,
                                type: 'DELETE',
                                data: {
                                    key: self.filterKey
                                },
                                success: function (data) {
                                    self.loading = false;
                                    if (data.msg) {
                                        self.$message({
                                            type: 'success',
                                            message: '删除成功！',
                                            showClose: 'true'
                                        });
                                        self.getCollectionFilterList();
                                    }
                                }
                            })

                        }
                    }
                })
            },

        },
    }
</script>

<style lang="scss">
    .control-search {
        padding: 16px 16px 0;
        background-color: #ffffff;
        margin: 0 0 16px;
        border-radius: 4px;
        -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

        &:after {
            content: "";
            display: block;
            height: 0;
            clear: both;
            visibility: hidden;
        }

        .control-fast-component {
            .control-item {
                float: left;
                margin-bottom: 16px;
                margin-right: 16px;

                & > span {
                    margin-right: 5px;
                    vertical-align: middle;
                    line-height: 32px;
                }

                .el-input, .el-select {
                    width: 150px;
                }

                .el-date-editor {
                    width: 296px;
                }

                .boolean {
                    .el-input, .el-select {
                        width: 100px;
                    }
                }

                input::placeholder {
                    font-size: 12px;
                }
            }

            .right {
                margin-bottom: 16px;
            }
        }

        .collection-filter {
            margin-right: 10px;
        }

    }

    .control-more-drawer {
        .el-drawer__header {
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #dddddd;
            font-weight: bolder;
            font-size: 16px;
        }

        .el-drawer__body {
            height: calc(100% - 60px);

            .control-more-component {
                max-height: calc(100% - 65px);

                .control-item {
                    margin: 0 20px 8px;

                    .label {
                        display: inline-block;
                        width: 120px;
                    }

                    .item-content {
                        display: inline-block;

                        .el-input, .el-select {
                            width: 215px;
                        }

                        .el-date-editor {
                            width: 320px;
                        }

                        input {
                            color: #000000;
                            font-weight: bolder;

                            &::placeholder {
                                font-weight: normal;
                            }
                        }
                    }

                    .operation {
                        display: inline-block;
                        padding-right: 5px;

                        .el-select, .el-input {
                            width: 100px;
                        }
                    }

                    .item-add {
                        float: right;
                        display: inline-block;
                    }

                }
            }

            .control-more-button {
                padding: 10px 20px 0;
                border-top: 1px solid #dddddd;
                text-align: right;
            }
        }
    }

    .collection-filter-item {
        .el-icon-close {
            float: right;
            margin: 5px 0 0 0;
            cursor: pointer;
            padding: 2px;

            &:hover {
                color: red;
            }
        }

        &.active {
            color: #FFFFFF;
            background-color: #00b9bc;
        }
    }
</style>