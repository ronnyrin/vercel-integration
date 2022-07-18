import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Layout from 'components/layout'
import styles from './callback.module.css'
import Loader from '../components/loader';

export default function CallbackPage() {
	const router = useRouter()
	const [data, setData] = useState({})
	const [projects, setProjects] = useState()
	const [domains, setDomains] = useState()
	const [step, setStep] = useState('split')
	const [domain, setDomain] = useState('')

	useEffect(() => {
		const fetchAccessToken = async (code) => {
			const res = await fetch(`/api/get-access-token?code=${code}`)
			const json = await res.json()

			setData({
				accessToken: json.access_token,
				userId: json.user_id,
				teamId: json.team_id,
			})
		}

		if (router.isReady && !data.accessToken) {
			const {code} = router.query
			fetchAccessToken(code)
		}
	}, [router])

	useEffect(() => {
		const fetchProjects = async (accessToken, teamId) => {
			if (accessToken) {
				{/* If we have a teamId, all calls to the Vercel API should have it attached as a query parameter */
				}
				const res = await fetch(`https://api.vercel.com/v4/projects${teamId ? `?teamId=${teamId}` : ''}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				})
				const json = await res.json()

				setProjects(json.projects)
			}
		}

		const {accessToken, teamId} = data
		fetchProjects(accessToken, teamId)
	}, [data])

	useEffect(() => {
		const fetchDomains = async (accessToken, teamId) => {
			if (accessToken) {
				{/* If we have a teamId, all calls to the Vercel API should have it attached as a query parameter */
				}
				const res = await fetch(`https://api.vercel.com/v9/projects/${projects[0].id}/domains${teamId ? `?teamId=${teamId}` : ''}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				})
				const json = await res.json()

				setDomains(json.domains)
				setDomain(json.domains[0].name)
			}
		}

		const {accessToken, teamId} = data
		fetchDomains(accessToken, teamId)
	}, [projects])

	const createAStore = () => {
		setStep('createNew');
	}

	const showConnectTab = () => {
		setStep('connect');
	}

	const connectSite = async () => {
		const siteUrl = document.querySelector('#site-url').value;
		await fetch(`/api/add-env-param?siteUrl=${siteUrl}&domain=${domain}&projectId=${projects[0].id}&accessToken=${data.accessToken}${data.teamId ? `&teamId=${data.teamId}` : ''}`)
		router.push(router.query.next)
	}

	const back = () => {
		setStep('split');
	}

	return (
		<Layout>
			<div className="w-full max-w-2xl divide-y">
				<div className="flex flex-row items-center justify-center">
					<div className={styles.Logo}>
						<svg xmlns="http://www.w3.org/2000/svg" width="100" height="121" viewBox="0 0 311 121">
							<path fill="#FBBD71"
							      d="M178 2.3c-6 3-8.6 8.6-8.6 23.8 0 0 3-3 7.8-4.8 3.5-1.3 6-3 7.8-4.3 5.2-3.9 6-8.6 6-16.8C190.9 0.2 182.7-0.3 178 2.3z"/>
							<path fill="#000000"
							      d="M141.3 5.8c-5.2 4.3-6.5 11.7-6.5 11.7l-16.8 64.4 -13.8-52.7c-1.3-5.6-3.9-12.5-7.8-17.3C91.6 5.8 81.6 5.4 80.4 5.4c-0.9 0-10.8 0.4-16 6.5 -3.9 4.8-6.5 11.7-7.8 17.3l-13 52.7L26.8 17.5c0 0-1.3-6.9-6.5-11.7C12.1-1.6 0 0.2 0 0.2l32 120.5c0 0 10.4 0.9 15.6-1.7 6.9-3.5 10.4-6 14.3-22.5 3.9-14.7 14.3-57.5 15.1-60.5 0.4-1.3 1.3-5.2 3.9-5.2 2.6 0 3.5 3.5 3.9 5.2 0.9 3 11.2 45.8 15.1 60.5 4.3 16.4 7.3 19 14.3 22.5 5.2 2.6 15.6 1.7 15.6 1.7L161.6 0.2C161.6 0.2 149.5-1.5 141.3 5.8z"/>
							<path fill="#000000"
							      d="M190.9 19.6c0 0-2.2 3-6.5 5.6 -3 1.7-5.6 2.6-8.6 4.3 -5.2 2.6-6.5 5.2-6.5 9.1v1.3 6.5l0 0v1.3 72.6c0 0 8.2 0.9 13.4-1.7 6.9-3.5 8.2-6.9 8.2-21.6V24.4l0 0L190.9 19.6 190.9 19.6z"/>
							<path fill="#000000"
							      d="M270.4 60.7L311 0.6c0 0-16.8-3-25.5 4.8 -5.6 4.8-11.2 13.8-11.2 13.8l-14.7 21.6c-0.9 1.3-1.7 2.2-3 2.2s-2.6-1.3-3-2.2l-14.7-21.6c0 0-6-8.6-11.2-13.8 -8.6-7.8-25.5-4.8-25.5-4.8l39.3 60 -40.2 60c0 0 17.7 2.2 26.4-5.6 5.6-4.8 10.8-13 10.8-13l14.7-21.6c0.9-1.3 1.7-2.2 3-2.2s2.6 1.3 3 2.2l14.7 21.6c0 0 5.6 8.2 10.8 13 8.6 7.8 25.9 5.6 25.9 5.6L270.4 60.7z"/>
						</svg>
					</div>
					<div className="px-4 ">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g opacity="0.4">
								<path d="M12.3289 5.19299V18.7018" stroke="black" strokeWidth="2.325" strokeLinecap="round"
								      strokeLinejoin="round"></path>
								<path d="M5.57452 11.9473H19.0833" stroke="black" strokeWidth="2.325" strokeLinecap="round"
								      strokeLinejoin="round"></path>
							</g>
						</svg>
					</div>
					<div className={styles.Logo} style={{backgroundColor: 'black'}}>
						<svg width="25" height="48" viewBox="0 0 54 48" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fillRule="evenodd" clipRule="evenodd" d="M26.7404 0.78949L53.4808 47.1053H0L26.7404 0.78949Z"
							      fill="white"></path>
						</svg>
					</div>
				</div>

				{step === 'split' &&
				(<div className="grid grid-cols-2 gap-8 text-center mt-10 pt-10">
					<div className={styles.Card}><h2 className="font-bold">New to Wix?</h2>
						<div className="px-1">Try Wix for <strong>free</strong>, and explore all you need to
							start, run, and grow your business.
						</div>
						<button data-variant="basic" className={styles.Button} onClick={createAStore}>Create a Store</button>
					</div>
					<div className={styles.Card}><h2 className="font-bold">Already own a Wix Store</h2>
						<div className="px-1">Connect your existing Wix Store with one or multiple Vercel
							projects in a couple of seconds.
						</div>
						<button data-variant="primary" className={styles.Button} onClick={showConnectTab}
						        style={{backgroundColor: '#3899ec'}}>Connect with Wix
						</button>
					</div>
				</div>)}

				{step === 'createNew' && (
					<div className={styles.Card}><h2 className="font-bold">Creating a new Wix Store</h2>
						<div className="Text_body__V9VBQ">To create a new Wix account click <strong>Create Wix Store</strong>.
							The flow will continue in another window. Once the store has been created, return to connect the newly
							created store with Vercel.
						</div>
						<div className="flex flex-row items-center mt-5"><a data-variant="primary"
						                                                    style={{backgroundColor: '#3899ec'}}
						                                                    className={styles.Button}
						                                                    href="https://wix.com/new/intro" target="_blank"
						                                                    rel="noreferrer">Create Wix Store</a>
							<button data-variant="plain" className={styles.Button} onClick={showConnectTab}
							        style={{marginLeft: '10px', border: 0, boxShadow: 'none'}}>I already created a Wix
								Store
							</button>
						</div>
					</div>)}

				{step === 'connect' && (
					<div className={styles.Card}>
						<div className="p-6"><h2 className="font-bold">Connect a Wix Store to a Vercel
							Project</h2>
							<div className="Text_body__V9VBQ">Select a Vercel Project and connect it with your Wix Store. <br/>Make
								sure that you are using the right URL Store.
							</div>
						</div>
						<div className="flex flex-col px-6 pb-6">
							<div className="relative"><label htmlFor="project"
							                                 className="block text-sm font-medium text-gray-700 mb-1.5">Vercel
								Project</label>{projects ? projects.map(project => (
								<span key={project.id} className={styles.Project}>{project.name}</span>)) : <Loader/>}</div>
						</div>
						<div className="border-t pt-6 pb-6">
							<div className="px-6"><label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-1.5">Wix's
								Store URL</label>
								<div className="flex shadow-sm flex-grow"><input id="site-url" type="text" name="store"
								                                                 placeholder="your wix site"
								                                                 className={styles.Connect}
								/>
								</div>
							</div>
						</div>
						{/*<div className="pt-6 pb-6">*/}
						{/*	<div className="px-6"><label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-1.5">Vercel's Domain</label>*/}
						{/*		<div className="flex shadow-sm flex-grow"><input id="vercel-url" type="text" name="vercel"*/}
						{/*		                                                 placeholder="your vercel domain"*/}
						{/*		                                                 value={domain}*/}
						{/*		                                                 onChange={(e) => setDomain(e.target.value)}*/}
						{/*		                                                 className={styles.Connect}*/}
						{/*		/>*/}
						{/*		</div>*/}
						{/*	</div>*/}
						{/*</div>*/}
						<div className="border-t border-accent-2 bg-accent-1 rounded-b-md">
							<div className="flex items-center justify-end p-6 ">
								<button data-variant="plain" className={styles.Button} onClick={back} type="button">Go back
								</button>
								<button data-variant="primary"
								        className={styles.Button} onClick={connectSite}
								        style={{backgroundColor: '#3899ec', marginLeft: '10px'}} disabled=""
								        type="submit">Connect
								</button>
							</div>
						</div>
					</div>)}
			</div>
		</Layout>
	)
}
