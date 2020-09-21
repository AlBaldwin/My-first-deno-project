import { join } from "https://deno.land/std/path/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { parse } from "https://deno.land/std/encoding/csv.ts";
import * as _ from "https://raw.githubusercontent.com/lodash/lodash/4.17.15-es/lodash.js";

interface Planet {
     [ key: string ] : string
}

async function loadPlanetsData() {
  const path = join(".", "kepler_exoplanets_nasa.csv");

  const file = await Deno.open(path);
  const bufReader = new BufReader(file);
  const result = await parse(bufReader, {
    header: true,
    comment: "#",
  });
  Deno.close(file.rid);

  const planets = (result as Array<Planet>).filter((planet) => {
      const planitaryRadius = Number(planet["koi_prad"]);
      const stellaMass = Number(planet["koi_smass"]);
      const stellaRadius = Number(planet["koi_srad"]);

      return planet["koi_disposition"] === "CONFIRMED" 
      && planitaryRadius > 0.5 && planitaryRadius < 1.5 
      && stellaMass > 0.78 && stellaMass < 1.04 
      && stellaRadius > 0.99 && stellaRadius < 1.01;
  });

  return planets.map((planet) => {
    return _.pick(planet, [
        "koi_prad",
        "koi_smass",
        "koi_srad",
        "kepler_name",
        "koi_count",
        "koi_steff"

    ]);
  });
}

const newEarths = await loadPlanetsData();
for (const planet of newEarths) {
    console.log(planet);

}
console.log(`${newEarths.length} habitatable planets found!`);
