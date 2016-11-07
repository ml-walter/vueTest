<style>
    .child-root{
        background-color:green;
    }
</style>
<template>

<div class="child-root">
    <h1>Child</h1>
    <div>{{parentProp}}</div>
</div>

</template>
<script>
export default{
    className:"Child.vue",
    props:['parentProp'],
    data:function(){
        return {};
    }
}
</script>