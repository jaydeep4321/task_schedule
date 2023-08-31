import { Global, Module, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { RequestContext } from "@nestjs/microservices";
import { DataSource } from "typeorm";
import { CONNECTION } from "./tenancy.symbols";
import { getTenantConnection } from "./tenancy.utils";

const connectionFactory = {
  provide: CONNECTION,
  scope: Scope.REQUEST,
  useFactory: async (request: RequestContext) => {
    const tenantHost = request.data["tenantId"] || request.data;
    if (tenantHost) {
      const tenantConnection: DataSource = await getTenantConnection(
        tenantHost
      );
      await tenantConnection.runMigrations();
      return tenantConnection;
    }

    return null;
  },
  inject: [REQUEST],
};

@Global()
@Module({
  providers: [connectionFactory],
  exports: [CONNECTION],
})
export class TenancyModule {}
