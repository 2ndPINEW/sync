import { ClientService } from "./services/client-service";
import { RestApiServer } from "./services/rest-api-service";
export class BrowserTester {
  clientService: ClientService;
  restApiServer: RestApiServer;

  constructor() {
    this.clientService = new ClientService();
    this.restApiServer = new RestApiServer();

    this.clientService.clients$.subscribe((clients) => {
      this.restApiServer.updateClients(clients);
    });
  }
}
