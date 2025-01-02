import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class AvisaApp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Avisa App',
		name: 'avisaApp',
		icon: 'file:avisaapp.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Integration with Avisa App API',
		defaults: {
			name: 'Avisa App',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'avisaAppApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
				],
				default: 'message',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
					},
				},
				options: [
					{
						name: 'Send Text',
						value: 'sendText',
						description: 'Send a text message',
						action: 'Send a text message',
					},
					{
						name: 'Send Document',
						value: 'sendDocument',
						description: 'Send a document',
						action: 'Send a document',
					},
					{
						name: 'Send Image',
						value: 'sendImage',
						description: 'Send an image',
						action: 'Send an image',
					},
				],
				default: 'sendText',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'contact',
						],
					},
				},
				options: [
					{
						name: 'Check Number',
						value: 'checkNumber',
						description: 'Check if a number is registered on WhatsApp',
						action: 'Check if a number is registered on whatsapp',
					},
				],
				default: 'checkNumber',
			},
			{
				displayName: 'Phone Number',
				name: 'numero',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendText',
							'sendDocument',
							'sendImage',
						],
					},
				},
				description: 'Phone number in international format',
			},
			{
				displayName: 'Phone Number',
				name: 'numero',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'contact',
						],
						operation: [
							'checkNumber',
						],
					},
				},
				description: 'Phone number in international format to check',
			},
			{
				displayName: 'Message',
				name: 'mensagem',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendText',
						],
					},
				},
				description: 'Text message to send',
			},
			{
				displayName: 'Document',
				name: 'document',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendDocument',
						],
					},
				},
				description: 'Document encoded in Base64',
			},
			{
				displayName: 'File Name',
				name: 'fileName',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendDocument',
						],
					},
				},
				description: 'Name of the file to be sent',
			},
			{
				displayName: 'Caption',
				name: 'caption',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendDocument',
							'sendImage',
						],
					},
				},
				description: 'Caption for document or image',
			},
			{
				displayName: 'Image',
				name: 'image',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendImage',
						],
					},
				},
				description: 'Image encoded in Base64',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('avisaAppApi') as { apiToken: string; baseUrl: string };

		// Ensure baseUrl doesn't end with a slash
		const baseUrl = credentials.baseUrl.replace(/\/$/, '');

		// Log the base URL for debugging
		console.log('Base URL:', baseUrl);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'message') {
					if (operation === 'sendText') {
						const numero = this.getNodeParameter('numero', i) as string;
						const mensagem = this.getNodeParameter('mensagem', i) as string;

						const body = {
							numero,
							mensagem,
						};

						const url = `${baseUrl}/actions/sendMessage`;
						console.log('Making request to:', url);
						console.log('Request body:', JSON.stringify(body));

						// Format the authorization header
						const authHeader = `Bearer ${credentials.apiToken.trim()}`;
						console.log('Authorization header:', authHeader);

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url,
							body,
							headers: {
								'Authorization': authHeader,
								'Content-Type': 'application/json',
							},
						});

						console.log('Response:', JSON.stringify(response));

						returnData.push(response as IDataObject);
					}
					else if (operation === 'sendDocument') {
						const numero = this.getNodeParameter('numero', i) as string;
						const document = this.getNodeParameter('document', i) as string;
						const fileName = this.getNodeParameter('fileName', i) as string;
						const caption = this.getNodeParameter('caption', i) as string;

						const body = {
							numero,
							document,
							fileName,
							caption,
						};

						const url = `${baseUrl}/actions/sendDocument`;
						console.log('Making request to:', url);
						console.log('Request body:', JSON.stringify(body));

						// Format the authorization header
						const authHeader = `Bearer ${credentials.apiToken.trim()}`;
						console.log('Authorization header:', authHeader);

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url,
							body,
							headers: {
								'Authorization': authHeader,
								'Content-Type': 'application/json',
							},
						});

						console.log('Response:', JSON.stringify(response));

						returnData.push(response as IDataObject);
					}
					else if (operation === 'sendImage') {
						const numero = this.getNodeParameter('numero', i) as string;
						const image = this.getNodeParameter('image', i) as string;
						const caption = this.getNodeParameter('caption', i) as string;

						const body = {
							numero,
							image,
							caption,
						};

						const url = `${baseUrl}/actions/sendImage`;
						console.log('Making request to:', url);
						console.log('Request body:', JSON.stringify(body));

						// Format the authorization header
						const authHeader = `Bearer ${credentials.apiToken.trim()}`;
						console.log('Authorization header:', authHeader);

						const response = await this.helpers.httpRequest({
							method: 'POST',
							url,
							body,
							headers: {
								'Authorization': authHeader,
								'Content-Type': 'application/json',
							},
						});

						console.log('Response:', JSON.stringify(response));

						returnData.push(response as IDataObject);
					}
				}
				else if (resource === 'contact') {
					if (operation === 'checkNumber') {
						const numero = this.getNodeParameter('numero', i) as string;

						const body = {
							numero,
						};

						const url = `${baseUrl}/actions/checknumberinternational`;
						console.log('Making request to:', url);
						console.log('Request body:', JSON.stringify(body));

						// Format the authorization header
						const authHeader = `Bearer ${credentials.apiToken.trim()}`;
						console.log('Authorization header:', authHeader);

						try {
							const response = await this.helpers.httpRequest({
								method: 'POST',
								url,
								body,
								headers: {
									'Authorization': authHeader,
									'Content-Type': 'application/json',
								},
							});

							console.log('Response:', JSON.stringify(response));
							returnData.push({
								success: true,
								isWhatsAppNumber: true,
								...response,
							} as IDataObject);
						} catch (error) {
							// For status code 400, we treat it as a valid response indicating the number is not a WhatsApp number
							if (error.response && error.response.statusCode === 400) {
								console.log('Invalid WhatsApp number response:', JSON.stringify(error.response.body));
								returnData.push({
									success: true, // We mark as success because this is an expected response
									isWhatsAppNumber: false,
									statusCode: 400,
									...error.response.body,
								} as IDataObject);
							} else {
								// For other errors, we treat them as actual errors
								console.log('Error:', error.message);
								returnData.push({
									success: false,
									isWhatsAppNumber: false,
									error: error.message,
									...(error.response?.body || {}),
								} as IDataObject);
							}
						}
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
