import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("06", "07");
  }, minutes(3));

  it(
    "should select top three directors ordered by total budget spent in their movies",
    async done => {
      const query = `select directors.full_name as director, round(sum(movies.budget_adj),2) as total_budget
      from movies
      join movie_directors on movies.id = movie_directors.movie_id
      join directors on movie_directors.director_id = directors.id
      group by directors.id
      order by total_budget desc
      limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          director: "Steven Spielberg",
          total_budget: 2173663066.68
        },
        {
          director: "Ridley Scott",
          total_budget: 1740157354.14
        },
        {
          director: "Michael Bay",
          total_budget: 1501996071.5
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top 10 keywords ordered by their appearance in movies",
    async done => {
      const query = `select keywords.keyword as keyword, count(keywords.id) as count
      from movies
      join movie_keywords on movies.id = movie_keywords.movie_id 
      join keywords on keywords.id = movie_keywords.keyword_id
      group by keywords.id 
      order by count(keywords.id) desc
      limit 10`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          keyword: "woman director",
          count: 411
        },
        {
          keyword: "independent film",
          count: 394
        },
        {
          keyword: "based on novel",
          count: 278
        },
        {
          keyword: "sex",
          count: 272
        },
        {
          keyword: "sport",
          count: 216
        },
        {
          keyword: "murder",
          count: 204
        },
        {
          keyword: "musical",
          count: 169
        },
        {
          keyword: "biography",
          count: 168
        },
        {
          keyword: "new york",
          count: 163
        },
        {
          keyword: "suspense",
          count: 157
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select one movie which has highest count of actors",
    async done => {
      const query = `select movies.original_title as original_title, count(*) as count
      from movies
      join movie_actors on movies.id = movie_actors.movie_id
      group by original_title
      order by count desc
      limit 1`;
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        original_title: "Hamlet",
        count: 20
      });

      done();
    },
    minutes(3)
  );

  it(
    "should select three genres which has most ratings with 5 stars",
    async done => {
      const query = `select genres.genre as genre, count(movie_ratings.movie_id) as five_stars_count
      from movies
      join genres on genres.id = movie_genres.genre_id
      join movie_genres on movies.id = movie_genres.movie_id
      join movie_ratings on movie_ratings.movie_id = movies.id
      where movie_ratings.rating = 5.0
      group by genres.id
      order by five_stars_count desc
      limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Drama",
          five_stars_count: 143663
        },
        {
          genre: "Thriller",
          five_stars_count: 96265
        },
        {
          genre: "Comedy",
          five_stars_count: 81184
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three genres ordered by average rating",
    async done => {
      const query = `select genres.genre as genre, round(avg(movie_ratings.rating), 2) as avg_rating
      from movies
      join movie_ratings on movie_ratings.movie_id = movies.id
      join genres on genres.id = movie_genres.genre_id
      join movie_genres on movies.id = movie_genres.movie_id 
      group by genres.id
      order by avg_rating desc
      limit 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Western",
          avg_rating: 3.64
        },
        {
          genre: "Crime",
          avg_rating: 3.62
        },
        {
          genre: "Animation",
          avg_rating: 3.6
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top 3 movie genres where budget is greater than 150000000",
    async done => {
      const query = `select movies.original_title as original_title, genres.genre as genre
      from movies
      join genres on genres.id = movie_genres.genre_id
      join movie_genres on movies.id = movie_genres.movie_id
      where budget > 150000000
      group by genre
      order by genre desc
      limit 3`;
      
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          original_title: "The Warrior's Way",
          genre: "Western"
        },
        {
          original_title: "The Hunger Games: Mockingjay - Part 2",
          genre: "War"
        },
        {
          original_title: "Furious 7",
          genre: "Thriller"
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top 3 actors which have more total roles in movies",
    async done => {
      const query = `select actors.full_name as actor, count(*) as count
      from movies
      join actors on actors.id = movie_actors.actor_id
      join movie_actors on movies.id = movie_actors.movie_id
      group by actors.id
      order by count desc
      limit 3`;
      
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          actor: "Robert De Niro",
          count: 72
        },
        {
          actor: "Samuel L. Jackson",
          count: 71
        },
        {
          actor: "Bruce Willis",
          count: 62
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select name of the director who has the highest number of movies made",
    async done => {
      const query = `select directors.full_name as director, count(*) as count
      from movies
      join directors on directors.id = movie_directors.director_id
      join movie_directors on movies.id = movie_directors.movie_id
      group by directors.id
      ORDER by count desc
      limit 1
      `;
      
      const result = await db.selectSingleRow(query);

      expect(result).toEqual(
        {
          director: "Woody Allen",
          count: 46
        }
      );

      done();
    },
    minutes(3)
  );
});
