<template>
  <div class="container">
    <h1>Car Workshop Management</h1>

    <nav>
      <button @click="currentPage = 'cars'">Cars</button>
      <button @click="currentPage = 'spareParts'">Spare Parts</button>
      <button @click="currentPage = 'monthlySummary'">Monthly Summary</button>
    </nav>

    <div class="page">
      <!-- Cars Page -->
      <div v-if="currentPage === 'cars'">
        <button class="add-btn" @click="showCarForm = true">
          + Add New Car
        </button>

        <CarForm
          v-if="showCarForm"
          @save="addCar"
          @cancel="showCarForm = false"
        />

        <CarList v-else :cars="cars" @editCar="editCar" />
      </div>

      <!-- Edit Car Page -->
      <CarEdit
        v-if="currentPage === 'editCar'"
        :car="selectedCar"
        :spareParts="spareParts"
        :repairs="repairs"
        @back="currentPage = 'cars'"
      />

      <!-- Spare Parts Page -->
      <SpareParts
        v-if="currentPage === 'spareParts'"
        :spareParts="spareParts"
      />

      <!-- Monthly Summary -->
      <MonthlySummary
        v-if="currentPage === 'monthlySummary'"
        :repairs="repairs"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CarList from "./components/CarList.vue";
import CarForm from "./components/CarForm.vue";
import CarEdit from "./components/CarEdit.vue";
import SpareParts from "./components/SpareParts.vue";
import MonthlySummary from "./components/MonthlySummary.vue";

import {
  cars as carsData,
  spareParts as partsData,
  repairs as repairsData,
} from "./dummydata.js";

const cars = ref(carsData);
const spareParts = ref(partsData);
const repairs = ref([]);

const currentPage = ref("cars");
const selectedCar = ref(null);
const showCarForm = ref(false);

function editCar(car) {
  selectedCar.value = car;
  currentPage.value = "editCar";
}

function addCar(newCar) {
  cars.value.push(newCar);
  showCarForm.value = false;
}
</script>

<style>
.container {
  padding: 20px;
  font-family: sans-serif;
  max-width: 1000px;
  margin: auto;
}
nav {
  margin-bottom: 20px;
}
button {
  margin-right: 10px;
  padding: 5px 12px;
  cursor: pointer;
}
.add-btn {
  margin-bottom: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
}
.page {
  margin-top: 20px;
}
</style>
