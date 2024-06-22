<!--
 * 用户缴费信息
-->
<template>
    <div class="user-fee-info">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
              <i class="iconfont icon-stall-fee-menu" style="margin: 5px; font-size: 22px">
                    缴费信息
              </i ></el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="info-card">
            <el-row>
                <el-col :span="24">
                    <div class="balance-container">
                        <div class="balance-title">
                            <el-row>
                                <el-col :span="24" style="text-align: left">
                                    <i class="iconfont icon-stall-fee-menu"
                                        style="font-size: 32px"
                                    > 账户余额
                                    </i>
                                </el-col>
                            </el-row>
                            <div class="balance-count" v-if="userInfo.money">
                                <span class="num">￥</span>
                                <span class="num">{{
                                    userInfo.money.toFixed(2)
                                }}</span>
                            </div>
                            <br />
                            <el-button
                                class="recharge-btn"
                                style="font-size: 22px"
                                type="primary"
                                @click="toPay"
                            ><i
                                class="iconfont icon-add-button"
                                style="font-size: 22px"
                            ></i>
                                立即充值</el-button
                            >
                        </div>
                    </div>
                </el-col>
                <hr />
              <el-col :span="24">
                <div class="bottom">
                  <!-- 待缴费标题 -->
                  <div class="section-title">
                    <i class="iconfont icon-wait-fee">待缴费</i>
                  </div>

                  <!-- 待缴费表格 -->
                  <el-table :data="dRes" style="width: 100%; margin-top: 10px;" border>
                    <el-table-column label="区域" prop="stall.stallArea" width="280"></el-table-column>
                    <el-table-column label="车位号" prop="stall.stallNum" width="220"></el-table-column>
                    <el-table-column label="时间" prop="createTime" width="340"></el-table-column>
                    <el-table-column label="操作" width="200">
                      <template slot-scope="scope">
                        <el-button type="success" size="small" @click="payStall(scope.row)">
                          <i class="iconfont icon-stall-fee-menu"></i> 缴费
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>

                  <!-- 空状态提示 -->
                  <div v-if="dRes.length === 0" class="no-data">没有待缴费记录</div>
                </div>
              </el-col>
                <hr />
              <el-col :span="24">
                <div class="right">
                  <!-- 缴费记录标题 -->
                  <div class="section-title">
                    <i class="iconfont icon-wait-fee">缴费记录</i>
                  </div>

                  <!-- 缴费记录表格 -->
                  <el-table :data="allStallRes" style="width: 100%; margin-top: 10px;" border>
                    <el-table-column label="区域" prop="stall.stallArea" width="280"></el-table-column>
                    <el-table-column label="车位号" prop="stall.stallNum" width="220"></el-table-column>
                    <el-table-column label="时间" prop="createTime" width="340"></el-table-column>
                    <el-table-column label="费用" width="200">
                      <template slot-scope="scope">
                        <span v-if="scope.row.money != null" class="money-paid">缴费：{{ scope.row.money.toFixed(2) }}元</span>
                        <span v-else class="money-due">待缴费：{{ feeChange(scope.row).toFixed(2) }}元</span>
                      </template>
                    </el-table-column>
                  </el-table>

                  <!-- 空状态提示 -->
                  <div v-if="allStallRes.length === 0" class="no-data">没有缴费记录</div>
                </div>
              </el-col>
            </el-row>
        </el-card>

        <el-dialog
            title="充值"
            :visible.sync="payShow"
            width="500px"
            center
            @close="payClose"
        >
            <!-- 内容主题区域 -->
            <el-input
                v-model.number="payMoney"
                @blur="checkMoney"
                placeholder="充值金额"
                style="width: 300px"
            ></el-input>
            <br />
            <span class="pay-msg" v-if="msgShow">{{ payMsg }}</span>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="payClose">取 消</el-button> -->
                <el-button type="primary" @click="payClick">确认充值</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import axios from "axios";
