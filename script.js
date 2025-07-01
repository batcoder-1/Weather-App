let apikey="YOUR_API_KEY_HERE";
let apikey1="YOUR_API_KEY_HERE";
const city=document.querySelector("#info-input");
const submit=document.querySelector("#info-submit");

function degToCompass(num) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round(num / 45) % 8;
    return directions[index];
}

try {
submit.addEventListener("click", async(evt) => {
    evt.preventDefault();
    document.getElementById("loading").style.display = "flex";
    loading.style.flexDirection = "column";
    loading.style.justifyContent = "center";
    loading.style.alignItems = "center";
    document.getElementById("output").style.display = "none";

    const defaultDiv = document.getElementById("default");
    if (defaultDiv) {
        defaultDiv.style.display = "none";
    }
    const inputVal = city.value.trim();
    if (!/^[a-zA-Z\s]+$/.test(inputVal)) {
        alert("Please enter a valid city name (letters only, no numbers or symbols).");
        document.getElementById("loading").style.display = "none";
        defaultDiv.style.display = "flex";
        defaultDiv.style.flexDirection = "column";
        defaultDiv.style.alignItems = "center";
        return;
    }

    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${inputVal}&appid=${apikey}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    if (data.length == 0 || data.message === "Nothing to geocode") {
        alert("Enter valid City or check internet connection");
        document.getElementById("loading").style.display = "none";
        defaultDiv.style.display = "flex";
        defaultDiv.style.flexDirection = "column";
        defaultDiv.style.alignItems = "center";
        return;
    }

    let latitude = data[0].lat;
    let longitude = data[0].lon;
    const url2 = `https://api.timezonedb.com/v2.1/get-time-zone?key=8PGEEXPMKQZE&format=json&by=position&lat=${latitude}&lng=${longitude}`;
    let response2 = await fetch(url2);
    let time = await response2.json();
    let format = time.formatted;
    const date = new Date(format + 'Z'); 
    const hour = date.getUTCHours();

    const url1 = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`;
    let response1 = await fetch(url1);
    let data1 = await response1.json();
    let city1 = document.querySelector("#city-name");
    let img = document.querySelector("#city-weather-img");

    if (data1.weather[0].description == "overcast clouds") {
        img.src = "images/clouds.png";
    }
    else if (data1.weather[0].main == "Clear") {
        img.src = hour < 19 && hour >= 7 ? "images/sun.png" : "images/half-moon.png";
    }
    else if (data1.weather[0].main == "Rain") {
        img.src = "images/rain.png";
    }
    else if (data1.weather[0].description == "broken clouds") {
        img.src = hour < 19 && hour >= 7 ? "images/sun(1).png" : "cloudy-night.png";
    }
    else if (data1.weather[0].main == "Snow") {
        img.src = "images/snow.png";
    }
    else{
      img.src = hour < 19 && hour >= 7 ? "images/sun.png" : "images/half-moon.png";
    }

    let cityvalue = String(city.value);
    city1.innerHTML = cityvalue.charAt(0).toUpperCase() + cityvalue.slice(1);
    let temp = document.querySelector(".temp-value");
    let feels = document.querySelector("#feels");
    let degree = document.createElement("sup");
    degree.innerHTML = (" ");
    let degree1 = document.createElement("sup");
    degree1.innerHTML = (" ");
    let temperature = data1.main.temp;
    temp.innerHTML = Math.round(temperature);
    temp.append(degree1);
    feels.innerHTML = `Feels Like - ${Math.round(data1.main.feels_like)}`;
    feels.append(degree);

    let sunr = document.querySelector("#sunrise");
    let suns = document.querySelector("#sunset");
    let sunsett = data1.sys.sunset * 1000;
    let sunriset = data1.sys.sunrise * 1000;

    let options = {
        timeZone: time.zoneName,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    let sunsetTime = new Date(sunsett).toLocaleTimeString('en-US', options);
    let sunriseTime = new Date(sunriset).toLocaleTimeString('en-US', options);

    sunr.innerHTML = `Sunrise - ${sunriseTime}`;
    suns.innerHTML = `Sunset - ${sunsetTime}`;

    let humidity = document.querySelector("#humidity");
    let image = document.createElement("img");
    image.src = "images/humidity.png";
    humidity.prepend(image);
    humidity.innerHTML = `${data1.main.humidity}%`;

    let windSpeed = data1.wind.speed;
    let windDeg = data1.wind.deg;
    let windDir = degToCompass(windDeg);
    let wind = document.querySelector("#wind");
    wind.innerHTML = `${windSpeed}m/s ${windDir}`;

    document.getElementById("loading").style.display = "none";
    document.getElementById("output").style.display = "block";
});
} catch (error) {
    console.log("Enter valid City or check internet connection");
}
