<!--
 * 停泊车辆管理
-->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <i class="iconfont icon-search-menu" style="margin: 5px; font-size: 22px">停泊车辆查询</i>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input placeholder="车牌号" v-model="queryInfo.card" clearable></el-input>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="用户" v-model="queryInfo.nike" clearable></el-input>
        </el-col>
        <el-col :span="3">
          <el-button size="small" type="success" icon="iconfont icon-search-menu" style="font-size: 18px" @click="getList"> 搜索</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="cars" border stripe>
        <el-table-column width="50" label="序号" align="center" type="index"></el-table-column>
        <el-table-column label="用户" align="center">
          <template slot-scope="scope">
            {{ scope.row.user.nike }}
          </template>
        </el-table-column>
        <el-table-column label="车牌号" align="center">
          <template slot-scope="scope">
            {{ scope.row.user.card }}
          </template>
        </el-table-column>
        <el-table-column label="联系电话" align="center">
          <template slot-scope="scope">
            {{ scope.row.user.phone }}
          </template>
        </el-table-column>
        <el-table-column label="停车地点" prop="stallArea" align="center"></el-table-column>
        <el-table-column label="停车车位" prop="stallNum" align="center"></el-table-column>
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
    </el-card>
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
                nike: "",
                card: "",
                pagenum: 1,
                pageSize: 5,
            },
            cars: [],
        };
    },
    methods: {
        getList() {
            axios.post("/api/stall/pageStallCar", this.queryInfo).then((res) => {
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
    },
    mounted() {
        this.getList();
    },
};
</script>
<style scoped>
/* 定义一些通用的颜色和字体大小 */
:root {
  --primary-color: #409eff;
  --success-color: #67c23a;
  --danger-color: #f56c6c;
  --font-size-normal: 14px;
}

/* 面包屑导航样式 */
el-breadcrumb {
  margin-bottom: 20px;
}

/* 卡片视图区域样式 */
el-card {
  margin-top: 20px;
}

/* 表格样式 */
el-table {
  margin-top: 15px;
}

/* 分页控件样式 */
el-pagination {
  margin-top: 15px;
  text-align: right;
}

/* 按钮样式 */
el-button {
  margin: 0 10px;
  font-size: var(--font-size-normal);
}

/* 搜索按钮样式 */
el-button--success {
  background-color: var(--success-color);
  border-color: var(--success-color);
}

/* 输入框样式 */
el-input,
el-textarea {
  width: 100%;
}

/* 表单项标签样式 */
el-form-item__label {
  font-size: var(--font-size-normal);
}

/* 表单项内容样式 */
el-form-item__content {
  margin-left: 0;
}
</style>