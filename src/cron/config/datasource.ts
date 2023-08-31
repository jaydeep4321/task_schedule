import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService } from "./config";

const DBConfig: DataSourceOptions = new ConfigService().get("db");

export const databaseSource = new DataSource(DBConfig);
