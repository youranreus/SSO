<template>
  <h2 class="title">
    这里是首页
    <br>
    <a href="/login">登陆</a>
    <br>
    <a href="/register">注册</a>
  </h2>
</template>

<script setup>
import {getHi} from "../api";

getHi().then(res => {
  console.log(res.data)
})
</script>

<style scoped>
.title {
  font-size: 3rem;
  font-weight: 200;
  text-align: center;
  opacity: 0.6;
  margin: 200px 0;
  letter-spacing: .3rem;
}
a {
  text-decoration: none;
}
</style>