class Client {
  #clientId;
  #fullName;
  #phone;
  #email;
  #address;

  constructor(clientId, fullName, phone, email, address) {
    this.#clientId = Client.validateId(clientId);
    this.#fullName = Client.validateFullName(fullName);
    this.#phone = Client.validatePhone(phone);
    this.#email = Client.validateEmail(email);
    this.#address = Client.validateAddress(address);
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
    this.#fullName = Client.validateFullName(value);
  }
  set phone(value) {
    this.#phone = Client.validatePhone(value);
  }
  set email(value) {
    this.#email = Client.validateEmail(value);
  }
  set address(value) {
    this.#address = Client.validateAddress(value);
  }

  static validateId(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID должен быть положительным целым числом");
    }
    return id;
  }

  static validateFullName(name) {
    if (typeof name !== "string" || name.trim().length < 3) {
      throw new Error("ФИО должно быть строкой длиной минимум 3 символа");
    }
    return name.trim();
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

  static validateAddress(address) {
    if (typeof address !== "string" || address.trim().length < 5) {
      throw new Error("Адрес должен содержать минимум 5 символов");
    }
    return address.trim();
  }
}
