import { Injectable } from '@angular/core';
import { resolve } from 'url';
import {Leader} from '../shared/leader';
import {LEADERS} from '../shared/leaders';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { Http } from '@angular/http';
import { map,catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from '../services/process-httpmsg.service'

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http:HttpClient,private processHTTPMsgService:ProcessHTTPMsgService) { }

  getLeaders():Observable<Leader[]>{
    // return new Promise(resolve=>{
    //   setTimeout(()=>resolve(LEADERS),2000)
    // });

    //return of(LEADERS).pipe(delay(0));

    return this.http.get<Leader[]>(baseURL+'leadership').
    pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getLeader(id:string):Observable<Leader>{
    // return Promise.resolve(LEADERS.filter(function(leader){
    //   if(leader.id==id)
    //   return leader;
    // })[0]);
    
    /*
    return of(LEADERS.filter(function(leader){
      if(leader.id==id)
      return leader;
    })[0]).pipe(delay(0));
    */

    return this.http.get<Leader>(baseURL+'leadership/'+id).
    pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedLeader():Observable<Leader>{


    // return of(LEADERS.filter(function(leader){
    //   if(leader.featured)
    //   return leader;
    // })[0]).pipe(delay(0));

    return this.http.get<Leader>(baseURL+'leadership?featured=true')
    .pipe(map(leaders=>leaders[0])).
    pipe(catchError(this.processHTTPMsgService.handleError));;
}
}
