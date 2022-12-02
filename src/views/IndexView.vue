<template>
    <div>
        <el-card>
            <!-- 搜索栏 -->
            <el-row :gutter="20">
                <el-col :span="16"></el-col>
                <el-col :span="4">
                    <el-input v-model="search" placeholder="请输入书名" />
                </el-col>
                <el-col :span="1">
                    <el-button type="primary" @click="Select()">搜索</el-button>
                </el-col>
            </el-row>
            <!-- 书籍列表区域  -->
            <el-row>
                <el-table border @row-click="setCurRow" height="750" highlight-current-row :data="tableData"
                    style="width: 600px; margin: 0 auto; text-align: center">
                    <el-table-column type="index" align="center" :index="setRow" label="序号"
                        width="70"></el-table-column>
                    <el-table-column align="center" :prop="index" :label="item" v-for="(item, index) in tableHeader"
                        :key="index"></el-table-column>
                </el-table>
            </el-row>
            <!-- 操作按钮 -->
            <el-row>
                <el-col :span="12"></el-col>
                <el-col :span="1">
                    <el-button type="primary" @click="refreshTable();">刷新</el-button>
                </el-col>
                <el-col :span="1">
                    <el-button type="primary" @click="updateData(Insert);">添加</el-button>
                </el-col>
                <el-col :span="1">
                    <el-button type="warning" @click="updateData(Update);">修改</el-button>
                </el-col>
                <el-col :span="1">
                    <el-button type="danger" @click="Delete();">删除</el-button>
                </el-col>
            </el-row>
        </el-card>
        <!-- 书籍信息框（不显示） -->
        <el-dialog v-model="dialogVisible" title="书籍信息" width="30%">
            <el-form :rules="rules" label-width="100px" :model="book"
                style="max-width: 300px; margin: 0 auto; text-align: center">
                <el-form-item prop="bookName" label="书名：">
                    <el-input placeholder="请输入书名" v-model="book.bookName" />
                </el-form-item>
                <el-form-item prop="price" label="单价：">
                    <el-input placeholder="请输入单价" v-model="book.price" />
                </el-form-item>
                <el-form-item prop="stock" label="库存：">
                    <el-input placeholder="请输入库存" v-model="book.stock" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="operation();">确认</el-button>
                    <el-button native-type="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { ElConfigProvider } from 'element-plus'
import api from '../api'


export default {
    components: {
        //使用element组件
        ElConfigProvider,
    },
    setup() {
        //当前选择的行下标
        let index = -1;

        //表格表头
        const tableHeader = reactive({
            bookName: "书名",
            price: "单价",
            stock: "库存"
        })
        //表格数据
        const tableData = reactive([

        ])
        // 书籍信息框
        const dialogVisible = ref(false)

        // 书籍信息框中确认按钮的操作
        const operation = ref(Insert)

        // 书籍信息
        const book = reactive({
            bookName: '',
            price: 0,
            stock: 0
        })

        //搜索内容
        const search = ref('')

        //表单校验规则
        const rules = reactive({
            bookName: [
                {
                    required: true,
                    message: '未填写书名',
                    trigger: 'blur'
                }
            ],
            price: [
                {
                    required: true,
                    message: '未填写单价',
                    trigger: 'blur'
                }
            ],
            stock: [
                {
                    required: true,
                    message: '未填写库存',
                    trigger: 'blur'
                }
            ]
        });

        // 设置当前选择行下标
        function setCurRow(row) {
            index = row.id - 1;
        }

        // 给后端传输的数据编号
        function setRow(i) {
            tableData[i].id = i + 1;
            return i + 1;
        }

        // 更新书籍信息框
        function updateData(op) {
            if (op === Insert) {
                book.bookName = '';
                book.price = 0;
                book.stock = 0;
            } else if (index >= 0 && index < tableData.length) {
                book.bookName = tableData[index].bookName;
                book.price = tableData[index].price;
                book.stock = tableData[index].stock;
            } else {
                ElNotification({
                    message: '未选择需要修改的书籍',
                    type: 'error',
                    position: 'top-left',
                    duration: 3000
                });
                return;
            }
            operation.value = op;
            dialogVisible.value = true;
        }

        // 添加操作
        function Insert() {
            if (book.bookName !== null && book.bookName !== '' && book.price !== null && book.price >= 0 && book.stock !== null) {
                api.postInsertBook(book).then(response => {
                    // 刷新表格
                    refreshTable();
                    ElNotification({
                        message: '添加成功',
                        type: 'success',
                        position: 'top-left',
                        duration: 3000
                    });
                });
                dialogVisible.value = false;
            }
        }

        // 删除操作
        function Delete() {
            if (index < 0 || index > tableData.length) {
                ElNotification({
                    message: '未选择需要删除的书籍',
                    type: 'error',
                    position: 'top-left',
                    duration: 3000
                });
            } else {
                api.postDeleteBook(tableData[index].bookName).then(response => {
                    refreshTable();
                    ElNotification({
                        message: '删除成功',
                        type: 'success',
                        position: 'top-left',
                        duration: 3000
                    });
                });
            }
        }

        // 修改操作
        function Update() {
            if (book.bookName !== null && book.bookName !== '' && book.price !== null && book.price >= 0 && book.stock !== null) {
                api.postUpdatetBook(tableData[index].bookName, book).then(response => {
                    refreshTable();
                    ElNotification({
                        message: '修改成功',
                        type: 'success',
                        position: 'top-left',
                        duration: 3000
                    });
                })
                dialogVisible.value = false;
            }
        }

        //查询操作
        function Select() {
            api.postSelectBook(search.value).then(response => {
                if ('success' === response.data.msg) {
                    if (tableData.length !== 0) {
                        tableData.length = 0;
                    }
                    response.data.books.forEach((value, index, array) => {
                        tableData.push(value);
                    });
                }
            })
        }

        //刷新表格
        function refreshTable() {
            if (tableData.length !== 0) {
                tableData.length = 0;
            }
            api.postBookInfo().then(response => {
                if ('success' === response.data.msg) {
                    response.data.books.forEach((value, index, array) => {
                        tableData.push(value);
                    });
                }
            })
        }

        // 初始化刷新
        refreshTable();

        return {
            tableHeader,
            dialogVisible,
            tableData,
            setCurRow,
            Insert,
            Delete,
            Update,
            Select,
            operation,
            updateData,
            refreshTable,
            book,
            setRow,
            search,
            rules
        }
    }
}
</script>