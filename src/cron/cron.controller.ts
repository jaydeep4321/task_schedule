import { Body, Controller, Get, Header, Headers, Logger, Post } from "@nestjs/common";
import { CronService } from "./service/cron.service";
import { OrganizationInterface } from "./model";
import { lastValueFrom, map } from "rxjs";

@Controller("/api")
  export class CronController {
    private readonly logger = new Logger(CronController.name);
    constructor(private readonly cronService: CronService) {}
  
    // @Get("orgDetails")
    // async findAllOrganizationDetails(
    //     @Headers() tenantId: string
    // ) {
    //     console.log("tenantID::",tenantId)
    //     let allOrganization: OrganizationInterface[];
    //     try {
    //       this.logger.debug("Fetching Organizations...");
    //       allOrganization = await lastValueFrom(
    //         this.cronService.findAll(tenantId).pipe(
    //           map((orgs: OrganizationInterface[]) => {
    //             return orgs;
    //           })
    //         )
    //       );
    //     } catch (error) {
    //       this.logger.debug("Error in Fetching Organizations " + error?.message);
    //     }
    //     return allOrganization;
    // }
  }

