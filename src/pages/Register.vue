<template>
  <div class="container">
      <div id="register-card">
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
                <input v-model="password" id="password" type="password" placeholder="请输入密码" name="password" required>                
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
              <a href="/login">已有账号，点击此处返回登陆页面！</a>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
  import { sendEmailCode, sendRegisterInfo } from '../api'
  import router from '../router';

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
          alert("请先填写你的邮箱！");
          this.email = "";
        } else {
          const getObj = {
            type: 'reg',
            email: this.email
          }
          sendEmailCode(getObj).then(res => {
            alert("验证码已发送，请前往邮箱查阅！")
            console.log("邮箱成功发送返回：", res);
          }).catch(err => {
            console.log(err);
            alert(err.response.data.msg);
          })
        }
      },
      registerButtonClick() {
        if (this.name === "") {
          alert("请填写你的姓名！");
        } else if (this.nickname === "") {
          alert("请填写你的昵称！");
        } else if (this.s_id === "") {
          alert("请填写你的学号！");
        } else if (this.password === "") {
          alert("请填写你的密码！");
        } else if (this.repassword === "") {
          alert("请填写确认密码！");
        } else if (this.email === "") {
          alert("请填写你的邮箱！");
        } else if (this.captcha === "") {
          alert("请填写邮箱验证码！")
        } else if (this.password !== this.repassword) {
          alert("输入的两次密码不一致！")
        } else {
          const postObj = {
            name: this.name,
            nickname: this.nickname,
            email: this.email,
            password: this.password,
            s_id: this.s_id,
            captcha: this.captcha
          }
          sendRegisterInfo(postObj).then(res => {
            console.log("注册成功返回：", res);
            alert('注册成功');
            if (res.data.code === 200) {
              router.push('/login');
            }
          }).catch(err => {
            console.log("错误信息：", err.response);
            alert(err);
          });
        }
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
    margin: 22px auto;
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
    margin-bottom: 25px;
    letter-spacing: .05rem;
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
  .row .left, .row .right {
    width: 50%;
    padding: 0 15px;
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
    width: 22%;
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