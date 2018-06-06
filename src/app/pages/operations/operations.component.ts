import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss']
})
export class OperationsComponent implements OnInit {
  public operationsBalance: number = 0;
  public operationsFrom = '0326e7875aadaba270ae93ec40ef4706934d070eb21c9acad4743e31289fa4ebc7';
  public operationsTo: string;
  public operationsAmount: string;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {

    setInterval(() => {
      this.apiService.getBalance(this.operationsFrom).subscribe(result => {
        console.log(result);
        this.operationsBalance = result;
      });
    }, 2000);

  }

  send(e) {
    this.apiService.sendBalance(this.operationsTo, this.operationsAmount).subscribe(result => {
      console.log(result);
    });
  }

}
