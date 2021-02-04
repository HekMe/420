
function getLocation() {
  if (navigator.geolocation) {
    console.log(navigator.geolocation.getCurrentPosition());
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function initialize() {
  const updateChannel = new BroadcastChannel("precache-channel");
  updateChannel.addEventListener("onmessage", event => {
    console.log("update precache")
    if (confirm("New content is available!. Click OK to refresh")) {
      window.location.reload();
    }
  });
  
  if(document.location.hostname.indexOf(".life")>-1){
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  
    gtag('config', 'UA-150086090-1');
    console.log("Loading UA-150086090-1");
  }
  else if(document.location.hostname.indexOf(".live")>-1){
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  
    gtag('config', 'UA-150086090-2');
    console.log("Loading UA-150086090-2");
  }
  else if(document.location.hostname.indexOf(".today")>-1){
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  
    gtag('config', 'UA-150086090-3');
    console.log("Loading UA-150086090-3");
  } else {
    console.log("Could not load Analytics");
  }

  String.prototype.regexIndexOf = function(regex, startpos) {
    var indexOf = this.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
  }

  String.prototype.regexLastIndexOf = function(regex, startpos) {
    regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : ""));
    if(typeof (startpos) == "undefined") {
      startpos = this.length;
    } else if(startpos < 0) {
      startpos = 0;
    }
    var stringToWorkWith = this.substring(0, startpos + 1);
    var lastIndexOf = -1;
    var nextStop = 0;
    while((result = regex.exec(stringToWorkWith)) != null) {
      lastIndexOf = result.index;
      regex.lastIndex = ++nextStop;
    }
    return lastIndexOf;
  }
  
  //WE.tileLayerJSON('http://4-2-0.life/MapStyle.json').addTo(earth);
  
  //var API_KEY = '37GYP82PUDMD';
  var API_KEY = 'AIzaSyAXeWr2erBsMxEiOat2vdy5MrqVgsoh1Uo';
  var xhr = new XMLHttpRequest();
  //var url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&fields=""&by=zone&zone=${getCookie("tz")}`
  var url = `https://maps.googleapis.com/maps/api/geocode/json?key=${API_KEY}&address=${getCookie("tz")}`;
  
  xhr.open("GET", url);
  xhr.responseType = 'json';
  xhr.send();
  
  xhr.onload=()=>{
    var result = xhr.response;
    console.log(result);
    var lat = (result.results[0].geometry.location.lat).toPrecision(3);
    var lgn = (result.results[0].geometry.location.lng).toPrecision(3);
    addGlobe(lat,lgn);
    getWeather(lat,lgn);
  }
}

function addGlobe(lat,lgn){
  var zoom = window.screen.width < 1000 ? 2 : 3;
  var options = {atmosphere: true, center: [lat, lgn], zoom: zoom};
  var earth = new WE.map('earth_div', options);
  WE.tileLayer('https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png',{
    attribution: ''
  }).addTo(earth);
  
  WE.marker([lat, lgn]/*, "./assets/pointer.svg", 15, 15*/).addTo(earth);
  
  /*var before = null;
  requestAnimationFrame(function animate(now) {
    var elapsed = before? now - before: 0;
    var c = earth.getPosition();
    before = now;
    earth.setCenter([c[0], c[1] + 0.1*(elapsed/3600)]);
    requestAnimationFrame(animate);
  });*/
}

function getWeather(lat, lgn){
  var xhr = new XMLHttpRequest();
  var url = `https://api.openweathermap.org/data/2.5/weather?appid=b43a00fa0f2e805a31497486022a4495&units=metric&lat=${lat}&lon=${lgn}`

  xhr.open("GET", url);
  xhr.responseType = 'json';
  xhr.send();

  xhr.onload=()=>{
    result = xhr.response;
    document.getElementById("temp").innerText = `Current temperature in ${getCookie("tz")} is ${result.main.temp}C`;
    document.getElementById("humidity").innerText = `Current Humidity is ${result.main.humidity}%`;
    document.getElementById("weather").innerText = `${result.weather[0].main}`;
  }
}

var localCountDown;
var tzCountDown
var localTime;
var tzTime;

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var tz = getCookie("tz");
  if (tz != "") {
  } else {
    tz = getTz();
    if (tz != "" && tz != null) {
      setCookie("tz", tz);
      setTimeout(()=>{window.location.reload}, 1000);
    }
  }
}

function setCookie(pLabel, pVal)
{
 var tExpDate=new Date();
 tExpDate.setTime( tExpDate.getTime()+(moment(new moment(moment.tz(getTz()).format('YYYY-MM-DD[T16:20:00]Z')).diff(new moment(moment.tz(getTz()).format()))).subtract(1,'H').add(1, 'm').format('mm')*60*1000) );
 document.cookie = pLabel + "=" + escape(pVal) +( ";expires="+ tExpDate.toString() );
}

function getLocalTime(){
  localTime = setInterval(()=>{
    document.getElementById('localtime').innerText = moment().format('hh:mm:ss a');
  }, 100)
}

