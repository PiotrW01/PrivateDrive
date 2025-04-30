import {
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
    viewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RequestService } from './request.service';
import { Item } from './item';
import { NgFor, NgIf } from '@angular/common';
import { SortMode } from './sort-mode';
import { ItemSortService } from './item-sort.service';
import { ItemContainerComponent } from './item-container/item-container.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NgFor, ItemContainerComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [RequestService],
})
export class AppComponent implements OnInit {
    title = 'PrivateDriveFront';
    @ViewChild('fileInput') fileInput: any;
    items: Item[] = [];
    sortMode: SortMode = SortMode.Type;
    isSortAscending: boolean = false;

    constructor(
        private requestService: RequestService,
        private sorter: ItemSortService
    ) {}

    uploadFile() {
        if (this.fileInput.nativeElement.files.length == 0) return;
        this.requestService
            .uploadItem(this.fileInput.nativeElement.files[0])
            .subscribe({
                next: (res) => {
                    console.log(res);
                },
                error: (err) => {
                    console.log(err);
                },
                complete: () => {
                    this.updateItemList();
                },
            });
    }

    downloadArchive() {
        this.requestService.downloadArchive();
    }

    ngOnInit(): void {
        this.updateItemList();
    }

    private updateItemList() {
        this.items.length = 0;
        this.requestService.getItems().subscribe((receivedItems) => {
            (receivedItems as Item[]).forEach((rItem) => {
                this.items.push(rItem);
            });
            this.sorter.sortBy(this.items, this.sortMode, this.isSortAscending);
        });
    }
}
