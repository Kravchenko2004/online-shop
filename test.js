import { Client_rep_json, Client_rep_yaml } from "./ClientRepository.js";
import { Client_rep_DB } from "./db/ClientRepositoryDB.js";
import { Client_rep_DB_adapter, Client_rep_DB_decorator } from "./db/DBEnhancers.js";

console.log("\n=== JSON TEST ===");
const jsonRepo = new Client_rep_json("./Clients.json");
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

console.log("\n=== YAML TEST ===");
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

console.log("\n=== DATABASE TEST ===");
const dbRepo = new Client_rep_DB({
  host: "localhost",
  user: "viktoria",
  password: "",
  database: "postgres",
  port: 5432,
});

(async () => {
  await dbRepo.connect();

  console.log("Всего клиентов:", await dbRepo.get_count());

  const newClient = await dbRepo.add({
    fullName: "Иванов Виктор Викторович",
    phone: "+79995556677",
    email: `updated_${Date.now()}@mail.ru`,
    address: "Казань",
  });
  console.log("Добавлен клиент:", newClient);

  console.log("Поиск по ID:", await dbRepo.getById(newClient.clientId));

  await dbRepo.replaceById(newClient.clientId, {
    fullName: "Петров Иван Сергеевич",
    phone: "+79995556677",
    email: `updated_${Date.now()}@mail.ru`,
    address: "Санкт-Петербург",
  });
  console.log("После обновления:", await dbRepo.getById(newClient.clientId));

  console.log("Постраничный список:", await dbRepo.get_k_n_short_list(3, 1));

  // Adapter
  const dbAdapter = new Client_rep_DB_adapter({
    host: "localhost",
    user: "viktoria",
    password: "",
    database: "postgres",
    port: 5432,
  });
  await dbAdapter.connect();
  console.log("\n[Adapter] Кол-во клиентов:", await dbAdapter.get_count());

  // Decorator (с фильтром и сортировкой)
  const decorator = new Client_rep_DB_decorator(dbAdapter, 
    { field: "full_name", value: "Иван" },
    { field: "client_id", direction: "DESC" }
  );

  console.log("[Decorator] Отфильтровано:", await decorator.get_count());
  console.log("[Decorator] Пагинация:", await decorator.get_k_n_short_list(2, 1));

  await dbRepo.deleteById(newClient.clientId);
  console.log("После удаления:", await dbRepo.get_count());
  await dbRepo.close();
})();