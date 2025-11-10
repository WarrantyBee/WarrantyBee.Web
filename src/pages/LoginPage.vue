<template>
	<Login v-if="activeComponent === components.Login" />
</template>

<script setup>
import { reactive, ref } from "vue";
import Login from "../components/Login.vue";
import { HomePageComponents } from "../constants";

const components = reactive(HomePageComponents);
const activeComponent = ref(components.Login);
</script>

<style lang="scss" scoped></style>
