import { Component, OnInit } from '@angular/core';
import { APP_IMPORTS } from '@import';
import { defaultGeneralSetting, GeneralSetting } from '@model/general-setting';
import { Store } from '@ngrx/store';
import { selectGeneralSetting } from '@selector/general-setting.selectors';
import { GeneralSettingService } from '@service/general-setting.service';
import { IAppState } from '@state/app.state';
import { Timestamp } from 'firebase/firestore';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-general-setting',
  standalone: true,
  imports: [APP_IMPORTS],
  templateUrl: './general-setting.component.html',
  styleUrl: './general-setting.component.scss'
})
export class GeneralSettingComponent implements OnInit {
  editState: boolean = false;

  generalSetting: GeneralSetting = cloneDeep(defaultGeneralSetting);

  constructor(
    private store: Store<IAppState>,
    private generalSettingService: GeneralSettingService
  ) { }

  ngOnInit(): void {
    this.store.select(selectGeneralSetting).subscribe(gs => {
      let tempGs = cloneDeep(gs);
      if (tempGs.maintenance.startDate instanceof Timestamp) {
        tempGs.maintenance.startDate = tempGs.maintenance.startDate.toDate();
      }


      if (tempGs.maintenance.endDate instanceof Timestamp) {
        tempGs.maintenance.endDate = tempGs.maintenance.endDate.toDate();
      }

      this.generalSetting = tempGs;
    });
  }

  createOrUpdate(): void {
    this.generalSetting = { ... this.generalSetting }
    this.generalSettingService.save(this.generalSetting.id, this.generalSetting);
    this.editState = false;
  }

  edit(): void {
    this.editState = true;
  }

  cancelSave(): void {
    this.editState = false;
  }
}
