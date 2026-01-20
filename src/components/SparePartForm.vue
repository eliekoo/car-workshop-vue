<template>
  <div class="card spare-part-form">
    <h3>{{ editMode ? "Edit Spare Part" : "Add Spare Part" }}</h3>

    <div class="form-group">
      <label>Name:</label>
      <input v-model="part.name" placeholder="Part name" />
    </div>

    <div class="form-group">
      <label>Stock:</label>
      <input type="number" v-model.number="part.stock" min="0" />
    </div>

    <div class="form-group">
      <label>Supplier Cost ($):</label>
      <input type="number" v-model.number="part.supplierCost" min="0" />
    </div>

    <div class="form-group">
      <label>Selling Price ($):</label>
      <input type="number" v-model.number="part.sellingPrice" min="0" />
    </div>

    <div class="form-actions">
      <button @click="$emit('cancel')">Cancel</button>
      <button @click="savePart">{{ editMode ? "Update" : "Add" }}</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs } from "vue";

const props = defineProps({
  partData: Object,
});

const emit = defineEmits(["save", "cancel"]);

const editMode = !!props.partData;

const part = reactive({
  id: props.partData?.id || null,
  name: props.partData?.name || "",
  stock: props.partData?.stock || 0,
  supplierCost: props.partData?.supplierCost || 0,
  sellingPrice: props.partData?.sellingPrice || 0,
});

function savePart() {
  if (!part.name) return alert("Part name is required");
  emit("save", { ...part });
}
</script>

<style scoped>
.card {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 10px;
  max-width: 500px;
}
.form-group {
  display: flex;
  flex-direction: column;
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
button {
  padding: 6px 12px;
  cursor: pointer;
}
</style>
