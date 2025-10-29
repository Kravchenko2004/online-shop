import {
  Client_rep_json,
  Client_rep_yaml,
  Client_rep_DB_adapter,
} from "./ClientRepository.js";

const jsonRepo = new Client_rep_json("./clients.json");
console.log("\n=== JSON TEST ===");
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
console.log("\n=== YAML TEST ===");
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

const dbRepo = new Client_rep_DB_adapter({
  host: "localhost",
  user: "viktoria",
  password: "",
  database: "postgres",
  port: 5432,
});

(async () => {
  console.log("\n=== DATABASE TEST (Adapter) ===");
  await dbRepo.connect();

  console.log("Всего клиентов в БД:", await dbRepo.get_count());

  const newClient = await dbRepo.add({
    fullName: "Петров Иван Сергеевич",
    phone: "+79995556677",
    email: `petrov_${Date.now()}@mail.ru`,
    address: "Санкт-Петербург",
  });
  console.log("Добавлен клиент:", newClient);

  const clientById = await dbRepo.getById(newClient.clientId);
  console.log("Поиск по ID:", clientById);

  await dbRepo.replaceById(newClient.clientId, {
    fullName: "Петров Обновлённый Иван",
    phone: "+79997774455",
    email: `petrov_updated_${Date.now()}@mail.ru`,
    address: "Казань",
  });
  console.log("После обновления:", await dbRepo.getById(newClient.clientId));

  console.log("Постраничный список:", await dbRepo.get_k_n_short_list(3, 1));

  await dbRepo.deleteById(newClient.clientId);
  console.log("После удаления:", await dbRepo.get_count());

  await dbRepo.close();
})();