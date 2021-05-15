<template>
    <div class="inline-block" @click.stop="">
        <el-button type="primary" size="mini" @click.native.stop="clickThirdParty()">第三方同步检测</el-button>

        <el-dialog :title="'凭证区间:'+accountPeriodName+'  第三方:筋斗云'" :visible.sync="dialogShow" width="1000px" top="50px"
                   :close-on-click-modal="false">
            <div v-loading="loading">
                <div style="min-height: 500px;">
                    <div style="padding: 20px 40px;"
                         v-if="thirdPartyData.progress_list && thirdPartyData.progress_list.items">
                        <el-steps :active="active_index" finish-status="success" :align-center="true">
                            <el-step
                                    v-for="(item,$index) in thirdPartyData.progress_list.items"
                                    :key="$index"
                                    :title="item.value">
                            </el-step>
                        </el-steps>
                    </div>
                    <div class="padding-10" v-html="thirdPartyData.form"></div>

                    <div v-if="thirdPartyData.table" style="max-height: 400px;overflow-y: auto;">
                        <table style="width: 100%;">
                            <thead v-if="thirdPartyData.table.head">
                            <tr>
                                <th v-for="(item,$index) in thirdPartyData.table.head"
                                    :key="$index">
                                    <div class="cell">{{item.value}}</div>
                                </th>
                            </tr>
                            </thead>
                            <tbody v-if="thirdPartyData.table.body">
                            <tr v-for="(row,rowIndex) in thirdPartyData.table.body" :key="rowIndex">
                                <td v-for="(item,$index) in row"
                                    :key="$index">
                                    <div class="cell">{{item.value}}</div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style="padding: 10px;text-align: center;" v-if="thirdPartyData.action">
                    <el-button v-for="(item,$index) in thirdPartyData.action"
                               :key="$index"
                               :type="item.button_color"
                               @click="clickActionButton(item)">
                        {{item.button_name}}
                    </el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        props: ['accountPeriodId', 'accountPeriodName'],
        data() {
            return {
                loading: false,
                dialogShow: false,
                thirdPartyData: {},
                active_index: 0,
            }
        },
        created() {
        },
        methods: {
            clickThirdParty() {
                this.dialogShow = true;
                this.getThirdPartyData();
            },

            getThirdPartyData() {
                let self = this;
                self.loading = true;
                self.$http({
                    url: self.$api.bank_v4_account_period + '/' + self.accountPeriodId + '/third/sync_check_step/1',
                    success: function (data) {
                        self.loading = false;
                        self.thirdPartyData = data.msg;
                        if (self.thirdPartyData.progress_list) {
                            self.active_index = self.thirdPartyData.progress_list.active_index + 1
                        }
                    }
                });
            },

            clickActionButton(item) {
                let self = this;
                if (item.button_type === 'exit') {
                    self.dialogShow = false;
                } else if (item.button_type === 'callback') {
                    self.loading = true;
                    self.$http({
                        url: item.action_url,
                        type: item.action_method,
                        requestBody: true,
                        success: function (data) {
                            self.loading = false;
                            self.thirdPartyData = data.msg;
                            if (self.thirdPartyData.progress_list) {
                                self.active_index = self.thirdPartyData.progress_list.active_index + 1
                            }
                        }
                    });
                }

            },
        },
    }
</script>