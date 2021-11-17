<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :permission="permission" />
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
      <el-table-column prop="appId" label="应用ID" />
      <el-table-column prop="appName" label="应用名称" />
      <el-table-column prop="appSecretKey" label="应用密钥" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="createBy" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateBy" label="更新人" />
      <el-table-column prop="updateTime" label="更新时间" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['appSecret_edit', 'appSecret_del'])"
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
    <eForm />
  </div>
</template>

<script>
import crudAppSecret from '@/api/system/appSecret'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'
export default {
  name: 'AppSecret',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: '应用密钥',
      url: 'api/appSecret/query',
      sortFields: ['update_time desc'],
      crudMethod: { ...crudAppSecret }
    })
  },
  mixins: [presenter()],
  data() {
    return {
      permission: {
        add: ['appSecret_add'],
        edit: ['appSecret_edit'],
        del: ['appSecret_del'],
        down: ['appSecret_down']
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
