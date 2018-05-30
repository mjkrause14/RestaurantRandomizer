    var map;
    var searchBox;
    var infowindow;
    var latitude;
    var longitude;
    var center;
    var markers = Array();
    var restaurants = Array();
    var textRestaurants = Array();

      function initMap() {
        var position = {lat: -33.867, lng: 151.195};

        map = new google.maps.Map(document.getElementById('map'), {
          center: position,
          zoom: 12
        });

        infowindow = new google.maps.InfoWindow();
        navigator.geolocation.getCurrentPosition(locationFound, locationNotFound);
      }

      function searchArea() {
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: getCenter(),
          radius: 5000,
          type: 'restaurant'
        }, callback);
      }

      $(function() {
        $('#createBtn').on('click', function() {
        var place = document.getElementById('restSelect').value;
        var service = new google.maps.places.PlacesService(map);
        service.textSearch({
          location: getCenter(),
          radius: 5000,
          query: place
        }, textCallBack);
      });
    });

      function locationFound(position) {
          var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

          map.setCenter(location);
          var marker = new google.maps.Marker({
              position: location,
              map: map,
              draggable: true,
              icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          });

            setCenter(position.coords.latitude, position.coords.longitude);

          google.maps.event.addListener(marker, 'dragend', function() {
            setCenter(this.position.lat(), this.position.lng());
          })
      }

      function locationNotFound() {
          alert("Not Found");
      }

      function setCenter(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
      }

      function getCenter() {
        return center = new google.maps.LatLng(latitude, longitude)
      }

      function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          clearMarkers();

          for (i in results) {
            createMarker(results[i]);
          }
          createList(results);
        }
      }

      function textCallBack(results, status) {
        if(status === google.maps.places.PlacesServiceStatus.OK) {
            clearMarkers();
            createTextMarker(results);
            addToList(place);
        }
      }

      function createMarker(place) {
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        markers.push(marker);

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }

      function createTextMarker(place) {
        var marker = new google.maps.Marker({
          map: map,
          place: {
            placeId: place.place_id,
            location: place.geometry.location
          }
        });

        markers.push(marker);

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
      }

      function addToList(place) {
        var numRows = textRestaurants.length;
        var tr;
        var tableBody;
        if(document.getElementById('restaurantList')) {
          tableBody = document.getElementById('restaurantBody');
          tr = createTR(place);
          tableBody.appendChild(tr);
          textRestaurants.push(place);
        }
        else {
          var form = document.getElementById('textSearch');
          var div = document.getElementById('resultList');
          var table = document.createElement('table');
          table.id = 'restaurantList';
          table.className = 'table table-striped';
          var tableBody = document.createElement('tbody');
          tableBody.id = "restaurantBody";
          tr = createTR(place);
          tableBody.appendChild(tr);
          textRestaurants.push(place);
          div.appendChild(table);
          var btn = document.createElement('button');
          btn.id = 'textSearchBtn';
          btn.class = 'btn btn-primary btn-lg btn-block';
          form.appendChild(btn);
        }
        clearTextBox();
      }

      function clearTextBox() {
        tb = document.getElementById('restSelect');
        tb.clear();
      }
      
      function clearMarkers() {
        if(markers) {
          for(marker in markers) {
            markers[marker].setMap(null);
          }
          markers = [];
        }
      }

      function createList(places) {
        var numRows = places.length;
        clearList();
        var div = document.getElementById('resultList');
        var table = document.createElement('table');
        table.id = "restaurantList";
        table.className = "table table-striped";
        var tableBody = document.createElement('tbody');

        table.appendChild(tableBody);

        for(i in places) {
          var tr = createTR(places[i]);
          tableBody.appendChild(tr);
          restaurants.push(places[i]);
        }
        div.appendChild(table);
        createButton(div, numRows)
        scrollToTable();
      }

      function createTR(place) {
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        td1.className="col-xs-12 col-md-2";
        var img = document.createElement('img');
        tablePhoto(img, place);
        td1.appendChild(img);
        tr.appendChild(td1);
        var td2 = document.createElement('td');
        td2.className="col-xs-12 col-md-4";
        td2.appendChild(document.createTextNode(place.name));
        tr.appendChild(td2);
        var td3 = document.createElement('td');
        td3.className="col-xs-12 col-md-6";
        td3.appendChild(document.createTextNode(place.vicinity));
        tr.appendChild(td3);
        return tr;
      }

      function clearList() {
        if(document.getElementById('restaurantList')) {
          var table = document.getElementById('restaurantList');
          var btn = document.getElementById('selectButton');
          table.remove();
          btn.remove();
          restaurants = [];
        }
      }

      function createButton(div, numRows) {
        var btn = document.createElement('button');
        btn.id = "selectButton";
        btn.className = "btn btn-success btn-lg btn-block";
        $(btn).attr("data-toggle","modal");
        $(btn).attr("data-target","#myModal");
        btn.addEventListener('click', function() {
          clearPopTable();
          randomSelect(numRows);
        });
        btn.appendChild(document.createTextNode("Select From This List"));
        div.appendChild(btn);
      }
    

      function getPlacePhoto(place) {
        var photos = place.photos;
        if(!photos) {
          return "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png";
        }
        return photos[0].getUrl({'maxWidth': 50, 'maxHeight': 50});
      }

      function clearPopTable() {
        if(document.getElementById('popupTable')) {
          var table = document.getElementById('popupTable');
          table.remove();
        }
      }

      function tablePhoto(img, place) {
        img.id = "restaurantImg";
        img.className = "img-rounded";
        img.src = getPlacePhoto(place);
        img.width = "50";
        img.height = "50";
      }

      function scrollToTable() {
        $('html, body').animate({
          scrollTop: $("#restaurantList").offset().top
        }, 2000);

      }

      function randomSelect(numRestaurants) {
        var selected = Math.floor(Math.random() * numRestaurants)
        getSelectedRow(selected);
      }

      function getSelectedRow(rowNum) {
        var selectedDetails = Array();
        var table = document.getElementById('restaurantList');
        var rows = table.getElementsByTagName('tr');
        for(i = 0; i < rows.length; i++) {
          if(rowNum == rows[i].rowIndex) {
            var cell = rows[i].getElementsByTagName('td');
            for(j = 0; j < cell.length; j++) {
              selectedDetails.push(cell[j].innerHTML);
            }
          }
        }
        getPopupDetails(selectedDetails);
      }

      $(function() {
        $('#btnConfirm').on('click', function() {
          var cell = document.getElementById('popupTable').rows[0].cells[1].innerHTML;
          unhighlightRow();
          highlightRow(cell);
          alterButton();
          $('#myModal').modal('hide');
        });
      });

      function highlightRow(cell) {
        var table = document.getElementById('restaurantList');
        var rows = table.getElementsByTagName('tr');
        for(i = 0; i < rows.length; i++) {
          var highlightCell = rows[i].getElementsByTagName('td');
          if(cell == highlightCell[1].innerHTML) {
            rows[i].className = 'info';
          }
        }
      }

      function unhighlightRow() {
        var table = document.getElementById('restaurantList');
        var rows = table.getElementsByTagName('tr');
        for(i = 0; i < rows.length; i++) {
          rows[i].classList.remove('info');
        }
      }

      function getPopupDetails(details) {
            var div = document.getElementById('modalBody');
            var table = document.createElement('table');
            table.id = "popupTable";
            table.className = "table table-striped";
            var tableBody = document.createElement('tbody');
          
            table.appendChild(tableBody);
          
            for(i in restaurants) {
              if(restaurants[i].name == details[1] ){
                var tr = createTR(restaurants[i]);
                tableBody.appendChild(tr);
                div.appendChild(table);
              }
            }
      }

      function alterButton() {
        var btn = document.getElementById('selectButton');
        btn.innerText = "Reselect From This List";
      }