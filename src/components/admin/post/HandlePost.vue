<template>
  <div class="add-post">
    <!-- 分割线 -->
    <div class="split-line">
      <span><i class="icon-news iconfont"></i> 发表新闻</span>
    </div>
    <!-- 面包导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/_news' }">新闻管理</el-breadcrumb-item>
      <el-breadcrumb-item>发表新闻</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 富文本 -->
    <el-card>
      <el-row :gutter="20">
        <el-form :model="newsForm" :rules="newsRules" ref="newsForm">
          <el-col :span="6">
            <div class="title">
              <el-form-item prop="title">
                <el-input
                  v-model="newsForm.title"
                  placeholder="请输入新闻标题"
                ></el-input>
              </el-form-item>
            </div>
            <el-form-item prop="url">
              <el-upload
                class="avatar-uploader"
                :action="bindImg('uploadfile')"
                :show-file-list="false"
                :on-success="handleEditAvatarSuccess"
                name="files"
              >
                <img
                  v-if="newsForm.url"
                  :src="bindURL(newsForm.url)"
                  class="avatar"
                  ref="preview"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item prop="content">
              <quill-editor
                ref="editor"
                v-model="newsForm.content"
                :content="newsForm.html"
                :options="editorOption"
                class="quill"
              />
            </el-form-item>
            <div class="btns">
              <el-button type="success" @click="submitNews('newsForm')" round
                >发表</el-button
              >
            </div>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { bindImg, bindURL } from '@/plugins/function'
import { addNews } from '@api'
export default {
  props: ['id'],
  data() {
    return {
      newsForm: {
        title: '',
        content: ''
      },
      newsRules: {
        title: [{ required: true, message: '请输入新闻标题', trigger: 'blur' }],
        url: [{ required: true, message: '请选择新闻封面', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入新闻内容', trigger: 'blur' }
        ]
      },
      editorOption: {}
    }
  },
  methods: {
    bindImg,
    bindURL,
    // 提交新闻
    submitNews(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        Object.assign(this.newsForm, {
          author: this.user.id,
          state: 0,
          id: Date.now() % 9999999,
          updateTime: new Date()
        })
        const { success } = await addNews(this.newsForm)
        if (success) {
          this.$message.success('添加成功')
          this.$router.push('/_news')
        } else {
          this.$message.error('添加失败')
        }
      })
      //   addNews()
    },
    handleEditAvatarSuccess(res) {
      this.$set(this.newsForm, 'url', res)
    },
    // initPage(id) {
    //   if(id) {
    //     this.newsForm = 
    //   }
    // }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {}
}
</script>

<style lang="less" scoped>
@import '~@/assets/css/common.css';

.el-card {
  margin-top: 10px;
  .title {
    margin-bottom: 10px;
  }
  .cover {
    margin: 0 auto;
  }
  /deep/.ql-toolbar.ql-snow + .ql-container.ql-snow {
    height: 400px;
  }
  .btns {
    .el-button {
      float: right;
      margin: 10px 14px 10px 0;
    }
  }
}
</style>