async function RenderCanvas() {
    
    let adatok=[]
    try{
        let res = await fetch(`${SERVER_URL}/weather`)
        weathers = await res.json();

        weathers.forEach(weather => {
            ujObj={
                label: weather.date,
                y:[Number(weather.min),Number(weather.max)],
                name: weather.type
            }
            adatok.push(ujObj)
        });
    }
    catch(err){
        console.log(err)
    }



    var chart = new CanvasJS.Chart("chartContainer", {            
        title:{
            text: "Weekly Weather Forecast"              
        },
        axisY: {
            suffix: " °C",
            maximum: 40,
            gridThickness: 0
        },
        toolTip:{
            shared: true,
            content: "{name} </br> <strong>Temperature: </strong> </br> Min: {y[0]} °C, Max: {y[1]} °C"
        },
        data: [{
            type: "rangeSplineArea",
            fillOpacity: 0.1,
            color: "#91AAB1",
            indexLabelFormatter: formatter,
            dataPoints: adatok
        }]
    });
    chart.render();
    
    var images = [];    
    
    addImages(chart);
    
    function addImages(chart) {
        for(var i = 0; i < chart.data[0].dataPoints.length; i++){
            var dpsName = chart.data[0].dataPoints[i].name;
            if(dpsName == "Felhős"){
                images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/cloudy.png"));
            } else if(dpsName == "Esős"){
            images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/rainy.png"));
            } else if(dpsName == "Napos"){
                images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/sunny.png"));
            }
    
        images[i].attr("class", dpsName).appendTo($("#chartContainer>.canvasjs-chart-container"));
        positionImage(images[i], i);
        }
    }
    
    function positionImage(image, index) {
        var imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[index].x);
        var imageTop =  chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);
    
        image.width("40px")
        .css({ "left": imageCenter - 20 + "px",
        "position": "absolute","top":imageTop + "px",
        "position": "absolute"});
    }
    
    $( window ).resize(function() {
        var cloudyCounter = 0, rainyCounter = 0, sunnyCounter = 0;    
        var imageCenter = 0;
        for(var i=0;i<chart.data[0].dataPoints.length;i++) {
            imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
            if(chart.data[0].dataPoints[i].name == "cloudy") {					
                $(".cloudy").eq(cloudyCounter++).css({ "left": imageCenter});
            } else if(chart.data[0].dataPoints[i].name == "rainy") {
                $(".rainy").eq(rainyCounter++).css({ "left": imageCenter});  
            } else if(chart.data[0].dataPoints[i].name == "sunny") {
                $(".sunny").eq(sunnyCounter++).css({ "left": imageCenter});  
            }                
        }
    });
    
    function formatter(e) { 
        if(e.index === 0 && e.dataPoint.x === 0) {
            return " Min " + e.dataPoint.y[e.index] + "°";
        } else if(e.index == 1 && e.dataPoint.x === 0) {
            return " Max " + e.dataPoint.y[e.index] + "°";
        } else{
            return e.dataPoint.y[e.index] + "°";
        }
    } 
    
}