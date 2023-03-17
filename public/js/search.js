
let map;
const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBybHZ3Sqy6xYgo-a0VaXMccYAqzkfYEIk&callback=initMap`;
        script.async = true;
document.head.appendChild(script);
let myPlace= [];
let centerLoc;
let details = document.querySelectorAll('button')

function center() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: centerLoc,
    zoom: 13,
  });

  const centerMarker = new google.maps.Marker({
    position: centerLoc,
    map: map,
    icon:'/images/center.png'
  })

  myPlace.forEach(result => {
    const loc = {
        lat: result.lat,
        lng: result.lng
    }
    window.setTimeout(() => {
        const infoWindow = new google.maps.InfoWindow({
          content: `${result.name}`
        });
        const toiletMarker = new google.maps.Marker({
            position: loc,
            map: map,
            icon: '/images/toilet.png',
            animation: google.maps.Animation.DROP,
            title: result.name
        });
        
        toiletMarker.addListener('click', () => {
            map.setZoom(14)
            map.setCenter(toiletMarker.getPosition())
            infoWindow.open({
              anchor: toiletMarker,
              map
            })
            toggleBounce(toiletMarker)
        })
       
    }, myPlace.indexOf(result) * 200)
  })
}

function toggleBounce(marker) {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(() => marker.setAnimation(null), 1500)
}

details.forEach(div => {
  div.addEventListener('click', (e) => {
    const separateId = e.target.id.split(',')
    const lat = parseFloat(separateId[0])
    const lng = parseFloat(separateId[1])

    map.setCenter({ lat: lat, lng: lng })
    map.setZoom(14)
  })
})

window.initMap = center;
