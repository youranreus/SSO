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
      nowTime: 0
    }
  },
  created() {
    this.nowTime = new Date().getHours();
    if (this.nowTime < 11) {
      this.message = "早上好";
    } else if (this.nowTime < 14) {
      this.message = "中午好";
    } else if (this.nowTime < 19) {
      this.message = "下午好";
    } else {
      this.message = "晚上好";
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