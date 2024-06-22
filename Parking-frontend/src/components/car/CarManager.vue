<!--
 * 车位管理
-->
<template>
  <div class="stall-management">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>车位信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <el-row :gutter="20" class="search-area">
      <el-col :span="4">
        <el-input placeholder="请输入停车区域" v-model="queryInfo.carArea" clearable></el-input>
      </el-col>
      <el-col :span="4">
        <el-select v-model="queryInfo.carType" placeholder="请选择车位类型" clearable>
          <el-option v-for="item in carTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="queryInfo.carState" placeholder="请选择车位状态" clearable>
          <el-option v-for="item in carStates" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="success" icon="el-icon-search" @click="getList">搜索</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-plus" @click="addCar">新增</el-button>
      </el-col>
    </el-row>

    <!-- 车位信息表格 -->
    <el-table
        v-loading="loading"
        :data="cars"
        border
        stripe
        style="width: 100%"
    >
      <!-- 表格列定义 -->
      <el-table-column
          width="50"
          label="序号"
          align="center"
          type="index">
      </el-table-column>
      <el-table-column label="车位号" prop="stallNum" align="center">
      </el-table-column>
                <el-table-column
                    label="车位区域"
                    prop="stallArea"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    label="车位类型"
                    prop="stallType"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    label="车位状态"
                    prop="stallState"
                    align="center"
                >
                </el-table-column>
                <el-table-column
                    label="车位收费"
                    prop="stallMoney"
                    align="center"
                >
                  <template slot-scope="scope">
                    <!-- 根据车位类型显示不同的文本 -->
                    <div v-if="scope.row.stallType === '临时车位'">
                      {{ scope.row.stallMoney }}元/时
                    </div>
                    <div v-else>
                      {{ scope.row.stallMoney }}元/月
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="200"
                    fixed="right"
                >
                    <template slot-scope="scope">
                        <el-button
                            @click="toEdit(scope.row)"
                            type="primary"
                            circle
                            ><i
                                class="iconfont icon-edit-button"
                                style="font-size: 22px"
                            ></i
                        ></el-button>
                        <el-button
                            @click="carDelete(scope.row.sid)"
                            type="danger"
                            circle
                            ><i
                                class="iconfont icon-del-button"
                                style="font-size: 22px"
                            ></i
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
    >
    </el-pagination>

    <!-- 对话框组件 -->
    <!-- 新增车位对话框 -->
    <el-dialog
        title="新增车位"
        :visible.sync="addShow"
        width="500px"
        center
        @close="addClose"
    >
            <!-- 内容主题区域 -->
            <el-form
                :model="registerCar"
                status-icon
                :rules="registerRules"
                ref="registerRules"
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item
                    label="车位号"
                    prop="stallNum"
                    class="is-required"
                >
                    <el-input
                        v-model="registerCar.stallNum"
                        placeholder="请输入车位号"
                        style="width: 300px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="车位区域"
                    prop="stallArea"
                    class="is-required"
                >
                    <el-input
                        v-model="registerCar.stallArea"
                        placeholder="请输入车位区域"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="车位类型"
                    prop="stallType"
                    class="is-required"
                >
                    <el-select
                        v-model="registerCar.stallType"
                        placeholder="请选择车位类型"
                    >
                        <el-option
                            v-for="item in carTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addClose">取 消</el-button>
                <el-button type="primary" @click="submitForm('registerRules')"
                    >确认添加</el-button
                >
            </span>
    </el-dialog>

    <!-- 修改车位对话框 -->
    <el-dialog
        title="修改车位"
        :visible.sync="editShow"
        width="500px"
        center
        @close="editClose"
    >
            <!-- 内容主题区域 -->
            <el-form
                :model="editCar"
                status-icon
                :rules="registerRules"
                ref="registerRules"
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item
                    label="车位号"
                    prop="stallNum"
                    class="is-required"
                >
                    <el-input
                        v-model="editCar.stallNum"
                        placeholder="请输入车位号"
                        style="width: 300px"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="车位区域"
                    prop="stallArea"
                    class="is-required"
                >
                    <el-input
                        v-model="editCar.stallArea"
                        placeholder="请输入车位区域"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item
                    label="车位类型"
                    prop="stallType"
                    class="is-required"
                >
                    <el-select
                        v-model="editCar.stallType"
                        placeholder="请选择车位类型"
                    >
                        <el-option
                            v-for="item in carTypes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editClose">取 消</el-button>
                <el-button
                    type="primary"
                    @click="editSend('registerRules')"
                    icon="iconfont icon-r-yes"
                >
                    确认修改</el-button
                >
            </span>
        </el-dialog>
    </div>
