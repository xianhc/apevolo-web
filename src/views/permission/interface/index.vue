<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <eHeader :permission="permission" />
      <crudOperation :permission="permission">
        <el-button
          slot="right"
          v-permission="['admin']"
          class="filter-item"
          type="primary"
          icon="el-icon-refresh"
          size="mini"
          :loading="refreshLoading"
          @click="doRefreshApis()"
        >
          刷新Api
        </el-button>
      </crudOperation>
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
      <el-table-column prop="group" label="组" />
      <el-table-column prop="url" label="请求路径" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="method" label="请求方法" />
      <el-table-column prop="createTime" label="创建日期" />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['apis_edit', 'apis_del'])"
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
import crudApis from '@/api/permission/apis'
import eHeader from './module/header'
import eForm from './module/form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import udOperation from '@crud/UD.operation'

export default {
  name: 'Apis',
  components: { eHeader, eForm, crudOperation, pagination, udOperation },
  cruds() {
    return CRUD({
      title: 'Apis',
      url: 'api/apis/query',
      sortFields: ['id desc'],
      crudMethod: { ...crudApis }
    })
  },
  mixins: [presenter()],
  data() {
    return {
      permission: {
        add: ['apis_add'],
        edit: ['apis_edit'],
        del: ['apis_del'],
        down: ['apis_down']
      },
      refreshLoading: false
    }
  },
  methods: {
    doRefreshApis() {
      this.refreshLoading = true
      crudApis.refresh()
        .then((res) => {
          this.crud.message(res.message, CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.refreshLoading = false
          this.crud.toQuery()
        })
        .catch(() => {
          this.refreshLoading = false
        })
    }
  }
}
</script>
