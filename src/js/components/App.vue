<style>

</style>

<template>
<div class="app-root">

    <menu-component></menu-component>
    <main>
        <transition name="fade" mode="out-in">
            <router-view class="view"></router-view>
        </transitoin>
    </main>


</div>    
</template>

<script>
    export default {
        className: "App.vue",
        data() {
            return {

            }
        },
        computed: {

        },
        methods: {

        },
        components: {
            "menu-component": require("Menu.vue")
        }
    }
</script>