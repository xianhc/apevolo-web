<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input v-model="query.keyWords" clearable size="small" placeholder="输入关键字搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
    <date-range-picker v-model="query.createTime" class="date-item" />
    <rrOperation />
  </div>
</template>

<script>
import { header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import DateRangePicker from '@/components/DateRangePicker'
export default {
  components: { rrOperation, DateRangePicker },
  mixins: [header()],
  props: {
    permission: {
      type: Object,
      required: true
    }
  }
}
</script>
