
let map;
const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBybHZ3Sqy6xYgo-a0VaXMccYAqzkfYEIk&callback=initMap`;
        script.async = true;


        // Append the 'script' element to 'head'
        document.head.appendChild(script);
let myPlace= [];
function center() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
        lat: 33.964870,
        lng: -117.622340
    },
    zoom: 11,
  });
 
  
  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");

  myPlace.forEach(result => {
    const loc = {
        lat: result.lat,
        lng: result.lng
    }
   console.log(myPlace.indexOf(result))
   window.setTimeout(() => {
        const toiletMarker = new google.maps.Marker({
            position: loc,
            map: map,
            icon: '/images/toilet.png',
            animation: google.maps.Animation.DROP
        })
   }, myPlace.indexOf(result) * 200)
    
  })

    // // Try HTML5 geolocation.
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       const pos = {
    //         lat: position.coords.latitude,
    //         lng: position.coords.longitude,
    //       };

    //       infoWindow.setPosition(pos);
    //       infoWindow.setContent('this is here');
    //       infoWindow.open(map);
    //       map.setCenter(pos);
    //       const marker = new google.maps.Marker({
    //         position: pos,
    //         map: map,
    //         icon: '/images/toilet.png'
    //       });
    //       console.log(pos.lat)
    //     },
    //     () => {
    //       handleLocationError(true, infoWindow, map.getCenter());
    //     }
    //   );
    // } else {
    //   // Browser doesn't support Geolocation
    //   handleLocationError(false, infoWindow, map.getCenter());
    // }
 
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}


window.initMap = center;
