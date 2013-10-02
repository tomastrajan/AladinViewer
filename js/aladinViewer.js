$(document).ready(function() {
	/*
	http://www.shmu.sk/data/datanwp/teplota/teplota_03102013-00.png
	http://www.shmu.sk/data/datanwp/teplota/teplota_02102013-14.png
	http://www.shmu.sk/data/datanwp/zrazky/zrazky_02102013-15.png
	*/
		
	var baseUrl = "http://www.shmu.sk/data/datanwp/";
	
	
	var imgSize;
	var images = [];
	images["rain"] = [];
	var loadCount = 0;
	var errorCount = 0;
	var animate = true;
	var started = false;
	
	Date.prototype.addHours = function(h){
		this.setHours(this.getHours()+h);
		return this;
	}
	
	init("teplota");
	//init("zrazky");
	
	function init(imgType) {
		images[imgType] = [];
		for (i = 0; i < 24; i++) {
			var url = baseUrl + imgType + "/" + imgType + "_" + getDateString(i, "SHMU") + ".png";
			isValidImageUrl(i, url, imgType);
		}
	}
	
	function isValidImageUrl(i, url, imgType) {
		$("<img>", {
			src: url,
			error: function() { errorCount++; },
			load: function() { 
				addImage(url, imgType); 
				if (loadCount == 23 - errorCount) {
					//alert("LC: " + loadCount + ", EC: " + errorCount);
					imgSize = images[imgType].length;
					changeImage(imgType);
				}
				loadCount++;
			}
		});
	}
	
	function addImage(url, imgType) {
		var img = new Image();
		img.src = url
		var imgHour = url.match("-..");
		imgHour = imgHour.toString().replace("-","");
		images[imgType][imgHour] = img;
	}
	
	var imgId = 0
	function changeImage() {
		if (animate) {
			$("#timer").html(getDateString(imgId, "VIEWER"))
			//$("#zrazky").attr("src", images["zrazky"][imgId].src);
			$("#teplota").attr("src", images["teplota"][getDateString(imgId, "HOUR")].src);
			imgId++;
			if (imgId + 1 == imgSize) {
				imgId = 0;
			}
		}
		window.setTimeout(function() { changeImage() }, 1000)
	}
	
	function getDateString(addHours, formatType) {
		var date = new Date().addHours(addHours);
		var year = date.getFullYear();
		var month = prependZero(date.getMonth() + 1);
		var day = prependZero(date.getDate());
		var hour = prependZero(date.getHours());
		
		if (formatType == "SHMU") {
			return day + month + year+ "-" + hour;
		}
		
		if (formatType == "VIEWER") {
			return hour + ":00 <br />" + day + ". " + month + ". " + year; 
		}
		
		if (formatType == "HOUR") {
			return hour; 
		}
	}
	
	
	$("#pause").click(function() {
		if (animate) {
			$("#pause").html("PLAY");
		} else {
			$("#pause").html("PAUSE");
		}
		animate = !animate;
	});
	
	
	function prependZero(date) {
		if (date.toString().length == 1) {
			date = "0" + date;
		}
		return date;
	}
	
});