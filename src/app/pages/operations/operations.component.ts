import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {ToastrMessageService} from '../../services/toastr.service';

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

  public addressToCheck: string;
  public balanceToCheck: string;

  constructor(private apiService: ApiService,
              private toastr: ToastrMessageService) {
  }

  ngOnInit() {

    setInterval(() => {
      this.apiService.getBalance(this.operationsFrom).subscribe(result => {
        if (!result) {
          result = 0;
        }
        this.operationsBalance = result;
      });
    }, 2000);

  }

  checkBalance() {
    this.apiService.getBalance(this.addressToCheck).subscribe(result => {
      if (!result) {
        result = 0;
      }
      this.balanceToCheck = result;
    });
  }

  send(e) {
    this.apiService.sendBalance(this.operationsTo, this.operationsAmount).subscribe(result => {

      if (result) {
        this.toastr.show({
          title: 'Success',
          message: `Operation was finished with success`,
        });
      } else {
        this.toastr.show({
          title: 'Fail',
          message: `Operation has failed`,
        }, 'error');
      }


    });
  }

  check(e) {
    console.log(e);
  }
}
