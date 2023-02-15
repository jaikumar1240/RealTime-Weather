"use strict"
const key = "82005d27a116c2880c8f0fcb866998a0";
const locationName = document.querySelector("[data-location]")
const temperature = document.querySelector("[data-temp]")
const minTemp = document.querySelector("[data-minTemp]")
const maxTemp = document.querySelector("[data-maxTemp]")
const tempUnit = document.querySelectorAll('.--unit');
const pressure = document.querySelector("[data-pressure]")
const humidity = document.querySelector("[data-humidity]")
const visibility = document.querySelector('[data-visibility]')
const windSpeed = document.querySelector('[data-wSpeed]')
const windDir = document.querySelector('[data-wDir]')
const weathercode = document.querySelector('[data-weathercode]')
const windDirAngle = document.querySelector('[data-winDirAngle');
const allBtn = document.querySelectorAll(".btn-graph")
let isDegree = true;
let current;
let completeData;
let coordinates = window.navigator.geolocation.getCurrentPosition((result) => {
    let lat = result.coords.latitude;
    let long = result.coords.longitude;
    if (lat && long) {
        getWeather(lat, long);
    }
});

async function getWeather(lat, long) {
    // let api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}`;
    let api = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,weathercode&timezone=auto&hourly=temperature_2m,pressure_msl,cloudcover,precipitation,visibility,relativehumidity_2m,apparent_temperature&current_weather=true`
    let data = await fetch(api)
    let res = await data.json()
    console.log(res);
    // locationName.innerText = res.name;
    current = res.current_weather;
    completeData = res;
    chart();
    temperature.innerText = current.temperature;
    weathercode.innerText = WeatherInterpretationCodes[current.weathercode];
    windSpeed.innerText = current.windspeed + ' km/h';
    windDir.innerText = current.winddirection + '°';
    windDirAngle.style.transform = `rotate(${current.winddirection}deg)`
    minTemp.innerText = res.daily.temperature_2m_min[0];
    maxTemp.innerText = res.daily.temperature_2m_max[0];
    const currentTimeHour = new Date().getHours()
    pressure.innerText = res.hourly.pressure_msl[currentTimeHour - 1] + ' ' + res.hourly_units.pressure_msl;
    humidity.innerText = res.hourly.relativehumidity_2m[currentTimeHour - 1] + ' ' + res.hourly_units.relativehumidity_2m;
    visibility.innerText = res.hourly.visibility[currentTimeHour - 1] + ' ' + res.hourly_units.visibility;
    const weatherDiv = document.querySelector('.daily-weather-div');
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    res.daily.sunrise.forEach((x, i = 0) => {
        let completeSpan = weatherDiv.appendChild(document.createElement('div'));
        completeSpan.classList.add('single-daily-span')
        let maxTemp = completeSpan.appendChild(document.createElement('span'));
        maxTemp.innerText = res.daily.temperature_2m_max[i];
        maxTemp.style.fontSize = '3rem';
        maxTemp.style.fontWeight = '700';
        let minTemp = completeSpan.appendChild(document.createElement('span'));
        minTemp.innerText = res.daily.temperature_2m_min[i];
        let weatherImg = completeSpan.appendChild(document.createElement('img'));//need to make this dynamic
        weatherImg.setAttribute('src', 'icons/day.svg')
        // weatherImg.innerText = WeatherInterpretationCodes[res.daily.weathercode[i]]; 
        let weatherCode = completeSpan.appendChild(document.createElement('span'));
        weatherCode.innerText = WeatherInterpretationCodes[res.daily.weathercode[i]];
        let date = completeSpan.appendChild(document.createElement('span'));
        date.innerText = new Date(x).getDate() + ' ' + month[new Date(x).getMonth()].substring(0, 3);
        i++;
    })

}

temperature.addEventListener('click', () => {
    if (!isDegree) {
        temperature.innerText = farToCel(temperature.innerText);
        tempUnit.forEach(x => {
            x.setAttribute('data-tempUnit', '°C')
        })
        minTemp.innerText = farToCel(minTemp.innerText);
        maxTemp.innerText = farToCel(maxTemp.innerText);
        // temperature.appendChild('C');
        isDegree = true;
    }
    else {
        temperature.innerText = celToFar(temperature.innerText);
        tempUnit.forEach(x => {
            x.setAttribute('data-tempUnit', '°F')
        })
        minTemp.innerText = celToFar(minTemp.innerText);
        maxTemp.innerText = celToFar(maxTemp.innerText);
        isDegree = false;
    }

})

function celToFar(data) {
    return ((data * 1.8) + 32).toFixed(1);
}

function farToCel(data) {
    return ((data - 32) * 0.5556).toFixed(1);
}


allBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        allBtn.forEach(btn1 => {
            btn1.classList.remove('btn-selected')
        })
        btn.classList.add('btn-selected')
        root.dispose();
        chart(btn.getAttribute('data-graphType'))
    })
})

let WeatherInterpretationCodes = {
    0: 'Clear sky',
    1:
        'Mainly clear',
    2:
        'Partly cloudy',
    3:
        'Overcast',
    45:
        'Fog',
    48:

        'Depositing rime fog',
    51:
        'Drizzle: Light',
    53:

        'Drizzle: Moderate',
    55:
        'Drizzle: Dense',
    56:
        'Freezing Drizzle: Light',
    57:
        'Freezing Drizzle: Dense',
    61:
        'Rain: Slight',
    63:
        'Rain: moderate',
    65: 'Rain: heavy',
    66:
        'Freezing Rain: Light',
    67:
        'Freezing Rain: Heavy',
    71:
        'Snow fall: Slight',
    73: 'Snow fall: moderate',
    75: 'Snow fall: Heavy',
    77: 'Snow fall: Snow grains',
    80:
        'Rain showers: Slight',
    81:
        'Rain showers: Moderate',
    82:
        'Rain showers: Violent',
    85:
        'Snow showers: slight',
    86:
        'Snow showers: heavy',
    95: 'Thunderstorm: Slight or moderate',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
}
var root;
function chart(chartType = 'temperature_2m') {
    root = am5.Root.new("chartdiv");

    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element


    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
        am5themes_Animated.new(root)
    ]);


    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true
    }));


    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "none"
    }));
    cursor.lineY.set("visible", false);


    // Generate random data
    var date = new Date();
    date.setHours(0, 0, 0, 0);
    var value = 100;

    function generateData(i) {
        // value = Math.round((Math.random() * 10 - 5) + value);
        value = completeData.hourly[chartType][i];
        am5.time.add(date, "hour", 1);
        return {
            date: date.getTime(),
            value: value
        };
    }

    function generateDatas() {
        var data = [];
        for (var i = 0; i < completeData.hourly[chartType].length; ++i) {

            data.push(generateData(i));
        }
        return data;
    }


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
        maxDeviation: 0.2,
        baseInterval: {
            timeUnit: "hour",
            count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {})
    }));

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(am5xy.LineSeries.new(root, {
        name: "Series",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        valueXField: "date",
        tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}"
        })
    }));


    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
        orientation: "horizontal"
    }));


    // Set data
    var data = generateDatas(7);
    series.data.setAll(data);


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);

};