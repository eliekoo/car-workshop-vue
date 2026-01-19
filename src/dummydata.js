// src/data.js

export const cars = Array.from({ length: 50 }, (_, i) => ({
  plateNo: `ABC${1000 + i}`,
  brand: ["Toyota", "Honda", "Proton", "Nissan"][i % 4],
  model: ["Vios", "Civic", "Saga", "Almera"][i % 4],
  owner: `Owner ${i + 1}`,
  ic: `9001010${i.toString().padStart(3, "0")}X`,
}));

export const spareParts = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Part ${i + 1}`,
  stock: Math.floor(Math.random() * 50) + 10,
  supplierCost: +(Math.random() * 50 + 10).toFixed(2),
  sellingPrice: +(Math.random() * 100 + 20).toFixed(2),
}));

export const repairs = [];
for (let i = 0; i < 100; i++) {
  const car = cars[Math.floor(Math.random() * cars.length)];
  const part = spareParts[Math.floor(Math.random() * spareParts.length)];
  const qty = Math.floor(Math.random() * 3) + 1;
  const discount = Math.floor(Math.random() * 10);
  const labour = 20;
  const otherFee = Math.floor(Math.random() * 10);
  const partsCost = part.sellingPrice * qty - discount;
  const tax = (partsCost + labour) * 0.06;
  const total = partsCost + labour + otherFee + tax;
  const profit = total - part.supplierCost * qty;
  repairs.push({
    carPlate: car.plateNo,
    date: `2026-01-${((i % 28) + 1).toString().padStart(2, "0")}`,
    partsUsedDetails: [{ ...part, qty, discount }],
    labour,
    otherFee,
    tax,
    totalCost: total,
    profit,
    showDetails: false,
  });
}
