export default class PostService {
  constructor(baseUrl, client) {
    this.baseUrl = baseUrl;
    this.client = client;
  }

  all(params = {}) {
    return this.client.get(this.baseUrl, { params });
  }

  find(slug) {
    return this.client.get(`${this.baseUrl}/${slug}`);
  }
}
