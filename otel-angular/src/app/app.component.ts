import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private readonly httpClient: HttpClient) {
  }

  loadData() {
    this.httpClient.get('/api/example').subscribe();
  }
}
