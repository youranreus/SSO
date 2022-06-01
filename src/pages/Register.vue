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
                <input v-model.trim="userData.name" id="name" type="text" placeholder="请输入姓名" name="name" required>                
              </div>
              <div class="right">
                <label for="nickname">昵称</label>
                <input v-model.trim="userData.nickname" id="nickname" type="text" placeholder="请输入昵称" name="nickname" required>                
              </div>
            </div>
            <div class="row">
              <div class="left">
                <label for="s_id">学号</label>
                <input v-model.trim="userData.s_id" id="s_id" type="text" placeholder="请输入学号" name="s_id" required>                
              </div>
            </div>
            <div class="row">
              <div class="left">
                <label for="password">密码</label>
                <input v-model="userData.password" id="password" type="password" placeholder="请输入密码（6~22位）" name="password" required>                
              </div>
              <div class="right">
                <label for="repassword">确认密码</label>
                <input v-model="userData.repassword" id="repassword" type="password" placeholder="请再次输入密码" name="repassword" required> 
              </div>
            </div>
            <div class="row">
              <div class="left">
                <label for="email">邮箱</label>
                <input v-model.trim="userData.email" id="email" type="text" placeholder="请输入邮箱" name="email" required>                
              </div>
              <div class="right">
                <label for="captcha">邮箱验证码</label>
                <div class="input-email">
                  <input v-model="userData.captcha" id="captcha" type="text" placeholder="请输入邮箱验证码" name="captcha" required>
                  <button @click="emailCodeButtonClick">发送</button>                  
                </div>
              </div>
            </div>
            <div class="button-row">
                <button @click="registerButtonClick">注册</button>
            </div>
            <div class="text-row">
              <router-link :to="{path: '/login', query: {from: urlFrom}}">已有账号，点击此处返回登陆页面！</router-link>
            </div>
            <div class="text-row">
              <router-link :to="{path: '/retrieve', query: {from: urlFrom}}">忘记密码，点击此处找回密码！</router-link>
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
  import { errorMap } from  '../utils/errorMap'

  export default {
    name: 'Register', 
    data() {
      return {
        userData: {
          name: "",
          nickname: "",
          s_id: "",
          password: "",
          repassword: "",
          email: "",
          captcha: "",      
        },
        urlFrom: "",
        errorMessage: ""
      }
    },
    created() {
      this.urlFrom = this.$route.query.from;
    }
    ,
    methods: {
      emailCodeButtonClick() {
        if (this.userData.email === "") {
          Message.info("请先填写你的邮箱！");
          this.userData.captcha = "";
        } else {
          const getObj = {
            type: 'reg',
            email: this.userData.email
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
      checkBlankInput() {
        for (const [key, value] of Object.entries(this.userData)) {
          if (value === "") {
            this.errorMessage = key;
            return false;
          }
        }
        return true;
      },
      judgeIfInput(event) {
        const target = event.target;
        if (target.tagName === "INPUT" && this.checkBlankInput()) {
          this.registerButtonClick();
        }
      },
      registerButtonClick() {
        if (this.checkBlankInput() === false) {
          Message.info(errorMap[this.errorMessage]);
          return;
        }
        if (this.userData.password !== this.userData.repassword) {
          Message.info("输入的两次密码不一致！")
        } else if (this.userData.password.length < 6 || this.userData.password.length > 22) {
          Message.info("你的密码长度必须在 6 ~ 22 位！");
        } else {
          const postObj = {
            name: this.userData.name,
            nickname: this.userData.nickname,
            email: this.userData.email,
            password: md5(this.userData.password),
            s_id: this.userData.s_id,
            captcha: this.userData.captcha
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
