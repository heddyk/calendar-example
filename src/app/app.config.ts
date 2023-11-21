import { ApplicationConfig, LOCALE_ID } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './core/routes/app.routes'
import { registerLocaleData } from '@angular/common'
import ptBR from '@angular/common/locales/pt'
import { provideHttpClient } from '@angular/common/http'

registerLocaleData(ptBR, 'pt-BR')

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideHttpClient(),
    provideRouter(routes),
  ],
}
