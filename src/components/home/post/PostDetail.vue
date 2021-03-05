<template>
  <div class="post-detail">
    <el-card shadow="always">
      <a href="#/post" class="back">
        <i class="el-icon-d-arrow-left"></i>
      </a>
      <el-container class="postDetail">
        <el-main>
          <div class="postTitle">
            <h2>{{ currentPost.title }}</h2>
          </div>
          <!-- 文章描述 -->
          <div class="postdesc">
            <el-row>
              <el-col :span="2">
                <el-avatar
                  shape="square"
                  :size="36"
                  :src="bindImg(currentAuthor.avatarImgUrl)"
                ></el-avatar>
              </el-col>
              <el-col :span="12">
                <div class="content">
                  <a href="javascript:;"
                    ><h4>{{ currentAuthor.name }}</h4>
                  </a>
                  <span class="createDate"
                    >{{ currentAuthor.createTime | formatDate }}发表</span
                  >
                </div>
                <p class="icons">
                  <i class="el-icon-chat-dot-round">2</i>
                  <i class="icon-dianzan iconfont">2</i>
                  <i class="el-icon-view">123</i>
                </p>
              </el-col>
            </el-row>
          </div>
          <!-- 文章内容 -->
          <div class="postContent">
            <div v-html="currentPost.htmlContent" v-highlight></div>
          </div>
          <el-divider> </el-divider>
          <!-- 评论区域 -->
          <p class="replyTitle">
            <i class="el-icon-chat-dot-round"></i>回复<span
              >({{ commentNum }})</span
            >
          </p>
          <div class="postRely">
            <div class="comment">
              <div class="content" v-if="currentComment">
                <el-row v-for="(item, index) in currentComment" :key="item.id">
                  <el-col :span="1">
                    <el-avatar
                      shape="square"
                      :size="36"
                      :src="bindImg(findNameById(item.userId).img)"
                    ></el-avatar>
                  </el-col>
                  <el-col :span="23" class="info">
                    <a href="javascript:;" class="author"
                      >{{ findNameById(item.userId).name }}
                    </a>
                    <span class="replyDate">{{
                      item.createTime | formatDate
                    }}</span>
                    <div class="text">{{ item.content }}</div>
                    <a
                      href="javascript:;"
                      class="actions"
                      @click="showTextarea(item.id)"
                      v-if="loginStatus === true"
                      >回复</a
                    >
                    <p v-else>
                      请在<a href="javascript:;" class="actions">登录</a
                      >后进行回复
                    </p>
                    <transition name="fade">
                      <div class="replyArea" v-show="currentIndex === item.id">
                        <el-input
                          type="textarea"
                          placeholder="请输入内容"
                          :rows="2"
                          resize="none"
                          v-model="currentComment[index].reply"
                        >
                        </el-input>
                        <div class="btns">
                          <el-button
                            type="info"
                            icon="el-icon-close"
                            size="mini"
                            @click="closeReply()"
                          >
                            取消
                          </el-button>
                          <el-button
                            type="success"
                            icon="el-icon-edit"
                            size="mini"
                            @click="
                              submitReply(item.id, currentComment[index].reply)
                            "
                            >回复</el-button
                          >
                        </div>
                      </div>
                    </transition>
                    <div class="comments" v-if="item.replies">
                      <el-row v-for="reply in item.replies" :key="reply.id">
                        <el-col :span="1">
                          <el-avatar
                            shape="square"
                            :size="36"
                            :src="bindImg(findNameById(reply.userId).img)"
                          ></el-avatar>
                        </el-col>
                        <el-col class="info" :span="15">
                          <a href="javascript:;" class="author"
                            >{{ findNameById(reply.userId).name }}
                          </a>
                          <span class="replyDate">{{
                            reply.createTime | formatDate
                          }}</span>
                          <div class="text">{{ reply.content }}</div>
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="commentArea" v-if="loginStatus === true">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              resize="none"
              v-model="commentForm.content"
              @focus="isShowBtns = true"
              @blur="isShowBtns = false"
            >
            </el-input>
            <transition name="fade">
              <div class="btns" :class="{ hidden: !isShowBtns }">
                <el-button
                  type="info"
                  icon="el-icon-close"
                  size="mini"
                  @click="isShowBtns = true"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="submitComment()"
                  >评论</el-button
                >
              </div>
            </transition>
          </div>
          <div v-else>请先<a href="javascript">登录</a>后进行评论</div>
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import { bindImg, findUserById } from '@/plugins/function'
import { mapState } from 'vuex'
import { getUser, getCommentById, addComment, getReply, addReply } from '@api'
export default {
  props: ['id'],
  data() {
    return {
      user: [],
      currentAuthor: {},
      currentComment: {},
      currentIndex: '',
      currentUser: {},
      isShowBtns: false,
      comment: [],
      commentForm: {
        content: '',
        postId: '',
        userId: ''
      },
      replyForm: {
        content: '',
        postId: '',
        commentId: '',
        userId: '',
        atuserId: ''
      }
    }
  },
  methods: {
    bindImg,
    // 初始化作者信息
    initAuthor() {
      // BUG >> 作者头像显示有问题
      this.currentAuthor = this.user.find(
        (item) => item.id === this.currentPost.authorId
      )
      //   this.$set(this.currentAuthor, 'avatarImgUrl', author.avatarImgUrl)
    },
    // 添加评论
    async submitComment() {
      if (this.commentForm.content.trim().length === 0) {
        this.$message.error('评论不能为空')
        return
      }
      const tempUser = this.$store.state.user
      Object.assign(this.commentForm, {
        userId: tempUser.id,
        postId: this.id
      })
      const { success } = await addComment(this.commentForm)
      if (success) {
        this.$message.success('评论成功')
        this.getComment()
        this.commentForm = {}
      } else {
        this.$message.error('评论失败')
      }
    },
    // 获取评论
    async getComment() {
      this.currentComment = await getCommentById(this.currentPost.id)
      this.currentComment.forEach(async (item) => {
        // console.log(item)
        item.replies = await this.findReplyById(item.id)
      })
    },
    // 获取用户名和头像
    findNameById(id) {
      const user = findUserById(id, this.user)
      return {
        name: user.name || '已注销',
        img: user.avatarImgUrl
      }
    },
    // 获取评论下回复
    async findReplyById(id) {
      return await getReply({ commentId: id })
    },
    // 显示回复框
    showTextarea(index) {
      this.currentIndex = index
    },
    // 关闭回复框
    closeReply() {
      this.currentIndex = 0
      this.replyForm = {}
    },
    // 提交回复框
    async submitReply(id, content) {
      if (content.trim().length === 0) {
        this.$message.error('内容不能为空')
        return
      }
      // const currentUser = this.$store.state.user
      Object.assign(this.replyForm, {
        content,
        postId: this.id,
        commentId: id,
        userId: this.currentUser.id,
        atuserId: this.currentAuthor.id
      })
      const { success } = await addReply(this.replyForm)
      if (success) {
        this.$message.success('回复成功')
        this.getComment()
        this.closeReply()
      } else {
        this.$message.error('回复失败')
      }
    }
  },
  computed: {
    ...mapState(['currentPost', 'loginStatus']),
    commentNum() {
      return this.currentComment.length
    }
  },
  async created() {
    this.user = await getUser()
    this.currentUser = this.$store.state.user
    this.initAuthor()
    this.getComment()
  }
}
</script>
<style lang="less" scoped>
.post-detail {
  .title {
    i {
      margin-right: 6px;
    }
  }
  .postdesc {
    font-size: 14px;
    margin: 24px 0;
    position: relative;
    .content {
      a h4 {
        margin: 0 0 12px 0;
      }
    }
    .el-col-2 {
      width: 5%;
    }
    .icons {
      position: absolute;
      bottom: 0;
      right: 0;
      i {
        font-size: 16px;
        padding: 0 4px;
      }
    }
  }

  .postContent {
    border: 1px dashed #ccc;
    border-radius: 10px;
    padding: 20px;
    letter-spacing: 0.1em;
  }

  .replyTitle {
    font-size: 20px;
    i {
      padding-right: 4px;
    }
  }

  .comment {
    .content {
      font-size: 14px;
      .replyDate {
        margin-left: 12px;
        color: #aaa;
      }
      .actions {
        color: #e74c3c;
      }
      .el-row {
        margin-bottom: 20px;
      }
    }
    .comments {
      margin-top: 6px;
    }
    .text {
      width: 350px;
    }
  }

  .commentArea,
  .replyArea {
    position: relative;
    width: 600px;
    margin-bottom: 30px;
    .btns {
      position: absolute;
      right: 0;
      bottom: -35px;
      margin: 10px 10px 0 0;
      z-index: 99;
    }
  }
  // 动画
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.6s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .hidden {
    visibility: hidden;
  }

  .el-card {
    position: relative;
    .back {
      position: absolute;
      right: 40px;
      top: 40px;
      font-size: 18px;
      padding: 4px 10px;
      border: 1px solid rgba(187, 187, 187, 0.5);
      border-radius: 2px;
      color: rgb(255, 99, 71);
      transition: transform linear 0.2s;
      &:hover {
        background-color: rgb(255, 99, 71);
        color: #fff;
        transform: scale(1.05);
      }
    }
  }
}
</style>