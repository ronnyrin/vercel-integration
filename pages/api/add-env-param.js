export default async function addEnvParam(req, res) {
	const project = req.query.projectId;
	const siteUrl = req.query.siteUrl;
	const domain = req.query.domain;
	const teamId = req.query.teamId;
	const result = await fetch(`https://api.vercel.com/v9/projects/${project}/env${teamId ? `?teamId=${teamId}` : ''}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${req.query.accessToken}`
		},
		method: 'POST',
		body: JSON.stringify([{
			key: 'NEXT_PUBLIC_WIX_VIEWER_URL',
			value: siteUrl,
			type: 'plain',
			target: ['development', 'preview', 'production']
		}, {
			key: 'NEXT_PUBLIC_WIX_DOMAIN',
			value: domain,
			type: 'plain',
			target: ['development', 'preview', 'production']
		}])
	})
	const body = await result.json()

	const siteModel = await (await fetch(`${siteUrl}?dumpSiteModel=true`)).json();
	const msid = siteModel.rendererModel.metaSiteId;

	const poc = await (await fetch(`https://www.wix.com/_serverless/external-sites-store-poc-service/v1/external-sites/${domain}/${msid}`, {
		method: 'POST'
	})).json();

	console.log(JSON.stringify(body, null, '  '))
	console.log(JSON.stringify(msid, null, '  '))
	console.log(JSON.stringify(poc, null, '  '))

	res.status(200).json(body)
}
