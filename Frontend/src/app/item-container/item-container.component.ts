import { Component, Input } from '@angular/core';
import { Item } from '../item';
import { RequestService } from '../request.service';

@Component({
    selector: 'app-item-container',
    standalone: true,
    imports: [],
    templateUrl: './item-container.component.html',
    styleUrl: './item-container.component.css',
})
export class ItemContainerComponent {
    constructor(private requestService: RequestService) {}

    @Input() item!: Item;

    downloadFile() {
        this.requestService.downloadFile(this.item.name);
    }
}
