import { Router } from "express";
import database from "services/database";
import _ from "lodash";
const router = Router();

router.get("/", (req, res) => {
	database.websites.find({}, (err, websites) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.send(websites);
		}
	});
});

router.post("/", (req, res) => {
	const { name, domain, description } = req.body;

	database.websites.insert(
		{ name, domain, description, sessions: [] },
		(err, website) => {
			if (err) {
				res.status(500).send(err);
			} else {
				res.status(201).send("Created");
			}
		}
	);
});

router.get("/:websiteId", (req, res) => {
	const { websiteId } = req.params;

	database.websites.findOne({ _id: websiteId }, (err, website) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(website);
		}
	});
});

router.patch("/:websiteId", (req, res) => {
	const { websiteId } = req.params;
	const data = req.body;

	console.log({ data });
	database.websites.update(
		{
			_id: websiteId,
		},
		{
			$set: _.pick(data, ["name", "domain", "description"]),
		},
		(err, n) => {
			if (err) {
				res.status(500).json(err);
			} else {
				res.status(200).json(n);
			}
		}
	);
});

router.delete("/:websiteId", (req, res) => {
	const { websiteId } = req.params;
	database.websites.remove({ _id: websiteId }, (err, n) => {
		if (err) {
			res.status(500).json(err);
		} else {
			res.status(200).json(n);
		}
	});
});

export default router;
