import { Pipe, PipeTransform } from '@angular/core';
import { isBoolean } from 'lodash';

@Pipe({
    name: 'sortBy',
    standalone: true
})
export class SortByPipe implements PipeTransform {
    transform(array: any[], field: string, priorityField: any): any[] {
        if (!Array.isArray(array)) {
            return array;
        }

        const sortedArray = array.slice().sort((a, b) => {
            const aValue = a[field]?.toLowerCase();
            const bValue = b[field]?.toLowerCase();
            return aValue?.localeCompare(bValue);
        });

        if (priorityField) {
            const priorityIndex = sortedArray.findIndex(item =>  item[priorityField] == true || item[field] === item[priorityField]);

            if (priorityIndex !== -1) {
                sortedArray.unshift(sortedArray.splice(priorityIndex, 1)[0]);
            }
        }
        return sortedArray;
    }
}
