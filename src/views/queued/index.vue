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
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="id" label="模板ID" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="from"
        label="发件邮箱"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="foName"
        label="发件人名称"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="to"
        label="收件邮箱"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="toName"
        label="收件人名称"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="emailAccountId"
        label="发送邮箱"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bcc"
        label="抄送"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="subject"
        label="标题"
      />
      <el-table-column prop="body" label="发送内容" width="110px">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.body"
            size="mini"
            type="text"
            @click="info(scope.row.body)"
          >查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="sentTries"
        style="width: 20px"
        label="发送次数"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="sendTime"
        label="发送时间"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="createTime"
        label="创建时间"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="UpdateTime"
        label="更新时间"
      />
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['queuedEmail_edit', 'queuedEmail_del'])"
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
    <el-dialog
      :visible.sync="bodyDialog"
      append-to-body
      title="发送内容"
      width="65%"
    >
      <pre v-highlightjs="sendBody"><code class="katex-html" /></pre>
    </el-dialog>
    <!--分页组件-->
    <pagination />
    <!--Form表单--> <eForm />
  </div>
</template>

<script>
import crudQueuedEmail from '@/api/queued/queuedEmail'
import eHeader from './header'
import eForm from './form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

export default {
  name: 'EmailQueued',
  components: {
    eHeader,
    eForm,
    pagination,
    crudOperation,
    udOperation
  },
  cruds: function() {
    return CRUD({
      title: '电子邮件队列',
      url: 'api/queued/email/query',
      crudMethod: { ...crudQueuedEmail },
      optShow: {
        add: true,
        edit: true,
        del: true,
        download: false,
        reset: true
      }
    })
  },
  mixins: [presenter()],
  data() {
    return {
      permission: {
        add: ['queuedEmail:add'],
        edit: ['queuedEmail:edit'],
        del: ['queuedEmail:del']
      },
      sendBody: '',
      bodyDialog: false
    }
  },
  methods: {
    checkboxT: function(row, rowIndex) {
      return row.id !== 1
    },
    // body
    info(body) {
      this.sendBody = body
      this.bodyDialog = true
    }
  }
}
</script>
