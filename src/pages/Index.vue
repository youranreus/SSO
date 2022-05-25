<template>
  <div class="container">
    <div v-if="show" class="row">
      <router-link :to="{path: '/login'}">登录</router-link>
      <router-link :to="{path: '/register'}">注册</router-link>
    </div>
    <h2 class="title">
      {{ message }}
    </h2>
  </div>

</template>

<script>
import { sendToken } from '../api';

export default {
  name: 'Index',
  data() {
    return {
      show: true,
      message: "",
      nowTime: 0,
      uickName: ""
    }
  },
  created() {
    this.judgeToken();
    this.initialPage();
  },
  methods: {
    judgeToken() {
      const token = localStorage.getItem('token');
      if (token !== null) {
        sendToken().then(res => {
          console.log("token返回：", res);
          this.show = false;
        }).catch(err => {
          console.log("token返回错误信息：", err);
          localStorage.clear();
          this.show = true;
        })
      }
    },
    initialPage() {
      const nick = localStorage.getItem('nickname');
      if (nick !== null) {
        this.nickName = nick;
      } else {
        this.nickName = "";
      }
      this.nowTime = new Date().getHours();
      if (this.nowTime < 11) {
        this.message = `早上好！${this.nickName}`;
      } else if (this.nowTime < 14) {
        this.message = `中午好！${this.nickName}`;
      } else if (this.nowTime < 19) {
        this.message = `下午好！${this.nickName}`;
      } else {
        this.message = `晚上好！${this.nickName}`;
      }
    }
  }
}
</script>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    width: 512px;
    margin: 176px auto;
    box-shadow: 0 4px 8px rgb(0 0 0 / 3%);
    background-color: #f5f6f9;
    border-radius: 5px;
    border-top: 2px solid #4582b31c;
  }
  .title {
    font-size: 3rem;
    font-weight: 200;
    text-align: center;
    opacity: 0.6;
    margin: 34px 0;
    letter-spacing: .3rem;
  }
  .container .row {
    display: flex;
    border-bottom: 3px solid #f9f9f9;
  }
  .container .row a {
    outline: none;
    padding: 20px;
    width: 50%;
    text-align: center;
    color: #000;
    opacity: 0.6;
    font-size: 1.125rem;
    border-right: 3px solid #f9f9f9;
  }
  .container .row a:last-child {
    border-right: none;
  }

  a {
    text-decoration: none;
  }
</style>
