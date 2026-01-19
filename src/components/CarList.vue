<template>
  <div class="card">
    <h2>Car List</h2>
    <input
      v-model="search"
      placeholder="Search by plate"
      class="search-input"
    />

    <table>
      <thead>
        <tr>
          <th>Plate No</th>
          <th>Brand</th>
          <th>Model</th>
          <th>Owner</th>
          <th>IC (Last 4)</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in pagedCars" :key="car.plateNo">
          <td>{{ car.plateNo }}</td>
          <td>{{ car.brand }}</td>
          <td>{{ car.model }}</td>
          <td>{{ car.owner }}</td>
          <td>{{ car.ic.slice(-4) }}</td>
          <td><button @click="$emit('editCar', car)">Edit</button></td>
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
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({ cars: Array });
const { cars } = props;

const search = ref("");
const currentPage = ref(1);
const perPage = 10;

const filteredCars = computed(() => {
  return cars.filter((c) =>
    c.plateNo.toLowerCase().includes(search.value.toLowerCase())
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredCars.value.length / perPage)
);
const pagedCars = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredCars.value.slice(start, start + perPage);
});
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
