import { Component, OnInit } from "@angular/core";
import { AppService } from "../app.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
  constructor(private service: AppService) {}

  ngOnInit() {
    this.service
      .getEndpointData("https://infinite-lake-80504.herokuapp.com/api/routes")
      .then((routeNames: any) => {
        console.log(routeNames);
      });
  }
}
