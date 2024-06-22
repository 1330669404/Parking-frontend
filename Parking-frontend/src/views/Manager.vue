<!--
 * 菜单栏

-->
<template>
  <!-- 头部区域 -->
  <el-container class="home-container">
    <el-header>
      <div class="left-logo">
        <img src="../assets/logo.png"/>
        <span style="color:#2b5d88;"><h3>停车场管理系统</h3></span>
      </div>
      <div style="text-align: right;width: 50%;padding-right: 25px;color: #2b5d88">
        欢迎您，{{ userInfo.nike }}
      </div>
      <el-button type="danger" icon="iconfont icon-back-button" @click="logout"> 退出登录</el-button>
    </el-header>

    <!-- 水平菜单区域 -->
    <el-menu
        :default-active="activePath"
        class="horizontal-menu"
        mode="horizontal"
        background-color="white"
        text-color="black"
        active-text-color="#2b5d88"
        router
    >
      <!-- 菜单项 -->
      <el-menu-item
          v-for="item in menuList"
          :key="item.id"
          :index="'/' + item.path"
          @click="savePath('/' + item.path)"
      >
        <template slot="title">
          <i :class="item.icon" style="font-size: 22px;color: #2b5d88;"></i>
          <span><b style="font-size: 14px;color: #2b5d88"> {{ item.name }}</b></span>
        </template>
      </el-menu-item>
    </el-menu>

    <!-- 页面主体区域 -->
    <el-container>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import axios from "axios";
export default {
    data() {
        return {
            menuList: [
                {
                    name: "首页",
                    id: 101,
                    path: "maneHome",
                    icon: "iconfont icon-home-menu",
                },
                {
                    name: "用户信息管理",
                    id: 111,
                    path: "userMane",
                    icon: "iconfont icon-user-menu",
                },
                {
                    name: "车位信息管理",
                    id: 131,
                    path: "carmaneger",
                    icon: "iconfont icon-stall-menu",
                },
                {
                    name: "车位费用设置",
                    id: 141,
                    path: "money",
                    icon: "iconfont icon-stall-fee-menu",
                },
                {
                    name: "停泊车辆查询",
                    id: 151,
                    path: "stallMane",
                    icon: "iconfont icon-paring-menu",
                },
                {
                    name: "车辆进出管理",
                    id: 161,
                    path: "carInMane",
                    icon: "iconfont icon-car-in-out-menu",
                },
                {
                    name: "登录日志查询",
                    id: 171,
                    path: "loginInfoMane",
                    icon: "iconfont icon-log-menu",
                },
            ],
            userInfo: {},
            activePath: "/users",
        };
    },
    created() {
        this.activePath = window.sessionStorage.getItem("savePath");
    },
    methods: {
        getUserInfo() {
            const uid = window.sessionStorage.getItem("token");
            axios.get("/api/user/getUserByUid?uid=" + uid).then((res) => {
                this.userInfo = res.data.data;
            });
        },
        logout() {
            window.sessionStorage.clear();
            this.$router.push("/login");
            this.$message("您已退出登录，请重新登录！");
        },
        savePath(savePath) {
            window.sessionStorage.setItem("savePath", savePath);
        },
    },
    mounted() {
        this.getUserInfo();
    },
};
</script>
<style scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #efe8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  font-size: 20px;
  border-bottom: 1px solid grey;
}

.left-logo {
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 25px;
}

.left-logo > span {
  margin-left: 15px;
}

.left-logo > img {
  height: 50px;
}

.horizontal-menu {
  width: 100%; /* 确保菜单宽度占满容器 */
  display: flex; /* 使用Flexbox布局 */
  justify-content: space-between; /* 菜单项平分空间 */
  background-color: #ffffff;
  border-bottom: 1px solid #e6e6e6;
}

.horizontal-menu .el-menu-item {
  height: 60px;
  line-height: 60px;
  flex-grow: 1; /* 使每个菜单项平分空间 */
  text-align: center; /* 文本居中 */
  padding: 0 10px; /* 根据需要调整内边距 */
}

.horizontal-menu .el-menu-item:focus,
.horizontal-menu .el-menu-item:hover {
  background-color: #f2f2f2 !important;
}
/* 其他样式... */
</style>
