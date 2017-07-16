$(document).ready(function() {

	if(navigator.geolocation)
		navigator.geolocation.getCurrentPosition(onPositionReceived, locationNotReceived);

    ClickEvents();
});

function onPositionReceived(position){
	GetData(position);
	$(".coffeeShopsContainer").fadeIn(500);
}

function locationNotReceived(positionError){
	console.log(positionError);
	$(".modal").modal("show");
}

function GetData(position){
	var url = "https://api.foursquare.com/v2/venues/explore?sortByDistance=1&venuePhotos=1";

	var date = new Date();
	date = date.toISOString().slice(0,10).replace(/-/g,"");
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var categoryId = "4bf58dd8d48988d1e0931735";
	var client_id = "FM5EDZ2HRALXS0O2P1BHLD3GFZK42PQAMPHK44BS1E0SM0HL";
	var client_secret = "2IRQ15USEOB2FRA4V1VXNCUCHESHLODNUBOQJZHA2TWCW2OT";

	url += "&categoryId=" + categoryId;
	url += "&ll=" + latitude + "," + longitude;
	url += "&client_id=" + client_id;
	url += "&client_secret=" + client_secret;
	url += "&v=" + date;
	url += "&radius=" + "1000";
	url += "&limit=" + "10";
	url += "&openNow=1";


	$.getJSON(url, function(data) {
			PrintData(data);
    	}
    );
}

function ClickEvents(){

	$('#list').click(function(event){
    	event.preventDefault();
    	$(document).find('#resultContainer .item').addClass('list-group-item');
    });

    $('#grid').click(function(event){
    	event.preventDefault();
    	$(document).find('#resultContainer .item').removeClass('list-group-item');
    	$(document).find('#resultContainer .item').addClass('grid-group-item');
    });
}

function PrintData(data){

    if(data.response.groups[0].items.length != 0) {
		var itemTemplate = '<div class="item  col-xs-12 col-lg-6">';
	      	itemTemplate +=  '<div class="thumbnail">';
	        itemTemplate +=  '<img class="group list-group-image" src="{0}" alt="" />';
	        itemTemplate +=  '<div class="caption">';
	        itemTemplate +=  '<h4 class="group inner list-group-item-heading">{1}</h4>';
	        itemTemplate +=  '<p class="group inner list-group-item-text"> Marked as {2}</p>';
	        itemTemplate +=  '<div class="row">';
	        itemTemplate +=  '<div class="col-xs-12 col-md-6">';
	        itemTemplate +=  '<p class="lead">{3} meters away from you</p>';
	        itemTemplate +=  '</div>';
	        itemTemplate +=  '</div>';
	        itemTemplate +=  '</div>';
	        itemTemplate +=  '</div>';
	        itemTemplate +=  '</div>';

	    var items = "";

		$.each(data.response.groups[0].items, function(e,v){
			var venue = v.venue;
			var photo = v.venue.featuredPhotos.items[0];
			items += String.format(itemTemplate, photo.prefix + "400x250"+ photo.suffix, venue.name, venue.price.message, venue.location.distance);
		});

		$("#resultContainer").html(items);
	}
	else
	{
		$(".modalTitle").text("Info");
		$(".modalMessage").text("It seems there are no open Coffee shops near you.");
		$("modal").modal("show");
	}
}

String.format = function() {
  var s = arguments[0];
  for (var i = 0; i < arguments.length - 1; i++) {       
    var reg = new RegExp("\\{" + i + "\\}", "gm");             
    s = s.replace(reg, arguments[i + 1]);
  }

  return s;
}