import { Database } from "../src/database";
import { minutes } from "./utils";
import {
    selectDirectorById,
    selectProductionCompanyById,
    selectGenreById
  } from "../src/queries/select";
import { doesNotReject } from "assert";

  describe("Update statements", () => {
      let db: Database;
      beforeAll(async () => {
          db = await Database.fromExisting("08", "09");
      }, 
      minutes(3));
  
      it("should update director's name by id", 
      async done => {
        const directorId = 89;

        await db.execute(`update directors set full_name = 'Leonardo Di Caprio' where id = '${directorId}'`);

        const director = await db.selectSingleRow(selectDirectorById(directorId));

        expect(director.full_name).toBe('Leonardo Di Caprio');

        done();
      });
      minutes(3);

      it("should update movie genre by id", 
      async done => {
        const genreId = 7;

        await db.execute(`update genres set genre = 'Insurgent' where id = ${genreId}`);

        const genres = await db.selectSingleRow(selectGenreById(genreId));

        expect(genres.genre).toBe('Insurgent');

        done();
      });
      minutes(3);

      it("should update production company's name by id", 
      async done => {
        const companyId = 145;

        await db.execute(`update production_companies set company_name = 'Brazzers Coorporation' where id = ${companyId}`);

        const company = await db.selectSingleRow(selectProductionCompanyById(companyId));

        expect(company.company_name).toBe('Brazzers Coorporation');

        done();
      });
      minutes(3);
    });