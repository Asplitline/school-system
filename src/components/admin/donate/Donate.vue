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
      <el-table-column prop="name" label="捐赠人" min-width="100">
      </el-table-column>
      <el-table-column prop="description" label="捐赠描述" min-width="80">
      </el-table-column>
      <el-table-column prop="comment" label="捐赠内容" min-width="80">
      </el-table-column>
      <el-table-column prop="classes" label="所在班级" min-width="100">
      </el-table-column>
      <el-table-column prop="state" label="状态" min-width="100">
        <template v-slot="{ row }">
          <el-tag v-if="row.state === 0" type="warning">审核中 </el-tag>
          <el-tag v-else-if="row.state === 1" type="danger">已拒绝 </el-tag>
          <el-tag v-else-if="row.state === 2" type="success">已通过 </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template v-slot="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            content="捐献详情"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-tickets"
              size="small"
              @click="showDetailDialog(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="捐献审核"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showReviewDialog(row)"
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
    <!-- 捐献详情对话框 -->
    <el-dialog :visible.sync="isDonateDialog" width="30%">
      <div class="content">
        <p>
          捐赠人:<span class="mark">{{ donateForm.name }}</span>
        </p>
        <p>
          捐赠人班级:<span>{{ donateForm.classes }}</span>
        </p>
        <p>
          捐赠描述:<span>{{ donateForm.description }}</span>
        </p>
        <p>
          捐赠内容:<span class="mark">{{ donateForm.comment }}</span>
        </p>
        <p>
          捐赠时间:<span>{{ donateForm.createTime | formatDate }}</span>
        </p>
        <p>
          捐赠状态:<span>{{
            ['审核中', '已拒绝', '已同意'][donateForm.state]
          }}</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isDonateDialog = false" size="mini"
          >关闭</el-button
        >
      </span>
    </el-dialog>
    <!-- 捐献审核对话框 -->
    <el-dialog :visible.sync="isDonateReviewDialog" width="30%">
      <div class="content">
        <p>
          捐赠人:<span class="mark">{{ donateDetailForm.name }}</span>
        </p>
        <p>
          捐赠人班级:<span>{{ donateDetailForm.classes }}</span>
        </p>
        <p>
          捐赠描述:<span>{{ donateDetailForm.description }}</span>
        </p>
        <p>
          捐赠内容:<span class="mark">{{ donateDetailForm.comment }}</span>
        </p>
        <p>
          捐赠时间:<span>{{ donateDetailForm.createTime | formatDate }}</span>
        </p>
        <p>
          捐赠状态:<span>
            <el-radio :label="1" v-model="donateDetailForm.state"
              >拒绝</el-radio
            >
            <el-radio :label="2" v-model="donateDetailForm.state"
              >同意</el-radio
            >
          </span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="isDonateReviewDialog = false"
          size="mini"
          >关闭</el-button
        >
        <el-button type="success" @click="submitDonate()" size="mini"
          >提交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDonateList, deleteDonate, editDonate } from '@api'
import { convertDeepCopy } from '@/plugins/function'
export default {
  data() {
    return {
      donateList: [],
      query: {
        page: 1, // 当前页
        size: 10, // 最大页数
        keyword: null
      },
      total: 10,
      donateForm: {},
      donateDetailForm: {},
      isDonateDialog: false,
      isDonateReviewDialog: false
    }
  },
  methods: {
    // 获取捐赠
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
    },
    // 显示详情对话框
    showDetailDialog(row) {
      this.isDonateDialog = true
      this.donateForm = row
    },
    // 显示审核对话框
    showReviewDialog(row) {
      this.isDonateReviewDialog = true
      this.donateDetailForm = convertDeepCopy(row)
    },
    // 提交审核
    async submitDonate() {
      if (
        this.donateDetailForm.state !== 1 &&
        this.donateDetailForm.state !== 2
      ) {
        this.$message.error('请做出选择')
        return
      }
      const { success } = await editDonate(this.donateDetailForm)
      if (success === true) {
        this.$message.success('提交成功')
        this.isDonateReviewDialog = false
        this.getDonate()
      } else {
        this.$message.error('提交失败')
      }
    }
  },
  created() {
    this.getDonate()
  }
}
</script>

<style lang="less"  scoped>
@import '~@/assets/css/common.css';
.donate {
  /deep/.el-select {
    width: 100%;
  }
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
    .mark {
      background-color: #f3f3f3;
    }
  }
}
</style>
