const apiKey = "fe662d54aa9e0abfc96fa999a9073418";

document.getElementById("getSuggestions").addEventListener("click", async () => {
  const location = document.getElementById("location").value;
  const activities = document.getElementById("activities").value;

  if (!location) {
    alert("Please enter a location.");
    return;
  }

  const weather = await fetchWeather(location);
  if (weather) {
    const packingList = suggestPacking(weather, activities.split(","));
    console.log("Packing List:", packingList); // Debugging output
    displayPackingList(weather, packingList);
  }
});

document.getElementById("translate").addEventListener("click", async () => {
  const language = document.getElementById("language").value;
  const output = document.getElementById("output").innerText;

  if (!output.trim()) {
    alert("There is nothing to translate!");
    return;
  }

  const translation = await translateText(output, language);
  document.getElementById("output").innerText = translation;
});

// Translation function
async function translateText(text, targetLang) {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    );
    const data = await response.json();
    return data.responseData.translatedText;
  } catch (error) {
    console.error("Translation Error:", error);
    return "Translation failed.";
  }
}

function generateAmazonLink(item) {
  const baseUrl = "https://www.amazon.com/s?k=";
  return `<a href='${baseUrl}${encodeURIComponent(item)}' target='_blank'>${item}</a>`;
}

function displayPackingList(weather, packingList) {
  const output = document.getElementById("output");

  const highPriorityItems = packingList.high.length > 0 
    ? packingList.high.map(item => `<li>${generateAmazonLink(item)}</li>`).join("") 
    : "<li>No high-priority items</li>";

  const moderatePriorityItems = packingList.moderate.length > 0 
    ? packingList.moderate.map(item => `<li>${generateAmazonLink(item)}</li>`).join("") 
    : "<li>No moderate-priority items</li>";

  const lowPriorityItems = packingList.low.length > 0 
    ? packingList.low.map(item => `<li>${generateAmazonLink(item)}</li>`).join("") 
    : "<li>No low-priority items</li>";

  output.innerHTML = `
    <h3>Weather in ${weather.location}:</h3>
    <p>Temperature: ${weather.temperature}°C</p>
    <p>Condition: ${weather.description}</p>
    <p>Humidity: ${weather.humidity}%</p>
    <p>Wind Speed: ${weather.windspeed} m/s</p>
    
    <h3>Packing Suggestions:</h3>
    <h4>High Priority (Must-Have):</h4>
    <ul>${highPriorityItems}</ul>
    
    <h4>Moderate Priority (Good to Have):</h4>
    <ul>${moderatePriorityItems}</ul>

    <h4>Low Priority (Optional):</h4>
    <ul>${lowPriorityItems}</ul>
  `;
}

async function fetchWeather(location) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );
    
    const data = await response.json();
    if (data.cod !== 200) {
      alert(data.message);
      return null;
    }
    return {
      location: location,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windspeed: data.wind.speed,
    };
  } catch (error) {
    console.error(error);
  }
}

function suggestPacking(weather, activities) {
  const packingList = { high: [], moderate: [], low: [] };
  
  if (weather.temperature < 10) {
    packingList.high.push("Heavy jacket", "Gloves", "Thermal wear");
  } else if (weather.temperature < 15) {
    packingList.moderate.push("Warm jacket", "Sweaters");
  }
  
  if (weather.temperature > 35) {
    packingList.high.push("Sunglasses", "Hat", "Sunscreen", "Light clothing");
  } else if (weather.temperature > 30) {
    packingList.moderate.push("Sunglasses", "Light clothing", "Hat");
  }
  
  if (weather.humidity > 85) {
    packingList.high.push("Anti-frizz hair products", "Moisture-wicking clothes");
  } else if (weather.humidity > 70) {
    packingList.moderate.push("Anti-frizz hair products");
  }
  
  if (weather.windspeed > 15) {
    packingList.high.push("Windbreaker jacket", "Sturdy shoes");
  } else if (weather.windspeed > 10) {
    packingList.moderate.push("Windbreaker jacket");
  }

  activities.forEach((activity) => {
    const act = activity.trim().toLowerCase(); 

    if (act.includes("hiking") || act.includes("trekking")) {
      packingList.high.push("Sturdy shoes", "Backpack", "Water bottle");
      packingList.moderate.push("Trekking poles", "Energy bars");
    }
    if (act.includes("beach") || act.includes("swimming")) {
      packingList.high.push("Swimsuit", "Sunscreen");
      packingList.moderate.push("Beach towel", "Flip-flops");
      packingList.low.push("Snorkeling gear");
    }
    if (act.includes("gym") || act.includes("workout")) {
      packingList.high.push("Gym shoes", "Workout clothes");
      packingList.moderate.push("Towel", "Water bottle");
      packingList.low.push("Resistance bands", "Heart rate monitor");
    }
    if (act.includes("cycling") || act.includes("biking")) {
      packingList.high.push("Helmet", "Water bottle");
      packingList.moderate.push("Cycling gloves", "Padded shorts");
    }
    if (act.includes("camping")) {
      packingList.high.push("Tent", "Sleeping bag", "Flashlight");
      packingList.moderate.push("Portable stove", "First aid kit");
      packingList.low.push("Hammock", "Camping chair");
    }
  });

  console.log("Final Packing List:", packingList); 
  return packingList;
}

// Speak Button Event Listener
document.getElementById("speak").addEventListener("click", () => {
  const text = document.getElementById("output").innerText;

  if (!text.trim()) {
    alert("There is nothing to speak!");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set the language of speech based on selected language
  const language = document.getElementById("language").value;
  switch(language) {
    case "es":
      utterance.lang = "es-ES";
      break;
    case "fr":
      utterance.lang = "fr-FR";
      break;
    case "ja":
      utterance.lang = "ja-JP";
      break;
    case "de":
      utterance.lang = "de-DE";
      break;
    case "zh":
      utterance.lang = "zh-CN";
      break;
    case "hi":
      utterance.lang = "hi-IN";
      break;
    case "ar":
      utterance.lang = "ar-SA";
      break;
    case "it":
      utterance.lang = "it-IT";
      break;
    case "ru":
      utterance.lang = "ru-RU";
      break;
    case "ko":
      utterance.lang = "ko-KR";
      break;
    case "ta":
      utterance.lang = "ta-IN";
      break;
    case "te":
      utterance.lang = "te-IN";
      break;
    case "kn":
      utterance.lang = "kn-IN";
      break;
    case "mr":
      utterance.lang = "mr-IN";
      break;
    case "ml":
      utterance.lang = "ml-IN";
      break;
    case "bn":
      utterance.lang = "bn-IN";
      break;
    case "pa":
      utterance.lang = "pa-IN";
      break;
    case "ur":
      utterance.lang = "ur-IN";
      break;
    case "gu":
      utterance.lang = "gu-IN";
      break;
    default:
      utterance.lang = "en-US"; // Default to English if no language selected
  }

  window.speechSynthesis.speak(utterance);
});