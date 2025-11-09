<template>
  <div class="home-page">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Welcome to WarrantyBee</span>
            </div>
          </template>
          <p>This is your dashboard.</p>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card>
          <el-statistic title="Warranties" :value="125" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <el-statistic title="Expirations" :value="12" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <el-statistic title="Claims" :value="3" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-page {
  width: 100%;
  padding: 20px;
}
.stats-row {
  margin-top: 20px;
}
</style>
