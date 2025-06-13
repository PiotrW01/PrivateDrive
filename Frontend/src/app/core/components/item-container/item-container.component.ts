import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../../models/item';
import { RequestService } from '../../services/request.service';

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
    @Output() delete = new EventEmitter<Item>();

    downloadFile() {
        this.requestService.downloadFile(this.item.name);
    }

    deleteFile() {
        this.requestService.deleteItem(this.item.name).subscribe(
            (response) => {
                console.log(response.status);
                if(response.status == 200){
                    this.delete.emit(this.item);
                }
            }
        );
    }
}
