import { TemplateRef } from "@angular/core";

export interface TabMenu {
  name: string;
  icon: string;
  order?: number;
  content: TemplateRef<any>
}
