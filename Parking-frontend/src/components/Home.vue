<!--
 * 系统首页
-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><i
                    class="iconfont icon-home-menu"
                    style="margin: 5px; font-size: 22px"
                >
                    首页</i></el-breadcrumb-item>
        </el-breadcrumb>
        <el-row style="background-color: white;padding: 0 0 50px 25px;">

            <el-col :span="24" style="font-size: 24px; text-align: center;color: #3eb628">
                <h1>欢迎访问停车场管理系统</h1>
            </el-col>

            <el-col :span="18" style="text-align: center;">
                <img :src="require('@/assets/img/03.jpg')" style="text-align:center;height: 100vh;width: 85vw">
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    data() {
        return {

        };
    },
    methods: {

    },
    mounted() {

    },
};
</script>
<style scoped>

</style>
