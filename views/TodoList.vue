<template>
  <div class="todo-container">
    <el-card class="todo-card">
      <template #header>
        <div class="todo-header">
          <h2 class="todo-title">待办事项</h2>
          <el-button type="primary" @click="showAddDialog">添加任务</el-button>
        </div>
      </template>
      <el-table :data="todoList" style="width: 100%">
        <el-table-column prop="title" label="任务" width="400">
          <template #default="{ row }">
            <span :class="{ 'completed': row.status === 'completed' }">{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deadline" label="截止日期" width="180">
          <template #default="{ row }">
            {{ formatDate(row.deadline) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : 'warning'">
              {{ row.status === 'completed' ? '已完成' : '进行中' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" @click="toggleStatus(row)">
                {{ row.status === 'completed' ? '取消完成' : '标记完成' }}
              </el-button>
              <el-button type="warning" @click="editTodo(row)">编辑</el-button>
              <el-button type="danger" @click="deleteTodo(row)">删除</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑任务' : '添加任务'"
      width="500px"
    >
      <el-form :model="todoForm" :rules="rules" ref="todoFormRef" label-width="80px">
        <el-form-item label="任务" prop="title">
          <el-input v-model="todoForm.title" placeholder="请输入任务内容" />
        </el-form-item>
        <el-form-item label="截止日期" prop="deadline">
          <el-date-picker
            v-model="todoForm.deadline"
            type="datetime"
            placeholder="选择截止日期"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTodo">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const todoList = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const todoForm = reactive({ title: '', deadline: '', completed: false })
const todoFormRef = ref()
const rules = {
  title: [
    { required: true, message: '请输入任务内容', trigger: 'blur' }
  ],
  deadline: [
    { required: true, message: '请选择截止日期', trigger: 'blur' }
  ]
}

// 校验token，未登录跳转到登录页
const checkAuth = () => {
  const token = localStorage.getItem('token')
  if (!token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return false
  }
  return true
}

const fetchTodos = async () => {
  if (!checkAuth()) return
  try {
    const res = await axios.get('/todos')
    todoList.value = res.data
  } catch (err) {
    ElMessage.error(err.response?.data || '获取待办事项失败')
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
  }
}

// 新增：请求联想代理接口
const fetchLenovoData = async () => {
  try {
    const res = await fetch('http://localhost:5000/proxy-lenovo')
    const data = await res.json()
    console.log('联想接口数据', data)
    // 可根据需要将data赋值到ref变量用于页面展示
  } catch (error) {
    console.error('获取联想接口数据失败', error)
  }
}

onMounted(() => {
  fetchTodos()
  fetchLenovoData() // 新增调用
})

const toggleStatus = async (todo) => {
  try {
    const response = await axios.put(`/todos/${todo._id}`, { completed: !todo.completed })
    todo.completed = response.data.completed
    ElMessage.success('状态更新成功')
  } catch (error) {
    ElMessage.error('状态更新失败: ' + error.response.data)
  }
}

const deleteTodo = async (todo) => {
  try {
    await axios.delete(`/todos/${todo._id}`)
    todoList.value = todoList.value.filter(t => t._id !== todo._id)
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除失败: ' + error.response.data)
  }
}

onMounted(fetchTodos)

const formatDate = (date) => {
  return date ? date.replace('T', ' ').substring(0, 16) : ''
}

const showAddDialog = () => {
  isEdit.value = false
  Object.assign(todoForm, {
    id: null,
    title: '',
    deadline: '',
    completed: false
  })
  dialogVisible.value = true
}

const editTodo = (row) => {
  isEdit.value = true
  Object.assign(todoForm, { ...row })
  dialogVisible.value = true
}

const saveTodo = async () => {
  if (!todoFormRef.value) return

  await todoFormRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        const index = todoList.value.findIndex(item => item.id === todoForm.id)
        if (index !== -1) {
          todoList.value[index] = { ...todoForm }
          ElMessage.success('任务更新成功')
        }
      } else {
        const newTodo = {
          ...todoForm,
          id: Date.now(),
          completed: false
        }
        todoList.value.push(newTodo)
        ElMessage.success('任务添加成功')
      }
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.todo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.todo-card {
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.todo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.todo-title {
  margin: 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.completed {
  text-decoration: line-through;
  color: #909399;
  transition: all 0.3s ease;
}

.el-table {
  margin-top: 10px;
}

.el-table .el-button-group {
  display: flex;
  gap: 8px;
}

.el-table .el-button {
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.el-table .el-button:hover {
  transform: translateY(-1px);
}

.el-tag {
  transition: all 0.3s ease;
  padding: 4px 8px;
}

.el-dialog {
  border-radius: 8px;
}

.el-dialog__header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.el-dialog__body {
  padding: 24px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
}

@media screen and (max-width: 768px) {
  .todo-container {
    padding: 10px;
  }

  .todo-card {
    margin-top: 10px;
  }

  .todo-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .todo-title {
    text-align: center;
  }

  .el-button {
    width: 100%;
  }

  .el-table .el-button-group {
    flex-direction: column;
  }
}
</style>