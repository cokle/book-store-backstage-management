<template>
  <el-form
    label-width="100px"
    :rules="rules"
    :model="user"
    style="max-width: 300px; margin: 0 auto; text-align: center"
  >
    <el-form-item prop="username" label="用户名：">
      <el-input placeholder="请输入用户名" v-model="user.username"/>
    </el-form-item>
    <el-form-item prop="password" label="密码：">
      <el-input placeholder="请输入密码" v-model="user.password"/>
    </el-form-item>
     <el-form-item>
      <el-button type="primary" @click="login">登录</el-button>
      <el-button native-type="reset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { reactive, ref } from 'vue'
import { ElConfigProvider } from 'element-plus'
import api from '../api'
import { useRouter } from 'vue-router'


export default {//js逻辑
    components: {
        //使用element组件
        ElConfigProvider,
    },
    setup() {
        //初始化路由
        const router = useRouter();

        //数据
        const user = reactive({
            username: '',
            password: ''
        });

        //表单校验规则
        const rules = reactive({
            username: [
                {
                    required: true,
                    message: '未填写用户名',
                    trigger: 'blur'
                }
            ],
            password: [
                {
                    required: true,
                    message: '未填写密码',
                    trigger: 'blur'
                }
            ]
        });
        
        //登录方法
        function login () {
            api.postLogin(user.username, user.password).then(response => {
                if('success' === response.data.msg) {
                    sessionStorage.setItem('user', JSON.stringify(user));
                    router.push({path: '/'});
                }
            })
        }

        return {
            user,
            rules,
            login
        }
    }
}
</script>