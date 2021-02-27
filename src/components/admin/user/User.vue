<template>
  <div class="user">
    <div class="split-line">
      <span> <i class="icon-user iconfont"></i> 用户列表</span>
    </div>
    <!-- 面包导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="mixInp" :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入用户账号"
          v-model="query.keyword"
          class="input-with-select"
          clearable
          @clear="getUsers()"
          size="small"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUsers()"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" size="small" @click="showUserDialog(0)" plain>
          添加用户</el-button
        >
      </el-col>
    </el-row>
    <!-- 用户表单 -->
    <el-table :data="userList" stripe style="width: 100%" max-height="560">
      <el-table-column prop="username" label="账号" min-width="100">
      </el-table-column>
      <el-table-column prop="name" label="姓名" min-width="120">
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" min-width="120">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="120">
      </el-table-column>
      <el-table-column prop="level" label="身份" min-width="120">
        <template v-slot="{ row }">
          <el-tag v-if="row.level === 0" effect="dark">学生</el-tag>
          <el-tag v-if="row.level === 1" effect="dark" type="success"
            >教师</el-tag
          >
          <el-tag v-else-if="row.level === 2" effect="dark" type="danger"
            >管理员</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200">
        <template v-slot="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            content="修改用户"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showUserDialog(1, row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除用户"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteUserById(row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="重置密码"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-refresh-left"
              size="small"
              @click="resetPassword(row.id)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query.page"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="query.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加用户 -->
    <el-dialog
      :visible.sync="isAddUserDialog"
      width="25%"
      :close-on-click-modal="false"
      @close="clearDialog('addUserForm')"
    >
      <el-form
        :model="addUserForm"
        :rules="userInfoRules"
        ref="addUserForm"
        label-width="100px"
        size="mini"
        class="user-form"
        hide-required-asterisk
      >
        <el-form-item prop="username">
          <span slot="label"><i class="icon-user iconfont"></i>账号</span>
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <span slot="label"><i class="icon-contacts iconfont"></i>姓名</span>
          <el-input v-model="addUserForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <span slot="label"><i class="icon-lock iconfont"></i>密码</span>
          <el-input v-model="addUserForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item prop="level">
          <span slot="label"><i class="icon-idcard iconfont"></i>身份</span>
          <el-radio v-model="addUserForm.level" label="0">普通</el-radio>
          <el-radio v-model="addUserForm.level" label="1">教师</el-radio>
          <el-radio v-model="addUserForm.level" label="2">管理员</el-radio>
        </el-form-item>
        <el-form-item prop="phone">
          <span slot="label"><i class="icon-mobile iconfont"></i>手机号码</span>
          <el-input v-model="addUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <span slot="label"><i class="icon-mail iconfont"></i>邮箱</span>
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="imgUrl">
          <span slot="label"><i class="icon-camera1 iconfont"></i>头像</span>
          <el-upload
            class="avatar-uploader"
            :action="bindImg('/uploadfile')"
            :show-file-list="false"
            :on-success="handleAddAvatarSuccess"
            name="files"
          >
            <img
              v-if="addUserForm.imgUrl"
              :src="bindUrl(addUserForm.imgUrl)"
              class="avatar"
              ref="preview"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item prop="description">
          <span slot="label"><i class="icon-bulb iconfont"></i>自我描述</span>
          <el-input
            v-model="addUserForm.description"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            resize="none"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddUserDialog = false" size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="submitUserForm('addUserForm')"
          size="small"
          >添 加</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
      :visible.sync="isEditUserDialog"
      width="25%"
      :close-on-click-modal="false"
      @close="clearDialog('editUserForm')"
    >
      <el-form
        :model="editUserForm"
        :rules="userInfoRules"
        ref="editUserForm"
        label-width="100px"
        size="mini"
        class="user-form"
        hide-required-asterisk
      >
        <el-form-item prop="username">
          <span slot="label"><i class="icon-user iconfont"></i>账号</span>
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <span slot="label"><i class="icon-contacts iconfont"></i>姓名</span>
          <el-input v-model="editUserForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="level">
          <span slot="label"><i class="icon-idcard iconfont"></i>身份</span>
          <el-radio v-model="editUserForm.level" :label="0">学生</el-radio>
          <el-radio v-model="editUserForm.level" :label="1">教师</el-radio>
          <el-radio v-model="editUserForm.level" :label="2">管理员</el-radio>
        </el-form-item>
        <el-form-item prop="phone">
          <span slot="label"><i class="icon-mobile iconfont"></i>手机号码</span>
          <el-input v-model="editUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <span slot="label"><i class="icon-mail iconfont"></i>邮箱</span>
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="imgUrl">
          <span slot="label"><i class="icon-camera1 iconfont"></i>头像</span>
          <el-upload
            class="avatar-uploader"
            :action="bindImg('uploadfile')"
            :show-file-list="false"
            :on-success="handleEditAvatarSuccess"
            name="files"
          >
            <img
              v-if="editUserForm.avatarImgUrl"
              :src="bindUrl(editUserForm.avatarImgUrl)"
              class="avatar"
              ref="preview"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item prop="description">
          <span slot="label"><i class="icon-bulb iconfont"></i>自我描述</span>
          <el-input
            v-model="editUserForm.description"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            resize="none"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditUserDialog = false" size="small"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="submitUserForm('editUserForm')"
          size="small"
          >修 改</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUser,
  addUser,
  editUser,
  resetPassword as resetPwd,
  deleteUser
} from '@api'

