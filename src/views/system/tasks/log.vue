<template>
  <el-dialog :visible.sync="dialog" append-to-body title="执行日志" width="85%">
    <!-- 搜索 -->
    <div class="head-container">
      <date-range-picker v-model="query.createTime" class="date-item" />
      <el-select
        v-model="query.isSuccess"
        placeholder="日志状态"
        clearable
        size="small"
        class="filter-item"
        style="width: 110px"
        @change="toQuery"
      >
        <el-option
          v-for="item in enabledTypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery"
      >搜索</el-button>
      <!-- 导出 -->
      <div style="display: inline-block">
        <el-button
          v-permission="['admin']"
          :loading="downloadLoading"
          size="mini"
          class="filter-item"
          type="warning"
          icon="el-icon-download"
          @click="downloadMethod"
        >导出</el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      style="width: 100%; margin-top: -10px"
    >
      <el-table-column
        :show-overflow-tooltip="true"
        prop="taskGroup"
        label="任务组"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="taskName"
        label="任务名称"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="assemblyName"
        label="程序集"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="className"
        label="执行类"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="cron"
        label="cron表达式"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="runParams"
        width="120px"
        label="执行参数"
      />
      <el-table-column prop="createTime" label="异常详情" width="110px">
        <template #default="scope">
          <div>
            <el-popover v-if="scope.row.exceptionDetail" placement="left-start" trigger="click">
              <div class="popover-box">
                <pre>{{ scope.row.exceptionDetail }}</pre>
              </div>
              <template #reference>
                <i class="el-icon-view" style="cursor: pointer;font-size: 20px;" />
              </template>
            </el-popover>
            <span v-else>无</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        prop="executionDuration"
        width="100px"
        label="耗时(毫秒)"
      />
      <el-table-column
        align="center"
        prop="isSuccess"
        width="80px"
        label="状态"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.isSuccess ? 'success' : 'danger'">{{
            scope.row.isSuccess ? "成功" : "失败"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        label="执行时间"
      />
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="totalElements"
      :current-page="pageIndex + 1"
      style="margin-top: 8px"
      layout="total, prev, pager, next"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </el-dialog>
</template>

<script>
import crud from '@/mixins/crud'
import DateRangePicker from '@/components/DateRangePicker'
export default {
  components: { DateRangePicker },
  mixins: [crud],
  data() {
    return {
      id: '',
      title: '作业日志',
      enabledTypeOptions: [
        { key: 'true', display_name: '成功' },
        { key: 'false', display_name: '失败' }
      ]
    }
  },
  methods: {
    doInit(id) {
      this.id = id
      this.$nextTick(() => {
        this.init()
      })
    },
    // 获取数据前设置好接口地址
    beforeInit() {
      this.query.id = this.id
      this.url = 'api/tasks/logs/query'
      return true
    }
  }
}
</script>

<style scoped>
.popover-box {
  background: #112435;
  color: #f08047;
  height: 600px;
  width: 800px;
  overflow: auto;
  scrollbar-width: thin;

}
.popover-box::-webkit-scrollbar {
  display: none;
}
</style>
