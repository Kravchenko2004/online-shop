import { Client_rep_json, Client_rep_yaml, FileRepositoryDecorator } from "./ClientRepository.js";
import { Client_rep_DB_adapter, Client_rep_DB_decorator } from "./db/DBEnhancers.js";

const jsonRepo = new Client_rep_json("./Clients.json");
const yamlRepo = new Client_rep_yaml("./clients.yaml");

console.log("=== JSON TEST ===");
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

const jsonFilter = { field: "fullName", value: "Сидоров" };
const jsonSort = { field: "fullName", direction: "ASC" };
const jsonDecorator = new FileRepositoryDecorator(jsonRepo, jsonFilter, jsonSort);
console.log("\nФильтрованный get_count (JSON):", jsonDecorator.get_count());
console.log("Фильтрованный get_k_n_short_list (JSON):", jsonDecorator.get_k_n_short_list(2, 1));

const dbRepo = new Client_rep_DB_adapter({
  host: "localhost",
  user: "viktoria",
  password: "",
  database: "postgres",
  port: 5432,
});

const dbFilter = { field: "full_name", value: "Иванов" };
const dbSort = { field: "client_id", direction: "DESC" };
const dbDecorator = new Client_rep_DB_decorator(dbRepo, dbFilter, dbSort);

(async () => {
  await dbRepo.connect();

  console.log("\n=== DATABASE TEST ===");
  console.log("Всего клиентов:", await dbRepo.get_count());

  const newClient = await dbRepo.add({
    fullName: "Иванов Виктор Викторович",
    phone: "+79995556677",
    email: `updated_${Date.now()}@mail.ru`,
    address: "Казань",
  });
  console.log("Добавлен клиент:", newClient);

  console.log("Фильтрованный get_count (DB):", await dbDecorator.get_count());
  console.log("Фильтрованный get_k_n_short_list (DB):", await dbDecorator.get_k_n_short_list(3, 1));

  await dbRepo.deleteById(newClient.clientId);
  await dbRepo.close();
})();