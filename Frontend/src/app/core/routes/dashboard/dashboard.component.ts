import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  viewChild,
} from '@angular/core';
import { RequestService } from '../../services/request.service';
import { Item } from '../../models/item';
import { NgFor, NgIf } from '@angular/common';
import { SortMode } from '../../models/sort-mode';
import { ItemSortService } from '../../services/item-sort.service';
import { ItemContainerComponent } from '../../components/item-container/item-container.component';
import {
    MatSlideToggleChange,
    MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgFor,
    ItemContainerComponent,
    MatSlideToggleModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
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
      const file: File = this.fileQueue[0];
      this.fileQueue.shift();
      this.requestService.uploadItem(file).subscribe(event =>
      {
          if(event.type === HttpEventType.UploadProgress)
          {
            const percentDone = Math.round(100 * event.loaded / (event.total ?? event.loaded));
            console.log(`Upload progress: ${percentDone}%`);
          }
          else if (event.type === HttpEventType.ResponseHeader)
          {
            if(!event.ok)
            {
                console.log(`Oopsie couldnt upload file ${file.name}`);
                if(this.fileQueue.length > 0)
                {
                    this.uploadNextFile();
                }
            }
          }
          else if (event.type === HttpEventType.Response)
          {
            console.log("File uploaded");
            const date: Date = new Date(file.lastModified);
            this.items.push({name: file.name, size: file.size, lastModified: date, birthtime: 0});
            if(this.fileQueue.length == 0)
            {
                this.sorter.sortBy(this.items, this.sortMode, this.isSortAscending);
                console.log("upload complete!");
            }
            else
            {
                this.uploadNextFile();
            }
          }
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
              console.log(rItem);
          });
          this.sorter.sortBy(this.items, this.sortMode, this.isSortAscending);
      });
  }
}
