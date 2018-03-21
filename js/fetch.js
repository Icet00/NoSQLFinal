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
  	console.log(data.responseJSON);
  	console.log(feature);
  	for(var i = 0; i < feature.length;i++)
  	{
  		var h3 = feature[i].querySelectorAll("h3")[0];
  		h3.innerHTML = data.responseJSON[i]._id;
  		var h4 = feature[i].querySelectorAll("h4")[0];
  		h4.innerHTML = "Average project value : " + Math.floor(data.responseJSON[i].averageValue);
  		var p = feature[i].querySelectorAll("p")[0];
  		p.innerHTML = "Number of project : " + data.responseJSON[i].count;
  	}
  }
});