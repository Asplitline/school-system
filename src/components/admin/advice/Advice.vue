<template>
  <div class="advice">
    <div class="split-line">
      <span><i class="icon-unorderedlist iconfont"></i> 投诉列表</span>
    </div>
    <!-- 面包导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>投诉管理</el-breadcrumb-item>
      <el-breadcrumb-item>投诉列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="mixInp" :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入投诉标题"
          v-model="query.keyword"
          class="input-with-select"
          clearable
          @clear="getAdvice()"
          size="small"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getAdvice()"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!-- 投诉表格 -->
    <el-table :data="adviceList" stripe style="width: 100%" max-height="560">
      <el-table-column prop="title" label="标题" min-width="100">
      </el-table-column>
      <el-table-column prop="description" label="内容" min-width="120">
      </el-table-column>
      <el-table-column prop="author" label="作者" min-width="120">
      </el-table-column>
      <el-table-column prop="state" label="状态" min-width="120">
        <template v-slot="{ row }">
          <el-tag v-if="row.state === 0" type="danger">未回复</el-tag>
          <el-tag v-else>已回复</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template v-slot="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            content="投诉详情"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-tickets"
              size="small"
              @click="showAdviceDetailDialog(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="投诉回复"
            placement="top"
            :enterable="false"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showAdviceReplyDialog(row)"
            ></el-button>
          </el-tooltip>
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
              @click="deleteAdviceById(row.id)"
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
    <!-- 投诉回复对话框 -->
    <el-dialog :visible.sync="isAdviceReplyDialog" width="30%">
      <div class="content">
        <p>
          投诉标题:<span>{{ adviceForm.title }}</span>
        </p>
        <p>
          投诉内容:<span class="mark">{{ adviceForm.description }}</span>
        </p>
        <p>
          投诉时间:<span>{{ adviceForm.createTime | formatDate }}</span>
        </p>
        <p>
          投诉状态:<span>{{
            adviceForm.state === 0 ? '未回复' : '已回复'
          }}</span>
        </p>
        <p class="breif">
          投诉图片:
          <span>
            <img
              :src="bindImg(adviceForm.url)"
              alt=""
              width="100"
              height="100"
            />
          </span>
        </p>
        <p>
          回复投诉：
          <el-input
            v-model="adviceForm.content"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </p>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isAdviceReplyDialog = false" size="mini"
          >取 消</el-button
        >
        <el-button type="primary" @click="submitAdviceReply()" size="mini"
          >回 复</el-button
        >
      </span>
    </el-dialog>
    <!-- 投诉详情对话框 -->
    <el-dialog :visible.sync="isAdviceDetailDialog" width="30%">
      <div class="content">
        <p>
          投诉标题:<span>{{ adviceForm.title }}</span>
        </p>
        <p>
          投诉内容:<span class="mark">{{ adviceForm.description }}</span>
        </p>
        <p>
          投诉时间:<span>{{ adviceForm.createTime | formatDate }}</span>
        </p>
        <p>
          投诉状态:<span>{{
            adviceForm.state === 0 ? '未回复' : '已回复'
          }}</span>
        </p>
        <p class="brief">
          投诉图片:
          <span>
            <img
              :src="bindImg(adviceForm.url)"
              alt=""
              width="100"
              height="100"
            />
          </span>
        </p>
        <p>
          投诉回复:<span class="mark">{{
            adviceForm.content || '暂未回复'
          }}</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="isAdviceDetailDialog = false"
          size="mini"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAdviceList, deleteAdvice, getUser, editAdvice } from '@api'
import { bindImg, findUserById, convertDeepCopy } from '@/plugins/function'
export default {
  data() {
    return {
      adviceList: [],
      allUser: {},
      query: {
        page: 1, // 当前页
        size: 10, // 最大页数
        keyword: null
      },
      total: 10,
      isAdviceReplyDialog: false,
      isAdviceDetailDialog: false,
      adviceForm: {}
    }
  },
  methods: {
    bindImg,
    // 获取投诉表单
    async getAdvice() {
      const { total, list } = await getAdviceList(this.query)
      this.adviceList = list
      this.adviceList.forEach((item) => {
        const user = findUserById(item.userid, this.allUser)
        item.author = user && user.name
      })
      this.total = total
    },
    // 显示详情对话框
    showAdviceDetailDialog(row) {
      this.adviceForm = convertDeepCopy(row)
      this.isAdviceDetailDialog = true
    },
    // 显示回复对话框
    showAdviceReplyDialog(row) {
      this.adviceForm = convertDeepCopy(row)
      this.isAdviceReplyDialog = true
    },
    // 投诉回复
    async submitAdviceReply() {
      if (this.adviceForm.content.trim().length === 0) {
        this.$message.error('请输入你的回复')
        return
      }
      this.adviceForm.state = 1
      const { success } = await editAdvice(this.adviceForm)
      if (success === true) {
        this.isAdviceReplyDialog = false
        this.getAdvice()
        this.$message.success('投诉审核成功')
      } else {
        this.$message.error('投诉审核失败')
      }
    },
    // 通过id删除建议
    deleteAdviceById(id) {
      this.$confirm('此操作将删除投诉, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const { success } = await deleteAdvice(id)
          if (success) {
            this.$message.success('删除成功')
            this.getAdvice()
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
      this.getNews()
    },
    // 当前页
    handleCurrentChange(currentIndex) {
      this.query.page = currentIndex
      this.getNews()
    }
  },
  created() {
    this.getAdvice()
    getUser()
      .then((res) => {
        this.allUser = res
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
