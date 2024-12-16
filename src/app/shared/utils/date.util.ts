import { DatePipe } from '@angular/common';
import { startOfMonth, endOfMonth, startOfWeek, addDays, isWeekend, endOfWeek } from 'date-fns';

export class DateUtils {
    static readonly today = new Date();
    static readonly firstDayOfMonth = startOfMonth(this.today);
    static readonly lastDayOfMonth = endOfMonth(this.today);
    static readonly firstDayOfWeek = startOfWeek(this.today);
    static readonly lastDayOfWeek = endOfWeek(this.today)

    static formatDate(date: Date, datePattern: string): string {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, datePattern) || '';
    }
}
