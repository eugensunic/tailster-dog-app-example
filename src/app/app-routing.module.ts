import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
  {
    path: 'view/:id',
    loadChildren: () =>
      import('./dog-map/overview.module').then(m => m.DogModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
