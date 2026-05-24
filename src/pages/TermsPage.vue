<template>
	<div class="legal-page p-5">
		<el-card class="max-w-800 mx-auto p-4 rounded-4">
			<h1 class="mb-4">Terms of Service</h1>
			<p class="text-muted mb-5">Last updated: May 24, 2026</p>
			
			<section class="mb-4">
				<h3 class="fs-5 fw-bold mb-3">1. Acceptance of Terms</h3>
				<p>By registering for a WarrantyBee account, you agree to be bound by these terms...</p>
			</section>

			<section class="mb-4">
				<h3 class="fs-5 fw-bold mb-3">2. Description of Service</h3>
				<p>WarrantyBee provides a digital vault for appliance warranties and a claim resolution platform...</p>
			</section>

			<div class="mt-5 pt-4 border-top">
				<el-button @click="router.back()">Back to App</el-button>
			</div>
		</el-card>
	</div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>

<style scoped>
.legal-page { background: #f8f9fa; min-height: 100vh; }
.max-w-800 { max-width: 800px; margin: 0 auto; }
</style>
