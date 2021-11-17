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
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="请求参数">
              <span>{{ props.row.requestParameters }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="用户名" />
      <el-table-column prop="requestIp" label="IP" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="ipAddress"
        label="IP来源"
      />
      <el-table-column prop="area" label="区域" />
      <el-table-column prop="controller" label="控制器" />
      <el-table-column prop="action" label="方法名称" />
      <el-table-column prop="method" label="请求类型" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="browserInfo" label="浏览器" />
      <el-table-column prop="createTime" label="创建日期" width="180px">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常详情" width="100px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="info(scope.row.id)"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="dialog"
      title="异常详情"
      append-to-body
      top="30px"
      width="85%"
    >
      <pre v-highlightjs="errorInfo"><code class="java" /></pre>
    </el-dialog>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { getErrDetail } from '@/api/monitor/log'
import Search from './search'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

export default {
  name: 'Log',
  components: { Search, crudOperation, pagination },
  cruds() {
    return CRUD({ title: '异常日志', url: 'api/log/query' })
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
    // 获取异常详情
    info(id) {
      this.dialog = true
      getErrDetail(id).then((res) => {
        this.errorInfo = res.exceptionInfoFull
      })
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 70px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.demo-table-expand .el-form-item__content {
  font-size: 12px;
}
/deep/ .el-dialog__body {
  padding: 0 20px 10px 20px !important;
}
.java.hljs {
  color: #444;
  background: #ffffff !important;
  height: 630px !important;
}
</style>
