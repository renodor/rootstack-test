const url = 'https://swapi.dev/api/starships/2/';
const numberOfPassengers = 10;


const checkPassengers = (passengers, num) => {
  return parseFloat(passengers) > num;
};

const checkAutonomy = (consumables) => {
  let result = false;
  const arr = consumables.split(' ');
  if (arr.length > 1) {
    if (arr[1][0].match(/[wmy]/)) {
      result = true;
    } else if (arr[1][0] === 'd') {
      arr[0] >= 7 ? result = true : result = false;
    }
  }
  return result;
};


const checkMovies = async (movieUrls) => {
  let i = 0;
  while (i < movieUrls.length) {
    const value = await fetchMovie(movieUrls[i]);
    if (value) {
      return true;
      break;
    }
    i += 1;
  }
};

const fetchMovie = (movie) => {
  return fetch(movie)
      .then((response) => response.json())
      .then((data) => {
        return [4, 5, 6].includes(data['episode_id']);
      });
};


fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const enoughSpace = checkPassengers(data['passengers'], numberOfPassengers);
      const enoughAutonomy = checkAutonomy(data['consumables']);
      if (enoughSpace && enoughAutonomy) {
        checkMovies(data['films']).then((goodMovies) => {
          if (goodMovies) {
            console.log(data);
          } else {
            console.log('dont belong to good movies');
          }
        });
      } else {
        console.log('not enough space or not enough autonomy');
      }
    });





// !async function(){
// let data = await fetch("https://raw.githubusercontent.com/IbrahimTanyalcin/LEXICON/master/lexiconLogo.png")
//     .then((response) => response.blob())
//     .then(data => {
//         return data;
//     })
//     .catch(error => {
//         console.error(error);
//     });

// console.log(data);
// }();


// // Example POST method implementation:
// async function postData(url) {
//   // Default options are marked with *
//   const response = await fetch(url)
//   return response.json(); // parses JSON response into native JavaScript objects
// }

// postData(url)
//   .then(data => {
//     console.log(data); // JSON data parsed by `response.json()` call
//   });
