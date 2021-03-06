<template>
  <div class="post">
    <el-card class="nav-pane">
      <!-- <el-main> -->
      <!-- 顶部导航 -->
      <ul class="nav-share" v-show="false">
        <li class="nav-share-item"><a href="javascript:;">全部</a></li>
        <li class="nav-share-item"><a href="javascript:;">站内公告</a></li>
        <li class="nav-share-item"><a href="javascript:;">笔经面经</a></li>
        <li class="nav-share-item"><a href="javascript:;">我要提问</a></li>
        <li class="nav-share-item"><a href="javascript:;">技术交流</a></li>
        <li class="nav-share-item"><a href="javascript:;">产品运营</a></li>
        <li class="nav-share-item"><a href="javascript:;">留学生</a></li>
        <li class="nav-share-item"><a href="javascript:;">职业发展</a></li>
        <li class="nav-share-item"><a href="javascript:;">招聘信息</a></li>
        <li class="nav-share-item"><a href="javascript:;">资源分享</a></li>
        <li class="nav-share-item"><a href="javascript:;">猿生活</a></li>
      </ul>
      <!-- 标签页 -->
      <el-tabs>
        <el-tab-pane label="最新回复"></el-tab-pane>
        <el-tab-pane label="最新发表"></el-tab-pane>
        <el-tab-pane label="最热"></el-tab-pane>
        <el-tab-pane label="精华"> </el-tab-pane>
      </el-tabs>
      <el-button
        type="danger"
        class="addpost"
        size="mini"
        plain
        @click="goPostSubmit()"
        ><i class="el-icon-edit-outline"></i>我要发布</el-button
      >
      <ul>
        <li class="postdesc" v-for="item in postList" :key="item.id">
          <a @click="goPostById(item)" href="javascript:;"
            ><h3>{{ item.title }}</h3></a
          >
          <p>
            <span class="author"
              ><i class="iconfont icon-user"></i>{{ item.author }}</span
            >
            <span class="createDate"
              ><em>{{ item.createTime | formatDate }}</em
              >发表</span
            >
            <span class="replyDate"
              >最后回复时间: <em>{{ item.lastReplyTime | formatDate }}</em>
            </span>
          </p>
          <p class="icons">
            <i class="el-icon-chat-dot-round">2</i>
            <i class="icon-dianzan iconfont">2</i>
            <i class="el-icon-view">123</i>
          </p>
        </li>
      </ul>
      <!-- 分页 -->
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="query.size"
        @current-change="handleCurrent"
        v-if="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getPostList, getUser } from '@api'
import { mapMutations, mapState } from 'vuex'
import { findUserById } from '@/plugins/function'
export default {
  data() {
    return {
      postList: [],
      total: 10,
      query: {
        page: 1,
        size: 10,
        keyword: null
      },
      user: []
    }
  },
  methods: {
    ...mapMutations(['initCurrentPost']),
    // 获取帖子列表
    async getPost() {
      const { list, total } = await getPostList(this.query)
      this.postList = list
      this.postList.forEach((item) => {
        const post = findUserById(item.authorId, this.user)
        item.author = post && post.name
      })
      this.total = total
    },
    // 通过id跳转到详情页
    async goPostById(data) {
      this.initCurrentPost(data)
      this.$router.push(`/post/${data.id}`)
      // console.log(id)
    },
    // 添加文章
    goPostSubmit() {
      if (this.loginStatus === false) {
        this.$message.error('请先登录')
        return
      }
      this.$router.push('/addPost')
    },
    // 当前页
    handleCurrent(currentIndex) {
      this.query.page = currentIndex
      this.getPost()
    }
  },
  computed: {
    ...mapState(['loginStatus'])
  },
  created() {
    this.getPost()
    getUser()
      .then((res) => {
        this.user = res
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>

<style lang="less" scoped>
.post {
  .el-divider /deep/.el-divider--horizontal {
    margin: 10px 0;
  }
}
.nav-share {
  display: flex;
  flex-wrap: wrap;
  .nav-share-item {
    width: 12.5%;
    padding-bottom: 10px;
  }
}
.nav-pane {
  position: relative;
  .addpost {
    position: absolute;
    right: 14px;
    top: 12px;
    i {
      padding-right: 6px;
    }
  }
}
.postdesc {
  position: relative;
  font-size: 14px;
  letter-spacing: 0.1em;
  padding: 10px 0;
  border-bottom: 1px dashed #ccc;
  a {
    color: rgb(0, 0, 238);
    &:hover {
      color: red;
    }
  }
  em {
    font-style: normal;
    color: #95979b;
  }
  .icons {
    position: absolute;
    bottom: 20px;
    right: 0;
    i {
      font-size: 16px;
      padding: 0 4px;
    }
  }
  p {
    margin: 0;
    margin-top: 10px;
    span {
      margin-right: 10px;
    }
  }
}
</style>
