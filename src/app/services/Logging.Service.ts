import { Injectable, inject } from '@angular/core';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoggingService {
    private http: HttpClient = inject(HttpClient);
    private logUrl = 'https://httpprojectdemo-default-rtdb.firebaseio.com/log.json';

    logError(data: { statusCode: number; errorMessage: string; datetime: Date }): void {
        this.http.post(this.logUrl, data).subscribe(); // Fire-and-forget logging
    }

    fetchErrors(): Observable<any> {
        return this.http.get(this.logUrl); // Returns observable instead of console.log
    }
}
