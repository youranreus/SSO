<template>
  <div class="container">
      <div id="register-card">
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
            <router-link :to="{path: '/register'}">还没有账号，点击此处立即注册！</router-link>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import { sendLoginInfo, sendToken } from '../api';
  import router from '../router';

  export default {
    name: 'Login',
    data() {
      return {
        account: "",
        password: ""
      }
    },
    created() {
      this.judgeToken();
    },
    methods: {
      back() {
        if (this.$route.query.from !== undefined) {
          window.location.href = this.$route.query.from + "?UUID=" 
           + localStorage.getItem('UUID') + "&token=" + localStorage.getItem('token');
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
      loginBtnClick() {
        const postObj = {
          account: this.account,
          password: this.password
        }
        sendLoginInfo(postObj).then(res => {
          if (res.data.code === 200) {
            console.log("登陆成功返回信息：", res.data);
            alert("登陆成功！");
            for (const [key, value] of Object.entries(res.data.data)) {
              localStorage.setItem(key, value);
            }
            this.back();
          }
        }).catch(err => {
          console.log(err.response.data.msg);
          alert(err.response.data.msg);
        });
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
    width: 512px;
    margin: 76px auto;
  }

  #register-card {
    box-shadow: 0 4px 8px rgb(0 0 0 / 3%);
    background-color: #f5f6f9;
    border-radius: 5px;
    border-top: 2px solid #4582b31c;
    width: 512px;
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
    letter-spacing: .05rem;
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

  button {
    cursor: pointer;
    background-color: #6777ef;
    outline: none;
    padding: 10px 15px;
    width: 100%;
    border-radius: 5px;
    border-color: transparent;
    box-shadow: 0 2px 6px #acb5f6;

    letter-spacing: .25rem;
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
