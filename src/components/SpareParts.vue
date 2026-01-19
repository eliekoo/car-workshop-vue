<template>
  <div class="card">
    <h2>Spare Parts</h2>
    <input v-model="search" placeholder="Search part" class="search-input" />

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Stock</th>
          <th>Supplier Cost</th>
          <th>Selling Price</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="part in pagedParts" :key="part.id">
          <td>{{ part.name }}</td>
          <td>{{ part.stock }}</td>
          <td>${{ part.supplierCost.toFixed(2) }}</td>
          <td>${{ part.sellingPrice.toFixed(2) }}</td>
          <td>
            <button @click="editPart(part)">Edit</button>
            <button @click="deletePart(part)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">Prev</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">
        Next
      </button>
    </div>

    <!-- Add/Edit form omitted for brevity -->
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({ spareParts: Array });
const { spareParts } = props;

const search = ref("");
const currentPage = ref(1);
const perPage = 10;

const filteredParts = computed(() =>
  spareParts.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

const totalPages = computed(() =>
  Math.ceil(filteredParts.value.length / perPage)
);
const pagedParts = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredParts.value.slice(start, start + perPage);
});

// Edit/Delete functions
function editPart(p) {
  /* ... */
}
function deletePart(p) {
  /* ... */
}
</script>

<style>
.card {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
}
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
.search-input {
  margin-bottom: 10px;
  padding: 5px;
  width: 200px;
}
.pagination {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}
button {
  padding: 5px 10px;
  cursor: pointer;
}
</style>
