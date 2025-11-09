<template>
	<el-container id="app-container">
		<el-main>
			<router-view />
		</el-main>
	</el-container>
</template>

<style scoped>
#app-container {
	height: 100vh;
	width: 100vw;
}

#app-container > .el-main {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
