<template>
  <!--     页面主体       -->
  <div>
    <!--        搜索部分        -->
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="itemName"
                class="ml-5"></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
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
      <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
      <el-table-column prop="itemName" label="商品名称" width="200" align="center"></el-table-column>
      <el-table-column prop="catId" label="分类id" width="80" align="center"></el-table-column>
      <el-table-column prop="rootCatId" label="一级分类id" width="80" align="center"></el-table-column>
      <el-table-column prop="sellCounts" label="累计销售" width="80" align="center"></el-table-column>
      <el-table-column prop="onOffStatus" label="上下架状态" width="80" align="center"></el-table-column>
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

    <el-dialog title="商品信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="100px" size="small">
        <el-form-item label="商品名称">
          <el-input v-model="form.itemName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类id">
          <el-input v-model="form.catId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="一级分类id">
          <el-input v-model="form.rootCatId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="累计销售">
          <el-input v-model="form.sellCounts" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上下架状态">
          <el-input v-model="form.onOffStatus" autocomplete="off"></el-input>
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
  name: "Item",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      itemName: "",
      email: "",
      address: "",
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
      this.request.get("/items/page", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          itemName: this.itemName,
        }
      }).then(res => {
        // console.log(res)
        this.tableData = res.data.records
        this.total = res.data.total
      }).catch((err) => {
        console.log(err)
      });
    },
    //新增->保存
    save() {
      this.request.post("/items", this.form).then(res => {
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
      this.request.delete("/items/delete/" + id).then(res => {
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
      this.request.post("/items/del/batch", ids).then(res => {
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
      this.itemName = ""
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
    //   window.open("/items/export")
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
