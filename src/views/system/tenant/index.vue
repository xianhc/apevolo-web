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
      <el-table-column prop="tenantId" label="租户Id" />
      <el-table-column prop="name" label="租户名称" />
      <el-table-column
        prop="tenantType"
        :formatter="(row, column, cellValue) => getTenantText(cellValue)"
        label="租户类型"
      />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="configId" label="库标识" />
      <el-table-column
        prop="dbType"
        :formatter="(row, column, cellValue) => getDbText(cellValue)"
        label="库类型"
      />
      <el-table-column prop="connectionString" label="库连接" />
      <el-table-column prop="createBy" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateBy" label="更新人" />
      <el-table-column prop="updateTime" label="更新时间" />
      <!--   编辑与删除   -->
      <el-table-column
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
    <eForm :dict="dict" />
  </div>
</template>

<script>
import crudSetting from '@/api/system/tenant'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'

export default {
  name: 'Tenant',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: '租户',
      url: 'api/tenant/query',
      sortFields: ['update_time desc'],
      crudMethod: { ...crudSetting }
    })
  },
  mixins: [presenter()],
  // 数据字典
  dicts: ['tenant_type', 'db_type'],
  data() {
    return {
      permission: {
        add: ['tenant_add'],
        edit: ['tenant_edit'],
        del: ['tenant_del'],
        down: ['tenant_down']
      }
    }
  },
  methods: {
    getTenantText(value) {
      try {
        const dictList = this.dict.tenant_type
        const keys = Object.keys(dictList)
        const foundKey = keys.find(key => dictList[key].value === value.toString())
        if (foundKey) {
          return dictList[foundKey].label
        }
        return value
      } catch (err) {
        return value
      }
    },
    getDbText(value) {
      try {
        const dictList = this.dict.db_type
        const keys = Object.keys(dictList)
        const foundKey = keys.find(key => dictList[key].value === value.toString())
        if (foundKey) {
          return dictList[foundKey].label
        }
        return value
      } catch (err) {
        return value
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
