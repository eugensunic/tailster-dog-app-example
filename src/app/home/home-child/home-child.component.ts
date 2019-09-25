import { Component } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { AppService } from "src/app/app.service";
import { filter } from "rxjs/operators";

declare const google: any;

@Component({
  selector: "app-home-child",
  templateUrl: "./home-child.component.html"
})
export class HomeChildComponent {
  map;
  walkPathCoordinates = [];
  walkPath;
  distance = 0;
  dog = {
    snacks: 0,
    momentum: 0,
    upDirection: false,
    downDirection: false
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: AppService
  ) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(_ => {
        this.resetDogProperties();
        const routeId = this.route.snapshot.paramMap.get("id");
        this.service
          .getEndpointData(
            "https://infinite-lake-80504.herokuapp.com/api/routes/" + routeId
          )
          .then(x => {
            this.walkPathCoordinates = x.locations.map(y => ({
              lat: y.latitude,
              lng: y.longitude,
              alt: y.altitude
            }));
            this.map = this.getMapViewPosition(18);
            if (this.walkPath) {
              this.walkPath.setMap(null);
            }

            for (let i = 0; i < this.walkPathCoordinates.length - 1; i++) {
              const p1 = new google.maps.LatLng(
                this.walkPathCoordinates[i].lat,
                this.walkPathCoordinates[i].lng
              );
              const p2 = new google.maps.LatLng(
                this.walkPathCoordinates[i + 1].lat,
                this.walkPathCoordinates[i + 1].lng
              );

              this.walkPath = new google.maps.Polyline({
                path: [p1, p2],
                strokeColor: this.getColors()[i],
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: this.map
              });
              this.calculateDogSnacks(p1, p2, i);
            }
            console.log(this.dog.snacks);
          });
      });
  }

  calculateDogSnacks(p1, p2, i) {
    let distance = google.maps.geometry.spherical.computeDistanceBetween(
      p1,
      p2
    );

    // determines UP or DOWN direction
    const altitudeLevel =
      this.walkPathCoordinates[i + 1].alt - this.walkPathCoordinates[i].alt;
    console.log("altitude level is:", altitudeLevel);
    console.log("distance between two points is:", distance);

    this.dog.downDirection = altitudeLevel < 0 ? true : false;
    // new momentum starts when transition from up to down happens (should not accumulate previous one)
    if (this.dog.downDirection && this.dog.upDirection) {
      this.dog.momentum = 0;
    }

    // go down, build momentum
    if (altitudeLevel < 0) {
      this.dog.momentum += distance;
      console.log("go-down:", this.dog.momentum);
    }

    // go up decrease momentum, add snacks
    if (altitudeLevel > 0) {
      this.dog.upDirection = true;
      if (this.dog.momentum) {
        distance -= this.dog.momentum;
        // decrease dog momentum
        this.dog.momentum = distance > 0 ? 0 : this.dog.momentum * -1;
        console.log("was dog down direction previously:", distance);
      }

      this.dog.snacks += distance <= 0 ? distance * -1 : distance;
      console.log("goUp-Snacks value:", this.dog.snacks);
    }
  }

  getWalkPath() {
    return new google.maps.Polyline({
      path: this.walkPathCoordinates,
      geodesic: true,
      strokeColor: this.getColors(),
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
  }

  getMapViewPosition(zoomLevel) {
    return new google.maps.Map(document.getElementById("map"), {
      zoom: zoomLevel,
      center: {
        lat: this.walkPathCoordinates[0].lat,
        lng: this.walkPathCoordinates[0].lng
      },
      mapTypeId: "terrain"
    });
  }

  getColors() {
    return [
      "red",
      "blue",
      "maroon",
      "purple",
      "violet",
      "orange",
      "black",
      "yellow",
      "gray",
      "gold",
      "brown"
    ];
  }

  resetDogProperties() {
    this.dog = {
      snacks: 0,
      momentum: 0,
      upDirection: false,
      downDirection: false
    };
  }
}
