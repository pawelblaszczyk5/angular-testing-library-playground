import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accordeon',
  templateUrl: './accordeon.component.html',
  styleUrls: ['./accordeon.component.css'],
})
export class AccordeonComponent {
  @Input()
  public isOpen: boolean = false;

  constructor() {}

  public changeIsOpenState = () => {
    this.isOpen = !this.isOpen;
  };
}
