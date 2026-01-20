<template>
  <div class="card">
    <h3>Add New Car</h3>
    <div class="form-group">
      <label>Plate No:</label>
      <input v-model="newCar.plateNo" />
    </div>
    <div class="form-group">
      <label>Brand:</label>
      <input v-model="newCar.brand" />
    </div>
    <div class="form-group">
      <label>Model:</label>
      <input v-model="newCar.model" />
    </div>
    <div class="form-group">
      <label>Owner:</label>
      <input v-model="newCar.owner" />
    </div>
    <div class="form-group">
      <label>IC:</label>
      <input v-model="newCar.ic" />
    </div>
    <div class="form-actions">
      <button class="save-btn" @click="$emit('save', { ...newCar })">
        Save
      </button>
      <button class="cancel-btn" @click="$emit('cancel')">Cancel</button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const newCar = reactive({
  plateNo: "",
  brand: "",
  model: "",
  owner: "",
  ic: "",
});
</script>

<style scoped>
.card {
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 600px;
}
.form-group {
  display: flex;
  flex-direction: column;
  min-width: 200px;
  margin-bottom: 10px;
}
input {
  padding: 5px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.form-actions {
  display: flex;
  gap: 10px;
}
.save-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
}
.cancel-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
}
.save-btn:hover,
.cancel-btn:hover {
  opacity: 0.9;
}
</style>
