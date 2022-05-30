<template>
  <div class="container">
      <div @keypress.enter="judgeIfInput" class="card">
        <div class="card-header">
          <h2>登陆</h2>
        </div>
        <div class="card-content">
          <div class="row">
            <label for="account">学号 / 邮箱</label>
            <input v-model.trim="account" id="account" type="text" placeholder="请输入学号 / 邮箱" name="account" required>     
          </div>
          <div class="row">
            <label for="password">密码</label>
            <input v-model="password" id="password" type="password" placeholder="请输入密码" name="password" required>
          </div>
          <div class="button-row">
            <button @click="loginBtnClick">登陆</button>
          </div>
          <div class="text-row">
            <router-link :to="{path: '/register', query: {from: urlFrom}}">还没有账号，点击此处立即注册！</router-link>
          </div>
          <div class="text-row">
              <router-link :to="{path: '/retrieve', query: {from: urlFrom}}">忘记密码，点击此处找回密码！</router-link>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import { sendLoginInfo, sendToken } from '../api';
  import router from '../router';
  import md5 from 'js-md5';
  import { Message } from '@arco-design/web-vue';
  import '@arco-design/web-vue/es/message/style/css.js'

  export default {
    name: 'Login',
    data() {
      return {
        account: "",
        password: "",
        urlFrom: ""
      }
    },
    created() {
      this.urlFrom = this.$route.query.from;
      this.judgeToken();
    },
    methods: {
      back() {
        if (this.$route.query.from !== undefined) {
          window.location.href = this.$route.query.from + "?UUID=" 
           + JSON.parse(localStorage.getItem('USER_INFO')).UUID + "&token=" + localStorage.getItem('token');
        } else {
          router.push('/');
        }
      },
      judgeToken() {
        const token = localStorage.getItem('token');
        if (token !== null) {
          sendToken().then(res => {
            console.log("token返回：", res);
            this.back();
          }).catch(err => {
            console.log("token返回错误信息：", err);
            localStorage.clear();
          })
        }
      },
      judgeIfInput(event) {
        const target = event.target;
        if (target.tagName === "INPUT" && this.account !== "" && this.password !== "") {
          this.loginBtnClick();
        }
      },
      loginBtnClick() {
        if (this.account === "") {
          Message.info("请填写学号或邮箱！");
        } else if (this.password === "") {
          Message.info("请填写密码！");
        } else {
          const postObj = {
            account: this.account,
            password: md5(this.password)
          }
          sendLoginInfo(postObj).then(res => {
            if (res.data.code === 200) {
              console.log("登陆成功返回信息：", res.data);
              localStorage.setItem('token', res.data.data.token);
              localStorage.setItem('USER_INFO', JSON.stringify(res.data.data, (key, val) => {
                if (key === "token") return undefined;
                else return val;
              }));
              Message.info("登陆成功！");
              this.back();
            }
          }).catch(err => {
            console.log(err.response.data.msg);
            Message.info(err.response.data.msg);
          });
        }
      }
    }
  }
</script>

<style scoped>
  @import "../css/card.css";
  .row {
    flex-direction: column;
    padding: 0 15px;
  }
</style>
