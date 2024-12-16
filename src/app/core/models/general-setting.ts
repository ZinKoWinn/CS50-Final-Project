import { Audit, defaultAudit } from "./audit";
import { GENERAL_SETTING_ID } from "@constant/app.constant";

export interface GeneralSetting {
    id: string;
    maintenance: Maintenance
    audit: Audit;
}

export interface Maintenance {
    enabled: boolean;
    description: string;
    startDate: Date;
    endDate: Date
}

export const defaultMaintenance: Maintenance = {
    enabled: false,
    startDate: null,
    endDate: null,
    description: 'Our system is currently being deployed. We are in the process of installing and configuring it.'
}

export const defaultGeneralSetting: GeneralSetting = {
    id: GENERAL_SETTING_ID,
    maintenance: defaultMaintenance,
    audit: defaultAudit
}