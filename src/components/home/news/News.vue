<template>
  <div class="news">
    <el-card class="card-subject">
      <div class="card-row">
        <el-card
          class="card-content"
          v-for="item in newsList"
          :key="item.id"
          body-style="padding: 0"
          shadow="hover"
        >
          <a class="card-pic" @click="goNewsDetailById(item)">
            <img :src="bindImg(item.url)" alt="" />
          </a>
          <el-button
            type="text"
            class="card-title"
            @click="goNewsDetailById(item)"
            >{{ item.title }}</el-button
          >
          <div class="card-author">
            <span class="author"
              ><i class="el-icon-user-solid"></i
              >{{ getNameById(item.author) }}</span
            >
          </div>
          <div class="card-detail">
            <span class="problem-num">
              <i class="el-icon-tickets"></i>{{ item.id }}</span
            >
            <span class="problem-info">
              <i class="el-icon-upload"></i
              >{{ item.createTime | formatDate }}</span
            >
          </div>
        </el-card>
        <!-- 补位 -->
        <div
          class="card-content hidden"
          v-for="index in currentSize"
          :key="index"
        ></div>
      </div>
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size="query.size"
        @current-change="handleCurrent"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { bindImg, findUserById } from '@/plugins/function'
import { getNewsList, getUser } from '@api'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      query: {
        page: 1,
        size: 10,
        keyword: null
      },
      total: 10,
      newsList: [],
      userList: []
    }
  },
  methods: {
    ...mapMutations(['initCurrentNews']),
    bindImg,
    // 获取新闻列表
    async getNews() {
      const { list, total } = await getNewsList(this.query)
      this.newsList = list
      this.total = total
    },
    // 处理当前页
    handleCurrent(currentIndex) {
      this.query.page = currentIndex
    },
    // 跳转到新闻详情页
    goNewsDetailById(row) {
      this.initCurrentNews(row)
      this.$router.push(`/news/${row.id}`)
    },
    getNameById(id) {
      const user = findUserById(Number(id), this.userList)
      return user && user.name
    }
  },
  computed: {
    currentSize() {}
  },
  created() {
    this.getNews()
    getUser()
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
.news {
  .card-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .card-content {
      position: relative;
      width: 260px;
      height: 260px;
      margin-bottom: 20px;
      border-radius: 8px;

      i {
        margin-right: 8px;
      }
      .card-title,
      .card-author {
        margin-left: 10px;
      }
    }
    .card-pic {
      display: inline-block;
      width: 100%;
      height: 140px;
      overflow: hidden;
      img {
        width: 100%;
        height: 140px;
        transition: all linear 0.3s;
        cursor: pointer;
      }
    }
    .card-content:hover {
      box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.2);
      img {
        transform: scale(1.05);
      }
    }
    .card-title {
      font-size: 20px;
      font-weight: 600;
    }
    .card-detail {
      position: absolute;
      display: flex;
      justify-content: space-around;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 36px;
      line-height: 36px;
      border-top: 1px solid #eee;
      font-size: 14px;
      color: #999;
      box-sizing: border-box;
    }
  }
}
</style>