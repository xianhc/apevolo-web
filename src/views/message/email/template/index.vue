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
      <el-table-column :selectable="checkboxT" type="selection" width="55" />
      <el-table-column :show-overflow-tooltip="true" prop="id" label="模板ID" />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="name"
        width="150px"
        label="模板名称"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="subject"
        width="150px"
        label="主题"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="body"
        label="内容"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="bccEmailAddresses"
        label="抄送邮箱"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        prop="emailAccountId"
        label="发送邮箱"
      />
      <el-table-column prop="isActive" label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isActive"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            @change="changeEnabled(scope.row, scope.row.isActive)"
          />
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
      <!--   编辑与删除   -->
      <el-table-column
        v-if="checkPer(['emailTemplate_edit', 'emailTemplate_del'])"
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
    <!--Form表单--> <eForm :template-status="dict.email_message_template_status" />
  </div>
</template>

<script>
import crudEmailTemplate from '@/api/message/emailTemplate'
import eHeader from './header'
import eForm from './form'
import CRUD, { presenter } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

export default {
  name: 'EmailTemplate',
  components: {
    eHeader,
    eForm,
    pagination,
    crudOperation,
    udOperation
  },
  cruds: function() {
    return CRUD({
      title: '电子邮件模板',
      url: 'api/email/template/query',
      crudMethod: { ...crudEmailTemplate },
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
  // 数据字典
  dicts: ['email_message_template_status'],
  data() {
    return {
      permission: {
        add: ['emailTemplate_add'],
        edit: ['emailTemplate_edit'],
        del: ['emailTemplate_del']
      }
    }
  },
  methods: {
    checkboxT: function(row, rowIndex) {
      return row.id !== 1
    },
    changeEnabled(data, val) {
      this.$confirm(
        '此操作将 "' +
        this.dict.label.email_message_template_status[val] +
        '" ' +
        data.name +
        '邮件模板, 是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          crudEmailTemplate
            .edit(data)
            .then(() => {
              // eslint-disable-next-line no-undef
              this.crud.message(
                this.dict.label.email_message_template_status[val] + '成功',
                'success'
              )
            })
            .catch((err) => {
              data.isActive = !data.isActive
              console.log(err.data.message)
            })
        })
        .catch(() => {
          data.isActive = !data.isActive
        })
    }
  }
}
</script>
