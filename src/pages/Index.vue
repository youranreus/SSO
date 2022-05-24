<template>
  <h2 class="title">
    {{ message }}
  </h2>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      message: "",
      nowTime: 0,
      uickName: ""
    }
  },
  created() {
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
