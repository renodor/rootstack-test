// simple helper method to fetch an url and return result in JSON
const fetchData = (url) => {
  return fetch(url).then((response) => response.json());
};

// method to fetch 1 page of the swapi planet API
const fetchPlanets = async (url, terrain) => {
  const planets = await fetchData(url)
      .then((data) => {
        return data['results'].filter((planet) => {
          // get all terrains of a planet and split it in an array
          plannetTerrains = planet['terrain'].split(', ');

          // check if terrains of the planet include the terrain we are looking for
          if (plannetTerrains.includes(terrain)) {
            // if yes, return an object with the planet name and its population
            return {'name': planet['name'], 'population': planet['population']};
          }
        });
      });

  // we return all the planets we found
  return planets;
};


// method to fetch all planets from the swapi API, and to clean results
const fetchAllPlanets = async (url, terrain) => {
  const results = [];

  // we have to fetch page after page (to consolidate results in the same array)
  // so fetch one page, and as long as we find a 'next page', we continue
  while (url) {
    results.push(await fetchPlanets(url, terrain));
    url = await fetchData(url).then((data) => data['next']);
  }

  // once we got all results, we can flatten our array
  cleanedResults = results.flat();

  // we define variables that will contain our most populated planet its id and its speed
  let maxPopulation = 0;
  let mostPopulatedPlanet = '';
  let mostPopulatedPlanetId = 0;

  // if we found more than 1 planet, we need to find the most populated one
  if (cleanedResults.length > 1) {
    // we loop over our found planets and compare their population to the last one
    cleanedResults.forEach((planet, i) => {
      // if we find a planet with more population than the last one we need to do three things:
      // - change the value of maxPopulation
      // - change the name of the most populated planet
      // - save the index of the most populated planet
      if (parseInt(planet['population']) > maxPopulation) {
        maxPopulation = parseInt(planet['population']);
        mostPopulatedPlanet = `${planet['name']} (population: ${planet['population']})`;
        mostPopulatedPlanetId = i;
      }
    });

  // if we found only 1 planet, we put it as the most populated one by default
  } else if (cleanedResults.length === 1) {
    mostPopulatedPlanet = `${cleanedResults[0]['name']} (population: ${cleanedResults[0]['population']})`;
  }

  // I kept this console log if you want to check the raw retrieved data
  console.log(cleanedResults);

  // once we did all that, we can display results
  displayResults(cleanedResults, mostPopulatedPlanet, mostPopulatedPlanetId);
};

// method to display our results in the html page
const displayResults = (planets, mostPopulatedPlanet, mostPopulatedPlanetId) => {
  // we automatically clean previous results
  bestResultDiv.innerHTML = '';
  otherResultsDiv.innerHTML = '';

  // if we found a most populated planet, we display it
  // (otherwise we display a custom message)
  // (but it normally won't happened has the terrain choices is fetched from the API itself)
  if (mostPopulatedPlanet) {
    bestResultDiv.innerHTML = `
      <p>The most populated StarWars planet for your search is:</p>
      <p><span>${mostPopulatedPlanet}</span></p>`;
  } else {
    bestResultDiv.innerHTML = 'No planets...';
  }

  // if we found other planets, we display it
  // (otherwise we display a custom message)
  if (planets.length > 1) {
    otherResultsDiv.innerHTML = '<b>Here are other good candidates:</b>';
    planets.forEach((planet, i) => {
      // we make sure to exclude the most populated planet from the other results,
      // otherwise it will be repeated on the page...
      if (i != mostPopulatedPlanetId) {
        otherResultsDiv.insertAdjacentHTML('beforeend', `<p>${planet['name']}</p>`);
      }
    });
  } else {
    otherResultsDiv.innerHTML = '<b>No other results...</b>';
  }
};

// the url to fetch
const planetsUrl = 'https://swapi.dev/api/planets/';

// method to fetch all available terrains in order to propulate the select option
const fetchAllTerrains = async (url) => {
  const results = [];

  // we have to fetch page after page (to consolidate results in the same array)
  // so fetch one page, and as long as we find a 'next page', we continue
  while (url) {
    results.push(await fetchData(url).then((data) => {
      return data['results'].map((planet) => planet['terrain']);
    }));
    url = await fetchData(url).then((data) => data['next']);
  }

  // once we get all terrains we have to clean the data
  // indeed some planets have several terrains
  // (there is maybe a better way to avoid double loop here...)
  cleanedResults = results.map((terrains) => {
    return cleanedTerrains = terrains.map((terrain) => {
      // if the planet has several terrains, we need to split it in an array
      // in order to propose those terrains has indidual values
      if (terrain.match(/,/)) {
        return terrain.split(', ');
      } else {
        return terrain;
      }
    });
  });

  // once we splited all values we can flatten our array
  flattenResults = cleanedResults.flat(2);

  // we can then remove duplicates
  uniqResults = [...new Set(flattenResults)];

  // and we return all unique terrains in alphabetical order
  return uniqResults.sort();
};

// the dropdown menu where you can chose a terrain
const select = document.querySelector('select');

// method that display all fetched terrains in the dropdown menu
const displayAvailableTerrains = async (select) => {
  const terrains = await fetchAllTerrains(planetsUrl);
  terrains.forEach((terrain) => {
    select.insertAdjacentHTML('beforeend', `<option value="${terrain}">${terrain}</option>`);
  });
};

// call the method to display all terrains in the dropdown menu
displayAvailableTerrains(select);

// the button that will trigger the action
const btn = document.querySelector('button');

// the divs where we will display results
const bestResultDiv = document.querySelector('.best-result');
const otherResultsDiv = document.querySelector('.other-results');

// trigger the action when the button is clicked
btn.addEventListener('click', (event) => {
  fetchAllPlanets(planetsUrl, select.value);
});

