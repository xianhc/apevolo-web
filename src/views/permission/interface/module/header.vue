<template>
  <div v-if="crud.props.searchToggle">
    <el-input v-model="query.group" clearable size="small" placeholder="输入组名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
    <el-input v-model="query.description" clearable size="small" placeholder="输入描述搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
    <el-select v-model="query.method" clearable size="small" placeholder="请求方法" class="filter-item" style="width: 120px" @change="crud.toQuery">
      <el-option
        v-for="item in httpMethods"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <rrOperation />
  </div>
</template>

<script>
import { header } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
export default {
  components: { rrOperation },
  mixins: [header()],
  props: {
    permission: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      httpMethods: [{
        value: 'GET',
        label: 'GET(查询)'
      }, {
        value: 'POST',
        label: 'PSOT(创建)'
      }, {
        value: 'PUT',
        label: 'PUST(更新)'
      }, {
        value: 'DELETE',
        label: 'DELETE(删除)'
      }]
    }
  }
}
</script>
