import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss']
})
export class ToasterComponent implements OnInit {

  constructor(private toastr: ToastrService) {
  }

  ngOnInit() {
  }

  show(type, payload) {
    switch (type) {
      case 'success': {
        return this.showSuccess(payload.message, payload.title);
      }
    }
  }

  showSuccess(message, title) {
    this.toastr.success(message, title);
  }
}
