import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordeonComponent } from './components/accordeon/accordeon.component';

@NgModule({
  declarations: [AccordeonComponent],
  imports: [CommonModule],
  exports: [AccordeonComponent],
})
export class AccordeonModule {}
