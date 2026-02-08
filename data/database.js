const records = [
  { id: 1, owner: "john", name: "John", age: 21, diagnosis: "Anemia" },
  { id: 2, owner: "mary", name: "Mary", age: 34, diagnosis: "Diabetes" },
  { id: 3, owner: "john", name: "John", age: 21, diagnosis: "Vitamin D Deficiency" },
  { id: 4, owner: "mary", name: "Mary", age: 34, diagnosis: "Hypothyroidism" }
];

function getData() {
  return JSON.parse(localStorage.getItem("db")) || records;
}

function saveData(data) {
  localStorage.setItem("db", JSON.stringify(data));
}
