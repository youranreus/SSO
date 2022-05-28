<template>
  <div class="container">
    <div id="register-card">
      <div class="card-header">
        <h2>找回密码</h2>
      </div>
      <div class="card-content">
        <div class="row">
          <label for="password">新密码</label>
          <input v-model.trim="password" type="password" placeholder="请输入新密码（6~22位）" name="password" required>
        </div>
        <div class="row">
          <label for="email">邮箱</label>
          <input v-model.trim="email" type="text" placeholder="请输入邮箱" name="email" required>
        </div>
        <div class="row">
          <label for="captcha">验证码</label>
          <div class="input-email">
            <input v-model="captcha" id="captcha" type="text" placeholder="请输入邮箱验证码" name="captcha" required>
            <button @click="emailCheckCode">发送</button>
          </div>
          
        </div>
        <div class="button-row">
            <button @click="send">重置密码</button>
          </div>
        <div class="text-row">
            <a @click="gotoLogin">点击此处返回登陆页面！</a>
          </div>
      </div>
    </div>
  </div>

</template>

<script>
import { sendEmailCode, sendResetPassword } from '../api';
import router from '../router';
import md5 from 'js-md5';
import { Message } from '@arco-design/web-vue';
import '@arco-design/web-vue/es/message/style/css.js'

export default {
  name: "Retrieve",
  data () {
    return {
      email: "",
      captcha: "",
      password: ""
    }
  },
  methods: {
    emailCheckCode () {
      let that = this;
      Message.info("正在检查邮箱格式...");
      if (that.email.search('@') == -1) {
        Message.info("请输入邮箱的正确格式！");
        console.log("邮箱格式错误");
      }
      else {
        const getObj = {
          type: "reset",
          email: that.email
        }
        sendEmailCode(getObj).then(res => {
         Message.info("验证码已发送，请前往邮箱查阅！");
          console.log("已发送验证码", res);
        }).catch(err => {
          console.log(err);
          Message.info(err.response.data.msg);
        })
      }
    },
    send () {
      let that = this;
      if (that.captcha == "") {
        Message.info("请输入验证码！")
      }
      else if (that.password.length < 6 || that.password.length > 22) {
        Message.info("密码长度应当为6~22位!");
      }
      else {
        const putObj = {
          email: that.email,
          captcha: that.captcha,
          password:md5(that.password)
        }
        sendResetPassword(putObj).then(res => {
          Message.info("密码已重置，即将返回登录页面！")
          if (res.data.code === 200) {
            router.push('/login');
          }
        }).catch(err => {
          console.log(err);
          Message.info(err.response.data.msg);
        })
      }
      console.log("发送重置密码请求");
    },
    gotoLogin(){
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 513.61px;
  margin: 76px auto;
}

#register-card {
  box-shadow: 0 4px 8px rgb(0 0 0 / 3%);
  background-color: #f5f6f9;
  border-radius: 5px;
  border-top: 2px solid #4582b31c;
  width: 513.61px;
  display: flex;
  flex-direction: column;
}

.card-header {
  line-height: 30px;
  width: 100%;
  min-height: 30px;
  padding: 15px 25px;
  display: flex;
  align-items: center;
  border-bottom: 3px solid #f9f9f9;
}

.card-header {
  font-size: 1rem;
}

.card-content {
  padding: 20px 10px;
}

.row {
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
  letter-spacing: 0.05rem;
  padding: 0 15px;
}

.row label {
  display: inline-block;
  margin-bottom: 8px;
  font-size: 0.75rem;
}

.row input {
  display: block;
  height: 40px;
  width: 100%;
  padding: 8px 12px;

  border-radius: 5px;
  border: 1px solid #ccc;
  outline: none;
}

.row input:focus {
  border-color: #95a0f4;
}

.button-row {
  padding: 10px 15px;
}

.input-email {
  display: flex;
}

#captcha {
  border-radius: 5px 0 0 5px;
  width: 78%
}

.input-email button {
  padding: 0px 3px;
  width: 32%;
  border-radius: 0 5px 5px 0;
}
button {
  cursor: pointer;
  background-color: #6777ef;
  outline: none;
  padding: 10px 15px;
  width: 100%;
  border-radius: 5px;
  border-color: transparent;
  box-shadow: 0 2px 6px #acb5f6;

  letter-spacing: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
}

.text-row {
  margin-top: 12px;
  text-align: center;
}

.text-row a {
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.05rem;
  color: rgba(116, 96, 96, 0.808);
  cursor: pointer;
}


</style>