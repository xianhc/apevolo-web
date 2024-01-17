<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :dict="dict" :permission="permission" />
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="value" label="值" />
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.enabled)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createBy" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateBy" label="更新人" />
      <el-table-column prop="updateTime" label="更新时间" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['setting_edit', 'setting_del'])"
        label="操作"
        width="130px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--表单渲染-->
    <eForm :setting-status="dict.setting_status" />
  </div>
</template>

<script>
import crudSetting from '@/api/system/setting'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
export default {
  name: 'Setting',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: '岗位',
      url: 'api/setting/query',
      sortFields: ['update_time desc'],
      crudMethod: { ...crudSetting }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['setting_status'],
  data() {
    return {
      permission: {
        add: ['setting_add'],
        edit: ['setting_edit'],
        del: ['setting_del'],
        down: ['setting_down']
      }
    }
  },
  methods: {
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm(
        '此操作将 "' +
        this.dict.label.setting_status[val] +
        '" ' +
        data.name +
        '设置, 是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
        // eslint-disable-next-line no-undef
          crudSetting
            .edit(data)
            .then(() => {
              // eslint-disable-next-line no-undef
              this.crud.message(
                this.dict.label.setting_status[val] + '成功',
                'success'
              )
            })
            .catch((err) => {
              data.enabled = !data.enabled
              console.log(err.data.message)
            })
        })
        .catch(() => {
          data.enabled = !data.enabled
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
