<template>
  <div class="user">
    <el-row>
      <el-col :span="5" :offset="2">
        <!-- 用户信息 -->
        <el-card class="user-info">
          <img :src="bindImg(user.avatarImgUrl)" alt="" />
          <div class="desc">
            <h4 class="username">{{ user.name }}</h4>
            <p>{{ user.description }}</p>
          </div>
        </el-card>
        <!-- 左侧导航栏 -->
        <el-card class="menu-nav">
          <ul>
            <li @click="setActive(1)">
              <a href="javascript:;" :class="{ active: menuIndex === 1 }"
                ><i class="iconfont icon-user">个人信息</i></a
              >
            </li>
            <li @click="setActive(2)">
              <a href="javascript:;" :class="{ active: menuIndex === 2 }"
                ><i class="iconfont icon-edit-square">更改密码</i></a
              >
            </li>
            <li @click="setActive(3)">
              <a href="javascript:;" :class="{ active: menuIndex === 3 }"
                ><i class="iconfont icon-unorderedlist">帖子记录</i></a
              >
            </li>
            <!-- <li @click="setActive(4)">
              <a href="javascript:;" :class="{ active: menuIndex === 4 }"
                ><i class="iconfont icon-solution">投诉记录</i></a
              >
            </li> -->
          </ul>
        </el-card>
      </el-col>
      <!-- 右侧内容区域 -->
      <el-col :span="14" :offset="1">
        <el-card class="content">
          <!-- 用户信息 -->
          <div class="edit-info" v-if="menuIndex === 1">
            <el-form
              key="userInfoForm"
              :model="userInfoForm"
              :rules="userInfoRules"
              ref="userInfoForm"
              label-width="100px"
              size="small"
              :hide-required-asterisk="true"
            >
              <el-form-item prop="username">
                <span slot="label"
                  ><i class="icon-contacts iconfont"></i>账号</span
                >
                <el-input v-model="userInfoForm.username" disabled></el-input>
              </el-form-item>

              <el-form-item prop="name">
                <span slot="label"><i class="icon-user iconfont"></i>昵称</span>
                <el-input v-model="userInfoForm.name"></el-input>
              </el-form-item>

              <el-form-item prop="phone">
                <span slot="label"
                  ><i class="icon-mobile iconfont"></i>手机号码</span
                >
                <el-input v-model="userInfoForm.phone"></el-input>
              </el-form-item>
              <el-form-item prop="email">
                <span slot="label"><i class="icon-mail iconfont"></i>邮箱</span>
                <el-input v-model="userInfoForm.email"></el-input>
              </el-form-item>
              <el-form-item prop="avatarImgUrl">
                <span slot="label"
                  ><i class="icon-camera1 iconfont"></i>头像</span
                >
                <el-upload
                  class="avatar-uploader"
                  :action="bindURL('uploadfile')"
                  :show-file-list="false"
                  :on-success="handleEditAvatarSuccess"
                  name="files"
                >
                  <img
                    v-if="userInfoForm.avatarImgUrl"
                    :src="bindImg(userInfoForm.avatarImgUrl)"
                    class="avatar"
                    ref="preview"
                  />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item prop="description">
                <span slot="label"
                  ><i class="icon-bulb iconfont"></i>自我描述</span
                >
                <el-input
                  v-model="userInfoForm.description"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  resize="none"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="success"
                  @click="submitUserInfo('userInfoForm')"
                  >修改</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <!-- 修改密码 -->
          <div class="edit-password" v-else-if="menuIndex === 2">
            <el-form
              key="passwordForm"
              :model="passwordForm"
              :rules="passwordRules"
              ref="passwordForm"
              size="small"
              label-width="100px"
              :hide-required-asterisk="true"
            >
              <el-form-item prop="oldPassword">
                <span slot="label"
                  ><i class="icon-lock iconfont"></i>旧密码</span
                >
                <el-input
                  v-model="passwordForm.oldPassword"
                  type="password"
                ></el-input>
              </el-form-item>
              <el-form-item prop="newPassword">
                <span slot="label"
                  ><i class="icon-lock iconfont"></i>新密码</span
                >
                <el-input
                  v-model="passwordForm.newPassword"
                  type="password"
                ></el-input>
              </el-form-item>
              <el-form-item prop="confirmPassword">
                <span slot="label"
                  ><i class="icon-lock iconfont"></i>确认密码</span
                >
                <el-input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="success"
                  @click="submitPassword('passwordForm')"
                  >修改</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <!-- 借阅记录 -->
          <div class="post-records" v-else-if="menuIndex === 3">
            <el-table :data="postTable" style="width: 100%" key="postTable">
              <el-table-column prop="title" label="标题" min-width="80">
              </el-table-column>
              <el-table-column prop="textContent" label="内容" min-width="120">
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间"
                min-width="120"
              >
                <template v-slot="{ row }">
                  {{ row.createTime | formatDate }}
                </template>
              </el-table-column>
              <el-table-column prop="replyNum" label="回复数" min-width="60">
              </el-table-column>
              <el-table-column label="操作" min-width="60">
                <template v-slot="{ row }">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="goPostDetail(row)"
                    >详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 投诉记录 -->
          <div class="advice-records" v-else-if="menuIndex === 4">
            <el-table :data="adviceTable" style="width: 100%" key="adviceTable">
              <el-table-column prop="title" label="投诉标题" min-width="80">
              </el-table-column>
              <el-table-column
                prop="description"
                label="投诉内容"
                min-width="80"
              >
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="投诉时间"
                min-width="100"
              >
                <template v-slot="{ row }">
                  {{ row.createTime | formatDate }}
                </template>
              </el-table-column>
              <el-table-column prop="state" label="投诉进度" min-width="60">
                <template v-slot="{ row }">
                  <el-tag v-if="row.state === 0">未回复</el-tag>
                  <el-tag v-else-if="row.state === 1" type="success"
                    >已回复</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="60">
                <template v-slot="{ row }">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="showadviceDetail(row)"
                    >详情</el-button
                  >
                </template>
                <!-- <el-button type="danger" size="mini" disabled>归还</el-button> -->
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { bindImg, convertDeepCopy, bindURL } from '@/plugins/function'
import { mapMutations, mapState } from 'vuex'
import { editUser, resetPassword, getPostByAuthor } from '@api'
export default {
  data() {
    // 验证邮箱
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) return callback()
      callback(new Error('邮箱不合法'))
    }
    // 验证手机
    const checkPhone = (rule, value, callback) => {
      const regPhone = /^1[34578]\d{9}$/
      if (regPhone.test(value)) return callback()
      callback(new Error('手机号码不合法'))
    }
    const checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userInfoForm: {},
      userInfoRules: {
        username: [
          { required: true, message: '输入账号', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '输入用户名', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '输入电话号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '输入电子邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        avatarImgUrl: [{ required: true, message: '选择头像', trigger: 'blur' }]
      },
      passwordForm: {},
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ]
      },
      postTable: [],
      query: {
        page: 1,
        size: 10,
        keyword: null
      },
      total: 10
    }
  },
  methods: {
    ...mapMutations(['initMenuIndex', 'initUser', 'initCurrentPost']),
    bindImg,
    bindURL,
    // 设置当前激活
    setActive(index) {
      this.menuIndex = index
      switch (this.menuIndex) {
        case 1:
          this.showUserInfo()
          break
        case 2:
          this.showChangePassword()
          break
        case 3:
          this.showPostList()
          break
        case 4:
          break
      }
    },
    // 显示个人信息
    showUserInfo() {
      this.userInfoForm = convertDeepCopy(this.user)
    },
    // 提交个人信息
    submitUserInfo(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        const { success } = await editUser(this.userInfoForm)
        if (success === true) {
          this.initUser(this.userInfoForm)
          this.$message.success('修改成功')
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    // 显示修改密码
    showChangePassword() {},
    // 提交密码修改
    submitPassword(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        const { success } = await resetPassword({
          id: this.user.id,
          password: this.passwordForm.confirmPassword
        })
        if (success === true) {
          this.$message.success('修改成功')
          this.$refs[formName].resetFields()
        } else {
          this.$message.error('修改失败')
        }
      })
    },
    // 显示帖子记录
    async showPostList() {
      const { list, total } = await getPostByAuthor({ keyword: this.user.id })
      this.postTable = list
      this.total = total
    },
    // 图片上传成功
    handleEditAvatarSuccess(res) {
      this.$set(this.userInfoForm, 'avatarImgUrl', res)
    },
    goPostDetail(row) {
      this.initCurrentPost(row)
      this.$router.push(`/post/${row.id}`)
    }
  },
  computed: {
    ...mapState(['user']),
    menuIndex: {
      get() {
        const val = this.$store.state.menuIndex || 1
        return typeof val === 'string' ? Number(val) : val
      },
      set(val) {
        this.initMenuIndex(val)
      }
    }
  },
  created() {
    this.setActive(this.menuIndex)
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/css/common.css';
// 用户信息
.user-info {
  margin-bottom: 20px;
  img {
    display: block;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    padding: 6px;
    border: 1px solid #ccc;
    box-shadow: 1px 2px 6px 1px rgb(0 0 0 / 0.1);
    margin: 0 auto;
  }

  .desc {
    text-align: center;
    margin: 20px 0;
    h4 {
      font-size: 24px;
      color: #333;
      margin-bottom: 10px;
    }
    p {
      font-size: 14px;
      color: #777;
      line-height: 24px;
    }
  }
}
// 左侧导航栏
.menu-nav {
  li {
    a {
      display: inline-block;
      width: 100%;
      height: 32px;
      line-height: 32px;
      letter-spacing: 4px;
      text-align: center;
      color: #2c2c54;
      transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.2s;
      border-radius: 4px;
      margin-bottom: 6px;
    }
    a:hover {
      background-color: #e7e7e7;
      color: #2c2c54;
      transform: scale(1.02);
    }
    a.active {
      color: #eff3f5;
      background-color: #6e6666;
    }

    i::before {
      margin-right: 6px;
    }
  }
}
// 帖子表单
.post-records {
  .el-table /deep/.cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
