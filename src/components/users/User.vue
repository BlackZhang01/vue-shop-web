<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户列表区域 -->
    <el-card>
      <!-- 用户搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            clearable
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @clear="getUserList"
          >
            <el-button
              @click="getUserList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="dialogVisible = true" type="primary"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeUserState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template>
            <!-- 编辑按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
      >
      </el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
        <el-form
          :model="addFromUser"
          :rules="fromRule"
          ref="ruleForm"
          label-width="70px"
        >
          <el-form-item label="账号" prop="username">
            <el-input v-model="addFromUser.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addFromUser.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addFromUser.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addFromUser.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 添加用户底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      let rul = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (rul.test(value)) {
        return cb()
      } else {
        return cb(new Error('请输入正确的邮箱!!'))
      }
    }

    let checkMobile = (rule, value, cb) => {
      let rul = /^1[3456789]\d{9}$/
      if (rul.test(value)) {
        return cb()
      } else {
        return cb(new Error('请输入正确的手机号'))
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      totalPage: 0,
      dialogVisible: false,
      addFromUser: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      fromRule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },

  mounted() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: result } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (result.meta.status !== 200) {
        return this.$message.error('用户列表获取失败')
      }
      this.userList = result.data.users
      this.totalPage = result.data.total
      console.log(result)
    },
    // 修改每页显示数量
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
      console.log(newSize)
    },
    // 切换页码
    handleCurrentChange(newCurrent) {
      this.queryInfo.pagenum = newCurrent
      this.getUserList()
      console.log('current' + newCurrent)
    },
    // 修改用户状态
    async changeUserState(userinfo) {
      const { data: result } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (result.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('用户状态修改失败!!')
      }
      this.$message.success('修改用户状态成功!')
      console.log(userinfo)
    },
    addUser() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) return
      })
    },
  },
}
</script>

<style lang="less" scope>
.el-card {
  margin-top: 15px;
}
</style>