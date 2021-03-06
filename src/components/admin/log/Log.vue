<template>
  <div class="log">
    <div class="split-line">
      <span><i class="icon-unorderedlist iconfont"></i> 日志列表</span>
    </div>
    <!-- 面包导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>日志管理</el-breadcrumb-item>
      <el-breadcrumb-item>日志列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="mixInp" :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入日志类型"
          v-model="query.keyword"
          class="input-with-select"
          clearable
          @clear="getLogs()"
          size="small"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getLogs()"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- 日志表格 -->
    <el-table :data="logList" stripe style="width: 100%" max-height="560">
      <el-table-column prop="description" label="内容" min-width="120">
      </el-table-column>
      <el-table-column prop="ip" label="操作地址" min-width="120">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="120">
        <template v-slot="{ row }">
          {{ row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="lx" label="日志类型" min-width="120">
        <template v-slot="{ row }">
          <el-tag v-if="row.lx === 2" type="danger">登录日志</el-tag>
          <el-tag v-else>操作日志</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template v-slot="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            content="删除投诉"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteLogById(row.id)"
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
import { getLogList, deleteLog } from '@api'
export default {
  data() {
    return {
      logList: [],
      query: {
        page: 1, // 当前页
        size: 10, // 最大页数
        keyword: null
      },
      total: 10
    }
  },
  methods: {
    // 获取日志列表
    async getLogs() {
      const { list, total } = await getLogList(this.query)
      this.total = total
      this.logList = list
    },
    // 通过id删除日志
    deleteLogById(id) {
      this.$confirm('此操作将删除日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { success } = await deleteLog(id)
          if (success) {
            this.$message.success('删除成功')
            this.getLogs()
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
      this.getLogs()
    },
    // 当前页
    handleCurrentChange(currentIndex) {
      this.query.page = currentIndex
      this.getLogs()
    }
  },
  created() {
    this.getLogs()
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/css/common.css';
</style>