</template>
<script>
import axios from "axios";
export default {
    data() {
        return {
            total: 0,
            loading: true,
            queryInfo: {
                carArea: "",
                carType: "",
                carState: "",
                pagenum: 1,
                pageSize: 6,
            },
            cars: [],
            registerCar: {},
            editCar: {
                sid: "",
                stallNum: "",
                stallArea: "",
                stallType: "",
            },
            editShow: false,
            uid: undefined,
            addShow: false,
            registerRules: {
                stallNum: [
                    {
                        required: true,
                        message: "请输入车牌号",
                        trigger: "blur",
                    },
                ],
                stallArea: [
                    {
                        required: true,
                        message: "请输入车位区域",
                        trigger: "blur",
                    },
                ],
                stallType: [
                    {
                        required: true,
                        message: "请选择车位类型",
                        trigger: "blur",
                    },
                ],
            },
            carTypes: [
                {
                    value: null,
                    label: "全部",
                },
                {
                    value: "临时车位",
                    label: "临时车位",
                },
                {
                    value: "固定车位",
                    label: "固定车位",
                },
            ],
            carStates: [
                {
                    value: null,
                    label: "全部",
                },
                {
                    value: "已停车",
                    label: "已停车",
                },
                {
                    value: "空闲中",
                    label: "空闲中",
                },
            ],
        };
    },
    methods: {
        getList() {
            axios
                .post("/api/stall/pageStall", this.queryInfo)
                .then((res) => {
                    this.loading = false;
                    this.total = res.data.data.total;
                    this.cars = res.data.data.records;
                });
        },
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getList();
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage;
            this.getList();
        },
        addCar() {
            for (let item in this.registerCar) {
                this.registerCar[item] = "";
            }
            if (this.carTypes[0].label == "全部") {
                this.carTypes.shift();
            }
            this.addShow = true;
        },
        addClose() {
            if (this.carTypes[0].label != "全部") {
                this.carTypes.unshift({ value: null, label: "全部" });
            }
            this.addShow = false;
            this.$nextTick(() => {
                this.$refs.registerRules.resetFields();
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    axios
                        .post("/api/stall/add", this.registerCar)
                        .then((res) => {
                            this.loading = false;
                            if (res.data.data.flag) {
                                // /^[A-Za-z0-9]+$/
                                this.$message.success("添加成功！");
                                this.getList();
                                this.addShow = false;
                            } else {
                                this.$message.error(res.data.data.msg);
                            }
                        });
                } else {
                    return false;
                }
            });
        },
        toEdit(car) {
            if (this.carTypes[0].label == "全部") {
                this.carTypes.shift();
            }
            this.editCar.sid = car.sid;
            this.editCar.stallArea = car.stallArea;
            this.editCar.stallNum = car.stallNum;
            this.editCar.stallType = car.stallType;
            this.editShow = true;
        },
        editClose() {
            if (this.carTypes[0].label != "全部") {
                this.carTypes.unshift({ value: null, label: "全部" });
            }

            this.editShow = false;
            this.$nextTick(() => {
                this.$refs.registerRules.resetFields();
            });
        },
        editSend(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    axios
                        .post("/api/stall/update", this.editCar)
                        .then((res) => {
                            this.loading = false;
                            if (res.data.data.flag) {
                                this.$message.success("更新成功");
                                this.getList();
                                this.editShow = false;
                            } else {
                                this.$message.error(res.data.data.msg);
                            }
                        });
                } else {
                    // console.log('error submit!!');
                    return false;
                }
            });
        },
        async useStall(sid) {
            const re = await this.$confirm(
                "此操作将预定该车位, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            // console.log(re)
            if (re != "confirm") {
                this.$message.info("已取消预定！");
            } else {
                axios
                    .get(
                        "/api/stall/orderStall?uid=" + this.uid + "&sid=" + sid
                    )
                    .then((res) => {
                        if (res.data.data) {
                            this.$message.success("预定成功！");
                            this.getList();
                        } else {
                            this.$message.error("预定失败！");
                        }
                    });
            }
        },
        async carDelete(sid) {
            const re = await this.$confirm(
                "此操作将永久删除该车位, 是否继续?",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            if (re != "confirm") {
                this.$message.info("已取消删除！");
            } else {
                axios.get("/api/stall/del?sid=" + sid).then((res) => {
                    if (res.data.data) {
                        this.$message.success("删除成功！");
                        this.getList();
                    } else {
                        this.$message.error("删除失败，青虫性操作！");
                    }
                });
            }
        },
    },
    mounted() {
        this.getList();
    },
};
</script>
<script setup>
</script>
<style scoped>
.stall-management {
  margin: 20px;
}
.search-area {
  margin-bottom: 20px;
}
</style>