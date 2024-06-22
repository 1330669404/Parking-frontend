<!--
 * 车辆信息
-->
<template>
  <div class="vehicle-info">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><i class="iconfont icon-stall-menu">预定停车位</i></el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="search-card">
      <el-form :inline="true" @submit.native.prevent="onSearch">
        <el-form-item label="停车区域">
          <el-input v-model="queryInfo.carArea" placeholder="请选择停车区域"></el-input>
        </el-form-item>
        <el-form-item label="车位类型">
          <el-select v-model="queryInfo.carType" placeholder="请选择车位类型">
            <el-option v-for="type in carTypes" :key="type.value" :label="type.label" :value="type.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车位状态">
          <el-select v-model="queryInfo.carState" placeholder="请选择车位状态">
            <el-option v-for="state in carStates" :key="state.value" :label="state.label"
                       :value="state.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table v-loading="loading" :data="cars" border stripe class="table">


      <el-table-column
          width="50"
          label="序号"
          align="center"
          type="index"
      ></el-table-column>
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
      <el-table-column label="车位收费" prop="stallMoney" align="center">
        <template slot-scope="scope">
          {{ scope.row.stallType === '临时车位' ? `${scope.row.stallMoney}元/时` : `${scope.row.stallMoney}元/月` }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button :type="scope.row.userId ? 'info' : 'warning'" :disabled="scope.row.userId"
                     @click="useStall(scope.row.sid)">
            {{ scope.row.userId ? '已预定' : '预定' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize"
                   layout="total, sizes, prev, pager, next" :total="total" class="pagination">
    </el-pagination>
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
        pageSize: 5,
      },
      cars: [],
      uid: undefined,
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
    async useStall(sid) {
      // 检查用户是否已经预定了一个车位
      const checkReservation = await axios.get("/api/stall/checkReservation?uid=" + this.uid);
      if (checkReservation.data.data) {
        this.$message.warning("您已经预定了一个车位，不能再次预定！");
        return;
      }

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
  },
  mounted() {
    this.getList();
    this.uid = window.sessionStorage.getItem("token");
  },
};
</script>
<style scoped>
.vehicle-info {
  margin: 30px;
}

.search-card {
  margin-bottom: 20px;
}

.table {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
