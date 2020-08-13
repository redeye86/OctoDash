import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Observer, Subscription, timer } from "rxjs";
import { shareReplay } from "rxjs/operators";

import { ConfigService } from "../config/config.service";
import { NotificationService } from "../notification/notification.service";
import { JobCommand } from "../octoprint-api/jobAPI";

import { OctoprintContinuousPrintQueueAPI } from "../octoprint-api/continuousPrintAPI";

@Injectable({
  providedIn: "root",
})
export class ContinuousPrintService {
  private httpGETRequest: Subscription;
  private observable: Observable<ContinuousPrintAPI>;

  public constructor(
    private configService: ConfigService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {
        this.observable = new Observable((observer: Observer<ContinuousPrintAPI>): void => {
        timer(1000, this.configService.getAPIPollingInterval()).subscribe((): void => {
            if (this.httpGETRequest) {
            this.httpGETRequest.unsubscribe();
            }
            this.httpGETRequest = this.http
            .get(
                this.configService.getURL("plugin/continuousprint/queue").replace("/api", ""),
                this.configService.getHTTPHeaders()
            )
            .subscribe(
                (data: OctoprintContinuousPrintQueueAPI): void => {
                observer.next({
                    next: data.queue[0].name
                });
                },
                (error: HttpErrorResponse): void => {
                this.notificationService.setError("Can't retrieve continuous print queue!", error.message);
                }
            );
        });
        }).pipe(shareReplay(1));
    }
  
  
  public getObservable(): Observable<ContinuousPrintAPI> {
    return this.observable;
  }

  public resumeQueue(): void {
    if (this.httpGETRequest) {
      this.httpGETRequest.unsubscribe();
    }
    this.httpGETRequest = this.http
      .get(this.configService.getURL("plugin/continuousprint/resumeQueue").replace("/api", ""), this.configService.getHTTPHeaders())
      .subscribe(
        (): void => null,
        (error: HttpErrorResponse): void => {
          this.notificationService.setError("Can't control Queue!", error.message);
        }
      );
  }

  public getQueueState(): string{
      return "PAUSED";
  }
}

export interface ContinuousPrintAPI {
  next: string;
}
