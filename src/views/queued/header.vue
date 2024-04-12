<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input
      v-model="query.to"
      clearable
      size="small"
      placeholder="收件人"
      style="width: 200px;"
      class="filter-item"
      @keyup.enter.native="crud.toQuery"
    />
    <el-select
      v-model="query.emailAccountId"
      clearable
      size="small"
      placeholder="发送账户"
      class="filter-item"
      style="width: 180px"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in emailAccounts"
        :key="item.email"
        :label="item.email"
        :value="item.id"
      />
    </el-select>
    <el-select
      v-model="query.isSend"
      clearable
      size="small"
      placeholder="发送结果"
      class="filter-item"
      style="width: 100px"
      @change="crud.toQuery"
    >
      <el-option
        v-for="item in sendResult"
        :key="item.label"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <date-range-picker v-model="query.createTime" class="date-item" />
    <rrOperation />
  </div>
</template>

<script>
import { header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
import { getAllEmailAccounts } from '@/api/message/emailAccount'

export default {
  components: { rrOperation, DateRangePicker },
  mixins: [header()],
  props: {
    permission: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      emailAccounts: [],
      sendResult: [
        { label: '已发送', value: 'true' },
        { label: '未发送', value: 'false' }
      ]
    }
  }, mounted: function() {
    this.getEmailAccounts()
  }, methods: {
    // 获取可用的邮箱账号
    getEmailAccounts() {
      getAllEmailAccounts()
        .then((res) => {
          this.emailAccounts = res.content
        })
        .catch(() => {
        })
    }
  }
}
</script>
