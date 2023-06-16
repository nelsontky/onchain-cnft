import { Controller, Get, Param, Query } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/:signaturesAddress")
  getMetadata(
    @Param("signaturesAddress") signaturesAddress: string,
    @Query("latestTxId") latestTxId: string,
    @Query("count") count: string
  ) {
    return this.appService.getMetadata(signaturesAddress, latestTxId, +count);
  }
}
