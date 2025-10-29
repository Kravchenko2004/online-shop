import { Client_rep_json, Client_rep_yaml } from "./ClientRepository.js";

const jsonRepo = new Client_rep_json("./clients.json");

console.log("Всего клиентов:", jsonRepo.get_count());
jsonRepo.add({
  fullName: "Сидоров Сидор Сидорович",
  phone: "+79998887766",
  email: "sidorov@mail.ru",
  address: "Краснодар",
});
jsonRepo.sortByField("fullName");
console.log("Первые 2 клиента:", jsonRepo.get_k_n_short_list(2, 1));
console.log("Итого:", jsonRepo.get_count());


const yamlRepo = new Client_rep_yaml("./clients.yaml");

console.log("Всего клиентов:", yamlRepo.get_count());
yamlRepo.add({
  fullName: "Иванова Мария Петровна",
  phone: "+79005554433",
  email: "ivanova@mail.ru",
  address: "Москва",
});
yamlRepo.sortByField("fullName");
console.log("Первые 2 клиента:", yamlRepo.get_k_n_short_list(2, 1));
console.log("Итого:", yamlRepo.get_count());