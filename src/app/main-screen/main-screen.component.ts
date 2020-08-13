import { Component } from "@angular/core";

import { AppService } from "../app.service";
import { JobService } from "../job.service";

import { ContinuousPrintService } from "../plugin-service/continuous-print.service";

@Component({
  selector: "app-main-screen",
  templateUrl: "./main-screen.component.html",
  styleUrls: ["./main-screen.component.scss"],
})
export class MainScreenComponent {
  public printing = false;

  public constructor(private jobService: JobService, private service: AppService, private continuousPrintService: ContinuousPrintService) {}

  public isPrinting(): boolean {
    return this.jobService.isPrinting();
  }

  public isFileLoaded(): boolean {
    return this.service.getLoadedFile();
  }
  
  public getQueueState(): string{
    return this.continuousPrintService.getQueueState();
  }
}
