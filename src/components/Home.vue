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
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleMenu">|||</div>
        <!-- 导航菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activeIndex"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObject[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="activeItem(`/${subItem.path}`)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconObject: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-check',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-marketing',
      },
      isCollapse: false,
      activeIndex: '/users',
    }
  },
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    // 获取菜单列表
    async getMenuList() {
      const { data: result } = await this.$http.get('menus')
      if (result.meta.status === 200) {
        this.menuList = result.data
        console.log(result)
      }
    },
    // 缩放菜单
    toggleMenu() {
      this.isCollapse = !this.isCollapse
    },
    activeItem(active) {
      window.sessionStorage.setItem('active', active)
      this.activeIndex = active
    },
  },
  created() {
    this.getMenuList()
    this.activeIndex = window.sessionStorage.getItem('active')
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
  .toggle-button {
    height: 24px;
    line-height: 24px;
    background-color: #666;
    color: #fff;
    text-align: center;
    cursor: pointer;
    font-size: 16px;
    letter-spacing: 0.2em;
  }
  .el-menu {
    border: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>