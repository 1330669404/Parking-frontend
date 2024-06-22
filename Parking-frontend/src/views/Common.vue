<!--
 * 菜单栏
-->
<template>
  <!-- 头部区域 -->
  <el-container class="home-container">
    <el-header>
      <div class="left-logo">
        <span style="font-size: 20px;color: #2b5d88"><h3>停车场管理系统</h3></span>
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
        background-color="#efe8e8"
        text-color="black"
        active-text-color="#2b5d88"
        router
    >
      <!-- 菜单项 -->
      <el-menu-item
          v-for="item in menuList"
          :key="item.id"
          :index="item.path"
          @click="savePath(item.path)"
      >
        <template #title>
          <i :class="item.icon" style="font-size: 22px;color: #2b5d88;"></i>
          <span><b style="font-size: 14px;color: #2b5d88">{{ item.name }}</b></span>
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
                    path: "conmenHome",
                    icon: "iconfont icon-home-menu",
                },
                {
                    name: "个人中心",
                    id: 111,
                    path: "userInfo",
                    icon: "iconfont icon-user-menu",
                },
                {
                    name: "预定停车位",
                    id: 131,
                    path: "carInfo",
                    icon: "iconfont icon-stall-menu",
                },
                {
                    name: "缴费信息",
                    id: 141,
                    path: "cost",
                    icon: "iconfont icon-stall-fee-menu",
                },
            ],
            userInfo: {},
            // isTransition:true
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
        // 点击按钮菜单的折叠与展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
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
    padding-left: 0;
    align-items: center;
    color: #2b5d88;
    font-size: 20px;
    border-bottom: 1px solid grey;
}
.left-logo {
    height: 100%;
    display: flex;
    align-items: center;
}
.left-logo > span {
    margin-left: 15px;
}
.left-logo > img {
    height: 50%;
    margin-left: 20px;
}
.el-aside {
    background-color: white;
}
.el-main {
    background-color: #eaedf1;
}
.el-menu {
    border-right: none;
}
.fa {
    margin-right: 10px;
}
.toggle-button {
    background-color: #2b5d88;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
