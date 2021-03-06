import config from "config";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import _ from "lodash";
import databaseService from "services/database.service";

export const getAll: RequestHandler = (req, res, next) => {
	databaseService.websites.find({}, (err: any, websites: any) => {
		if (err) return next(err);
		res.json(websites);
	});
};

export const getOne: RequestHandler = (req, res, next) => {
	const { websiteId } = req.params;

	databaseService.websites.findOne(
		{ _id: websiteId },
		{},
		{},
		(err, website) => {
			if (err) return next(err);
			res.json(website);
		}
	);
};

export const getTrackerCode: RequestHandler = (req, res, next) => {
	const payload = {
		websiteId: req.params.websiteId,
		apiUrl: config.apiUrl,
	};
	const token = jwt.sign(payload, config.jwtSecret);
	const code = `
    <script>window.sessionRecorderToken="${token}";</script>
    <script src="${config.apiUrl}/bundle/index.js"></script>
    `;
	res.json(code);
};

export const create: RequestHandler = (req, res, next) => {
	const { name, domain, description } = req.body;

	databaseService.websites.create(
		{ name, domain, description, sessions: [] },
		(err, savedWebsite) => {
			if (err) return next(err);
			res.status(200).send(savedWebsite);
		}
	);
};

export const updateOne: RequestHandler = (req, res, next) => {
	const { websiteId } = req.params;
	const data = req.body;

	databaseService.websites.updateOne(
		{ _id: websiteId },
		{ $set: _.pick(data, ["name", "domain", "description"]) },
		{}, // updateOptions
		(err, n) => {
			if (err) return next(err);
			res.json(n);
		}
	);
};

export const deleteOne: RequestHandler = (req, res, next) => {
	const { websiteId } = req.params;
	databaseService.websites.deleteOne({ _id: websiteId }, {}, (err) => {
		if (err) return next(err);
		res.status(204).send();
	});
};
