<template>
  <div
    v-if="crud.props.searchToggle"
  >
    <el-input
      v-model="query.name"
      clearable
      size="small"
      placeholder="输入租户名称搜索"
      style="width: 160px;"
      class="filter-item"
      @keyup.enter.native="crud.toQuery"
    />
    <date-range-picker v-model="query.createTime" class="date-item" />
    <el-select
      v-model="query.tenantType"
      clearable
      size="small"
      placeholder="租户类型"
      class="filter-item"
      style="width: 100px"
      @change="crud.toQuery"
    >
      <el-option v-for="item in dict.dict.tenant_type" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-select
      v-model="query.dbType"
      clearable
      size="small"
      placeholder="DB类型"
      class="filter-item"
      style="width: 90px"
      @change="crud.toQuery"
    >
      <el-option v-for="item in dict.dict.db_type" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
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
    dict: {
      type: Object,
      required: true
    },
    permission: {
      type: Object,
      required: true
    }
  }
}
</script>
