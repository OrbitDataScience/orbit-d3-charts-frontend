import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainService {
    constructor(private httpClient: HttpClient) { }
  //url = 'http://127.0.0.1:8080';
  url = 'https://d3-charts-backend-xgmsewclfa-uc.a.run.app';

  circlesChartEndpoint = '/getchartdata'
  nodesChartEndpoint = '/getnodeschartdata'

  public getCirclesChartData(): Observable<any> {
    return this.httpClient.get<any>(this.url + this.circlesChartEndpoint)
  }

  public getNodesChartData(): Observable<any> {
    return this.httpClient.get(this.url + this.nodesChartEndpoint)
  }
}
