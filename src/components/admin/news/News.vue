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
        <el-button type="success" size="small" @click="goPostDetail(0)" plain>
          发布新闻</el-button
        >
      </el-col>
    </el-row>
    <!-- 新闻表格  -->
    <el-table :data="newsList" stripe style="width: 100%" max-height="560">
      <el-table-column prop="url" label="封面" min-width="60">
        <template v-slot="{ row }">
          <el-avatar
            :size="60"
            :src="bindImg(row.url)"
            shape="square"
          ></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="100">
      </el-table-column>
      <el-table-column prop="name" label="作者" min-width="80">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="120">
        <template v-slot="{ row }">
          {{ row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" min-width="120">
        <template v-slot="{ row }">
          {{ row.updateTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" min-width="120">
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
              @click="showNewsDialog(row)"
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
              @click="goPostDetail(1, row)"
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
    <!-- 新闻审核 -->
    <el-dialog :visible.sync="isVerifyDialog" width="34%">
      <div class="content">
        <p class="brief">
          新闻封面:
          <span>
            <img
              :src="bindURL(currentForm.url)"
              alt=""
              width="100"
              height="100"
            />
          </span>
        </p>
        <p>
          新闻标题:<span>{{ currentForm.title }}</span>
        </p>
        <p>新闻内容:<span class="mark" v-html="currentForm.content"></span></p>
        <p>
          新闻时间:<span>{{ currentForm.createTime | formatDate }}</span>
        </p>
        <p>
          更新时间:<span>{{ currentForm.updateTime | formatDate }}</span>
        </p>
        <p>
          新闻状态:<span>
            <el-radio
              v-model="currentForm.state"
              :label="0"
              :disabled="currentForm.state === 1"
              >未发表</el-radio
            >
            <el-radio v-model="currentForm.state" :label="1"
              >已发表</el-radio
            ></span
          >
        </p>
        <p></p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isVerifyDialog = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitVerify()" size="small"
          >提 交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getNewsList, deleteNews, getUser, editNews } from '@api'
import {
  findUserById,
  bindImg,
  bindURL,
  convertDeepCopy
} from '@/plugins/function'
import { mapMutations } from 'vuex'
const ADD = 0
const EDIT = 1

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
      isAddNewsDrawer: false,
      isVerifyDialog: false,
      currentForm: {}
    }
  },
  methods: {
    ...mapMutations(['initCurrentNews']),
    bindImg,
    bindURL,
    // 获取新闻
    async getNews() {
      const { list, total } = await getNewsList(this.query)
      this.newsList = list
      this.newsList.forEach((item) => {
        const news = findUserById(Number(item.author), this.user)
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
    // 跳转到文章
    goPostDetail(flag, row) {
      switch (flag) {
        case ADD:
          this.$router.push('/_hNews')
          break
        case EDIT:
          this.initCurrentNews(row)
          this.$router.push(`/_hNews/${row.id}`)
          break
      }
    },
    // 显示审核对话框
    showNewsDialog(row) {
      this.isVerifyDialog = true
      this.currentForm = convertDeepCopy(row)
    },
    // 提交审核
    async submitVerify() {
      const { success } = await editNews(this.currentForm)
      if (success) {
        this.$message.success('修改成功')
        this.getNews()
        this.isVerifyDialog = false
      } else {
        this.$message.error('修改失败')
      }
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
.content {
  letter-spacing: 2px;
  p {
    line-height: 26px;
    color: #000;
    margin-bottom: 4px;
    span {
      display: block;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 4px 20px;
      box-sizing: border-box;
      color: #666;
    }
    span img {
      vertical-align: top;
    }
  }
  .brief > span {
    border-color: transparent;
  }
  .mark {
    background-color: #f3f3f3;
  }
}
</style>