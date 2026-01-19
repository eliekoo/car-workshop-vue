<template>
  <div class="card">
    <button class="back-btn" @click="$emit('back')">← Back</button>
    <h2>Edit Car: {{ car.plateNo }}</h2>

    <!-- Car Info Section -->
    <div class="car-info card-section">
      <p><b>Brand:</b> {{ car.brand }}</p>
      <p><b>Model:</b> {{ car.model }}</p>
      <p><b>Owner:</b> {{ car.owner }}</p>
      <p><b>IC:</b> {{ car.ic }}</p>
    </div>
  </div>

  <!-- Add Repair Section -->
  <div class="card add-repair-card">
    <h3>Add Repair</h3>

    <div class="repair-items">
      <div
        class="repair-item"
        v-for="(item, index) in repairItems"
        :key="index"
      >
        <!-- Search Part -->
        <div class="form-group search-group">
          <label>Search Part:</label>
          <input
            v-model="item.search"
            placeholder="Type part name"
            @input="searchParts(index)"
          />
        </div>

        <!-- Row with Select, Qty, Discount, Remove Button -->
        <div class="repair-row">
          <div class="form-group">
            <label>Select Part:</label>
            <select v-model="item.partId">
              <option v-for="p in item.filtered" :key="p.id" :value="p.id">
                {{ p.name }} (Stock: {{ p.stock }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Qty:</label>
            <input type="number" v-model.number="item.qty" min="1" />
          </div>

          <div class="form-group">
            <label>Discount ($):</label>
            <input type="number" v-model.number="item.discount" min="0" />
          </div>

          <div class="remove-button-group">
            <button class="remove-btn" @click="removeItem(index)">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <button class="add-part-btn" @click="addItem">+ Add Part</button>

    <!-- Costs -->
    <div class="costs-container">
      <div class="form-group">
        <label>Labour Cost ($):</label>
        <input type="number" v-model.number="labourCost" min="0" />
      </div>
      <div class="form-group">
        <label>Service Tax (%):</label>
        <input type="number" v-model.number="serviceTaxPercent" min="0" />
      </div>
      <div class="form-group">
        <label>Other Fee ($):</label>
        <input type="number" v-model.number="otherFee" min="0" />
      </div>
    </div>

    <button class="add-repair-btn" @click="addRepair">Add Repair</button>
  </div>

  <!-- Repair History -->
  <div class="card">
    <h3>Repair History</h3>
    <div v-for="(r, index) in carRepairs" :key="index" class="repair-history">
      <p @click="r.showDetails = !r.showDetails" class="toggle-header">
        {{ r.date }} - Total: ${{ r.totalCost.toFixed(2) }}, Profit: ${{
          r.profit.toFixed(2)
        }}
        <span v-if="!r.showDetails">[Show Details]</span>
        <span v-else>[Hide Details]</span>
      </p>
      <div v-if="r.showDetails" class="details">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Part</th>
                <th>Qty</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in r.partsUsedDetails" :key="u.partId">
                <td>{{ u.name }}</td>
                <td>{{ u.qty }}</td>
                <td>${{ u.supplierCost.toFixed(2) }}</td>
                <td>${{ u.sellingPrice.toFixed(2) }}</td>
                <td>${{ u.discount.toFixed(2) }}</td>
                <td>${{ (u.sellingPrice * u.qty - u.discount).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p><b>Labour:</b> ${{ r.labour }}</p>
        <p><b>Other Fee:</b> ${{ r.otherFee }}</p>
        <p><b>Tax:</b> ${{ r.tax.toFixed(2) }}</p>
        <p><b>Total:</b> ${{ r.totalCost.toFixed(2) }}</p>
        <p><b>Profit:</b> ${{ r.profit.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";

const props = defineProps({ car: Object, spareParts: Array, repairs: Array });
const { car, spareParts, repairs } = props;

// Reactive repair items
const repairItems = reactive([]);

// Add / Remove / Search part
function addItem() {
  repairItems.push({
    partId: null,
    qty: 1,
    discount: 0,
    search: "",
    filtered: spareParts,
  });
}
function removeItem(index) {
  repairItems.splice(index, 1);
}
function searchParts(index) {
  const term = repairItems[index].search.toLowerCase();
  repairItems[index].filtered = spareParts.filter((p) =>
    p.name.toLowerCase().includes(term)
  );
}

// Costs
const labourCost = ref(20);
const serviceTaxPercent = ref(6);
const otherFee = ref(0);

// Computed repairs for this car
const carRepairs = computed(() =>
  repairs.filter((r) => r.carPlate === car.plateNo)
);

// Add Repair function
function addRepair() {
  if (repairItems.length === 0) return alert("Add at least one part!");
  const partsUsedDetails = [];
  let partsSupplierCost = 0;
  let partsSellingPrice = 0;

  for (const item of repairItems) {
    if (!item.partId || item.qty <= 0) continue;
    const part = spareParts.find((p) => p.id === item.partId);
    if (!part) continue;
    if (item.qty > part.stock)
      return alert(`Not enough stock for ${part.name}`);
    part.stock -= item.qty;
    partsSupplierCost += part.supplierCost * item.qty;
    partsSellingPrice += part.sellingPrice * item.qty - item.discount;
    partsUsedDetails.push({ ...part, qty: item.qty, discount: item.discount });
  }

  const tax =
    (partsSellingPrice + labourCost.value) * (serviceTaxPercent.value / 100);
  const totalCost = partsSellingPrice + labourCost.value + tax + otherFee.value;
  const profit = totalCost - partsSupplierCost;

  repairs.push({
    carPlate: car.plateNo,
    date: new Date().toISOString().split("T")[0],
    partsUsedDetails,
    labour: labourCost.value,
    tax,
    otherFee: otherFee.value,
    totalCost,
    profit,
    showDetails: false,
  });

  // Reset form
  repairItems.splice(0);
  labourCost.value = 20;
  serviceTaxPercent.value = 6;
  otherFee.value = 0;
}
</script>

<style scoped>
.card {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: #fff;
  max-width: 900px;
  margin: 15px auto; /* card margin between cards */
  font-family: sans-serif;
}
.back-btn {
  background: none;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-bottom: 15px;
}
h2,
h3 {
  margin-bottom: 10px;
}
.card-section {
  padding: 10px 0;
  margin-bottom: 10px;
}
.car-info p {
  margin: 4px 0;
}

/* Repair Items */
.repair-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  background: #fafafa;
}

.repair-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  flex-wrap: nowrap;
}

.form-group {
  display: flex;
  flex-direction: column;
  min-width: 120px;
  max-width: 250px;
  flex: 1;
}
input,
select {
  padding: 5px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
}

/* Remove button aligned with inputs */
.remove-button-group {
  display: flex;
  align-items: flex-end;
}
.remove-btn {
  padding: 5px 10px;
  cursor: pointer;
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  border-radius: 4px;
}
.remove-btn:hover {
  opacity: 0.8;
}

/* Add / Add Repair buttons */
.add-part-btn,
.add-repair-btn {
  margin-top: 10px;
  padding: 5px 12px;
  cursor: pointer;
  border: 1px solid #007bff;
  color: #007bff;
  background: none;
  border-radius: 4px;
}
.add-part-btn:hover,
.add-repair-btn:hover {
  background: #007bff;
  color: #fff;
}

/* Costs vertically */
.costs-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

/* Repair history */
.toggle-header {
  cursor: pointer;
  font-weight: bold;
  margin: 5px 0;
  background: #f1f1f1;
  padding: 5px 10px;
  border-radius: 5px;
}
.details {
  margin-left: 10px;
  background: #fafafa;
  padding: 10px;
  border-radius: 5px;
}
.table-container {
  overflow-x: auto;
  margin-bottom: 10px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 5px;
  text-align: left;
}
</style>
