<!--
 * 登录信息管理
-->
<template>
  <div class="login-management">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item><i class="iconfont icon-log-menu">登录日志查询</i></el-breadcrumb-item>
    </el-breadcrumb>

    <div class="search-bar">
      <el-row :gutter="20" class="search-area">
        <el-col :span="6">
          <el-input placeholder="用户名" v-model="queryInfo.person" clearable></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="ip地址" v-model="queryInfo.ip" clearable></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
        </el-col>
      </el-row>
    </div>

    <el-card class="card-container">
      <el-table
          v-loading="loading"
          :data="loginInfos"
          border
          stripe
          class="login-table"
      >
        <el-table-column width="50" label="序号" align="center" type="index"></el-table-column>
                <el-table-column
                    label="用户名"
                    prop="person"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="ip地址"
                    prop="ip"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="浏览器"
                    prop="browser"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="操作系统"
                    prop="os"
                    align="center"
                ></el-table-column>
                <el-table-column
                    label="登录时间"
                    prop="loginTime"
                    align="center"
                ></el-table-column>
      </el-table>
    </el-card>

    <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
    >
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
                person: "",
                ip: "",
                pagenum: 1,
                pageSize: 5,
            },
            loginInfos: [],
        };
    },
    methods: {
        getList() {
            axios
                .post("/api/login-info/getLoginInfoList", this.queryInfo)
                .then((res) => {
                    this.loading = false;
                    this.total = res.data.data.total;
                    this.loginInfos = res.data.data.records;
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