export default {
    data() {
        return {
            allStallRes: [],
            userInfo: {},
            payShow: false,
            payMoney: "",
            payMsg: "",
            msgShow: false,
            dRes: [],
        };
    },
    methods: {
        getAllStallRes(uid) {
            axios.get("/api/stall/listUserStallRes?person=" + uid).then((res) => {
                this.allStallRes = res.data.data;
            });
        },
        getUserInfo(uid) {
            axios.get("/api/user/getUserByUid?uid=" + uid).then((res) => {
                this.userInfo = res.data.data;
                if (this.userInfo.username) {
                    this.getAllStallRes(this.userInfo.username);
                    this.getUserNoPay(this.userInfo.username);
                }
            });
        },
        getUserNoPay(uid) {
            axios.get("/api/stall/allNoPay?person=" + uid).then((res) => {
                this.dRes = res.data.data;
            });
        },
        getUserStallRes(uid) {
            axios.get("/api/stall/allRes?uid=" + uid).then((res) => {
                this.yRes = res.data.data;
            });
        },
          feeChange(stallRes) {
            let startTime = new Date(stallRes.createTime);
            let endTime = new Date();
            let hours = (endTime.getTime() - startTime.getTime()) / 3600000;
            let money;
            // 计算停车时间跨越的完整月数
            let startMonth = startTime.getMonth() + 1; // 月份从1开始
            let startYear = startTime.getFullYear();
            let startDay = startTime.getDate();
            let endMonth = endTime.getMonth() + 1;
            let endYear = endTime.getFullYear();
            let endDay = endTime.getDate();
            let fullMonths = (endYear - startYear) * 12 + (endMonth - startMonth);
            if (stallRes.stall.stallType==="固定车位"){
              // 如果停车时间不足一个月，按一个月计算
              if (fullMonths === 0) {
                fullMonths = 1;
              }
              if(startYear !== endYear || startMonth !== endMonth && endDay > startDay){
                fullMonths += 1;
              }
              // 计算费用
              money = fullMonths * stallRes.stall.stallMoney;
            }else{
              //money = (Math.floor(hours * 10) / 10) * stallRes.stall.stallMoney;
              if (hours < 0.01) {
                money = 0;
              } else {
                money = Math.ceil(hours) * stallRes.stall.stallMoney;
              }
            }
            return money;
          },
        toPay() {
            this.payMoney = "";
            this.payShow = true;
        },
        checkMoney() {
            if (typeof this.payMoney === "number") {
                this.msgShow = false;
                this.payMsg = "";
            } else {
                this.msgShow = true;
                this.payMsg = "请输入正确的金额数值";
            }
        },
        payClick() {
            if (typeof this.payMoney === "number") {
                const uid = window.sessionStorage.getItem("token");
                axios
                    .post("/api/user/userPay", {
                        uid: uid,
                        money: this.payMoney,
                    })
                    .then((res) => {
                        if (res.data.data) {
                            this.$message.success("充值成功！");
                            this.getUserInfo(uid);
                            this.payClose();
                        } else {
                            this.$message.error("充值失败，请重新尝试");
                        }
                    });
            } else {
                this.$message.info("输入金额错误，充值失败！");
                this.payClose();
            }
        },
        payClose() {
            this.payShow = false;
            this.msgShow = false;
            this.payMsg = "";
        },
        async payStall(stallRes) {
            const re = await this.$confirm(
                "该次停车缴费" + this.feeChange(stallRes) + "元?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            // console.log(re)
            if (re != "confirm") {
                this.$message.info("已取消停车缴费！");
            } else {
                let oa = {};
                oa.pid = stallRes.pid;
                oa.person = stallRes.person;
                oa.stallId = stallRes.stallId;
                oa.money = this.feeChange(stallRes);
                axios.post("/api/stall/payMoneyPerson", oa).then((res) => {
                    if (res.data.data.flag) {
                        this.$message.success("停车缴费成功！");
                        this.getAllStallRes(this.userInfo.username);
                        this.getUserNoPay(this.userInfo.username);
                    } else {
                        this.$message.error(res.data.data.msg);
                    }
                });
            }
        },
    },

    mounted() {
        const uid = window.sessionStorage.getItem("token");
        this.getUserInfo(uid);
    },
};
</script>
<style scoped>
.top {
    height: 200px;
}
.top h2 {
    text-align: center;
    color: rgb(102, 102, 102);
}
.count {
    text-align: left;
    color: #e75c09;
}
.num {
    font-size: 34px;
}
.text {
    font-size: 20px;
}
.pay-btn {
    margin-left: 8%;
    width: 180px;
    transform: translateX(-90px);
}
.bottom {
}
.bottom h2 {
    text-align: center;
    color: rgb(102, 102, 102);
}
.right {
}
.el-row {
    height: 50px;
}
.right h2 {
    text-align: center;
    font-size: 24px;
    color: rgb(107, 107, 107);
}
.pay-msg {
    color: red;
    font-size: 12px;
}
.stall-num {
    font-size: 16px;
}
.num-red {
    color: red;
}
.no-res {
    width: 100%;
    height: 150px;
    line-height: 150px;
    text-align: center;
    color: rgb(203, 199, 199);
    font-size: 24px;
}
.user-fee-info {
  margin: 30px;
  font-family: 'Arial', sans-serif;
}
.info-card {
  margin-bottom: 20px;
}
.balance-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}
.balance-title i {
  font-size: 32px;
  color: #333;
}
.balance-count {
  font-size: 48px;
  color: #e75c09;
  margin-top: 10px;
}
.recharge-btn {
  margin-top: 20px;
  font-size: 16px;
}
.bottom {
  padding: 20px;
  box-sizing: border-box; /* 确保padding不影响宽度 */
}
.section-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 20px;
}
.section-title i {
  margin-right: 10px;
}
.no-data {
  color: #999;
  text-align: center;
  padding: 20px;
  box-sizing: border-box; /* 确保padding不影响宽度 */
}
/* 表格样式 */
.el-table {
  width: 100%; /* 再次确保表格宽度 */
  border: 1px solid #ebeef5; /* 表格边框样式 */
}
.el-table__expanded-cell {
  box-sizing: border-box; /* 确保展开行的padding不影响宽度 */
}
.right {
  padding: 20px;
  box-sizing: border-box;
}
.section-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 20px;
}
.section-title i {
  margin-right: 10px;
}
.no-data {
  color: #999;
  text-align: center;
  padding: 20px;
  box-sizing: border-box;
}
.money-paid {
  color: #00a854;
}
.money-due {
  color: #ff4949;
}
</style>
