import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from './app.component';
import { EncryptedMsgComponent } from './components/encrypted-msg/encrypted-msg.component';
import { GamesComponent } from './components/games/games.component';

const routes: Routes = [
  {path: 'encrypted', component:EncryptedMsgComponent},
  {path: 'games', component:GamesComponent},
  {path: '**', component: AppComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
