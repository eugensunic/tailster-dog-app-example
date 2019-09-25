import { Component, OnInit } from "@angular/core";
import { AppService } from "./app.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
  title = "tailster-dog-snack-calculator";
  routeNames = 0;
  constructor(private service: AppService) {}

  ngOnInit() {
    this.service
      .getEndpointData("https://infinite-lake-80504.herokuapp.com/api/routes")
      .then(data => (this.routeNames = data))
  }
}
