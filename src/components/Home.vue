<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header class="home-header">
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商管理后台</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 左侧导航栏 -->
      <el-aside width="200px">Aside</el-aside>
      <!-- 右侧主体内容 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout() {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="less" scope>
.home-container {
  height: 100%;
}

.el-header.home-header {
  background-color: #24292f;
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      height: 50px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>