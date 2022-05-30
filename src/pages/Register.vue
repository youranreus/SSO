<template>
  <div class="container">
      <div @keypress.enter="judgeIfInput" class="card">
        <div class="card-header">
          <h2>注册</h2>
        </div>
        <div class="card-content">
            <div class="row">
              <div class="left">
                <label for="name">姓名</label>
                <input v-model.trim="name" id="name" type="text" placeholder="请输入姓名" name="name" required>                
              </div>
              <div class="right">
                <label for="nickname">昵称</label>
                <input v-model.trim="nickname" id="nickname" type="text" placeholder="请输入昵称" name="nickname" required>                
              </div>
            </div>
            <div class="row">
              <div class="left">
                <label for="s_id">学号</label>
                <input v-model.trim="s_id" id="s_id" type="text" placeholder="请输入学号" name="s_id" required>                
              </div>
            </div>
            <div class="row">
              <div class="left">
                <label for="password">密码</label>
                <input v-model="password" id="password" type="password" placeholder="请输入密码（6~22位）" name="password" required>                
              </div>
              <div class="right">
                <label for="repassword">确认密码</label>
                <input v-model="repassword" id="repassword" type="password" placeholder="请再次输入密码" name="repassword" required> 
              </div>
            </div>
            <div class="row">
              <div class="left">
                <label for="email">邮箱</label>
                <input v-model.trim="email" id="email" type="text" placeholder="请输入邮箱" name="email" required>                
              </div>
              <div class="right">
                <label for="captcha">邮箱验证码</label>
                <div class="input-email">
                  <input v-model="captcha" id="captcha" type="text" placeholder="请输入邮箱验证码" name="captcha" required>
                  <button @click="emailCodeButtonClick">发送</button>                  
                </div>
              </div>
            </div>
            <div class="button-row">
                <button @click="registerButtonClick">注册</button>
            </div>
            <div class="text-row">
              <router-link :to="{path: '/login'}">已有账号，点击此处返回登陆页面！</router-link>
            </div>
            <div class="text-row">
              <router-link :to="{path: '/retrieve'}">忘记密码，点击此处找回密码！</router-link>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
  import { sendEmailCode, sendRegisterInfo } from '../api'
  import router from '../router';
  import md5 from 'js-md5';
  import { Message } from '@arco-design/web-vue';
  import '@arco-design/web-vue/es/message/style/css.js'

  export default {
    name: 'Register',
    data() {
      return {
        name: "",
        nickname: "",
        s_id: "",
        password: "",
        repassword: "",
        email: "",
        captcha: ""
      }
    },
    methods: {
      emailCodeButtonClick() {
        if (this.email === "") {
          Message.info("请先填写你的邮箱！");
          this.captcha = "";
        } else {
          const getObj = {
            type: 'reg',
            email: this.email
          }
          sendEmailCode(getObj).then(res => {
            Message.info("验证码已发送，请前往邮箱查阅！")
            console.log("邮箱成功发送返回：", res);
          }).catch(err => {
            console.log(err);
            Message.info(err.response.data.msg);
          })
        }
      },
      judgeIfInput(event) {
        const target = event.target;
        if (target.tagName === "INPUT" && this.name !== "" && this.nickname !== "" && this.s_id !== "" &&
        this.password !== "" && this.repassword !== "" && this.email !== "" && this.captcha !== "") {
          this.registerButtonClick();
        }
      },
      registerButtonClick() {
        if (this.name === "") {
          Message.info("请填写你的姓名！");
        } else if (this.nickname === "") {
          Message.info("请填写你的昵称！");
        } else if (this.s_id === "") {
          Message.info("请填写你的学号！");
        } else if (this.password === "") {
          Message.info("请填写你的密码！");
        } else if (this.repassword === "") {
          Message.info("请填写确认密码！");
        } else if (this.email === "") {
          Message.info("请填写你的邮箱！");
        } else if (this.captcha === "") {
          Message.info("请填写邮箱验证码！")
        } else if (this.password !== this.repassword) {
          Message.info("输入的两次密码不一致！")
        } else if (this.password.length < 6 || this.password.length > 22) {
          Message.info("你的密码长度必须在 6 ~ 22 位！");
        } else {
          const postObj = {
            name: this.name,
            nickname: this.nickname,
            email: this.email,
            password: md5(this.password),
            s_id: this.s_id,
            captcha: this.captcha
          }
          sendRegisterInfo(postObj).then(res => {
            console.log("注册成功返回：", res);
            Message.info('注册成功');
            if (res.data.code === 200) {
              router.push('/');
            }
          }).catch(err => {
            console.log("错误信息：", err.response.data.msg);
            Message.info(err.response.data.msg);
          });
        }
      }
    }
  }
</script>

<style scoped>
  @import "../css/card.css";
  .container {
    margin: 22px auto;
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
    width: 22%;
    border-radius: 0 5px 5px 0;
  }
</style>
