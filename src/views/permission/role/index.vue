<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.roleName"
          size="small"
          clearable
          placeholder="输入角色名称搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!-- 表单渲染 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="520px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" style="width: 380px" />
        </el-form-item>
        <el-form-item label="角色代码" prop="permission">
          <el-input v-model="form.permission" style="width: 380px" />
        </el-form-item>
        <el-form-item label="角色级别" prop="level">
          <el-input-number
            v-model.number="form.level"
            :min="1"
            controls-position="right"
            style="width: 145px"
          />
        </el-form-item>
        <el-form-item label="数据范围" prop="dataScope">
          <el-select
            v-model="form.dataScope"
            style="width: 140px"
            placeholder="请选择数据范围"
            @change="changeScope"
          >
            <el-option
              v-for="item in dateScopes"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.dataScope === '自定义'"
          label="数据权限"
          prop="depts"
        >
          <treeselect
            v-model="deptDatas"
            :load-options="loadDepts"
            :options="depts"
            multiple
            style="width: 380px"
            placeholder="请选择"
          />
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input
            v-model="form.description"
            style="width: 380px"
            rows="5"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          :loading="crud.status.cu === 2"
          type="primary"
          @click="crud.submitCU"
        >确认</el-button>
      </div>
    </el-dialog>
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col
        :xs="24"
        :sm="24"
        :md="16"
        :lg="16"
        :xl="17"
      >
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table
            ref="table"
            v-loading="crud.loading"
            highlight-current-row
            style="width: 100%"
            :data="crud.data"
            @selection-change="crud.selectionChangeHandler"
            @current-change="handleCurrentChange"
          >
            <el-table-column
              :selectable="checkboxT"
              type="selection"
              width="60"
            />
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="permission" label="角色代码" />
            <el-table-column prop="dataScope" label="数据权限" />
            <el-table-column prop="level" label="角色级别" />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="description"
              label="描述"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              width="135px"
              prop="createTime"
              label="创建日期"
            />
            <el-table-column
              v-if="checkPer(['role_edit', 'roles_del'])"
              label="操作"
              width="130px"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <udOperation
                  v-if="scope.row.level >= level"
                  :data="scope.row"
                  :permission="permission"
                />
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination />
        </el-card>
      </el-col>
      <!-- 菜单授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="菜单管理" name="first">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <el-input
                  v-model="filterMenuText"
                  style="float: left;width: 80%;"
                  placeholder="输入关键字进行过滤"
                />
                <el-button
                  v-permission="['role_edit']"
                  :disabled="!showButton"
                  :loading="menuLoading"
                  icon="el-icon-check"
                  size="small"
                  style="float: right;"
                  type="primary"
                  @click="saveMenu"
                >保存</el-button>
              </div>
              <el-tree
                ref="menu"
                :data="menus"
                :default-checked-keys="menuIds"
                :props="defaultProps"
                show-checkbox
                node-key="id"
                default-expand-all
                check-strictly
                :filter-node-method="filterMenuNode"
              />
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="Api管理" name="second">
            <el-card class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <el-input
                  v-model="filterApiText"
                  style="float: left;width: 80%;"
                  placeholder="输入关键字进行过滤"
                />
                <el-button
                  v-permission="['role_edit']"
                  :disabled="!showButton"
                  :loading="menuLoading"
                  icon="el-icon-check"
                  size="small"
                  style="float: right;"
                  type="primary"
                  @click="saveApi"
                >保存</el-button>
              </div>
              <el-tree
                ref="api"
                :data="apis"
                :default-checked-keys="apisIds"
                :props="defaultProps"
                show-checkbox
                node-key="id"
                default-expand-all
                :filter-node-method="filterApiNode"
              />
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudRoles from '@/api/permission/role'
import { getDepts, getDeptSuperior } from '@/api/permission/dept'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = {
  id: null,
  name: null,
  depts: [],
  description: null,
  dataScope: '全部',
  level: 3
}
export default {
  name: 'Role',
  components: {
    Treeselect,
    pagination,
    crudOperation,
    rrOperation,
    udOperation,
    DateRangePicker
  },
  cruds() {
    return CRUD({
      title: '角色',
      url: 'api/role/query',
      sortFields: ['id desc'],
      crudMethod: { ...crudRoles }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      filterMenuText: '',
      filterApiText: '',
      defaultProps: { children: 'children', label: 'label', isLeaf: 'leaf' },
      dateScopes: ['全部', '本级', '自定义'],
      level: 3,
      currentId: 0,
      menuLoading: false,
      showButton: false,
      menus: [],
      apis: [],
      menuIds: [],
      apisIds: [],
      depts: [],
      deptDatas: [], // 多选时使用
      permission: {
        add: ['role_add'],
        edit: ['role_edit'],
        del: ['role_del'],
        down: ['role_down']
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        permission: [
          { required: true, message: '请输入权限', trigger: 'blur' }
        ]
      },
      activeName: 'first'
    }
  },
  watch: {
    filterMenuText(val) {
      this.$refs.menu.filter(val)
    },
    filterApiText(val) {
      this.$refs.api.filter(val)
    }
  },
  created() {
    crudRoles.getLevel().then((data) => {
      this.level = data.level
    })
    crudRoles.getMenusTree().then((data) => {
      this.menus = data
    })
    crudRoles.getApisTree().then((data) => {
      this.apis = data
    })
  },
  methods: {
    // getMenuDatas(node, resolve) {
    //  setTimeout(() => {
    //    getMenusTree(node.data.id ? node.data.id : 0).then((res) => {
    //      resolve(res)
    //    })
    //  }, 100)
    // },
    filterMenuNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    filterApiNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    [CRUD.HOOK.afterRefresh]() {
      this.$refs.menu.setCheckedKeys([])
    },
    // 新增前初始化部门信息
    [CRUD.HOOK.beforeToAdd](crud, form) {
      this.deptDatas = []
      form.menus = null
    },
    // 编辑前初始化自定义数据权限的部门信息
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.deptDatas = []
      if (form.dataScope === '自定义') {
        this.getSupDepts(form.depts)
      }
      const _this = this
      form.depts.forEach(function(dept) {
        _this.deptDatas.push(dept.id)
      })
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (crud.form.dataScope === '自定义' && this.deptDatas.length === 0) {
        this.$message({
          message: '自定义数据权限不能为空',
          type: 'warning'
        })
        return false
      } else if (crud.form.dataScope === '自定义') {
        const depts = []
        this.deptDatas.forEach(function(data) {
          const dept = { id: data }
          depts.push(dept)
        })
        crud.form.depts = depts
      } else {
        crud.form.depts = []
      }
      return true
    },
    // 触发单选
    handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 清空菜单的选中
        this.$refs.menu.setCheckedKeys([])
        this.$refs.api.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        // 初始化默认选中的key
        this.menuIds = []
        val.menus.forEach(function(data) {
          _this.menuIds.push(data.id)
        })
        this.apisIds = []
        val.apis.forEach(function(data) {
          _this.apisIds.push(data.id)
        })
        this.showButton = true
      }
    },
    // 保存菜单
    saveMenu() {
      this.menuIds = this.$refs.menu.getCheckedKeys()
      this.menuLoading = true
      const role = { id: this.currentId, menus: [] }
      // 得到已选中的 key 值
      this.menuIds.forEach(function(id) {
        const menu = { id: id }
        role.menus.push(menu)
      })
      crudRoles
        .editMenu(role)
        .then(() => {
          this.menuIds = []
          this.crud.message('保存菜单成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.menuLoading = false
          this.update()
        })
        .catch((err) => {
          this.menuLoading = false
          console.log(err.response.data.message)
        })
    },
    // 保存Api
    saveApi() {
      this.apisIds = this.$refs.api.getCheckedKeys()
      this.menuLoading = true
      const role = { id: this.currentId, apis: [] }
      // 得到已选中的 key 值
      this.apisIds.forEach(function(id) {
        const api = { id: id }
        role.apis.push(api)
      })
      crudRoles
        .editApi(role)
        .then(() => {
          this.apisIds = []
          this.crud.message('保存Api成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.menuLoading = false
          this.update()
        })
        .catch((err) => {
          this.menuLoading = false
          console.log(err.response.data.message)
        })
    },
    // 改变数据
    update() {
      crudRoles.get(this.currentId).then((res) => {
        for (let i = 0; i < this.crud.data.length; i++) {
          if (res.id === this.crud.data[i].id) {
            this.crud.data[i] = res
            break
          }
        }
      })
    },
    // 获取部门数据
    getDepts() {
      getDepts({ enabled: true }).then((res) => {
        this.depts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    getSupDepts(depts) {
      const ids = []
      depts.forEach((dept) => {
        ids.push(dept.id)
      })
      getDeptSuperior(ids).then((res) => {
        const date = res.content
        this.buildDepts(date)
        this.depts = date
      })
    },
    buildDepts(depts) {
      depts.forEach((data) => {
        if (data.children) {
          this.buildDepts(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    // 获取弹窗内部门数据
    loadDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, parentId: parentNode.id }).then((res) => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 如果数据权限为自定义则获取部门数据
    changeScope() {
      if (this.form.dataScope === '自定义') {
        this.getDepts()
      }
    },
    checkboxT(row) {
      return row.level >= this.level
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.role-span {
  font-weight: bold;
  color: #303133;
  font-size: 15px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
::v-deep .vue-treeselect__multi-value {
  margin-bottom: 0;
}
::v-deep .vue-treeselect__multi-value-item {
  border: 0;
  padding: 0;
}
</style>
