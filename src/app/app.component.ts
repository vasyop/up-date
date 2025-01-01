import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  ngAfterContentInit() {
    setTimeout(() => {
      this.initMap();
    }, 500);
  }

  initMap() {
    const mapboxgl = (window as any).mapboxgl;

    mapboxgl.accessToken =
      'pk.eyJ1IjoidmFzeW9wIiwiYSI6ImNqNW1yMnd4YzNvbXEyd284cGVxbnQ1bjYifQ.jMhtbSEu9PsLlBoikZrVjg';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v11',
      center: [25, 45],
      zoom: 3,
    });

    map.scrollZoom.disable();

    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker(el).setLngLat([25, 45]).addTo(map);

    let dragging = false;
    map.on('mousedown', () => {
      dragging = true
    });

    map.on('mouseup', () => {
      dragging = false
    });

    pan();

    function pan() {
      const duration = 10;
      const deltaDistance = 25;

      function easing(t: number) {
        return t * (2 - t);
      }

      if(!dragging) {
        map.panBy([-deltaDistance, 0], {
          easing,
        });
      }

      setTimeout(pan, duration);
    }
  }
}
