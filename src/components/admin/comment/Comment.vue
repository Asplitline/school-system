<template>
  <div class="comment">
    <!-- 分割线 -->
    <div class="split-line">
      <span><i class="icon-fly iconfont"></i> 评论列表</span>
    </div>
    <!-- 面包导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      <el-breadcrumb-item>评论列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 评论表格 -->
    <el-table :data="commentList" stripe style="width: 100%" max-height="560">
      <el-table-column prop="title" label="文章名" min-width="100">
      </el-table-column>
      <el-table-column prop="content" label="内容" min-width="150">
      </el-table-column>
      <el-table-column prop="user" label="作者" min-width="100">
      </el-table-column>
      <el-table-column prop="createTime" label="回帖时间" min-width="100">
        <template v-slot="{ row }">
          {{ row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template v-slot="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            content="删除帖子"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteCommentById(row.id)"
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
  </div>
</template>

<script>
import { getCommentList, getUser, getPost, deleteComment } from '@api'
import { findUserById, findPostById } from '@/plugins/function'
export default {
  data() {
    return {
      commentList: [{}],
      allUser: [],
      allPost: [],
      query: {
        pageNum: 1, // 当前页
        pageSize: 10, // 最大页数
        keyword: null
      },
      total: 10
    }
  },
  methods: {
    // 获取评论列表
    async getComments() {
      const { totalPageSize: total, comments: list } = await getCommentList(
        this.query
      )
      this.commentList = list
      this.commentList.forEach((item) => {
        const user = findUserById(item.userId, this.allUser)
        const post = findPostById(item.postId, this.allPost)
        item.user = user && user.name
        item.title = post && post.title
      })
      this.total = total
    },
    // 通过id删除评论
    deleteCommentById(id) {
      this.$confirm('此操作将删除评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { success } = await deleteComment(id)
          if (success) {
            this.$message.success('删除成功')
            this.getComments()
          } else {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {
          this.$message.info('已取消')
        })
    },
    // 最大页
    handleSizeChange(size) {
      this.query.pageSize = size
      this.query.pageNum = 1
      this.getComments()
    },
    // 当前页
    handleCurrentChange(currentIndex) {
      this.query.pageNum = currentIndex
      this.getComments()
    }
  },
  async created() {
    this.allUser = await getUser()
    this.allPost = await getPost()
    await this.getComments()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/css/common.css';
.el-breadcrumb {
  margin-bottom: 16px;
}
</style>
