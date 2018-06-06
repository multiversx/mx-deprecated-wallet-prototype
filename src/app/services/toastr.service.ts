import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrMessageService {

  constructor(private toastr: ToastrService) {
  }

  show(payload, type?, ) {
    switch (type) {
      case 'error': {
        return this.showError(payload.message, payload.title);
      }
      default: {
        return this.showSuccess(payload.message, payload.title);
      }
    }
  }

  showSuccess(message, title) {
    this.toastr.success(message, title);
  }

  showError(message, title) {
    this.toastr.error(message, title);
  }
}
