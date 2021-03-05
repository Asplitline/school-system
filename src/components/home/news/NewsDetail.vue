<template>
  <div class="news-detail">
    <el-card shadow="always">
      <a href="#/post" class="back">
        <i class="el-icon-d-arrow-left"></i>
      </a>
      <el-container class="postDetail">
        <el-main>
          <div class="postTitle">
            <h2>{{ currentNews.title }}</h2>
          </div>
          <!-- 文章描述 -->
          <div class="postdesc">
            <el-row>
              <el-col :span="2">
                <el-avatar
                  shape="square"
                  :size="36"
                  :src="bindImg(currentAuthor.url)"
                ></el-avatar>
              </el-col>
              <el-col :span="12">
                <div class="content">
                  <a href="javascript:;"
                    ><h4>{{ currentAuthor.name }}</h4>
                  </a>
                  <span class="createDate"
                    >{{ currentAuthor.createTime | formatDate }}发表</span
                  >
                </div>
                <p class="icons">
                  <i class="el-icon-chat-dot-round">2</i>
                  <i class="icon-dianzan iconfont">2</i>
                  <i class="el-icon-view">123</i>
                </p>
              </el-col>
            </el-row>
          </div>
          <!-- 文章内容 -->
          <div class="postContent">
            <div v-html="currentNews.comment" v-highlight></div>
          </div>
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { bindImg, findUserById } from '@/plugins/function'
import { getUser } from '@api'
export default {
  props: ['id'],
  data() {
    return {
      currentAuthor: {},
      userList: []
    }
  },
  computed: {
    ...mapState(['currentNews'])
  },
  methods: {
    bindImg
  },
  created() {
    getUser()
      .then((res) => {
        this.userList = res
        this.currentAuthor = findUserById(
          Number(this.currentNews.author),
          this.userList
        )
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>

<style lang="less" scoped>
</style>