class Client {
  #clientId;
  #fullName;
  #phone;
  #email;
  #address;

  constructor(clientId, fullName, phone, email, address) {
    this.#clientId = Client.validateId(clientId);
    this.#fullName = Client.validateNonEmptyString(fullName, "ФИО");
    this.#phone = Client.validatePhone(phone);
    this.#email = Client.validateEmail(email);
    this.#address = Client.validateNonEmptyString(address, "Адрес");
  }

  get clientId() {
    return this.#clientId;
  }
  get fullName() {
    return this.#fullName;
  }
  get phone() {
    return this.#phone;
  }
  get email() {
    return this.#email;
  }
  get address() {
    return this.#address;
  }

  set clientId(value) {
    this.#clientId = Client.validateId(value);
  }
  set fullName(value) {
    this.#fullName = Client.validateNonEmptyString(value, "ФИО");
  }
  set phone(value) {
    this.#phone = Client.validatePhone(value);
  }
  set email(value) {
    this.#email = Client.validateEmail(value);
  }
  set address(value) {
    this.#address = Client.validateNonEmptyString(value, "Адрес");
  }

  static validateNonEmptyString(value, fieldName = "Поле") {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`${fieldName} должно быть непустой строкой`);
    }
    return value.trim();
  }

  static validateId(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID должен быть положительным целым числом");
    }
    return id;
  }

  static validatePhone(phone) {
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error("Телефон должен содержать от 7 до 15 цифр");
    }
    return phone;
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Некорректный email");
    }
    return email;
  }
}
