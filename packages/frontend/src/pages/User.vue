<script setup>
import { ref, reactive } from "vue";
import student_boy from "../assets/img/student-boy.svg"
import { IconEdit } from '@arco-design/web-vue/es/icon';
import {UpdateUserData} from '../api/index'
import { Message } from '@arco-design/web-vue';

const UserData = ref({})
const FormData = reactive({
  nickname: "",
  name: "",
  s_id: "",
  gender: "",
  grade: "",
  email: ""
})
const FormVisible = ref(false)
const keyMap = {
  name: "姓名",
  s_id: "学号",
  nickname: "昵称",
  gender: "性别",
  grade: "年级",
  email: "邮箱"
}

if (localStorage.getItem('USER_INFO')) {
  UserData.value = JSON.parse(localStorage.getItem('USER_INFO'))
  console.log(JSON.parse(localStorage.getItem('USER_INFO')))
}

function convertData(input) {
  const data = []
  const filterMap = ["UUID", "role"]

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

const handleOpen = () => {
  FormVisible.value = true;
  for (const key in FormData) 
    FormData[key] = UserData.value[key]
};

const handleBeforeOk = (done) => {
  console.log(FormData);
  UpdateUserData(FormData).then(res => {
    if (res.status === 200) {
      localStorage.setItem('USER_INFO', JSON.stringify(FormData))
      UserData.value = FormData
      FormVisible.value = false
      Message.success('修改成功')
      done();
    }
  }).catch(err => {
    if (err.response.data.msg === 'SequelizeUniqueConstraintError: Validation error')
      Message.warning('邮箱重复了')
    else
      Message.warning(err.response.data.msg)
    done();
  })
};

const handleCancel = () => {
  FormVisible.value = false;
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
      <div v-if="!UserData.name">
        <a-skeleton :animation="true">
          <a-skeleton-line :rows="3" />
        </a-skeleton>
      </div>
      <div v-else>
        <a-descriptions :data="convertData(UserData)" size="large" :column="2" />
        <div class="footer">
          <a-button type="text" @click="handleOpen">
            <template #icon>
              <icon-edit />
            </template>
            编辑
          </a-button>
        </div>
      </div>

      <a-modal v-model:visible="FormVisible" title="编辑信息" @cancel="handleCancel" @before-ok="handleBeforeOk">
        <a-form :model="FormData">
          <a-form-item v-for="value, key in keyMap" :field="key" :label="value">
            <a-input v-model="FormData[key]" :disabled="(key === 's_id' || key === 'name')"/>
          </a-form-item>
        </a-form>
      </a-modal>
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