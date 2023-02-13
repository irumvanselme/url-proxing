import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { proxyConf } from '../../../utils';
import NextCors from 'nextjs-cors';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	let slugs = (req.query.slug as string[]) || [];

	let instance = axios.create({
		baseURL:
			proxyConf[req.query.context as string] || 'http://google.com',
	});

	let others = {
		...req.query
	}

	delete others.context
	delete others.slug

	function serialize(obj: any) {
		let str =
			'?' +
			Object.keys(obj)
				.reduce(function (a, k) {
					// @ts-ignore
					a.push(k + '=' + encodeURIComponent(obj[k]));
					return a;
				}, [])
				.join('&');
		return str;
	}

	await NextCors(req, res, {
		// Options
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
		origin: '*',
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	});

	try {
		let data = await instance({
			method: req.method?.toLowerCase(),
			url: slugs.join('/')+serialize(others),
			headers: {
				...req.headers,
			},
			data: req.body,
		});

		return res.status(data.status).send(data.data);
	} catch (error: any) {
		return res.status(error.response.status).send(error.response.data);
	}
}
