<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addRoleDialogVisible = true"
        >添加角色</el-button
      >
      <!-- 角色列表 -->
      <el-table border stripe :data="roleList" style="width: 100%">
        <!-- 权限展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- 渲染一级权限 -->
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="deleteRights(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="7"
                    ><el-tag
                      closable
                      type="success"
                      @close="deleteRights(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="17">
                    <!-- 渲染三级权限 -->
                    <el-tag
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      @close="deleteRights(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
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
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="removeRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              icon="el-icon-setting"
              size="mini"
              @click="getAllRights(scope.row)"
              type="warning"
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

      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="assignRightsDialogVisible"
        width="50%"
        @closed="refArray = []"
      >
        <el-tree
          :data="allRightsList"
          node-key="id"
          :props="defaultProps"
          default-expand-all
          :default-checked-keys="refArray"
          show-checkbox
          ref="checkedRef"
        ></el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="assignRightsDialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="roleRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
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
      //   分配权限对话框
      assignRightsDialogVisible: false,
      allRightsList: [],
      defaultProps: {
        children: 'children',
        label: 'authName',
      },
      //   默认选中的数组
      refArray: [],
      roleRightsId: '',
    }
  },
  created() {
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
    // 根据 ID 删除角色
    async removeRole(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      if (confirmResult === 'cancel') {
        return this.$message('您已取消了删除操作')
      }
      const { data: result } = await this.$http.delete(`/roles/${id}`)
      if (result.meta.status !== 200) {
        return this.$message.error('删除失败!!')
      }
      this.$message.success('删除角色成功.')
      this.getRoleList()
    },

    // 删除权限
    async deleteRights(role, rightId) {
      const { data: result } = await this.$http.delete(
        `/roles/${role.id}/rights/${rightId}`
      )
      if (result.meta.status !== 200) {
        return this.$message.error('删除权限失败!!')
      }
      this.$message.success('删除权限成功.')
      role.children = result.data
    },

    //获取所有权限
    async getAllRights(role) {
      console.log(role)
      const { data: result } = await this.$http.get('/rights/tree')
      if (result.meta.status !== 200) {
        return this.$message.error('get rights is failing !!!')
      }
      this.roleRightsId = role.id
      //   console.log(role.id, '@', this.roleRightsId)
      role.children.forEach((item1) => {
        item1.children.forEach((item2) => {
          item2.children.forEach((item3) => {
            this.refArray.push(item3.id)
          })
        })
      })
      //   console.log(this.refArray)
      this.allRightsList = result.data
      this.assignRightsDialogVisible = true
    },
    async roleRights() {
      const tempList = [
        ...this.$refs.checkedRef.getHalfCheckedNodes(),
        ...this.$refs.checkedRef.getCheckedKeys(),
      ]
      let rids = tempList.join(',')
      console.log(rids)
      //   console.log(this.refArray)
      const { data: result } = await this.$http.post(
        `roles/${this.roleRightsId}/rights`,
        { rids }
      )
      console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error('权限更新失败!!!')
      }
      this.$message.success('权限更新成功.')
      this.assignRightsDialogVisible = false
      this.getRoleList()
    },
  },
}
</script>

<style lang="less" scope>
.el-row {
  margin-top: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>