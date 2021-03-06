<template>
  <div class="advice">
    <el-card shadow="always">
      <!-- 搜索框 -->
      <el-row class="topSearch">
        <el-col :span="8">
          <el-input
            placeholder="请输入标题"
            v-model="query.keyword"
            @clear="getAdvice()"
            clearable
            size="small"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              size="small"
              @click="getAdvice()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="add-advice" @click="showAdviceDialog()" size="small"
            >添加投诉</el-button
          >
        </el-col>
        <el-col :span="8" :offset="4">
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </el-col>
      </el-row>
      <!-- 列表表格 -->
      <el-row class="AdviceTable">
        <el-table :data="adviceTable" style="width: 100%">
          <el-table-column prop="title" label="投诉标题" min-width="100">
          </el-table-column>
          <el-table-column prop="description" label="投诉内容" min-width="200">
          </el-table-column>
          <el-table-column prop="createTime" label="投诉时间" min-width="100">
            <template v-slot="{ row }">
              {{ row.createTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="state" label="投诉状态" min-width="100">
            <template v-slot="{ row }">
              <el-tag v-if="row.state === 0" type="danger">未回复</el-tag>
              <el-tag v-else>已回复</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template v-slot="{ row }">
              <el-button
                type="primary"
                size="mini"
                @click="showAdviceDetail(row)"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!-- 添加投诉对话框 -->
    <el-dialog
      title="新增投诉"
      :visible.sync="isAdviceDialog"
      width="25%"
      @close="clearDialog"
    >
      <el-form
        :model="adviceForm"
        :rules="adviceRules"
        ref="adviceForm"
        size="small"
        :hide-required-asterisk="true"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="adviceForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="description">
          <el-input
            v-model="adviceForm.description"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 2, maxRows: 4 }"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片说明" prop="url">
          <br />
          <el-upload
            class="avatar-uploader"
            :action="bindURL('/uploadfile')"
            :show-file-list="false"
            :on-success="handleAddAvatarSuccess"
            name="files"
          >
            <img
              v-if="adviceForm.url"
              :src="bindImg(adviceForm.url)"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAdviceDialog = false" size="mini">取 消</el-button>
        <el-button
          type="primary"
          @click="submitAdvice('adviceForm')"
          size="mini"
          >新 增</el-button
        >
      </span>
    </el-dialog>
    <!-- 投诉详情对话框 -->
    <el-dialog :visible.sync="isAdviceDetailDialog" width="30%">
      <div class="content">
        <p>
          投诉标题:<span>{{ adviceFormDetail.title }}</span>
        </p>
        <p>
          投诉内容:<span class="mark">{{ adviceFormDetail.description }}</span>
        </p>
        <p>
          投诉时间:<span>{{ adviceFormDetail.createTime | formatDate }}</span>
        </p>
        <p>
          投诉状态:<span>{{
            adviceFormDetail.state === 0 ? '未回复' : '已回复'
          }}</span>
        </p>
        <p class="breif">
          投诉图片:
          <span>
            <img
              :src="bindImg(adviceFormDetail.url)"
              alt=""
              width="100"
              height="100"
            />
          </span>
        </p>
        <p>
          投诉回复:<span class="mark">{{
            adviceFormDetail.content || '暂未回复'
          }}</span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="isAdviceDetailDialog = false"
          size="mini"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { bindImg, bindURL, convertDeepCopy } from '@/plugins/function'
import { getAdviceList, addAdvice } from '@api'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      query: {
        keyword: null,
        page: 1,
        size: 10
      },
      total: 10,
      adviceTable: [],
      isAdviceDialog: false,
      adviceForm: {},
      adviceFormDetail: {},
      isAdviceDetailDialog: false,
      adviceRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        description: [
          { required: true, message: '请输入投诉内容', trigger: 'blur' }
        ],
        url: [{ required: true, message: '请添加图片说明', trigger: 'blur' }]
      }
    }
  },
  methods: {
    bindImg,
    bindURL,
    // 获取投诉列表
    async getAdvice() {
      const { list, total } = await getAdviceList(this.query)
      this.adviceTable = list
      this.total = total
    },
    // 切换当前页
    handleCurrentChange(currentIndex) {
      this.query.page = currentIndex
      this.getAdvice()
    },
    // 显示添加投诉
    showAdviceDialog() {
      if (this.loginStatus === false) {
        this.$message.error('请先登录')
        return
      }
      this.isAdviceDialog = true
    },
    // 提交投诉
    submitAdvice(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        Object.assign(this.adviceForm, {
          userid: this.user.id,
          id: Date.now() % 9999999,
          state: 0,
          createTime: Date.now(),
          updateTime: Date.now()
        })
        const { success } = await addAdvice(this.adviceForm)
        if (success === true) {
          this.$message.success('投诉成功')
          this.getAdvice()
          this.isAdviceDialog = false
        } else {
          this.$message.error('投诉失败')
        }
      })
    },
    // 显示投诉详情
    showAdviceDetail(row) {
      this.isAdviceDetailDialog = true
      this.adviceFormDetail = convertDeepCopy(row)
    },
    // 图片上传成功回调
    handleAddAvatarSuccess(res) {
      this.$set(this.adviceForm, 'url', res)
    },
    // 清空对话框
    clearDialog() {}
  },
  computed: {
    ...mapState(['loginStatus', 'user'])
  },
  created() {
    this.getAdvice()
  }
}
</script>

<style lang="less" scoped>
.advice {
  /deep/.el-dialog__body {
    padding: 10px 20px;
  }
  /deep/.el-upload {
    position: relative;
    border: 2px dashed rgba(0, 0, 0, 0.1);
    line-height: 0;
    border-radius: 2px;
    width: 120px;
    height: 120px;
    img {
      width: 100%;
      height: 100%;
      box-shadow: 0px 1px 2px 1px rgba(0 0 0 / 0.2);
    }
    &:hover {
      border: 2px dashed #ff525278;
    }
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 20px;
    }
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

.adviceTable {
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 1px 1px 6px 1px rgba(0, 0, 0, 0.2);
  /deep/.el-table__row td:nth-child(2) .cell {
    overflow: hidden;
    white-space: nowrap; /* 设置文本不换行，单行显示 */
    text-overflow: ellipsis; /* 超出的文本使用省略号代替 */
  }
}
</style>