function getTzTime(){
  var tz = getCookie("tz")
  if(getCookie("tz") == ""){
    checkCookie()
    setTimeout(()=>{
      window.location.reload();
    }, 2000)
  }
  document.getElementById("tztimetext").innerText = "Current local time in Timezone: " + tz
  clearInterval(tzTime)
  tzTime = setInterval(()=>{
    document.getElementById('tztime').innerText = moment.tz(tz).format("hh:mm:ss a");
    if(moment.tz(getCookie("tz")).format("hh:mm:ss a").indexOf("04:19:45") === 0 || moment.tz(getCookie("tz")).format("hh:mm:ss a").regexIndexOf("04:19:4[5-9]") === 0){
      setupRain();
      setTimeout(()=>{document.cookie = 'tz=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';}, 120000);
    };
  }, 100)
}

function getLocalCountDown(){
  localCountDown = setInterval(()=>{
    var now = new moment().utc()
    var t420 = new moment(moment(moment().format("DD/MM/YYYY") + " 16:20:00.000", "DD/MM/YYYY HH:mm:ss.SSS")).utc()
  
    document.getElementById("localcountdown").innerText = "t - " + moment(t420.diff(now)).subtract(1, "h").format('HH:mm:ss')
  },10)
}

function getTzCountDown(){
  var tz = getCookie("tz")
  if(getCookie("tz") == ""){
    checkCookie()
    setTimeout(()=>{
      window.location.reload();
    }, 2000)
  }
  document.getElementById("tzcountdowntext").innerText = "Time till 4:20 in Timezone: " + tz
  clearInterval(tzCountDown)
  tzCountDown = setInterval(()=>{
    var now = moment().tz(tz).format()
    var t420 = moment().tz(tz).format('YYYY-MM-DD[T16:20:00]Z')
    
    document.getElementById("tzcountdown").innerText = "t - " + moment(new moment(t420).diff(new moment(now))).subtract(1,'H').format('HH:mm:ss')
    
    /* if(moment.tz(getCookie("tz")).format("hh:mm:ss a").indexOf("04:20:01") === 0){document.cookie = 'tz=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';} */
  },10)
}

function getCookieExpired(){
  cookieExpiration = setInterval(()=>{
    if(getCookie("tz") == ""){
      checkCookie()
      setTimeout(()=>{
        window.location.reload();
      }, 100)
    }
  }, 1000)
}

function getTz(){
  var arr = []
  moment.tz.names().forEach((v,i)=>{
    if(moment().utc().tz(moment.tz.names()[i]).format('HH:mm:ss').split(":").reduce((k,v)=>{return k + v}) < "162000" && moment().utc().tz(moment.tz.names()[i]).format('HH:mm:ss').split(":").reduce((k,v)=>{return k + v}) > "152000" ){
      if(moment.tz.names()[i].toLowerCase().indexOf("gmt") === -1){
        arr.push(v)
      }
    }
  })
  return arr[Math.floor(Math.random()*arr.length)]
}

if(getCookie("tz") == ""){
  checkCookie()
  setTimeout(()=>{
    window.location.reload();
  }, 100)
} else {
  getTzTime()
  getTzCountDown()    
}

getLocalTime();
getLocalCountDown();
getCookieExpired();
initialize();

var c;
var imgBg;
var imgDrops;
var x = 0;
var y = 0;
var noOfDrops = 500;
var fallingDrops = [];
var firstRain = true;

function drawRain() {
  for (var i=0; i < noOfDrops; i++)
  {
    c.drawImage(fallingDrops[i].image, fallingDrops[i].x, fallingDrops[i].y); //The rain drop
    
    fallingDrops[i].y += fallingDrops[i].speed; //Set the falling speed
    if (fallingDrops[i].y > window.screen.width) {  //Repeat the raindrop when it falls out of view
      fallingDrops[i].y = -100 //Account for the image size
      fallingDrops[i].x = Math.random() * window.screen.width;    //Make it appear randomly along the width    
    }
  }
}

function setupRain() {
  if(firstRain){
    firstRain = false;
    var canvas = document.getElementById('canvasRegn');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (canvas.getContext) {
      c = canvas.getContext('2d');
      for (var i = 0; i < noOfDrops; i++) {
        var fallingDr = new Object();
        fallingDr["image"] =  new Image(1,1);
        fallingDr.image.src = '/assets/32.png';
        fallingDr.image = '';
        fallingDr["x"] = Math.random() * window.screen.width;
        fallingDr["y"] = Math.random() * -100;
        fallingDr["speed"] = 2 + Math.random() * 2;
        fallingDrops.push(fallingDr);
      }
      setInterval(drawRain, 30);
      async ()=>{for(var j = 0; j < 360; j++){c.rotate(j*Math.PI/180);}}
    }
  }
}


/*






for(var i = 0; i < 2; i++){
  var j = 100;
  var testInt = setInterval(()=>{
    console.log(this);
    document.getElementsByClassName('image')[i].style.top = i;
    if(i==200) clearInterval(testInt);
    j++;
  },5)
}





var noOfImages = 100;
for(var i = 0; i<noOfImages; i++){
  var img = document.createElement("img");
  img.id = `weed-${i}`;
  img.className = "image";
  img.src = 'http://makeameme.org/media/templates/120/grumpy_cat.jpg';
  img.style.top = -100;
  img.style.left = Math.random()*screen.width;
  img.style.width = 80+Math.floor(Math.random() * 20);
  document.getElementById('420').appendChild(img);
}



*/