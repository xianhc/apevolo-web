<template>
  <div class="app-container">
    <div class="head-container">
      <Search />
      <crudOperation />
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column prop="createBy" label="用户名" />
      <el-table-column prop="createTime" label="创建日期" width="180px" />
      <el-table-column label="异常详情" width="80px">
        <template #default="scope">
          <div>
            <el-popover v-if="scope.row.exceptionMessageFull" placement="left-start" trigger="click">
              <div class="popover-box">
                <pre>{{ errFullInfo(scope.row.requestUrl,scope.row.requestParameters,scope.row.exceptionMessageFull,scope.row.exceptionStack) }}</pre>
              </div>
              <template #reference>
                <i class="el-icon-view" style="cursor: pointer;font-size: 20px;" />
              </template>
            </el-popover>
            <span v-else>无</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="requestUrl" label="请求路径" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="method" label="请求方法" />
      <el-table-column prop="requestParameters" label="请求参数" width="80px">
        <template #default="scope">
          <div>
            <el-popover v-if="scope.row.requestParameters && scope.row.requestParameters.trim() !== '{}'" placement="left-start" trigger="click">
              <div class="popover-box">
                <pre>{{ convertToJson(scope.row.requestParameters) }}</pre>
              </div>
              <template #reference>
                <i class="el-icon-view" style="cursor: pointer;font-size: 20px;" />
              </template>
            </el-popover>
            <span v-else>{}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="requestIp" label="IP" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="ipAddress"
        label="IP来源"
      />
      <el-table-column prop="operatingSystem" label="操作系统" />
      <el-table-column prop="deviceType" label="设备类型" />
      <el-table-column prop="browserName" label="浏览器" />
      <el-table-column prop="version" label="版本号" />
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import Search from './search'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

export default {
  name: 'Log',
  components: { Search, crudOperation, pagination },
  cruds() {
    return CRUD({ title: '异常日志', url: 'api/exception/query' })
  },
  mixins: [presenter()],
  data() {
    return {
      errorInfo: '',
      dialog: false
    }
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: false
    }
  },
  methods: {
    convertToJson(value) {
      try {
        return JSON.parse(value)
      } catch (err) {
        return value
      }
    },
    errFullInfo(url, para, msg, stack) {
      try {
        return url + '\n\r' + para + '\n\r' + msg + '\n\r' + stack
      } catch (err) {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.popover-box {
  background: #112435;
  color: #f08047;
  height: auto;
  width: 900px;
  overflow: auto;
  scrollbar-width: thin;
}
.popover-box::-webkit-scrollbar {
  display: none;
}
</style>
