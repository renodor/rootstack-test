url = 'https://swapi.dev/api/starships/';

fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const starShips = data['results'];

      starShips.forEach((starShip) => {
        console.log(starShip['passengers']);
        if (starShip['passengers'] > 10) {
          console.log('hello')
        }

      })
    })
