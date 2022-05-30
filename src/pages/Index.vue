<template>
  <div class="card">
    <h2 class="title">
      {{ message }}
    </h2>
    <div v-if="show" class="row">
      <router-link :to="{path: '/login', query: {from: urlFrom}}">登录</router-link>
      <router-link :to="{path: '/register', query: {from: urlFrom}}">注册</router-link>
    </div>
    <div v-if="!show" class="row">
      <router-link id="logout" @click="logout" :to="{path: '/', query: {from: urlFrom}}">退出登录</router-link>
    </div>
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
      uickName: "",
      urlFrom: ""
    }
  },
  created() {
    this.urlFrom = this.$route.query.from;
    this.judgeToken();
    this.initialPage();
  },
  methods: {
    judgeToken() {
      this.urlFrom = this.$route.query.from;
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
      const user_info = JSON.parse(localStorage.getItem('USER_INFO'));
      if (user_info !== null) {
        this.nickName = user_info.nickname;
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
    },
    logout() {
      localStorage.clear();
      this.show = true;
      this.initialPage();
    }
  }
}
</script>

<style scoped>
  @import "../css/card.css";
  .card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .title {
    font-size: 3rem;
    font-weight: 200;
    text-align: center;
    opacity: 0.6;
    margin: 34px 0;
    letter-spacing: .3rem;
  }
  .card .row {
    border-top: 3px solid #f9f9f9;
    margin-bottom: 0;
  }
  .card .row a {
    outline: none;
    padding: 20px;
    width: 50%;
    text-align: center;
    color: #000;
    opacity: 0.6;
    font-size: 1.125rem;
    border-right: 3px solid #f9f9f9;
  }
  .card .row a:last-child {
    border-right: none;
  }

  #logout {
    width: 100%;
    letter-spacing: .56rem;
  }

  a {
    text-decoration: none;
  }

  a:hover {
    background-color: #8ab1d11c;
  }
</style>
