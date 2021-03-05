<template>
  <div class="donate">
    <el-card shadow="always">
      <!-- 搜索框 -->
      <el-row class="topSearch">
        <el-col :span="8">
          <el-input
            placeholder="请输入标题"
            v-model="query.keyword"
            @clear="getDonate()"
            clearable
            size="small"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              size="small"
              @click="getDonate()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="add-donate" @click="showDonateDialog()" size="small"
            >我要捐赠</el-button
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
      <el-row class="donateTable">
        <el-table :data="donateTable" style="width: 100%">
          <el-table-column prop="name" label="捐赠人" min-width="100">
          </el-table-column>
          <el-table-column prop="description" label="捐赠描述" min-width="100">
          </el-table-column>
          <el-table-column prop="classes" label="所在班级" min-width="100">
          </el-table-column>
          <el-table-column prop="createTime" label="捐赠时间" min-width="100">
            <template v-slot="{ row }">
              {{ row.createTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="state" label="捐赠状态" min-width="100">
            <template v-slot="{ row }">
              <el-tag v-if="row.state === 0" type="danger">审核中</el-tag>
              <el-tag v-else>已通过</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template v-slot="{ row }">
              <el-button
                type="primary"
                size="mini"
                @click="showDonateDetailDialog(row)"
                >详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!-- 添加捐赠对话框 -->
      <el-dialog
        title="我要捐赠"
        :visible.sync="isDonateDialog"
        width="30%"
        @close="clearDialog('donateForm')"
      >
        <el-form
          :model="donateForm"
          :rules="donateRules"
          ref="donateForm"
          size="small"
          :hide-required-asterisk="true"
        >
          <el-form-item label="捐赠人" prop="name">
            <el-input v-model="donateForm.name" readonly></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="donateForm.description"
              type="textarea"
              resize="none"
              :autosize="{ minRows: 2, maxRows: 2 }"
            ></el-input>
          </el-form-item>
          <el-form-item label="内容" prop="comment">
            <el-input
              v-model="donateForm.comment"
              type="textarea"
              resize="none"
              :autosize="{ minRows: 2, maxRows: 4 }"
            ></el-input>
          </el-form-item>
          <el-form-item label="所在班级" prop="classes">
            <el-select v-model="donateForm.classes" placeholder="请选择班级">
              <el-option :label="item" :value="item" v-for="item in options">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDonateDialog = false" size="mini"
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="submitDonate('donateForm')"
            size="mini"
            >新 增</el-button
          >
        </span>
      </el-dialog>
      <!-- 捐赠详情对话框 -->
      <el-dialog :visible.sync="isDonateDetailDialog" width="30%">
        <div class="content">
          <p>
            捐赠人:<span>{{ donateDetailForm.name }}</span>
          </p>
          <p>
            捐赠人班级:<span>{{ donateDetailForm.classes }}</span>
          </p>
          <p>
            捐赠描述:<span class="mark">{{
              donateDetailForm.description
            }}</span>
          </p>
          <p>
            捐赠内容:<span class="mark">{{ donateDetailForm.comment }}</span>
          </p>
          <p>
            捐赠时间:<span>{{ donateDetailForm.createTime | formatDate }}</span>
          </p>
          <p>
            捐赠状态:<span>{{
              donateDetailForm.state === 0 ? '审核中' : '已同意'
            }}</span>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="isDonateDetailDialog = false"
            size="mini"
            >关闭</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getDonateList, addDonate } from '@api'
import { mapState } from 'vuex'
import { convertDeepCopy } from '@/plugins/function'
export default {
  data() {
    return {
      query: {
        keyword: null,
        page: 1,
        size: 10
      },
      total: 10,
      donateTable: [],
      isDonateDialog: false,
      isDonateDetailDialog: false,
      donateForm: {},
      donateRules: {
        description: [
          { required: true, message: '请输入捐赠内容', trigger: 'blur' }
        ],
        comment: [
          { required: true, message: '请输入捐赠内容', trigger: 'blur' }
        ],
        classes: [
          { required: true, message: '请输入班级信息', trigger: 'blur' }
        ]
      },
      options: [
        '202001',
        '202002',
        '202003',
        '202004',
        '202005',
        '202006',
        '202101',
        '202102',
        '202103',
        '202104',
        '202105',
        '202106'
      ],
      donateDetailForm: {}
    }
  },
  methods: {
    // 获取捐赠列表
    async getDonate() {
      const { list, total } = await getDonateList(this.query)
      this.donateTable = list
      this.total = total
    },
    // 显示捐赠对话框
    showDonateDialog() {
      this.isDonateDialog = true
      this.donateForm.name = this.user.name
      this.donateForm.userid = this.user.id
    },
    // 获取当前页
    handleCurrentChange(currentIndex) {
      this.query.page = currentIndex
    },
    // 显示捐赠详情
    showDonateDetailDialog(row) {
      this.isDonateDetailDialog = <true></true>
      this.donateDetailForm = convertDeepCopy(row)
    },
    // 提交捐赠信息
    submitDonate(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return
        Object.assign(this.donateForm, {
          userid: this.user.id,
          state: 0,
          createTime: Date.now(),
          updateTime: Date.now(),
          id: Date.now() % 99999999
        })
        const { success } = await addDonate(this.donateForm)
        if (success === true) {
          this.$message.success('提交成功，等待审核')
          this.isDonateDialog = false
        } else {
          this.$message.error('捐赠失败')
        }
      })
    },
    // 清空对话框
    clearDialog(formName) {
      this.$refs[formName].resetFields()
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this.getDonate()
  }
}
</script>

<style lang="less" scoped>
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