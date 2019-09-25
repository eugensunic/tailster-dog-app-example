import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// containers
import { HomeChildComponent } from "./home-child/home-child.component";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";

// routes
export const ROUTES: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [{ path: "", component: HomeChildComponent }]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(ROUTES)],
  declarations: [HomeComponent, HomeChildComponent]
})
export class HomeModule {}
