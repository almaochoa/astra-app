import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EncryptedMsgComponent } from './components/encrypted-msg/encrypted-msg.component';

const routes: Routes = [
  {path: 'encrypted', component:EncryptedMsgComponent},
  {path: '**', component:EncryptedMsgComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
