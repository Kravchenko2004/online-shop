export class ClientRepositoryDecorator {
  #repo;
  #filter;
  #sort;

  constructor(repo, filter = null, sort = null) {
    this.#repo = repo;
    this.#filter = filter;
    this.#sort = sort;
  }

  get repo() {
    return this.#repo;
  }
  get filter() {
    return this.#filter;
  }
  get sort() {
    return this.#sort;
  }
}
