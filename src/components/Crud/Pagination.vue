<!--分页-->
<template>
  <el-pagination
    :page-size.sync="pagination.pageSize"
    :total="pagination.totalElements"
    :current-page.sync="pagination.pageIndex"
    style="margin-top: 8px;"
    layout="total, prev, pager, next, sizes"
    @size-change="crud.sizeChangeHandler($event)"
    @current-change="crud.pageChangeHandler"
  />
</template>
<script>
import { pagination } from '@crud/crud'
export default {
  mixins: [pagination()]
}
</script>
