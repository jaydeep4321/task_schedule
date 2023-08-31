import { RpcException } from "@nestjs/microservices";
import { ConfigService } from "src/cron/config/config";
import { DataSource, DataSourceOptions } from "typeorm";

let connectionPools = [];

export async function getTenantConnection(
  tenantHost: string
): Promise<DataSource> {
  const tenantId = getTenantId(tenantHost);
  const connectionName = `${tenantId}`;
 
  const DBConfig: DataSourceOptions = {
    ...new ConfigService().get("tenantdb"),
    database: connectionName,
  };

  let dataSource: DataSource;

  const connExists = connectionPools.findIndex(
    (item) => item.tenantId === tenantId
  );

  if (connExists === -1) {
    dataSource = new DataSource(DBConfig);
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    connectionPools.push({ tenantId, tenantConnection: dataSource });
  } else {
    dataSource = connectionPools[connExists].tenantConnection;
  }

  const schemaExists = await dataSource.query(
    `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${tenantId}'`
  );

  if (schemaExists.length === 0 || tenantId === "superadmin") {
    dataSource.destroy();
    throw new RpcException("Database connection error.");
  }

  return dataSource;
}

export function getTenantId(tenantHost: string) {
  let domain: string[];

  domain = tenantHost.split(".");

  if (domain.length < 2) {
    return domain[0];
  }

  if (domain[0] != "127" && domain[0] != "www" && domain.length > 2) {
    return domain[0];
  }
}
