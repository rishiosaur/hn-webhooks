/* eslint-disable global-require */
import { NextApiRequest, NextApiResponse } from 'next'
import { gql, GraphQLClient } from 'graphql-request'
import axios from 'axios'
import { apiURL, adminToken } from '../../../../lib/index'

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const { user, type, id } = req.query

	if (req.headers?.token === adminToken) {
		const client = new GraphQLClient(apiURL, {
			headers: {
				admin: req.headers?.token,
			},
		})

		if (type === 'payments') {
			const query = gql`
				query Hooks($user: String!) {
					user(id: $user) {
						paymentWebhooks {
							url
						}
					}
				}
			`

			const {
				user: { paymentWebhooks: hooks },
			} = await client.request(query, {
				user,
			})

			console.log(
				await Promise.allSettled(
					(hooks as { url: string }[]).map(({ url }) =>
						axios.post(url, {
							body: {
								type: 'payment',
								id,
							},
							timeout: 300,
						})
					)
				)
			)
		} else {
			const query = gql`
				query Hooks($user: String!) {
					user(id: $user) {
						transactionWebhooks {
							url
						}
					}
				}
			`

			const {
				user: { transactionWebhooks: hooks },
			} = await client.request(query, {
				user,
			})

			await Promise.allSettled(
				(hooks as { url: string }[]).map(({ url }) =>
					axios.post(url, {
						body: {
							type: 'transaction',
							id,
						},
						timeout: 300,
					})
				)
			)
		}
		console.log('hhhhh')
		res.end('hi')
	}
	res.end('hi')
}

export default Handler
