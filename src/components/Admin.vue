<template>
  <div class="admin">
    <el-container class="main-container">
      <el-header>
        <div>
          <el-menu
            class="el-menu-demo"
            mode="horizontal"
            background-color="#444444"
            text-color="#eee"
            active-text-color="#ffd04b"
          >
            <el-menu-item
              ><img src="../assets/logo.png" alt="" class="logo"
            /></el-menu-item>
            <el-menu-item class="logo-title">校友服务平台 - 后台</el-menu-item>
            <el-submenu class="user-info" index="1" v-if="currentUser">
              <template slot="title">
                <img :src="bindURL(currentUser.avatarImgUrl)" class="avatar" />
                <span>{{ currentUser.name }}</span>
              </template>
              <el-menu-item @click="logout"
                ><i class="icon-export iconfont"></i>退出系统</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '64px' : '260px'">
          <div class="toggle-menu" @click="toToggleMenu">|||</div>
          <el-menu
            :default-active="activePath"
            background-color="#fff"
            text-color="#000"
            active-text-color="#F56C6C"
            :collapse="isCollapse"
            :collapse-transition="false"
            router
          >
            <el-menu-item index="/_user">
              <i class="iconfont icon-user"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="/_advice">
              <i class="iconfont icon-unorderedlist"></i>
              <span slot="title">投诉管理</span>
            </el-menu-item>
            <el-menu-item index="/_donate">
              <i class="iconfont icon-wallet"></i>
              <span slot="title">捐献管理</span>
            </el-menu-item>
            <el-menu-item index="/_news">
              <i class="iconfont icon-news"></i>
              <span slot="title">新闻管理</span>
            </el-menu-item>
            <el-menu-item index="/_post">
              <i class="iconfont icon-fly"></i>
              <span slot="title">帖子管理</span>
            </el-menu-item>
            <el-menu-item index="/_comment">
              <i class="iconfont icon-comment1"></i>
              <span slot="title">评论管理</span>
            </el-menu-item>
            <el-menu-item index="/_log">
              <i class="iconfont icon-flag"></i>
              <span slot="title">日志管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { bindURL } from '@/plugins/function'
export default {
  data() {
    return {
      currentUser: JSON.parse(sessionStorage.getItem('userInfo')),
      activePath: sessionStorage.getItem('currentIndexA'),
      isCollapse: false
    }
  },
  methods: {
    bindURL,
    //
    toToggleMenu() {
      this.isCollapse = !this.isCollapse
    },
    // 登出
    logout() {
      this.$router.push('/login')
      sessionStorage.clear()
    }
  },
  created() {}
}
</script>

<style scoped lang="less">
.admin {
  min-width: 800px;
  height: 100%;
}
.main-container {
  height: 100%;
}

.el-header {
  padding: 0 0;
  .logo {
    height: 50px;
    pointer-events: none;
  }
  .logo-title {
    font-size: 20px;
  }
  .user-info {
    float: right;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 6px;
    }
  }
  .iconfont {
    color: #fff;
    margin-right: 20px;
  }
}

.el-aside {
  box-shadow: 0 10px 10px #000;
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  .iconfont {
    color: #000;
    // vertical-align: bottom;
  }
}

.iconfont {
  margin-right: 10px;
  font-size: 18px;
  color: #fff;
}

.el-submenu,
.el-menu-item {
  span {
    font-size: 16px;
  }
}

.toggle-menu {
  width: 100%;
  color: #6c5ce7;
  text-align: center;
  padding: 10px 0;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: letter-spacing 0.5s;
}

.toggle-menu:hover {
  color: blue;
  letter-spacing: 0.5em;
}

.el-menu-item {
  text-align: center;
  letter-spacing: 0.3em;
}
</style>
