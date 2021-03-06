<template>
  <div class="home" :class="{ indexS: isIndex }">
    <el-container>
      <!-- 头部导航 -->
      <el-header v-show="!isIndex">
        <el-menu
          :default-active="activeIndex"
          class="w"
          mode="horizontal"
          background-color="#444444"
          text-color="#eee"
          active-text-color="#ffd04b"
          router
        >
          <a href="javascript:;" class="logo">
            <img src="../assets/logo.png" alt="" height="50" />
          </a>
          <el-menu-item index="/index"
            ><i class="icon-home iconfont"></i>首页</el-menu-item
          >
          <el-menu-item index="/post"
            ><i class="icon-fly iconfont"></i>帖子中心</el-menu-item
          >
          <el-menu-item index="/advice"
            ><i class="icon-unorderedlist iconfont"></i>投诉建议</el-menu-item
          >
          <el-menu-item index="/donate"
            ><i class="icon-wallet iconfont"></i>捐赠中心</el-menu-item
          >
          <el-menu-item index="/news"
            ><i class="icon-news iconfont"></i>新闻中心</el-menu-item
          >
          <el-menu-item index="/user" v-show="loginStatus"
            ><i class="icon-user iconfont"></i>个人中心</el-menu-item
          >
          <div class="login">
            <a
              href="javascript:;"
              v-if="loginStatus === false"
              @click="showLoginDialog()"
              >登录</a
            >
            <a href="javascript:;" v-else @click="logOut">注销</a>
          </div>
        </el-menu>
      </el-header>
      <!-- 主体内容 -->
      <el-main class="w content">
        <router-view></router-view>
      </el-main>
      <!-- 页脚 -->
      <el-footer class="footer" style="height: 90px">
        <p class="call-me"><a href="">关于我们</a>|<a href="">联系我们</a></p>
        <p class="copy-right">© 2021 MY All Rights Reserved</p>
      </el-footer>
    </el-container>
    <!-- 登录对话框 -->
    <el-dialog
      :visible.sync="isLoginDialog"
      width="20%"
      class="loginDialog"
      :close-on-click-modal="false"
      @close="clearDialog('loginForm')"
    >
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        size="small"
      >
        <h4 content-position="left" class="title">登录界面</h4>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
            placeholder="输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="输入密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isLoginDialog = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitLogin('loginForm')" size="mini"
          >登 录</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { checkLogin } from '@api'
import { toURL } from '@/plugins/function'
import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      isIndex: false,
      activeIndex: sessionStorage.getItem('currentIndexH'),
      isLogin: this.$store.state.loginStatus,
      loginForm: {},
      loginRules: {
        username: [
          { required: true, message: '请输入用户账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ]
      },
      isLoginDialog: false
    }
  },
  methods: {
    ...mapMutations(['initUser', 'initLoginStatus']),
    // 显示登录对话框
    showLoginDialog() {
      this.isLoginDialog = true
    },
    // 注销
    logOut() {
      sessionStorage.clear()
      this.initUser(null)
      this.initLoginStatus(false)
    },
    // 提交登录
    submitLogin(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        const { success, data } = await checkLogin(toURL(this.loginForm))
        if (success) {
          this.$message.success('登录成功')
          this.isLoginDialog = false
          this.initUser(data)
          this.initLoginStatus(true)
        } else this.$message.error('登录失败')
      })
    },
    // 清空对话框
    clearDialog(formName) {
      this.$refs[formName].resetFields()
    }
  },
  computed: {
    ...mapState(['loginStatus'])
  },
  updated() {
    this.isIndex = sessionStorage.getItem('currentIndexH') === '/index'
    this.activeIndex = sessionStorage.getItem('currentIndexH')
  },
  created() {
    this.activeIndex = sessionStorage.getItem('currentIndexH')
    this.isIndex = sessionStorage.getItem('currentIndexH') === '/index'
  }
}
</script>
<style scoped lang="less">
.home {
  // Sticky -footer
  display: flex;
  flex-flow: column;
  min-height: 100vh;
  // 头部导航
  .el-header {
    background-color: #444;
    padding: 0 20px;

    // logo
    .logo {
      float: left;
      height: 60px;
      padding: 5px 8px;
      margin-right: 10px;
      cursor: pointer;
      box-sizing: border-box;
      outline: none;
    }
    // 自定义 el-menu 样式
    .el-menu--horizontal {
      border: none;
      .el-menu-item:not(.is-disabled):focus,
      & > .el-menu-item.is-active[data-v-8dc7cce2] {
        background-color: #0984e3;
        color: #fff;
      }

      & > .el-menu-item:not(.is-disabled):hover {
        background-color: #0984e399;
      }
      & > .el-menu-item {
        margin-right: 6px;
        font-size: 15px;
        i {
          color: inherit;
          vertical-align: top;
          margin-right: 3px;
        }
      }
      // 登录样式
      .login {
        float: right;
        outline: none;
        margin: 14px 10px;
        a {
          display: inline-block;
          padding: 0 12px;
          line-height: 32px;
          border-radius: 6px;
          font-size: 14px;
          letter-spacing: 2px;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.8);
          i {
            font-size: 13px;
            vertical-align: middle;
          }
        }
        a:hover {
          background-color: #fff;
          color: #1a4d72;
        }
      }
    }
    .el-menu {
      background-color: transparent;
      border: none;
      height: 60px;
    }
  }
  // 内容区域
  .content {
    flex: 1;
  }
  // 页尾
  .footer {
    background-image: linear-gradient(to bottom, #333, #222);
    text-align: center;
    p {
      color: #eee;
      letter-spacing: 0.25em;
      a {
        color: #ddd;
      }
    }
  }
  // 登录对话框
  /deep/.el-dialog__body {
    padding: 10px 20px;
  }
}

.indexS {
  background-image: linear-gradient(to top right, #2d3436, #636e72);
  .footer {
    background-image: none;
  }
}
</style>
