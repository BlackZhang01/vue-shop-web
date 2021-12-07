<template>
  <div>
    <el-button type="primary" @click="addRoleDialogVisible = true"
      >添加角色</el-button
    >
    <!-- 角色列表 -->
    <el-table border stripe :data="roleList" style="width: 100%">
      <el-table-column label="#" width="50" type="index"> </el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template v-slot="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="primary"
            @click="editRoleInfoData(scope.row)"
            >编辑</el-button
          >
          <el-button icon="el-icon-delete" size="mini" type="danger"
            >删除</el-button
          >
          <el-button icon="el-icon-setting" size="mini" type="warning"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
    >
      <!-- 添加角色主体 -->
      <el-form
        ref="addRoleRef"
        :rules="addRoleRules"
        :model="addRoleForm"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加角色底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色信息 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editRoleDialogVisible"
      width="50%"
    >
      <el-form
        :rules="addRoleRules"
        ref="editRoleRef"
        :model="editRoleInfo"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色列表
      roleList: [],
      //   控制显示添加角色面板
      addRoleDialogVisible: false,
      //   待添加的角色
      addRoleForm: {
        roleName: '',
        roleDesc: '',
      },
      //   添加角色输入框规则
      addRoleRules: {
        roleName: [
          {
            required: true,
            message: 'Please input role name !!',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          {
            required: true,
            message: 'Please input role description',
            trigger: 'blur',
          },
        ],
      },
      //   编辑角色对话框
      editRoleDialogVisible: false,
      //   待修改的角色信息
      editRoleInfo: {},
    }
  },
  mounted() {
    this.getRoleList()
  },
  methods: {
    //   获取角色列表
    async getRoleList() {
      const { data: result } = await this.$http.get('/roles')
      this.roleList = result.data
    },
    // 添加角色
    addRole() {
      this.$refs.addRoleRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.post(
          '/roles',
          this.addRoleForm
        )
        if (result.meta.status === 201) {
          this.$message.success('The role is create success .')
          this.addRoleDialogVisible = false
          this.$refs.addRoleRef.resetFields()
          this.getRoleList()
        } else {
          return this.$message.error('The role create is failing !!!')
        }
      })
    },
    // 修改角色
    editRole() {
      this.$refs.editRoleRef.validate(async (valid) => {
        if (!valid) return
        const { data: result } = await this.$http.put(
          `/roles/${this.editRoleInfo.id}`,
          {
            roleName: this.editRoleInfo.roleName,
            roleDesc: this.editRoleInfo.roleDesc,
          }
        )
        if (result.meta.status !== 200) {
          return this.$message.error('修改角色信息失败!!')
        }
        this.$message.success('角色信息修改成功.')
        this.editRoleDialogVisible = false
      })
    },
    //
    editRoleInfoData(roleInfo) {
      this.editRoleInfo = roleInfo
      this.editRoleDialogVisible = true
    },
  },
}
</script>

<style>
</style>