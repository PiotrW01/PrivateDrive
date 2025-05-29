import { Injectable } from '@angular/core';
import { SortMode } from '../models/sort-mode';
import { Item } from '../models/item';

@Injectable({
    providedIn: 'root',
})
export class ItemSortService {
    constructor() {}

    sortBy(items: Item[], sortMode: SortMode, ascending: boolean) {
        switch (sortMode) {
            case SortMode.Name:
                items.sort((a, b) => a.name.localeCompare(b.name));

                break;
            case SortMode.Date:
                items.sort((a, b) => {
                    return a.birthtime - b.birthtime;
                });
                break;
            case SortMode.Size:
                items.sort((a, b) => {
                    return a.size - b.size;
                });
                break;
            case SortMode.Type:
                items.sort((a, b) => {
                    const n = this.extensionOf(a.name);
                    const m = this.extensionOf(b.name);
                    return n.localeCompare(m);
                });
                this.sortGroupedByName(items);
                break;
        }

        if (!ascending) items.reverse();
    }

    private sortGroupedByName(items: Item[]) {
        var finalArray: Item[] = [];
        const temp: Item[] = [];
        for (const item of items) {
            if (
                temp.length == 0 ||
                this.extensionOf(temp[0].name) === this.extensionOf(item.name)
            ) {
                temp.push(item);
            } else {
                temp.sort((a, b) => a.name.localeCompare(b.name));
                finalArray = finalArray.concat(temp);
                temp.length = 0;
            }
        }
        items = finalArray;
    }

    private extensionOf(filename: string): string {
        return filename.split('.').pop() || '';
    }
}