import {
  checkEmail,
  checkPhone,
  bindUrl,
  bindImg,
  convertDeepCopy
} from '@/plugins/function'

const ADD = 0
const EDIT = 1
const DEFAULT_PWD = 123456
export default {
  data() {
    return {
      userList: [{}],
      query: {
        page: 1, // 当前页
        size: 10, // 最大页数
        keyword: null
      },
      total: 10,
      isAddUserDialog: false,
      isEditUserDialog: false,
      addUserForm: {},
      editUserForm: {
        avatarImgUrl: ''
      },
      userInfoRules: {
        username: [
          { required: true, message: '输入账号', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '输入用户名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        level: [{ required: true, message: '选择身份', trigger: 'blur' }],
        phone: [
          { required: true, message: '输入电话号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '输入电子邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        avatarImgUrl: [{ required: true, message: '选择头像', trigger: 'blur' }]
      }
    }
  },
  methods: {
    bindUrl,
    bindImg,
    // 单页数据量
    handleSizeChange(size) {
      this.query.size = size
      this.query.page = 1
      this.getUsers()
    },
    // 当前页
    handleCurrentChange(currentIndex) {
      this.query.page = currentIndex
      this.getUsers()
    },
    // 获取用户列表
    async getUsers() {
      const { list, total } = await getUser(this.query)
      this.total = total
      this.userList = list
    },
    // 图片上传成功处理
    handleAddAvatarSuccess(res) {
      this.$set(this.addUserForm, 'avatarImgUrl', res)
    },
    // 图片修改成功
    handleEditAvatarSuccess(res) {
      this.$set(this.editUserForm, 'avatarImgUrl', res)
    },
    // 显示用户表单
    showUserDialog(flag, formData) {
      switch (flag) {
        case ADD:
          this.isAddUserDialog = true
          break
        case EDIT:
          this.isEditUserDialog = true
          this.editUserForm = convertDeepCopy(formData)
          break
      }
    },
    // 处理用户表单
    handleUserForm(formName, formData, flag) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        if (flag === ADD) {
          const { success } = await addUser(formData)
          if (success) {
            this.$message.success('添加成功')
            this.isAddUserDialog = false
          } else {
            this.$message.error('添加失败')
          }
        } else {
          const { success } = await editUser(formData)
          console.log(success)
          if (success) {
            this.$message.success('修改成功')
            this.isEditUserDialog = false
          } else {
            this.$message.error('修改失败')
          }
        }
        this.getUsers()
      })
    },
    // 提交用户表单
    submitUserForm(formName) {
      switch (formName) {
        case 'addUserForm':
          this.addUserForm.id = Date.now() % 9999999
          this.handleUserForm(formName, this.addUserForm, ADD)
          break
        case 'editUserForm':
          this.handleUserForm(formName, this.editUserForm, EDIT)
          break
      }
    },
    // 重置密码
    async resetPassword(id) {
      this.$confirm('此操作将重置密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { success } = await resetPwd({ id, password: DEFAULT_PWD })
          if (success) {
            // this.getUsers()
            this.$message.success('重置密码成功，密码为：123456')
          } else {
            this.$message.error('重置密码失败')
          }
        })
        .catch(() => {
          this.$message.info('已取消')
        })
    },
    // 根据id删除用户
    deleteUserById(id) {
      this.$confirm('此操作将删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { success } = await deleteUser(id)
          if (success) {
            this.$message.success('删除成功')
            this.getUsers()
          } else {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {
          this.$message.info('已取消')
        })
    },
    clearDialog() {}
  },
  created() {
    this.getUsers()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/css/common.css';
</style>