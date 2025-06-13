import { Injectable, OnInit } from '@angular/core';
import {
    HttpClient,
    HttpEventType,
    HttpHeaderResponse,
    HttpHeaders,
} from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { environment } from '../../../environments/environment';
import { Item } from '../models/item';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    private apiUrl!: string;

    constructor(
        private client: HttpClient,
        private appConfig: AppConfigService,
        private cookieService: CookieService
    ) {
        if (!environment.production) {
            this.apiUrl = environment.apiUrl;
            console.log(this.apiUrl);
            return;
        }
        if (this.appConfig.configData) {
            this.apiUrl = this.appConfig.configData.apiUrl;
            console.log(this.appConfig.configData);
        } else {
            console.log("no api url!");
        }
    }

    getItems() {
        return this.client.get<Item[]>(`${this.apiUrl}/files`);
    }

    downloadFile(id: string) {
        const a = document.createElement('a');
        a.download = id;
        a.href = `${this.apiUrl}/file/${encodeURIComponent(id)}`;
        a.click();
    }

    downloadArchive() {
        const a = document.createElement('a');
        a.download = 'archive.zip';
        a.href = `${this.apiUrl}/zipfiles`;
        a.click();
    }

    uploadItem(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('lastModified', file.lastModified.toString());
        return this.client.post(`${this.apiUrl}/upload`, formData, {
            headers: { enctype: 'multipart/form-data' },
            reportProgress: true,
            observe: 'events',
            responseType: 'blob',
        });
    }

    moveItem() {}

    deleteItem(name: string) {
        return this.client.delete(`${this.apiUrl}/removefile`, {
            params: { name },
            responseType: "text",
            observe: 'response'
        });
    }

    renameItem() {}

    createFolder() {}

    createTextFile() {}
}
