<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.taskName"
          clearable
          size="small"
          placeholder="输入任务名称搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
      <Log ref="log" />
    </div>
    <!--Form表单-->
    <el-dialog
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      append-to-body
      width="730px"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        size="small"
        label-width="100px"
      >
        <el-form-item label="任务组" prop="taskGroup">
          <el-input v-model="form.taskGroup" style="width: 220px" />
        </el-form-item>
        <el-form-item label="程序集" prop="assemblyName">
          <el-input v-model="form.assemblyName" style="width: 220px" />
        </el-form-item>
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="form.taskName" style="width: 220px" />
        </el-form-item>
        <el-form-item label="任务描述" prop="description">
          <el-input v-model="form.description" style="width: 220px" />
        </el-form-item>
        <el-form-item label="执行类" prop="className">
          <el-input v-model="form.className" style="width: 220px" />
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cron">
          <el-input v-model="form.cron" style="width: 220px" />
        </el-form-item>
        <el-form-item label="任务负责人" prop="principal">
          <el-input v-model="form.principal" style="width: 220px" />
        </el-form-item>
        <el-form-item label="告警邮箱" prop="alertEmail">
          <el-input
            v-model="form.alertEmail"
            placeholder="多个邮箱用逗号隔开"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="form.startTime"
            type="date"
            style="width: 220px"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="結束时间">
          <el-date-picker
            v-model="form.endTime"
            type="date"
            style="width: 220px"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="执行间隔(秒)" prop="intervalSecond">
          <el-input
            v-model="form.intervalSecond"
            placeholder="非Cron表达式模式使用"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label="循环次数" prop="cycleRunTimes">
          <el-input
            v-model="form.cycleRunTimes"
            placeholder="非Cron表达式模式使用"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label="失败后暂停">
          <el-radio-group v-model="form.pauseAfterFailure" style="width: 220px">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="form.isEnable" style="width: 220px">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参数内容">
          <el-input
            v-model="form.runParams"
            style="width: 556px"
            rows="4"
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
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="id" label="任务ID" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="taskName"
        label="任务名称"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="description"
        width="150px"
        label="描述"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="taskGroup"
        label="任务组"
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
        prop="triggerTypeStr"
        label="触发器模式"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="cron"
        label="cron表达式"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="runTimes"
        label="已执行次数"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="runParams"
        label="执行参数"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="principal"
        label="任务负责人"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="alertEmail"
        label="告警邮箱"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="isEnable"
        width="90px"
        label="DB状态"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.isEnable ? 'success' : 'warning'">{{
            scope.row.isEnable ? '启动' : '停用'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="triggerStatus"
        width="90px"
        label="RAM状态"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.triggerStatus === '正常' ? 'success' : 'warning'"
          >{{ scope.row.triggerStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        width="136px"
        label="创建时间"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="updateTime"
        width="136px"
        label="更新时间"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="startTime"
        width="136px"
        label="开始时间"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="endTime"
        width="136px"
        label="结束时间"
      />
      <el-table-column
        v-if="checkPer(['timing_edit', 'timing_del'])"
        label="操作"
        width="170px"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            v-permission="['timing_edit']"
            size="mini"
            style="margin-right: 3px"
            type="text"
            @click="crud.toEdit(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="['timing_edit']"
            style="margin-left: -2px"
            type="text"
            size="mini"
            @click="execute(scope.row.id)"
          >执行</el-button>
          <el-button
            v-show="scope.row.triggerStatus==='正常' "
            v-permission="['timing_edit']"
            style="margin-left: -2px"
            type="text"
            size="mini"
            @click="Pause(scope.row.id)"
          >暂停</el-button>
          <el-button
            v-show="scope.row.triggerStatus==='暂停' "
            v-permission="['timing_edit']"
            style="margin-left: -2px"
            type="text"
            size="mini"
            @click="Resume(scope.row.id)"
          >恢复</el-button>
          <el-popover
            :ref="scope.row.id"
            v-permission="['timing_del']"
            placement="top"
            width="200"
          >
            <p>确定停止并删除该任务吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="$refs[scope.row.id].doClose()"
              >取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="delMethod(scope.row.id)"
              >确定</el-button>
            </div>
            <el-button slot="reference" type="text" size="mini">删除</el-button>
          </el-popover>
          <el-button
            v-permission="['admin']"
            style="margin-left: -2px"
            type="text"
            size="mini"
            @click="doLog(scope.row.id)"
          >日志</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudJob from '@/api/system/tasks'
import Log from './log'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = {
  id: null,
  taskGroup: null,
  assemblyName: null,
  taskName: null,
  description: null,
  className: null,
  cron: null,
  principal: null,
  alertEmail: null,
  startTime: null,
  endTime: null,
  pauseAfterFailure: true,
  isEnable: false,
  runParams: null,
  intervalSecond: 0,
  cycleRunTimes: 0
}
export default {
  name: 'Timing',
  components: { Log, pagination, crudOperation, rrOperation, DateRangePicker },
  cruds() {
    return CRUD({
      title: '作业调度',
      url: 'api/tasks/query',
      crudMethod: { ...crudJob }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      delLoading: false,
      permission: {
        add: ['timing_add'],
        edit: ['timing_edit'],
        del: ['timing_del'],
        down: ['timing_down']
      },
      rules: {
        taskGroup: [
          { required: true, message: '请输入任务組', trigger: 'blur' }
        ],
        assemblyName: [
          { required: true, message: '请输入程序集', trigger: 'blur' }
        ],
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入任务描述', trigger: 'blur' }
        ],
        className: [
          { required: true, message: '请输入执行类', trigger: 'blur' }
        ],
        principal: [
          { required: true, message: '请输入负责人名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 执行
    execute(id) {
      crudJob
        .execution(id)
        .then((res) => {
          this.crud.notify('执行成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.crud.toQuery()
        })
        .catch((err) => {
          console.log(err.response.data.message)
        })
    },
    // 暂停
    Pause(id) {
      crudJob
        .pause(id)
        .then((res) => {
          this.crud.notify('暂停成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.crud.toQuery()
        })
        .catch((err) => {
          console.log(err.response.data.message)
        })
    },
    // 恢复
    Resume(id) {
      crudJob
        .resume(id)
        .then((res) => {
          this.crud.notify('恢复成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.crud.toQuery()
        })
        .catch((err) => {
          console.log(err.response.data.message)
        })
    },
    delMethod(id) {
      this.delLoading = true
      crudJob
        .del([id])
        .then(() => {
          this.delLoading = false
          this.$refs[id].doClose()
          this.crud.dleChangePage(1)
          this.crud.delSuccessNotify()
          this.crud.toQuery()
        })
        .catch(() => {
          this.delLoading = false
          this.$refs[id].doClose()
        })
    },
    // 显示日志
    doLog(id) {
      this.$refs.log.dialog = true
      this.$refs.log.doInit(id)
    },
    checkboxT(row, rowIndex) {
      return row.id !== 1
    }
  }
}
</script>
