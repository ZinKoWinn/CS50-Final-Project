import { Component, OnInit } from '@angular/core';
import { defaultMaintenance, Maintenance } from '@model/general-setting';
import { Store } from '@ngrx/store';
import { selectMaintenance } from '@selector/general-setting.selectors';
import { IAppState } from '@state/app.state';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [],
  templateUrl: './maintenance.component.html',
  styleUrl: './maintenance.component.scss'
})
export class MaintenanceComponent implements OnInit {
  maintenance: Maintenance;

  constructor(
    private store: Store<IAppState>
  ) { }

  ngOnInit(): void {
    this.store.select(selectMaintenance).subscribe((maintenance) => {
      this.maintenance = cloneDeep(maintenance ? maintenance : defaultMaintenance);
    })
  }
}
