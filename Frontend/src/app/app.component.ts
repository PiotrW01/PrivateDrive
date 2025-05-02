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
import {
    MatSlideToggleChange,
    MatSlideToggleModule,
} from '@angular/material/slide-toggle';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        NgFor,
        ItemContainerComponent,
        MatSlideToggleModule,
    ],
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
    fileQueue: File[] = [];

    constructor(
        private requestService: RequestService,
        private sorter: ItemSortService
    ) {}

    uploadFiles() {
        if (this.fileInput.nativeElement.files.length == 0) return;
        if (this.fileQueue.length != 0) {
            this.fileQueue = this.fileQueue.concat(
                Array.from(this.fileInput.nativeElement.files)
            );
            return;
        }

        this.fileQueue = Array.from(this.fileInput.nativeElement.files);
        this.uploadNextFile();
    }

    private async uploadNextFile() {
        if (this.fileQueue.length == 0) {
            this.updateItemList();
            return;
        }
        const file: File = this.fileQueue[0];
        this.fileQueue.shift();
        this.requestService.uploadItem(file).subscribe({
            complete: () => {
                console.log('File uploaded!');
                this.uploadNextFile();
            },
        });
    }

    downloadArchive() {
        this.requestService.downloadArchive();
    }

    ngOnInit(): void {
        this.updateItemList();
    }

    toggle(event: MatSlideToggleChange) {
        console.log(event.checked);
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
