import { Global, Module } from "@nestjs/common";
import { DBSOURCE } from "../tenancy/tenancy.symbols";
import { databaseSource } from "src/cron/config/datasource";

const databaseProvider = {
  provide: DBSOURCE,
  useFactory: async () => {
    try {
      if (!databaseSource.isInitialized) {
        await databaseSource.initialize();
      }
    } catch (error) {
      console.error(error?.message);
    }
    return databaseSource;
  },
};

@Global()
@Module({
  providers: [databaseProvider],
  exports: [DBSOURCE],
})
export class DatabaseModule {}
