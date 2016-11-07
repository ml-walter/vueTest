<style scoped>
    .root {
        background: #e3e3e3;
    }
    
    h1 {
        font-size: 40px;
    }
    
    .test {
        display: flex;
    }
    
    img {
        width: 50px;
        height: 50px;
    }
</style>

<template>

    <div class="root">
        <h1>我是 HelloWorld.vue</h1>
        <div>msg:{{ msg }}</div>
        <img src="~b.jpg" alt="" />
        <button @click="click">Click</button>
        <child :parent-prop="parentProp"></child>
    </div>

</template>

<script>
    export default {
        className: "HelloWorld.vue", // 在 init.js 裡有設定 global
        data() {
            return {
                msg: 'Hello Vue!',
                parentProp: 'parentProp',
                value: 0
            }
        },
        methods: { // 所有的自定事件都要寫在 methods 裡
            click: function() {
                this.msg = Math.random().toFixed(2);
                this.parentProp = this.msg;
            },

        },
        components: {
            'child': require('Child')
        }
    }
</script>