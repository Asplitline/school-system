<template>
  <div class="donate">
    <!-- 分割线 -->
    <div class="split-line">
      <span><i class="icon-wallet iconfont"></i> 捐献列表</span>
    </div>
    <!-- 面包导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>捐献管理</el-breadcrumb-item>
      <el-breadcrumb-item>捐献列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 捐献表格 -->
    <el-table :data="donateList" stripe style="width: 100%" max-height="560">
      <el-table-column prop="name" label="捐赠人" min-width="200">
      </el-table-column>
      <el-table-column prop="description" label="捐赠描述" min-width="80">
      </el-table-column>
      <el-table-column prop="comment" label="捐赠内容" min-width="80">
      </el-table-column>
      <el-table-column prop="classes" label="所在班级" min-width="100">
      </el-table-column>
      <el-table-column prop="company" label="所在公司信息" min-width="100">
      </el-table-column>
      <el-table-column prop="state" label="状态" min-width="100">
        <template v-slot="{ row }">
          <el-tag v-if="row.state === 0" type="warning">审核中 </el-tag>
          <el-tag v-else-if="row.state === 1" type="success">已通过 </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template v-slot="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            content="捐献审核"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-tickets"
              size="small"
              @click="deleteDonateById(row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="删除捐献"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteDonateById(row.id)"
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
import { getDonateList, deleteDonate } from '@api'
export default {
  data() {
    return {
      donateList: [{}],
      query: {
        page: 1, // 当前页
        size: 10, // 最大页数
        keyword: null
      },
      total: 10
    }
  },
  methods: {
    async getDonate() {
      const { list, total } = await getDonateList(this.query)
      this.donateList = list
      this.total = total
    },
    // 最大页
    handleSizeChange(size) {
      this.query.size = size
      this.query.page = 1
      this.getDonate()
    },
    // 当前页
    handleCurrentChange(currentIndex) {
      this.query.page = currentIndex
      this.getDonate()
    },
    // 通过id删除捐献
    deleteDonateById(id) {
      this.$confirm('此操作将删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { success } = await deleteDonate(id)
          if (success) {
            this.$message.success('删除成功')
            this.getDonate()
          } else {
            this.$message.error('删除失败')
          }
        })
        .catch(() => {
          this.$message.info('已取消')
        })
    }
  },
  created() {
    this.getDonate()
  }
}
</script>

<style lang="less"  scoped>
@import '~@/assets/css/common.css';
</style>