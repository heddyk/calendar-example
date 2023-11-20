import { ApplicationConfig, LOCALE_ID } from '@angular/core'
import { provideRouter } from '@angular/router'

import { routes } from './core/routes/app.routes'
import { registerLocaleData } from '@angular/common'
import ptBR from '@angular/common/locales/pt'

registerLocaleData(ptBR, 'pt-BR')

export const appConfig: ApplicationConfig = {
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }, provideRouter(routes)],
}
