<template>
  <div class="index">
    <h1>校友服务平台</h1>
    <div class="btns">
      <a class="items" href="#/post">
        <i class="icon-fly iconfont"></i>
        <h4>帖子</h4>
        <p>在线平台，尽情交流</p>
      </a>
      <a class="items" href="#/advice">
        <i class="icon-unorderedlist iconfont"></i>
        <h4>投诉</h4>
        <p>构建和谐平台</p>
      </a>
      <a class="items" href="#/donate">
        <i class="icon-wallet iconfont"></i>
        <h4>捐赠</h4>
        <p>献爱心帮助他人</p>
      </a>
      <a class="items" href="#/news">
        <i class="icon-news iconfont"></i>
        <h4>新闻</h4>
        <p>实时新闻，一览无余</p>
      </a>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.index {
  color: #fff;
  h1 {
    font-size: 30px;
    font-weight: normal;
    text-align: center;
    margin-bottom: 200px;
  }
  .btns {
    text-align: center;
    .items {
      display: inline-block;
      width: 200px;
      height: 200px;
      padding: 14px;
      margin-right: 10px;
      border-radius: 10px;
      color: #dcdde1;
      transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.5s;

      i {
        font-size: 4em;
        display: block;
      }
      h4 {
        // margin: 0;
        // margin-top: 6px;
      }
      p {
        font-size: 14px;
        line-height: 30px;
      }
    }
    .items:hover {
      color: #fff;
      background-color: rgba(0, 0, 0, 0.5);
      transform: scale(1.1);
    }
  }
}
</style>
