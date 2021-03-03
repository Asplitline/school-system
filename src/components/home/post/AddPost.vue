<template>
  <div class="add-post">
    <el-alert
      type="warning"
      title="请注意帖子的言语措辞,如果出现恶意中伤别人,诽谤他人,帖子将被删除,发帖人将会被惩罚。"
      show-icon
      center
      class="postAlert"
    >
    </el-alert>
    <!-- 标题 -->
    <el-input
      placeholder="请输入内容"
      v-model="postForm.title"
      class="postTitle"
    >
      <template slot="prepend">标题</template>
    </el-input>

    <!-- 富文本 - 内容 -->
    <quill-editor
      ref="myQuillEditor"
      v-model="postForm.htmlContent"
      :options="options"
    />
    <el-button
      class="submitPost"
      type="danger"
      @click="getContent('myQuillEditor')"
      plain
    >
      提交
    </el-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { addPost } from '@api'
export default {
  data() {
    return {
      content: '',
      options: {},
      postForm: {
        title: '',
        htmlContent: '',
        textContent: ''
      },
      postRules: {
        title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
        htmlContent: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 发表文章
    async getContent(editor) {
      this.postForm.textContent = this.$refs[editor].quill.getText()
      if (!this.validatePost()) return
      Object.assign(this.postForm, {
        authorId: this.user.id
      })
      const { success } = await addPost(this.postForm)
      if (success) {
        this.$message.success('发布成功')
        this.$router.push('/post')
      } else {
        this.$message.error('发布失败')
      }
    },
    // 验证文章
    validatePost() {
      const { title, htmlContent } = this.postForm
      if (title.trim().length === 0) {
        this.$message.warning('标题不能为空')
        return false
      }
      if (htmlContent.trim().length === 0) {
        this.$message.warning('文章内容不能为空')
        return false
      }
      return true
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.add-post {
  .el-alert {
    margin-bottom: 20px;
    /deep/.el-alert__title {
      font-size: 16px;
    }
  }

  /deep/.ql-editor {
    height: 400px;
  }
  .submitPost {
    float: right;
    margin: 10px 10px 0 0;
  }

  .postTitle {
    border-radius: 6px;
    margin-bottom: 20px;
    outline: none;
  }
}
</style>
