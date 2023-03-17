
let map;
const infoDiv = document.querySelector('#info-container')
const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBybHZ3Sqy6xYgo-a0VaXMccYAqzkfYEIk&callback=initMap&libraries=places`;
        script.async = true;
        document.head.appendChild(script);
let myPlace;
function center() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: myPlace,
    zoom: 12,
  });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
          const marker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: '/images/center.png'
          });
          nearMe(pos.lat, pos.lng)
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
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

function nearMe(lat, lng) {
  const center = new google.maps.LatLng(lat, lng)
  const request = {
    location: center,
    radius: 8000,
    keyword: ['public toilet']
  }
  const service = new google.maps.places.PlacesService(map)
  service.nearbySearch(request, logResults)

}

function logResults(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      const loc = {
        lat: results[i].geometry.location.lat(),
        lng: results[i].geometry.location.lng()
      }
      addCards(results[i], loc)
      
      window.setTimeout(() => {
        const infoWindow = new google.maps.InfoWindow({
          content: `${results[i].name}`
        });
        const toiletMarker = new google.maps.Marker({
            position: loc,
            map: map,
            icon: '/images/toilet.png',
            animation: google.maps.Animation.DROP,
            title: results[i].name
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
      }, i * 200)
    }
      let details = document.querySelectorAll('.bathroom-btn button')
      details.forEach(div => {
      div.addEventListener('click', (e) => {
        const separateId = e.target.id.split(',')
        const lat = parseFloat(separateId[0])
        const lng = parseFloat(separateId[1])
        
        map.setCenter({ lat: lat, lng: lng })
        map.setZoom(14)
      })
    })
  }
}

function addCards(result, loc) {
  const geocoder = new google.maps.Geocoder()
  const cardDiv = document.createElement('div')
  const title = document.createElement('h3')
  const form = document.createElement('form')
  const address = document.createElement('p')
  const input = document.createElement('input')
  const btnDiv = document.createElement('div')
  const button = document.createElement('button')
  const btnImg = document.createElement('img')

  cardDiv.classList.add('bathroom-details')
  title.innerText = `${result.name}`
  form.method = 'POST'
  form.action = `/bathroom/create/${result.place_id}`
  input.type = 'submit'
  input.value = 'more info'
  form.appendChild(input)
  btnDiv.classList.add('bathroom-btn')
  btnImg.id = `${result.geometry.location.lat()}, ${result.geometry.location.lng()}`
  btnImg.src = '/images/target.png'
  button.appendChild(btnImg)
  btnDiv.appendChild(button)

  geocoder
    .geocode({ location: loc })
    .then(response => {
      if(response.results[0]) {
        address.innerHTML = `<i>${response.results[0].formatted_address}</i>`
      } else {
        console.log('no results found')
      }
      
    })
    .catch(err => console.log(err))
  
  cardDiv.append(title, address, form, btnDiv)
  infoDiv.append(cardDiv)
}
function toggleBounce(marker) {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(() => marker.setAnimation(null), 1500)
}


window.initMap = center;
