import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpHeaderResponse,
    HttpHeaders,
} from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    private url: string = 'http://localhost:3000';

    constructor(private client: HttpClient) {}

    getItems() {
        return this.client.get(`${this.url}/files`);
    }

    downloadFile(id: string) {
        const a = document.createElement('a');
        a.download = id;
        a.href = `${this.url}/file/${encodeURIComponent(id)}`;
        a.click();
    }

    downloadArchive() {
        const a = document.createElement('a');
        a.href = `${this.url}/zipfiles`;
        a.click();
    }

    uploadItem(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const headers = new HttpHeaders({ enctype: 'multipart/form-data' });

        return this.client.post(`${this.url}/upload`, formData, {
            headers: headers,
            responseType: 'text',
        });
    }

    moveItem() {}

    deleteItem() {}

    renameItem() {}

    createFolder() {}

    createTextFile() {}
}
