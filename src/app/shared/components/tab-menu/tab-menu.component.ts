import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { APP_IMPORTS } from 'src/app/app.import';
import { TabMenu } from './tab-menu.model';

@Component({
  selector: 'app-tab-menu',
  standalone: true,
  imports: [APP_IMPORTS],
  templateUrl: './tab-menu.component.html',
  styleUrls: ['./tab-menu.component.scss']
})
export class TabMenuComponent implements OnChanges {
  @Input() tabs: TabMenu[] = [];
  @Output() onSelectChange = new EventEmitter<TabMenu>();

  ngOnChanges(changes: SimpleChanges): void {
    this.tabs = this.tabs.sort((t1, t2) => t1.order - t2.order);
  }

  getId(tab: TabMenu): string {
    return tab?.name.replace(/ /g, '-');
  }

  onSelectTabChange(index: number) {
    this.onSelectChange.emit(this.tabs[index]);
  }
}
