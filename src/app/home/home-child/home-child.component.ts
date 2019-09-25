import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { AppService } from "src/app/app.service";
import { tap, map, filter } from "rxjs/operators";

declare const google: any;

@Component({
  selector: "app-home-child",
  templateUrl: "./home-child.component.html"
})
export class HomeChildComponent implements OnInit, AfterViewInit {
  routes;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: AppService
  ) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(_ => {
        const routeId = this.route.snapshot.paramMap.get("id");
        this.service
          .getEndpointData(
            "https://infinite-lake-80504.herokuapp.com/api/routes/" + routeId
          )
          .then(x => {
            console.log(x);
            this.routes = x;
          });
      });
  }

  ngOnInit() {}
  ngAfterViewInit() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 18,
      center: { lat: 51.51973438454002, lng: -0.1222349703313059 },
      mapTypeId: "terrain"
    });

    const flightPlanCoordinates = [
      { lat: 51.51973438454002, lng: -0.1222349703313059 },
      { lat: 51.51975093879879, lng: -0.1222902908922381 },
      { lat: 51.51968937371999, lng: -0.1225241459907242 },
      { lat: 51.51955128186523, lng: -0.1227341126651715 },
      { lat: 51.51940237735539, lng: -0.1229298301042271 }
    ];

    const flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    flightPath.setMap(map);
    var p1 = new google.maps.LatLng(51.51973438454002, -0.1222349703313059);
    var p2 = new google.maps.LatLng(51.51940237735539, -0.1229298301042271);
    const distance = google.maps.geometry.spherical
      .computeDistanceBetween(p1, p2)
      .toFixed(2);
    console.log("distance", distance);
  }
}
