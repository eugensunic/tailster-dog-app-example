import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// containers
import { CommonModule } from "@angular/common";
import { OverviewComponent } from "./overview.component";
import { DogMapComponent } from "./components/dog-map.component";

// routes
export const ROUTES: Routes = [
  {
    path: "",
    component: OverviewComponent,
    children: [{ path: "", component: DogMapComponent }]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(ROUTES)],
  declarations: [OverviewComponent, DogMapComponent]
})
export class DogModule {}
