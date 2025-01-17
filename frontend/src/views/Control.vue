<template>
<div>
    <button @click="go(1)">Next</button>
    <button @click="go(-1)">Back</button>
    <button @click="end()">End</button>
</div>
    <div>control</div>
</template>
<script lang="ts" setip>
function go(num: number) {
    console.log(num)
}
function end() {
    if(confirm('本当に終了しますか? この操作は取り消せません。')) {
        console.log('end')
    }
}
</script>