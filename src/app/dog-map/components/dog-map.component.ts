import { Component } from "@angular/core";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { AppService } from "src/app/app.service";
import { filter } from "rxjs/operators";

declare const google: any;

@Component({
  selector: "app-dog-map",
  templateUrl: "./dog-map.component.html"
})
export class DogMapComponent {
  map;
  walkPathCoordinates = [];
  walkPath;
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
          .then(data => {
            this.walkPathCoordinates = data.locations.map(x => ({
              lat: x.latitude,
              lng: x.longitude,
              alt: x.altitude
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

              this.calculateDogSnacks(i);
            }
          });
      });
  }

  private calculateDogSnacks(i: number) {
    // determines UP or DOWN direction, [m]
    const altitudeLevelDiff =
      this.walkPathCoordinates[i + 1].alt - this.walkPathCoordinates[i].alt;

    this.dog.downDirection = altitudeLevelDiff < 0;
    const fromDownToUp = this.dog.downDirection && this.dog.upDirection;
    const fromUpToBase = this.dog.upDirection && altitudeLevelDiff === 0;

    if (fromDownToUp || fromUpToBase) {
      this.dog.upDirection = false;
      this.dog.momentum = 0;
    }

    // go down, build momentum
    if (altitudeLevelDiff < 0) {
      this.dog.momentum += altitudeLevelDiff * -1;
    }

    // go up decrease momentum, add snacks
    if (altitudeLevelDiff > 0) {
      this.dog.upDirection = true;
      // no momentum
      if (this.dog.momentum === 0) {
        this.dog.snacks += altitudeLevelDiff;
        return;
      }
      // accumulated momentum
      this.dog.momentum -= altitudeLevelDiff;
      if (this.dog.momentum < 0) {
        const snackAmount = this.dog.momentum * -1;
        this.dog.snacks += snackAmount;
        this.dog.momentum = 0;
      }
    }
  }

  private getMapViewPosition(zoomLevel: number) {
    return new google.maps.Map(document.getElementById("map"), {
      zoom: zoomLevel,
      center: {
        lat: this.walkPathCoordinates[0].lat,
        lng: this.walkPathCoordinates[0].lng
      },
      mapTypeId: "terrain"
    });
  }

  private getColors() {
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

  private resetDogProperties() {
    this.dog = {
      snacks: 0,
      momentum: 0,
      upDirection: false,
      downDirection: false
    };
  }
}
