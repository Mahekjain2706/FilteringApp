const router = require("express").Router();
const Movie = require("../models/Movie");
const movies = require("../config/movies.json");
const { query } = require("express");

router.get("/movies", async (req, res) => {
	try {
		const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 5;
		const search = req.query.search || "";
		let sort = req.query.sort || "maxspeed";
		let color = req.query.color || "All";

		const colorOptions = [
			"Action",
			"Romance",
			"Fantasy",
			"Drama",
			"Crime",
			"Adventure",
			"Thriller",
			"Sci-fi",
			"Music",
			"Family",
		];

		color === "All"
			? (color = [...colorOptions])
			: (color = req.query.color.split(","));
		req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

		let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = "asc";
		}

		const movies = await Movie.find({ name: { $regex: search, $options: "i" } })
			.where("color")
			.in([...color])
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

		// const total = await Movie.countDocuments({
		// 	color: { $in: [...color] },
		// 	name: { $regex: search, $options: "i" },
		// });

	const total = 14;

		console.log(" total yaha kjwbeab = " +  total);
		console.log("HELLO");

		const response = {
			error: false,
			total,
			page: page + 1,
			limit,
			colors: colorOptions,
			movies,
		};

		// console.log(limit);

		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

const insertMovies = async () => {
    try {
        const docs = await Movie.insertMany(movies);
        return Promise.resolve(docs);
    } catch (err) {
        return Promise.reject(err)
    }
};

insertMovies()
    .then((docs) => console.log(docs))
    .catch((err) => console.log(err))

module.exports = router;
