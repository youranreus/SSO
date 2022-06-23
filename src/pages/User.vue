<script setup>
import {ref} from "vue";
import student_boy from "../assets/img/student-boy.svg"
import {IconEdit} from '@arco-design/web-vue/es/icon';

const UserData = ref({})
if (localStorage.getItem('USER_INFO')) {
  UserData.value = JSON.parse(localStorage.getItem('USER_INFO'))
  console.log(JSON.parse(localStorage.getItem('USER_INFO')))
}

function convertData(input) {
  const data = []
  const filterMap = ["UUID", "role"]
  const keyMap = {
    nickname: "昵称",
    name: "姓名",
    s_id: "学号",
    gender: "性别",
    grade: "年级",
    email: "邮箱"
  }

  for (const key in input) {
    if (filterMap.indexOf(key) === -1) {
      data.push({
        label: keyMap[key],
        value: (input[key] || "未填写~")
      })
    }
  }

  return data
}
</script>

<template>
  <div class="user">
    <div class="header">
      <a-avatar :size="64"><img :src="student_boy" :alt="UserData.nickname"></a-avatar>
      <div class="header-content">
        <h2>{{ UserData.nickname }}</h2>
        <p>{{ UserData.s_id }}</p>
      </div>
    </div>

    <a-divider orientation="center"></a-divider>

    <div class="content">
      <div v-if="!UserData.name">加载中</div>
      <div v-else>
        <a-descriptions :data="convertData(UserData)" size="large" :column="2"/>
      </div>
    </div>

    <div class="footer">
      <a-button type="text">
        <template #icon>
          <icon-edit/>
        </template>
        编辑
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.user {
  width: 512px;
  height: auto;
  box-shadow: 0 4px 8px rgb(0 0 0 / 3%);
  background-color: #f5f6f9;
  border-radius: 5px;
  border-top: 2px solid #4582b31c;
  box-sizing: border-box;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  padding: 15px;
}

.header {
  height: 64px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.header-content {
  height: 64px;
  width: 400px;
}

.header-content h2 {
  line-height: 36px;
  font-size: 28px;
  margin: 0;
  font-weight: 400;
  opacity: 0.6;
}

.header-content p {
  margin: 7px 0 0;
  line-height: 18px;
  font-size: 16px;
  opacity: 0.5;
}

.footer {
  text-align: right;
}
</style>