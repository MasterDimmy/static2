	  var map;
      function initMap() {
        function addMarker(company) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(company.position_X, company.position_Y),
            icon: {
				url: company.icon,
				scaledSize: new google.maps.Size(90, 59), // scaled size
				origin: new google.maps.Point(0,0), // origin
				anchor: new google.maps.Point(0, 0) // anchor
			},
            map: map
          });
        }
		
	  map = new google.maps.Map(document.getElementById('map'), {
          zoom: 5,
          center: companies.position,
          mapTypeId: 'roadmap'
        });

		//замещаем маркеры
        for (var i = 0, company; company = companies[i]; i++) {
          addMarker(company);
        }

		//легенда
        var legend = document.getElementById('legend');
        for (var key in companies) {
          var company = companies[key];
          var name = company.name;
          var icon = company.icon2;
		  var tooltip = `<div><p>${company.address}</p><p>${company.phone}</p></div>`;
          var div = document.createElement('div');
          div.innerHTML = `<div onclick="document.location.href='/details.html?id=`+company.id+`';" class="legend_item" data-toggle="tooltip" data-placement="right" data-html="true" title="`+tooltip+'"><img src="' + icon + '" width="40px"> <span class="padding-left-5">' + name+'</span></div>';
          legend.appendChild(div);
        }

        map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
		
		var latlngbounds = new google.maps.LatLngBounds();
		for (var i = 0; i < companies.length; i++) {
			latlngbounds.extend(new google.maps.LatLng(companies[i].position_X, companies[i].position_Y));
		}
		map.fitBounds(latlngbounds);
		
		document.getElementById("legend").style.display = "block";
      }
