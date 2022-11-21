import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LetModule } from '@ngrx/component';

import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { ControlsComponent } from './controls/controls.component';
import { ColorizeDirective } from './directives/colorize.directive';
import { MinutesPipe } from './pipes/minutes.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { ControlOptionComponent } from './control-option/control-option.component';
import { LongPressDirective } from './directives/long-press.directive';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    ControlsComponent,
    ColorizeDirective,
    MinutesPipe,
    ClickOutsideDirective,
    ControlOptionComponent,
    LongPressDirective,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    LetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
