<template>
  <div class="card">
    <h2>Add Repair</h2>

    <div>
      <label>Select Car:</label>
      <select v-model="selectedCar">
        <option disabled value="">--Select Car--</option>
        <option v-for="car in cars" :key="car.plateNo" :value="car.plateNo">
          {{ car.plateNo }}
        </option>
      </select>
    </div>

    <div v-for="part in spareParts" :key="part.id" style="margin-top: 10px">
      <label>{{ part.name }} (Stock: {{ part.stock }})</label>
      <input
        type="number"
        v-model.number="partsQty[part.id]"
        min="0"
        :max="part.stock"
      />
    </div>

    <div style="margin-top: 10px">
      <label>Labour Cost:</label>
      <input type="number" v-model.number="labourCost" min="0" />
    </div>

    <div>
      <label>Service Tax (%):</label>
      <input
        type="number"
        v-model.number="serviceTaxPercent"
        min="0"
        max="100"
      />
    </div>

    <div>
      <label>Delay Cost:</label>
      <input type="number" v-model.number="delayCost" min="0" />
    </div>

    <button @click="addRepair" style="margin-top: 10px">Add Repair</button>

    <h3 style="margin-top: 20px">Repair Records</h3>
    <ul>
      <li v-for="repair in props.repairs" :key="repair.date + repair.carPlate">
        {{ repair.date }} - {{ repair.carPlate }}
        <ul>
          <li>Parts Supplier Cost: ${{ repair.partsSupplierCost }}</li>
          <li>Parts Selling Price: ${{ repair.partsSellingPrice }}</li>
          <li>Labour: ${{ repair.labour }}</li>
          <li>Service Tax: ${{ repair.tax.toFixed(2) }}</li>
          <li>Delay Cost: ${{ repair.delayCost }}</li>
          <li>
            <b>Total Cost Charged: ${{ repair.totalCost.toFixed(2) }}</b>
          </li>
          <li>
            <b>Profit: ${{ repair.profit.toFixed(2) }}</b>
          </li>
        </ul>
      </li>
    </ul>

    <h3 style="margin-top: 20px">Monthly Summary (Current Month)</h3>
    <p>Total Transactions: ${{ monthTotal.toFixed(2) }}</p>
    <p>Total Profit: ${{ monthProfit.toFixed(2) }}</p>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";

const props = defineProps({
  cars: Array,
  spareParts: Array,
  repairs: Array,
});

const selectedCar = ref("");
const partsQty = reactive({});
const labourCost = ref(20);
const serviceTaxPercent = ref(6);
const delayCost = ref(0);

function addRepair() {
  if (!selectedCar.value) return alert("Select a car!");

  const usedParts = [];
  let partsSupplierCost = 0;
  let partsSellingPrice = 0;

  props.spareParts.forEach((part) => {
    const qty = partsQty[part.id] || 0;
    if (qty > 0) {
      if (qty > part.stock) return alert(`Not enough stock for ${part.name}`);
      part.stock -= qty;

      partsSupplierCost += part.supplierCost * qty;
      partsSellingPrice += part.sellingPrice * qty;

      usedParts.push({ partId: part.id, qty });
    }
  });

  if (usedParts.length === 0) return alert("No parts selected!");

  const labour = labourCost.value;
  const tax = (partsSellingPrice + labour) * (serviceTaxPercent.value / 100);
  const totalCost = partsSellingPrice + labour + tax + delayCost.value;
  const profit = partsSellingPrice + labour - partsSupplierCost;

  props.repairs.push({
    carPlate: selectedCar.value,
    date: new Date().toISOString().split("T")[0],
    partsUsed: usedParts,
    partsSupplierCost,
    partsSellingPrice,
    labour,
    tax,
    delayCost: delayCost.value,
    totalCost,
    profit,
  });

  // reset
  partsQty = reactive({});
  selectedCar.value = "";
  delayCost.value = 0;
}

// Monthly summary (current month)
const monthRepairs = computed(() => {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  return props.repairs.filter((r) => r.date.startsWith(month));
});
const monthTotal = computed(() =>
  monthRepairs.value.reduce((sum, r) => sum + r.totalCost, 0)
);
const monthProfit = computed(() =>
  monthRepairs.value.reduce((sum, r) => sum + r.profit, 0)
);
</script>

<style>
.card {
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
input {
  width: 60px;
  margin-left: 5px;
}
button {
  margin-top: 10px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
