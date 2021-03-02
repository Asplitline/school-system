<template>
  <div class="news">
    <div class="split-line">
      <span><i class="icon-news iconfont"></i> 新闻列表</span>
    </div>
    <!-- 面包导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>新闻管理</el-breadcrumb-item>
      <el-breadcrumb-item>新闻列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="mixInp" :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入新闻标题"
          v-model="query.keyword"
          class="input-with-select"
          clearable
          @clear="getNews()"
          size="small"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getNews()"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="success" size="small" @click="goPostDetail()" plain>
          发布新闻</el-button
        >
      </el-col>
    </el-row>
    <!-- 新闻表格  -->
    <el-table :data="newsList" stripe style="width: 100%" max-height="560">
      <el-table-column prop="title" label="标题" min-width="100">
      </el-table-column>
      <el-table-column prop="content" label="内容" min-width="140">
        <template v-slot="{ row }">
          <div v-html="row.content"></div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="作者" min-width="80">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="80">
        <template v-slot="{ row }">
          {{ row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" min-width="80">
        <template v-slot="{ row }">
          {{ row.updateTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" min-width="80">
        <template v-slot="{ row }">
          <el-tag v-if="row.state === 0" type="danger">未发表</el-tag>
          <el-tag v-else>已发表</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template v-slot="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            content="新闻审核"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-tickets"
              size="small"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="修改新闻"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除新闻"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteNewsById(row.id)"
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
import { getNewsList, deleteNews, getUser } from '@api'
import { findUserById } from '@/plugins/function'
export default {
  data() {
    return {
      newsList: [],
      user: [],
      query: {
        page: 1, // 当前页
        size: 10, // 最大页数
        keyword: null
      },
      total: 10,
      isAddNewsDrawer: false
    }
  },
  methods: {
    // 获取新闻
    async getNews() {
      const { list, total } = await getNewsList(this.query)
      this.newsList = list
      this.newsList.forEach((item) => {
        const news = findUserById(Number(item.author), this.user)
        // console.log(item.author, news)
        item.name = news && news.name
      })
      // console.log(this.newsList)
      this.total = total
    },
    // 通过id删除新闻
    async deleteNewsById(id) {
      this.$confirm('此操作将删除新闻, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { success } = await deleteNews(id)
          if (success) {
            this.$message.success('删除成功')
            this.getNews()
          } else {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {
          this.$message.info('已取消')
        })
    },
    // 跳转到文章详情
    goPostDetail() {
      // this.$router.push('/_hPost')
      this.$router.push(`/_hPost/1`)
    },
    // 最大页
    handleSizeChange(size) {
      this.query.size = size
      this.query.page = 1
      this.getNews()
    },
    // 当前页
    handleCurrentChange(currentIndex) {
      this.query.page = currentIndex
      this.getNews()
    }
  },
  created() {
    this.getNews()
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
@import '~@/assets/css/common.css';
</style>