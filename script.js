  <script>
    
    var API_KEY = '98ecd32d7b24c7a769abe3091d55ecb7';

    var BG_THEMES = {
      sunny:  { top: '#1a1200', bot: '#3a2800', r:255, g:153, b:0,   op: 0.18 },
      rain:   { top: '#0a1520', bot: '#0d2035', r:68,  g:136, b:204, op: 0.12 },
      haze:   { top: '#1a1a22', bot: '#2a2a38', r:170, g:170, b:204, op: 0.10 },
      snow:   { top: '#0d1828', bot: '#1a2a40', r:136, g:187, b:255, op: 0.14 },
      cloudy: { top: '#111620', bot: '#1c2535', r:102, g:153, b:170, op: 0.10 }
    };

    var ICON_IDS = {
      sunny: 'iconSunny', rain: 'iconRain',
      haze:  'iconHaze',  snow: 'iconSnow', cloudy: 'iconCloudy'
    };

    /* ── CANVAS ──────────────────────────────────────── */
    var bgCanvas  = document.getElementById('bgCanvas');
    var bgCtx     = bgCanvas.getContext('2d');
    var fxCanvas  = document.getElementById('weatherCanvas');
    var fxCtx     = fxCanvas.getContext('2d');
    var W = 0, H = 0;
    var particles = [];
    var currentCond = 'sunny';

    function resize() {
      W = bgCanvas.width = fxCanvas.width = window.innerWidth;
      H = bgCanvas.height = fxCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', function() { resize(); drawBg(currentCond); buildParticles(currentCond); });

    /* ── BACKGROUND ──────────────────────────────────── */
    function drawBg(cond) {
      var t = BG_THEMES[cond] || BG_THEMES.sunny;
      var grad = bgCtx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, t.top);
      grad.addColorStop(1, t.bot);
      bgCtx.fillStyle = grad;
      bgCtx.fillRect(0, 0, W, H);
      var rad = bgCtx.createRadialGradient(W*0.5, H*0.3, 0, W*0.5, H*0.3, W*0.7);
      rad.addColorStop(0, 'rgba('+t.r+','+t.g+','+t.b+','+t.op+')');
      rad.addColorStop(1, 'transparent');
      bgCtx.fillStyle = rad;
      bgCtx.fillRect(0, 0, W, H);
    }

    /* ── items/particle ───────────────────────────────────── */
    function buildParticles(cond) {
      particles = [];
      var i;
      if (cond === 'rain') {
        for (i = 0; i < 200; i++) particles.push({ x:Math.random()*W, y:Math.random()*H, len:12+Math.random()*20, speed:14+Math.random()*12, opacity:0.25+Math.random()*0.45 });
      } else if (cond === 'snow') {
        for (i = 0; i < 120; i++) particles.push({ x:Math.random()*W, y:Math.random()*H, r:2+Math.random()*4, speed:0.8+Math.random()*1.5, drift:(Math.random()-0.5)*0.8, opacity:0.4+Math.random()*0.5, wobble:Math.random()*Math.PI*2 });
      } else if (cond === 'haze') {
        for (i = 0; i < 14; i++) particles.push({ y:60+i*(H/14), w:W*(1.2+Math.random()*0.8), h:30+Math.random()*60, speed:0.3+Math.random()*0.5, opacity:0.025+Math.random()*0.04, offset:Math.random()*W });
      } else if (cond === 'sunny') {
        for (i = 0; i < 30; i++) particles.push({ x:Math.random()*W, y:Math.random()*H, r:1+Math.random()*2, speed:0.3+Math.random()*0.5, opacity:0.1+Math.random()*0.2, angle:Math.random()*Math.PI*2 });
      }
    }

    function animate() {
      fxCtx.clearRect(0, 0, W, H);
      var p, i, g;
      if (currentCond === 'rain') {
        for (i = 0; i < particles.length; i++) {
          p = particles[i];
          fxCtx.beginPath(); fxCtx.strokeStyle = 'rgba(130,190,255,'+p.opacity+')'; fxCtx.lineWidth = 1;
          fxCtx.moveTo(p.x, p.y); fxCtx.lineTo(p.x+1.5, p.y+p.len); fxCtx.stroke();
          p.y += p.speed; p.x += 0.75;
          if (p.y > H) { p.y = -p.len; p.x = Math.random()*W; }
        }
      } else if (currentCond === 'snow') {
        for (i = 0; i < particles.length; i++) {
          p = particles[i];
          p.wobble += 0.02; p.x += Math.sin(p.wobble)*0.5+p.drift; p.y += p.speed;
          if (p.y > H) { p.y = -10; p.x = Math.random()*W; }
          if (p.x > W) p.x = 0; if (p.x < 0) p.x = W;
          fxCtx.beginPath(); fxCtx.arc(p.x, p.y, p.r, 0, Math.PI*2);
          fxCtx.fillStyle = 'rgba(210,235,255,'+p.opacity+')'; fxCtx.fill();
        }
      } else if (currentCond === 'haze') {
        for (i = 0; i < particles.length; i++) {
          p = particles[i];
          p.offset += p.speed; if (p.offset > W*2) p.offset = -W;
          g = fxCtx.createLinearGradient(p.offset-p.w/2, 0, p.offset+p.w/2, 0);
          g.addColorStop(0, 'transparent');
          g.addColorStop(0.3, 'rgba(180,190,210,'+p.opacity+')');
          g.addColorStop(0.7, 'rgba(180,190,210,'+p.opacity+')');
          g.addColorStop(1, 'transparent');
          fxCtx.fillStyle = g; fxCtx.fillRect(p.offset-p.w/2, p.y-p.h/2, p.w, p.h);
        }
      } else if (currentCond === 'sunny') {
        for (i = 0; i < particles.length; i++) {
          p = particles[i];
          p.angle += 0.008; p.x += Math.cos(p.angle)*p.speed*0.3; p.y += Math.sin(p.angle)*p.speed*0.15;
          if (p.x > W) p.x = 0; if (p.y > H) p.y = 0;
          fxCtx.beginPath(); fxCtx.arc(p.x, p.y, p.r, 0, Math.PI*2);
          fxCtx.fillStyle = 'rgba(255,210,80,'+p.opacity+')'; fxCtx.fill();
        }
      }
      requestAnimationFrame(animate);
    }

    /* ── UI ──────────────────────────────────── */
    function showError(msg) {
      var el = document.getElementById('errorBanner');
      el.textContent = '\u26a0 ' + msg;
      el.classList.add('visible');
      setTimeout(function() { el.classList.remove('visible'); }, 6000);
    }

    function setLoading(on) {
      document.getElementById('loadingOverlay').classList.toggle('active', on);
      document.getElementById('goBtn').disabled = on;
    }

    function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

    /* ── WEATHER DATA ────────────────────────────────── */
    function applyData(data) {
      document.getElementById('cityDisplay').textContent    = data.name;
      document.getElementById('countryDisplay').textContent = data.sys.country || '';
      document.getElementById('tempDisplay').innerHTML      = Math.round(data.main.temp) + '<span>\xb0C</span>';
      document.getElementById('descDisplay').textContent    = data.weather[0].description;
      document.getElementById('feelsLike').innerHTML        = Math.round(data.main.feels_like) + '<span class="unit">\xb0C</span>';
      document.getElementById('humidityVal').innerHTML      = data.main.humidity + '<span class="unit">%</span>';
      document.getElementById('windVal').innerHTML          = Math.round(data.wind.speed * 3.6) + '<span class="unit">km/h</span>';
      document.getElementById('visibVal').innerHTML         = (data.visibility / 1000).toFixed(1) + '<span class="unit">km</span>';

      var lat = data.coord.lat, lon = data.coord.lon;
      document.getElementById('latVal').textContent = Math.abs(lat).toFixed(1) + '\xb0' + (lat >= 0 ? 'N' : 'S');
      document.getElementById('lonVal').textContent = Math.abs(lon).toFixed(1) + '\xb0' + (lon >= 0 ? 'E' : 'W');

      var id = data.weather[0].id;
      var cond = 'sunny', accent = '#ffd060';
      if      (id >= 200 && id < 600) { cond = 'rain';   accent = '#6aadff'; }
      else if (id >= 600 && id < 700) { cond = 'snow';   accent = '#b8d4ff'; }
      else if (id >= 700 && id < 800) { cond = 'haze';   accent = '#aab8c8'; }
      else if (id === 800)             { cond = 'sunny';  accent = '#ffd060'; }
      else if (id >  800)              { cond = 'cloudy'; accent = '#90a4b8'; }

      document.getElementById('conditionLabel').textContent = cap(data.weather[0].description);

      var keys = Object.keys(ICON_IDS);
      for (var k = 0; k < keys.length; k++) document.getElementById(ICON_IDS[keys[k]]).classList.remove('active');
      document.getElementById(ICON_IDS[cond]).classList.add('active');

      currentCond = cond;
      document.documentElement.style.setProperty('--accent', accent);
      drawBg(cond);
      buildParticles(cond);
    }

    function fetchWeather(query) {
      setLoading(true);
      var url = 'https://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(query) + '&appid=' + API_KEY + '&units=metric';
      fetch(url)
        .then(function(res) { return res.json().then(function(data) { return { ok: res.ok, data: data }; }); })
        .then(function(obj) {
          if (!obj.ok) throw new Error(cap(obj.data.message || 'City not found.'));
          applyData(obj.data);
        })
        .catch(function(err) { showError(err.message || 'Could not fetch weather.'); })
        .finally(function() { setLoading(false); });
    }

    function updateWeather() {
      var city    = document.getElementById('cityInput').value.trim();
      var country = document.getElementById('countryInput').value.trim();
      if (!city) { showError('Please enter a city name.'); return; }
      fetchWeather(country ? city + ',' + country : city);
    }

    /* ── SUN RAYS ────────────────────────────────────── */
    var raysEl = document.getElementById('sunRays');
    for (var ri = 0; ri < 12; ri++) {
      var ray = document.createElement('div');
      ray.className = 'ray';
      var ang = (ri / 12) * 360;
      var len = 18 + Math.random() * 10;
      ray.style.cssText = 'height:'+len+'px;transform:translate(-50%,-100%) rotate('+ang+'deg) translateY(-38px);opacity:'+(0.6+Math.random()*0.4)+';width:'+(2+Math.random())+'px;';
      raysEl.appendChild(ray);
    }

    /* ── ENTER KEY ───────────────────────────────────── */
    document.getElementById('cityInput').addEventListener('keydown', function(e) { if (e.key === 'Enter') updateWeather(); });
    document.getElementById('countryInput').addEventListener('keydown', function(e) { if (e.key === 'Enter') updateWeather(); });

    /* ── START ───────────────────────────────────────── */
    drawBg('sunny');
    buildParticles('sunny');
    animate();

    function fetchWeatherByLocation(lat, lon){

    console.log("Latitude:", lat);
    console.log("Longitude:", lon);

    setLoading(true);

    fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=98ecd32d7b24c7a769abe3091d55ecb7&units=metric`
    )

    .then(response => response.json())

    .then(data => {

        console.log(data);

        if(data.cod != 200){
            throw new Error(data.message);
        }

        applyData(data);

    })

    .catch(error => {

        console.log(error);

        showError(error.message);

        fetchWeather("Bhopal,IN");

    })

    .finally(() => {

        setLoading(false);

    });
}

navigator.geolocation.getCurrentPosition(

function(position){

fetchWeatherByLocation(
position.coords.latitude,
position.coords.longitude
);

},

function(error){

console.log(error);

showError("Location denied");

fetchWeather("California,US");

}

);

  </script>
