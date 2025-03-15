import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'side-section',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './side-section.component.html',
  styleUrls: ['./side-section.component.scss']
})
export class SideSectionComponent {
  @Input() title: string = '';
  @Input() links: Array<{ title: string; id: string }> = [];
  @Input() buttonText?: string;

  @Output() linkClick = new EventEmitter<string>();
  @Output() buttonClick = new EventEmitter<void>();

  onLinkClick(id: string) {
    this.linkClick.emit(id);
  }

  onButtonClick() {
    this.buttonClick.emit();
  }
}
