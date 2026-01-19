<template>
  <div>
    <h2>Spare Parts</h2>

    <!-- Search -->
    <input v-model="searchTerm" placeholder="Search parts..." />

    <!-- Add new -->
    <button @click="showForm(null)">+ Add Part</button>

    <!-- Spare Parts Table -->
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Stock</th>
          <th>Supplier Cost</th>
          <th>Selling Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="part in paginatedParts" :key="part.id">
          <td>{{ part.name }}</td>
          <td>{{ part.stock }}</td>
          <td>${{ part.supplierCost.toFixed(2) }}</td>
          <td>${{ part.sellingPrice.toFixed(2) }}</td>
          <td>
            <button @click="showForm(part)">Edit</button>
            <button @click="deletePart(part.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="prevPage">Prev</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="nextPage">
        Next
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <SparePartForm
      v-if="showingForm"
      :partData="editingPart"
      @save="savePart"
      @cancel="showingForm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import SparePartForm from "./SparePartForm.vue";

const props = defineProps({ spareParts: Array });

const searchTerm = ref("");
const showingForm = ref(false);
const editingPart = ref(null);

// Pagination
const currentPage = ref(1);
const perPage = ref(5);

const filteredParts = computed(() =>
  props.spareParts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);

const totalPages = computed(() =>
  Math.ceil(filteredParts.value.length / perPage.value)
);

const paginatedParts = computed(() =>
  filteredParts.value.slice(
    (currentPage.value - 1) * perPage.value,
    currentPage.value * perPage.value
  )
);

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

// Add/Edit
function showForm(part) {
  editingPart.value = part ? { ...part } : null;
  showingForm.value = true;
}

function savePart(newPart) {
  if (editingPart.value) {
    // update existing
    const index = props.spareParts.findIndex((p) => p.id === newPart.id);
    if (index !== -1) props.spareParts[index] = newPart;
  } else {
    // add new
    newPart.id = Date.now();
    props.spareParts.push(newPart);
  }
  showingForm.value = false;
}

// Delete
function deletePart(id) {
  if (!confirm("Delete this part?")) return;
  const index = props.spareParts.findIndex((p) => p.id === id);
  if (index !== -1) props.spareParts.splice(index, 1);
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th,
td {
  border: 1px solid #ccc;
  padding: 5px;
  text-align: left;
}
input {
  padding: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
}
button {
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
}
.pagination {
  margin-top: 10px;
}
</style>
