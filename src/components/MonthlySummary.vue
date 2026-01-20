<template>
  <div class="card">
    <h2>Monthly Summary</h2>

    <!-- Month selector -->
    <div class="filter-row">
      <label for="month">Select Month:</label>
      <input
        type="month"
        v-model="selectedMonth"
        id="month"
        class="search-input"
      />
    </div>

    <!-- Summary table -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Car Plate</th>
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
            <td>{{ r.date }}</td>
            <td>{{ r.carPlate }}</td>
            <td>
              {{
                r.partsUsedDetails
                  .reduce(
                    (sum, p) => sum + (p.sellingPrice * p.qty - p.discount),
                    0
                  )
                  .toFixed(2)
              }}
            </td>
            <td>{{ r.labour.toFixed(2) }}</td>
            <td>{{ r.otherFee.toFixed(2) }}</td>
            <td>{{ r.tax.toFixed(2) }}</td>
            <td>{{ r.totalCost.toFixed(2) }}</td>
            <td>{{ r.profit.toFixed(2) }}</td>
          </tr>
          <tr v-if="pagedRepairs.length === 0">
            <td colspan="8" class="no-data">No records for selected month.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">Prev</button>
      <span>Page {{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">
        Next
      </button>
    </div>

    <!-- Totals -->
    <div class="totals"></div>

    <div class="summary-box">
      <table class="summary-table">
        <tbody>
          <tr>
            <td>Total Revenue</td>
            <td class="amount">${{ totalRevenue.toFixed(2) }}</td>
          </tr>
          <tr class="profit-row internal-only">
            <td>Total Profit</td>
            <td class="amount">${{ totalProfit.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
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

const totalPages = computed(
  () => Math.ceil(monthRepairs.value.length / perPage) || 1
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

<style scoped>
.card {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: #fff;
  max-width: 900px;
  margin: 20px auto;
  font-family: sans-serif;
}

/* Filter row */
.filter-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.search-input {
  padding: 5px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Table styling */
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
  font-size: 14px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 6px 10px;
  text-align: left;
}

th {
  background: #f5f5f5;
}

.no-data {
  text-align: center;
  color: #888;
  font-style: italic;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.pagination button {
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid #007bff;
  background: none;
  color: #007bff;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: #007bff;
  color: white;
}

/* Totals */
.totals {
  margin-top: 10px;
  font-weight: 500;
}

.summary-box {
  max-width: 320px;
  margin-top: 10px;
}

.summary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.summary-table td {
  padding: 6px 8px;
}

.summary-table td:first-child {
  color: #555;
}

.amount {
  text-align: right;
  font-weight: 500;
}

.total-row td {
  border-top: 1px solid #ddd;
  font-weight: bold;
}

.profit-row td {
  font-weight: bold;
  color: #2e7d32;
}
</style>
