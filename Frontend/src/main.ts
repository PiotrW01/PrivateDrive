import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ApplicationConfig} from '@angular/core';
import { AppComponent } from './app/app.component';
import { AppConfigService } from './app/core/services/app-config.service';

async function main() {
  try {
    const response = await fetch('/data/config.json');
    if (!response.ok) throw new Error('Failed to load config.json');
    const configData = await response.json();

    const configService = new AppConfigService();
    configService.load(configData);

    const extendedAppConfig: ApplicationConfig = {
      ...appConfig,
      providers: [
        { provide: AppConfigService, useValue: configService },
        ...appConfig.providers,
      ]
    };

    await bootstrapApplication(AppComponent, extendedAppConfig);
  } catch (err) {
    console.error(err);
  }
}

main();
