<template>
  <!--     页面主体       -->
  <div>
    <!--        搜索部分        -->
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="id" class="ml-5">
      </el-input>
      <el-button class="ml-5" type="primary" @click="load" placeholder="请输入订单id">搜索</el-button>
      <el-button type="warning" @click="reset">重置</el-button>
    </div>

    <!--      表格外部操作部分          -->
    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
      <el-popconfirm class="ml-5" confirm-button-text='确定' cancel-button-text='我再想想' icon="el-icon-info"
                     icon-color="red" title="ATTENTION!!!" @confirm="delBatch">
        <el-button type="danger" slot="reference" class="ml-5">批量删除 <i class="el-icon-remove-outline"></i>
        </el-button>
      </el-popconfirm>
    </div>

    <!--        表格内部操作部分        -->
    <el-table :data="tableData" border stripe :header-cell-class-name="headerBg"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="订单ID" width="150" align="center"></el-table-column>
      <el-table-column prop="userId" label="用户ID" width="150" align="center"></el-table-column>
      <el-table-column prop="receiverName" label="收货人昵称" width="80" align="center"></el-table-column>
      <el-table-column prop="receiverMobile" label="收货人电话" width="80" align="center"></el-table-column>
      <el-table-column prop="receiverAddress" label="收货地址" width="80" align="center"></el-table-column>
      <el-table-column prop="totalAmount" label="订单总价格" width="80" align="center"></el-table-column>
      <el-table-column prop="createdTime" label="创建时间" width="150" align="center"></el-table-column>
      <el-table-column prop="updatedTime" label="更新时间" width="150" align="center"></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
          <el-popconfirm class="ml-5" confirm-button-text='确定' cancel-button-text='我再想想' icon="el-icon-info"
                         icon-color="red" title="ATTENTION!!!" @confirm="del(scope.row.id)">
            <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!--       翻页与页码部分         -->
    <div style="padding: 10px 0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
                     :page-sizes="[2, 5, 10, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </div>

    <el-dialog title="订单信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="100px" size="small">
        <el-form-item label="订单ID">
          <el-input v-model="form.id" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="form.userId" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货人昵称">
          <el-input v-model="form.receiverName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="收货人地址">
          <el-input v-model="form.receiverAddress" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<!--页面数据与动作Js代码-->
<script>
export default {
  name: "Orders",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      id: "",
      form: {},
      dialogFormVisible: false,
      multipleSelection: [],
      roles: [],
    }
  },
  // 请求分页查询数据
  created() {
    this.load()
  },
  methods: {
    // 将数据库查询操作封装
    load() {
      this.request.get("/orders/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          id: this.id,
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      }).catch((err) => {
        console.log(err)
      });
      // this.request.get("/role").then(res => {
      //   this.roles = res
      // })
    },
    //新增->保存
    save() {
      this.request.post("/orders", this.form).then(res => {
        if (res) {
          this.$message.success("保存成功!")
          this.dialogFormVisible = false
          this.load()
        } else {
          this.$message.error("保存失败!")
        }
      })
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },
    handleEdit(row) {
      this.form = row
      this.dialogFormVisible = true
    },
    //删除
    del(id) {
      this.request.delete("/orders/delete/" + id).then(res => {
        if (res) {
          this.$message.success("删除成功!")
          this.load()
        } else {
          this.$message.error("删除失败!")
        }
      })
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    //批量删除
    delBatch() {
      let ids = this.multipleSelection.map(v => v.id) // [{}, {}, {}] => [1,2,3]
      this.request.post("/orders/del/batch", ids).then(res => {
        if (res) {
          this.$message.success("批量删除成功")
          this.load()
        } else {
          this.$message.error("批量删除失败")
        }
      })
    },
    //重置
    reset() {
      this.id = ""
      this.load()
    },
    // 动态分页请求
    handleSizeChange(pageSize) {
      console.log(pageSize)
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      console.log(pageNum)
      this.pageNum = pageNum
      this.load()
    },
    //导出数据
    // exp() {
    //   window.open("/orders/export")
    // },
    handleExcelImportSuccess() {
      this.$message.success("文件导入成功！！！")
      this.load()
    }
  }
}
</script>

<!--表格头部样式-->
<style>
.headerBg {
  background: #eee !important;
}
</style>
