import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../services/loading.service';
import { LoadingState } from '../../models/loading';

@Component({
  selector: 'app-is-loading',
  templateUrl: './is-loading.component.html',
  styleUrls: ['./is-loading.component.scss'],
})
export class IsLoadingComponent implements OnInit, OnDestroy {
  @HostBinding('class.is-loading')

  public show = false;
  private subscription: Subscription;

  constructor(private loaderService: LoadingService) {
  }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoadingState) => {
        this.show = state.show;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
