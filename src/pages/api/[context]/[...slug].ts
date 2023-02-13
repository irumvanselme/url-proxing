import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { proxyConf } from '../../../utils';

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

	try {
		let data = await instance({
			method: req.method?.toLowerCase(),
			url: slugs.join('/'),
			headers: {
				...req.headers,
			},
			data: req.body,
		});

		return res.send(data.data);
	} catch (error: any) {
		return res.send(error.response.data);
	}
}
