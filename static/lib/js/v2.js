function prepareAllEvents(eventsList){

	/*currently for single events we use this:
		{date: '', sourceRank: , sourceId: , articleURL}

		Making a dictionary
		
		Broad level dictionary, collects all data at once. Contains: Event Groups + Ticker value combination
		<event group, [{date: '', sourceRank: "", sourceId: "", articleURL: ""}, {date: '', sourceRank: "", sourceId: "", articleURL: ""}] >

		Event level dictionary, Collects only when required. Conatins: specific event  + ticker value combination
		<event name, [{date: '', sourceRank: "", sourceId: "", articleURL: ""}, {date: '', sourceRank: "", sourceId: "", articleURL: ""}] >
	*/

	var dataHighMap = {};
	var tempDataMap = [];
	
	_.each(masterData, function(root, index, list){
		_.each(root.entities, function(entity, index, list){

			if(entity.ticker == srch){//Collect only searched company's events

				var dataMap = { //Common attributes
					date: new Date(root.harvested_at.$date)
					, sourceRank: 	root.overall_source_rank
					, sourceId: root.source_id
					, articleURL: root.article_url
				};

				_.each(root.event_groups, function(eventGroup, index, list){

					if(dataHighMap[eventGroup.group] == undefined){
						//Group does not exist in the dictionary
						dataHighMap[eventGroup.group] = [];
					}

					dataHighMap[eventGroup.group].push(dataMap);
				});
			}
		});/*--Root ends--*/

	});/*--Main master data _.each ends--*/

	//console.log(dataHighMap["Business Concerns"]); //["Accounting Actions"][0][0].date
	//console.log(dataMap);

	drawAllEvents(dataHighMap);
}


function drawAllEvents(dataHighMap){

	$("#pnlPlot").empty();

	console.log("Now plotting v2.0");

	//console.log(temp);
	var uniqDates = [];

	//Collect unique dates
	_.each(dataHighMap, function(root, index, list){
		_.each(root, function(element, eIndex, eList){

			var d =  new Date(element.date);
			d.setHours(0,0,0);
			uniqDates.push(d);
		});
	});

	//Filtering out unique 
	uniqDates = _.uniq(uniqDates, function(d){ return d.setHours(0,0,0); });

	//console.log(uniqDates);
	
	var filterPrice = [];
	 _.each(priceData[srch], function(d){
		_.each(uniqDates, function(element){
			//console.log(element);
			/*console.log(new Date(d.date));
			console.log("vs");
			console.log(element);*/
			if(element.getTime() == new Date(d.date).getTime()){
				
				filterPrice.push(d);
			}
		})
	});

	//console.log("filter");
	//console.log(filter);

	_.each(dataHighMap, function(root, index, list){

		drawSingleScatter(root, index, filterPrice)
	});
}

function getPriceDataAndPrepareEvents(){

	//Get CSV Data
	d3.csv("static/PriceData/" + srch.toLowerCase() + ".csv", function(error, data){
		if(error){
			//Erorr occured
			console.log(error);
		}
		else{
			//console.log(data);
			
			_.each(data, function(element, index, list){

				if(element.Change.toLowerCase() != "closed" && element.Change.toLowerCase() != ""){

					//console.log(element.Date);
					var tempPriceData = {
						date: new Date(element.Date)
						, change: element.Change
					};

					//console.log(tempPriceData);

					if(priceData[srch] == undefined){
						//Group does not exist in the dictionary
						priceData[srch] = [];
					}

					priceData[srch].push(tempPriceData);
				}
								
			});

			//console.log(priceData);

			//Populate event groups to select from
    			makeAList(events);
		}

	});
}