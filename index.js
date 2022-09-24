const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const resultados = [];
let habitables = [];

/*
According to the article at centauri-dreams.org "A review of the best habitable planet candidates"
a good candidate must have an effective stellar flux not greater than 1.11 and not lower than 0.36 (koi_insol, where Earth value is 1).
Also it must have not more than 1.6 times the Earth radius (koi_prad). The koi_disposition is the status of the observation by Kepler, what must be as "CONFIRMED"
*/

const esHabitable = (planeta) => {
  return (
    planeta.koi_disposition === 'CONFIRMED' &&
    planeta.koi_insol > 0.36 &&
    planeta.koi_insol < 1.11 &&
    planeta.koi_prad < 1.6
  );
};

fs.createReadStream(path.join(__dirname, 'kepler_data.csv'))
  .pipe(
    parse({
      comment: '#',
      columns: true,
    })
  )
  .on('data', (data) => {
    resultados.push(data);
  })
  .on('end', () => {
    habitables = resultados.filter((planeta) => {
      return esHabitable(planeta);
    });
    fs.writeFile(
      path.join(__dirname, 'planetas_habitables.txt'),
      JSON.stringify(habitables),
      (err) => {
        console.log(err);
      }
    );
  });
