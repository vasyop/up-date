import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import {MatGridListModule} from '@angular/material/grid-list'
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, MatButtonModule, MatGridListModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'dating-app';

  ngAfterContentInit(){
    setTimeout(() => {
      this.initMap();
    }, 500);
  }

  initMap() {
    const mapboxgl = (window as any).mapboxgl;

    mapboxgl.accessToken = 'pk.eyJ1IjoidmFzeW9wIiwiYSI6ImNqNW1yMnd4YzNvbXEyd284cGVxbnQ1bjYifQ.jMhtbSEu9PsLlBoikZrVjg';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/vasyop/cm4wx7z1z004o01s9ek1i5ru7',
  projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
  zoom: 2,
  center: [25, 45]
});

map.scrollZoom.disable();

map.on('style.load', () => {
  map.setFog({
    color: 'rgb(186, 210, 235)', // Lower atmosphere
    'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
    'horizon-blend': 0.02, // Atmosphere thickness (default 0.2 at low zooms)
    'space-color': 'rgb(11, 11, 25)', // Background color
    'star-intensity': 0.6 // Background star brightness (default 0.35 at low zoooms )
  });
});

map.on('load', function() {
  map.addLayer(
    {
      id: 'country-boundaries',
      source: {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1',
      },
      'source-layer': 'country_boundaries',
      type: 'fill',
      paint: {
        'fill-color': 'black',
        'fill-opacity': 0.2,
      },
    },
    'country-label'
  );

  map.setFilter('country-boundaries', [
    "in",
    "iso_3166_1_alpha_3",
    'ROU',
  ]);

  map.setFilter(
    'country-label',
    [
      "match",
      ["get", "class"],
      ["country"],
      [
        "match",
        ["get", "iso_3166_1"],
        ["RO"],
        true,
        false
      ],
      false
    ]

  );
});


  }
}
