import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LetModule } from '@ngrx/component';

import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { ControlsComponent } from './controls/controls.component';
import { ColorizeDirective } from './directives/colorize.directive';
import { MinutesPipe } from './pipes/minutes.pipe';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    ControlsComponent,
    ColorizeDirective,
    MinutesPipe
  ],
  imports: [
    BrowserModule,
    LetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
