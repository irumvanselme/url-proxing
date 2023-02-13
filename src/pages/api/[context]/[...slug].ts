import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { proxyConf } from '../../../utils';
import NextCors from 'nextjs-cors';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
  console.log(proxyConf[req.query.context as string]);

	let slugs = (req.query.slug as string[]) || [];
	let instance = axios.create({
		baseURL:
			proxyConf[req.query.context as string] || 'http://google.com',
	});

	await NextCors(req, res, {
		// Options
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
		origin: '*',
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	});

	try {
		let data = await instance({
			method: req.method?.toLowerCase(),
			url: slugs.join('/'),
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
