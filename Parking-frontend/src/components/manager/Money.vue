<!--
 * 车费费用设置
-->
<template>
  <div class="vehicle-fee-settings">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <i class="iconfont icon-stall-fee-menu">车位费用设置</i>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20" class="search-row">
        <el-col :span="18">
          <el-input placeholder="请输入车位类型" v-model="carType" clearable></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="success" icon="el-icon-search" @click="getList">搜索</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="fees" border stripe class="fee-table">
        <el-table-column width="50" label="序号" align="center" type="index"></el-table-column>
        <el-table-column label="车位类型" prop="carType" align="center"></el-table-column>
        <el-table-column label="价位" prop="money" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.carType === '临时车位'">{{ scope.row.money }}元/时</span>
            <span v-else>{{ scope.row.money }}元/月</span>
          </template>
        </el-table-column>
        <el-table-column label="价位说明" prop="moneyDesc" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="feeTime" align="center">
          <template slot-scope="scope">{{ dateFormat(scope.row.feeTime, 3) }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="toEdit(scope.row)" type="primary" class="edit-button">
              <i class="iconfont icon-edit-button"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="车位类型价格修改" :visible.sync="feeShow" width="50%" center @close="editClose">
      <el-form :model="feeEdit" label-width="80px">
        <el-form-item label="车位类型">
          <el-input v-model="feeEdit.carType" disabled></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model.number="feeEdit.money"></el-input>
        </el-form-item>
        <el-form-item label="价格说明">
          <el-input type="textarea" v-model="feeEdit.moneyDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="editClose">取消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="editCon">确认修改</el-button>
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
      carType: "",
      fees: [],
      feeShow: false,
      feeEdit: {
        carType: "",
        money: "",
        moneyDesc: "",
      },
    };
  },
  methods: {
    getList() {
      axios.get("/api/fee/list?carType=" + this.carType).then((res) => {
        this.loading = false;
        this.fees = res.data.data;
      });
    },
    toEdit(row) {
      this.feeEdit.carType = row.carType;
      this.feeEdit.money = row.money;
      this.feeEdit.moneyDesc = row.moneyDesc;
      this.feeShow = true;
      console.log(row);
    },
    editClose() {
      this.feeEdit.carType = "";
      this.feeEdit.money = "";
      this.feeEdit.moneyDesc = "";
      this.feeShow = false;
    },
    tofeeUser() {
    },
    editCon() {
      axios.post("/api/fee/update", this.feeEdit).then((res) => {
        this.loading = false;
        if (res.data.data.flag) {
          this.$message.success("修改成功！");
          this.getList();
          this.editClose();
        } else {
          this.$message.error(res.data.data.msg);
        }
      });
    },
    //时间转换函数
    dateFormat(val, timeType) {
      //将字符串或长整型转为时间类型
      let date = new Date(val);
      //默认格式为'年月日 时:分:秒'
      let resultFormat = "Y年M月D日 h:m:s";
      switch (timeType) {
        case 1:
          resultFormat = "Y年M月D日";
          break;
        case 2:
          resultFormat = "Y-M-D";
          break;
        case 3:
          resultFormat = "Y-M-D h:m:s";
          break;
      }
      let result = formatTime(resultFormat);

      // 格式化日期，如月、日、时、分、秒保证为2位数
      function formatNumber(n) {
        n = n.toString();
        return n[1] ? n : "0" + n;
      }

      // 参数number为毫秒时间戳，format为需要转换成的日期格式
      function formatTime(format) {
        let newArr = [];
        let formatArr = ["Y", "M", "D", "h", "m", "s"];
        newArr.push(date.getFullYear());
        newArr.push(formatNumber(date.getMonth() + 1));
        newArr.push(formatNumber(date.getDate()));

        newArr.push(formatNumber(date.getHours()));
        newArr.push(formatNumber(date.getMinutes()));
        newArr.push(formatNumber(date.getSeconds()));

        for (let i in newArr) {
          format = format.replace(formatArr[i], newArr[i]);
        }
        return format;
      }

      return result;
    }

  },
  mounted() {
    this.getList();
  },
};
</script>
<style scoped>
.vehicle-fee-settings {
  font-size: var(--font-size-normal);
}

.search-row {
  margin-bottom: 20px;
}

.fee-table {
  margin-top: 15px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.edit-button {
  margin: 0 10px;
}

:root {
  --font-size-normal: 14px;
}
</style>