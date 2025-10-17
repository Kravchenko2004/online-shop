import { Client_rep_json } from "./Client_rep_json.js";

const repo = new Client_rep_json("./clients.json");

console.log("Количество клиентов:", repo.get_count());

console.log("Добавляем нового клиента...");
repo.add({
  fullName: "Сидоров Сидор Сидорович",
  phone: "+79998887766",
  email: "sidorov@mail.ru",
  address: "Краснодар",
});

console.log("Клиент с ID=2:");
console.log(repo.getById(2)?.toStringFull());

console.log("Первые 2 клиента (страница 1):");
console.log(repo.get_k_n_short_list(2, 1));

console.log("Сортировка по имени:");
repo.sortByField("fullName");
console.log(repo.get_k_n_short_list(3, 1));

console.log("Замена клиента ID=1:");
repo.replaceById(1, {
  fullName: "Иванов Иван Обновленный",
  phone: "+70001112233",
  email: "ivanov_new@mail.ru",
  address: "Москва, центр",
});

console.log("Удаление клиента ID=2:");
repo.deleteById(2);

console.log("Итоговый список:");
console.log(repo.get_k_n_short_list(10, 1));

console.log("Всего клиентов:", repo.get_count());