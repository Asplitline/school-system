<template>
  <div class="news-detail">
    <el-card shadow="always">
      <a href="#/news" class="back">
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
            <div v-html="currentNews.content" v-highlight></div>
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
.news-detail {
  .title {
    i {
      margin-right: 6px;
    }
  }
  .postdesc {
    font-size: 14px;
    margin: 24px 0;
    position: relative;
    .content {
      a h4 {
        margin: 0 0 12px 0;
      }
    }
    .el-col-2 {
      width: 5%;
    }
    .icons {
      position: absolute;
      bottom: 0;
      right: 0;
      i {
        font-size: 16px;
        padding: 0 4px;
      }
    }
  }

  .postContent {
    border: 1px dashed #ccc;
    border-radius: 10px;
    padding: 20px;
    letter-spacing: 0.1em;
  }

  .el-card {
    position: relative;
    .back {
      position: absolute;
      right: 40px;
      top: 40px;
      font-size: 18px;
      padding: 4px 10px;
      border: 1px solid rgba(187, 187, 187, 0.5);
      border-radius: 2px;
      color: rgb(255, 99, 71);
      transition: transform linear 0.2s;
      &:hover {
        background-color: rgb(255, 99, 71);
        color: #fff;
        transform: scale(1.05);
      }
    }
  }
}
</style>
