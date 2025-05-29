import { Injectable } from '@angular/core';
import { AppConfig } from '../models/appconfig';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  configData!: AppConfig

  constructor() { }

  load(configData: AppConfig){
    this.configData = configData;
  }
}
