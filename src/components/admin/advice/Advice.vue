<template>
  <div class="advice">
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
          @clear="getAdivce()"
          size="small"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getAdivce()"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      adviceList: [],
      query: {
        page: 1, // 当前页
        size: 10, // 最大页数
        keyword: null
      },
      total: 10
    }
  },
  methods: {
    async getAdivce() {
      const res = await getAdivceList(this.query)
    }
  },
  created() {
    this.getAdivce()
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/css/common.css';
</style>