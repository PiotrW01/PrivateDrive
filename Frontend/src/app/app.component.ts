import {
    Component,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RequestService } from './core/services/request.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [RequestService],
})
export class AppComponent {
}
