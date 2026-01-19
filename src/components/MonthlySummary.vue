<template>
  <div class="card">
    <h2>Monthly Summary</h2>
    <input type="month" v-model="selectedMonth" class="search-input" />

    <table>
      <thead>
        <tr>
          <th>Car Plate</th>
          <th>Date</th>
          <th>Parts Cost</th>
          <th>Labour</th>
          <th>Other Fee</th>
          <th>Tax</th>
          <th>Total</th>
          <th>Profit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in pagedRepairs" :key="r.carPlate + r.date">
          <td>{{ r.carPlate }}</td>
          <td>{{ r.date }}</td>
          <td>
            ${{
              r.partsUsedDetails
                .reduce(
                  (sum, p) => sum + (p.sellingPrice * p.qty - p.discount),
                  0
                )
                .toFixed(2)
            }}
          </td>
          <td>${{ r.labour }}</td>
          <td>${{ r.otherFee }}</td>
          <td>${{ r.tax.toFixed(2) }}</td>
          <td>${{ r.totalCost.toFixed(2) }}</td>
          <td>${{ r.profit.toFixed(2) }}</td>
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

    <p><b>Total Revenue:</b> ${{ totalRevenue.toFixed(2) }}</p>
    <p><b>Total Profit:</b> ${{ totalProfit.toFixed(2) }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({ repairs: Array });
const { repairs } = props;

const selectedMonth = ref(new Date().toISOString().slice(0, 7));
const currentPage = ref(1);
const perPage = 10;

const monthRepairs = computed(() =>
  repairs.filter((r) => r.date.startsWith(selectedMonth.value))
);

const totalPages = computed(() =>
  Math.ceil(monthRepairs.value.length / perPage)
);
const pagedRepairs = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return monthRepairs.value.slice(start, start + perPage);
});

const totalRevenue = computed(() =>
  monthRepairs.value.reduce((sum, r) => sum + r.totalCost, 0)
);
const totalProfit = computed(() =>
  monthRepairs.value.reduce((sum, r) => sum + r.profit, 0)
);
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
