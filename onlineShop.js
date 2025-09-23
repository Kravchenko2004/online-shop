class Client {
  #clientId;
  #fullName;
  #phone;
  #email;
  #address;

  constructor(clientId, fullName, phone, email, address) {
    this.#clientId = clientId;
    this.#fullName = fullName;
    this.#phone = phone;
    this.#email = email;
    this.#address = address;
  }

  get clientId() { return this.#clientId; }
  get fullName() { return this.#fullName; }
  get phone()    { return this.#phone; }
  get email()    { return this.#email; }
  get address()  { return this.#address; }

  set clientId(value) { this.#clientId = value; }
  set fullName(value) { this.#fullName = value; }
  set phone(value)    { this.#phone = value; }
  set email(value)    { this.#email = value; }
  set address(value)  { this.#address = value; }
}