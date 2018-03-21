//To refresh the scroll down at page relaod
$(document).ready(function(){
    $(this).scrollTop(0);
});


$.ajax({
  url: '/db/maxValue',
  type: 'GET',
  complete: function(data) {
  	var feature = document.getElementsByClassName("feature-inner");
  	//Arrange the first one at the right place
  	var tmp = data.responseJSON[1];
	data.responseJSON[1] = data.responseJSON[0];
	data.responseJSON[0] = tmp;

	//Insert in html
  	for(var i = 0; i < feature.length;i++)
  	{
  		var h3 = feature[i].querySelectorAll("h3")[0];
  		h3.innerHTML = data.responseJSON[i].permits.APPL_TYPE;
  		var h4 = feature[i].querySelectorAll("h4")[0];
  		h4.innerHTML = data.responseJSON[i].permits.CONTRACTOR;
  		var h2 = feature[i].querySelectorAll("h2")[0];
  		h2.innerHTML = data.responseJSON[i].permits.VALUE_unit;
  		var p = feature[i].querySelectorAll("p")[0];
  		p.innerHTML = data.responseJSON[i].permits.DESCRIPTION;
  	}
  }
});

$.ajax({
  url: '/db/avgTotal',
  type: 'GET',
  complete: function(data) {
  	var value = [data.responseJSON[0].averageValue_unit, data.responseJSON[0].averageCost_unit, data.responseJSON[0].count, data.responseJSON[0].averageTotal_unit];
  	var counter = document.getElementsByClassName("counter js-counter");
  	for(var i = 0; i < counter.length;i++)
  	{
  		counter[i].dataset.to = value[i];
  	}
  }
});

$.ajax({
  url: '/db/contractMax',
  type: 'GET',
  complete: function(data) {
  	var feature = document.getElementsByClassName("feature-center animate-box");
  	for(var i = 0; i < feature.length;i++)
  	{
  		var h3 = feature[i].querySelectorAll("h3")[0];
  		h3.innerHTML = data.responseJSON[i]._id;
  		var h4 = feature[i].querySelectorAll("h4")[0];
  		h4.innerHTML = "Average project value : " + Math.floor(data.responseJSON[i].averageValue);
  		var p = feature[i].querySelectorAll("p")[0];
  		p.innerHTML = "Number of projects : " + data.responseJSON[i].count;
  	}
  }
});

$.ajax({
  url: '/db/municipality',
  type: 'GET',
  complete: function(data) {
  	var feature = document.getElementsByClassName("feature-left animate-box");
  	data.responseJSON.sort(function(a, b)
  	{
  		if (a.count < b.count)
	    	return 1;
		if (a.count > b.count)
		    return -1;
		return 0;
  	});
  	for(var i = 0; i < feature.length;i++)
  	{
  		var h3 = feature[i].querySelectorAll("h3")[0];
  		h3.innerHTML = data.responseJSON[i]._id;
  		var p = feature[i].querySelectorAll("p")[0];
  		p.innerHTML = "Number of project : " + data.responseJSON[i].count;
  		if(data.responseJSON[i].count < 1000)
  		{
  			var icon = feature[i].querySelectorAll("span")[0].querySelectorAll("i")[0] ;
  			icon.classList.remove('icon-check');
  			icon.classList.add('icon-cross');
  		}
  	}
  }
});

function submit()
{
	var municipality = document.getElementById('municipality').value;
	var description = document.getElementById('description').value;
	var appl_type = document.getElementById('appl_type').value;
	var value = document.getElementById('value').value;
	if(!Number.isInteger(value))
	{
		value = 0;
	}
	console.log(municipality + " - " + description + " - " + appl_type + " - " + value);
	var json = { municipality: municipality, description: description, appl_type: appl_type, value:value };
	$.post( '/db/search', json)
	.done(function(data) {
	    console.log(data);
	    var feature = document.getElementsByClassName("card");
	    console.log(feature);
	    for(var i = 0; i < feature.length;i++)
	  	{
	  		var h3 = feature[i].querySelectorAll("h3")[0];
	  		h3.innerHTML = data[i].permits.CONTRACTOR;
	  		var h4 = feature[i].querySelectorAll("h3")[1];
	  		h4.innerHTML = data[i].permits.ISSUED_DATE;
	  		var p = feature[i].querySelectorAll("p")[0];
	  		p.innerHTML = data[i].properties.location;
	  	}
	});
}