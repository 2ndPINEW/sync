import { ClientService } from "./services/client-service";
export class BrowserTester {
  clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }
}
