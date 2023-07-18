<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input
          v-model="query.filter"
          clearable
          size="small"
          placeholder="模糊搜索"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <rrOperation />
      </div>
      <crudOperation show="" :permission="permission">
        <el-button
          slot="left"
          v-permission="['admin']"
          class="filter-item"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :loading="delLoading"
          :disabled="crud.selections.length === 0"
          @click="doDelete(crud.selections)"
        >
          强退
        </el-button>
      </crudOperation>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="account" label="登录账号" />
      <el-table-column prop="accessToken" label="令牌" />
      <el-table-column prop="nickName" label="用户昵称" />
      <el-table-column prop="dept" label="所属部门" />
      <el-table-column prop="ip" label="登录IP" />
      <el-table-column prop="address" label="IP地址" />
      <el-table-column prop="operatingSystem" label="操作系统" />
      <el-table-column prop="deviceType" label="设备类型" />
      <el-table-column prop="browserName" label="浏览器" />
      <el-table-column prop="version" label="版本号" />
      <el-table-column prop="loginTime" label="登录时间" />
      <el-table-column label="操作" width="70px" fixed="right">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.$index"
            v-permission="['admin']"
            placement="top"
            width="180"
          >
            <p>确定强退该用户吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                @click="$refs[scope.$index].doClose()"
              >取消</el-button>
              <el-button
                :loading="delLoading"
                type="primary"
                size="mini"
                @click="delMethod(scope.row.accessToken, scope.$index)"
              >确定</el-button>
            </div>
            <el-button slot="reference" size="mini" type="text">强退</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { del } from '@/api/monitor/online'
import CRUD, { presenter, header, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

export default {
  name: 'OnlineUser',
  components: { pagination, crudOperation, rrOperation },
  cruds() {
    return CRUD({ url: 'api/online/query', title: '在线用户' })
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      delLoading: false,
      permission: {
        down: ['admin']
      }
    }
  },
  created() {
    this.crud.msg.del = '强退成功！'
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true
    }
  },
  methods: {
    doDelete(datas) {
      this.$confirm(`确认强退选中的${datas.length}个用户?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delMethod(datas)
        })
        .catch(() => {})
    },
    // 强退用户
    delMethod(accessToken, index) {
      const ids = []
      if (accessToken instanceof Array) {
        accessToken.forEach((val) => {
          ids.push(val.accessToken)
        })
      } else ids.push(accessToken)
      this.delLoading = true
      del(ids)
        .then(() => {
          this.delLoading = false
          if (this.$refs[index]) {
            this.$refs[index].doClose()
          }
          this.crud.dleChangePage(1)
          this.crud.delSuccessNotify()
          this.crud.toQuery()
        })
        .catch(() => {
          this.delLoading = false
          if (this.$refs[index]) {
            this.$refs[index].doClose()
          }
        })
    }
  }
}
</script>
