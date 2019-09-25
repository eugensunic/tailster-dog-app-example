import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor() {}

  getEndpointData(url: string) {
    return fetch(url)
      .then(res =>
        res.status !== 200
          ? () => {
              throw new Error("error");
            }
          : res.json()
      )
      .catch(err => console.log(err));
  }
}
