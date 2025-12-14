<template>
	<div
		class="h-100 w-100 bg-white d-flex justify-content-center align-items-center"
		v-loading="loading"
		:element-loading-text="text"
	></div>
</template>

<script setup>
import { computed } from "vue";
import { useGlobalStore } from "../stores/global/index";

const globalStore = useGlobalStore();
const loading = computed(() => globalStore.screenLoader.active);
const text = computed(() => globalStore.screenLoader.text);
</script>
