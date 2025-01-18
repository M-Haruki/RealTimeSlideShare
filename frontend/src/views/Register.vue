<template>
    <h1>Create Presentation</h1>
    <form @submit.prevent="createPresentation">
        <label for="title">Title</label>
        <input type="text" id="title" v-model="title" required />
        <br />
        <label for="file">PDF File</label>
        <input type="file" id="file" @change="onFileChange" accept=".pdf" required />
        <br />
        <p v-if="isUploading">アップロード中</p>
        <button v-else type="submit">Create</button>
    </form>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'

const title = ref('')
const file = ref('')
const isUploading = ref(false)

function onFileChange(event) {
    file.value = event.target.files;
};

async function createPresentation() {
    isUploading.value = true;
    if (!title.value || !file.value) {
        alert('Please fill all fields');
        return;
    }
    const formData = new FormData();
    formData.append('ufile', file.value[0]);
    await axios({
        method: 'post',
        url: `http://localhost:8000/create?title=${title.value}`,
        data: formData,
        withCredentials: true,
    }).then((response) => {
        isUploading.value = false;
        alert(response.data.presentation_id)
    }).catch((error) => {
        isUploading.value = false;
        alert(error.response.data.detail.reason)
    });
}

</script>