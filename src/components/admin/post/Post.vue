<template>
  <div>
    <div class="split-line">
      <span><i class="icon-fly iconfont"></i> 帖子列表</span>
    </div>
    <!-- 面包导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>帖子管理</el-breadcrumb-item>
      <el-breadcrumb-item>帖子列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="mixInp" :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入文章名称"
          v-model="query.keyword"
          class="input-with-select"
          clearable
          @clear="getPosts()"
          size="small"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getPosts()"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- 帖子表格  -->
    <el-table :data="postList" stripe style="width: 100%" max-height="560">
      <el-table-column prop="title" label="标题" min-width="200">
      </el-table-column>
      <el-table-column prop="author" label="发布者" min-width="80">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="100">
        <template v-slot="{ row }">
          {{ row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="编辑时间" min-width="100">
        <template v-slot="{ row }">
          {{ row.updateTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column
        prop="lastReplyTime"
        label="最有一次回复时间"
        min-width="100"
      >
        <template v-slot="{ row }">
          {{ row.lastReplyTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="replyNum" label="回帖数量" min-width="100">
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
              @click="deletePostById(row.id)"
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
import { getPostList, getUserList, deletePost } from '@api'
import { findUserById } from '@/plugins/function'
export default {
  data() {
    return {
      postList: [{}],
      userList: [],
      query: {
        page: 1, // 当前页
        size: 10, // 最大页数
        keyword: null
      },
      total: 10,
      isAddPostDialog: false,
      isEditPostDialog: false
    }
  },
  methods: {
    // 获取帖子列表
    async getPosts() {
      const { list, total } = await getPostList(this.query)
      this.postList = list
      this.postList.forEach((item) => {
        const user = findUserById(item.authorId, this.userList)
        item.author = user && user.name
      })
      this.total = total
    },
    // 根据id 删除帖子
    deletePostById(id) {
      this.$confirm('此操作将删除帖子, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { success } = await deletePost(id)
          if (success) {
            this.$message.success('删除成功')
            this.getPosts()
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
      this.query.size = size
      this.query.page = 1
      this.getPosts()
    },
    // 当前页
    handleCurrentChange(currentIndex) {
      this.query.page = currentIndex
      this.getPosts()
    }
  },
  created() {
    this.getPosts()
    getUserList()
      .then((res) => {
        this.userList = res
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/css/common.css';
</style>
