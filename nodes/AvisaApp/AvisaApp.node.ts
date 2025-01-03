import {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
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
					{
						name: 'Instance',
						value: 'instance',
						description: 'Instance operations',
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
						description: 'Send a document base64',
						action: 'Send a document base64',
					},
					{
						name: 'Send Image',
						value: 'sendImage',
						description: 'Send an image base64',
						action: 'Send an image base64',
					},
					{
						name: 'Send Media',
						value: 'sendMedia',
						description: 'Send a media file (image/video/audio)',
						action: 'Send a media file url',
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
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'instance',
						],
					},
				},
				options: [
					{
						name: 'Check Status',
						value: 'checkStatus',
						description: 'Check if instance is connected',
						action: 'Check if instance is connected',
					},
					{
						name: 'Get QR Code',
						value: 'getQR',
						description: 'Get QR code for scanning',
						action: 'Get QR code for scanning',
					},
				],
				default: 'checkStatus',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
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
							'sendMedia',
						],
					},
				},
				description: 'Phone number in international format or JID',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
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
				typeOptions: {
					alwaysOpenEditWindow: true,
					rows: 4,
					maxDataSize: 100 * 1024 * 1024, // 100MB limit
				},
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
				description: 'Document encoded in Base64 or binary file data',
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
				description: 'Caption for media file',
			},
			{
				displayName: 'Image',
				name: 'image',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
					rows: 4,
					maxDataSize: 100 * 1024 * 1024, // 100MB limit
				},
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
				description: 'Image encoded in Base64 or binary file data',
			},
			{
				displayName: 'File URL',
				name: 'urlFile',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendMedia',
						],
					},
				},
				description: 'URL of the file to send',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{
						name: 'Image',
						value: 'image',
					},
					{
						name: 'Video',
						value: 'video',
					},
					{
						name: 'Audio',
						value: 'audio',
					},
					{
						name: 'Document',
						value: 'document',
					},
				],
				default: 'image',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendMedia',
						],
					},
				},
				description: 'Type of media being sent',
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
							'sendMedia',
						],
					},
				},
				description: 'Name of the file to be sent',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: [
							'message',
						],
						operation: [
							'sendMedia',
						],
					},
				},
				description: 'Message text to send with the media',
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
						const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
						const mensagem = this.getNodeParameter('mensagem', i) as string;

						const body = {
							numero: phoneNumber,
							mensagem,
						};

						const url = `${baseUrl}/actions/sendMessage`;
						console.log('Making request to:', url);
						console.log('Request body:', body);

						try {
							// Format the authorization header
							const authHeader = `Bearer ${credentials.apiToken.trim()}`;

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
						} catch (error) {
							if (error.response && (error.response.status === 400 || error.response.status === 401)) {
								returnData.push({
									success: false,
									error: error.response.data.error || error.message,
								});
							} else {
								throw error;
							}
						}
					}
					else if (operation === 'sendDocument') {
						const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
						const document = this.getNodeParameter('document', i) as string;
						const fileName = this.getNodeParameter('fileName', i) as string;
						const caption = this.getNodeParameter('caption', i) as string;

						const body = {
							number: phoneNumber,
							document,
							fileName,
							caption,
						};

						const url = `${baseUrl}/actions/sendDocument`;
						console.log('Making request to:', url);
						console.log('Request body:', {
							...body,
							document: body.document.substring(0, 50) + '... [content truncated]'
						});

						try {
							// Format the authorization header
							const authHeader = `Bearer ${credentials.apiToken.trim()}`;

							const response = await this.helpers.httpRequest({
								method: 'POST',
								url,
								body,
								headers: {
									'Authorization': authHeader,
									'Content-Type': 'application/json',
								},
								timeout: 300000, // 5 minutes timeout for large files
							});

							console.log('Response:', JSON.stringify(response));
							returnData.push(response as IDataObject);
						} catch (error) {
							console.log('Error response:', JSON.stringify(error.response?.data));

							if (error.response && (error.response.status === 400 || error.response.status === 401)) {
								const errorMessage = error.response.data?.message || error.response.data?.error || error.message;
								returnData.push({
									success: false,
									error: errorMessage,
								});
							} else {
								throw error;
							}
						}
					}
					else if (operation === 'sendImage') {
						const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
						const image = this.getNodeParameter('image', i) as string;
						const caption = this.getNodeParameter('caption', i) as string;

						// Validate image size
						if (Buffer.from(image, 'base64').length > 100 * 1024 * 1024) {
							throw new NodeOperationError(this.getNode(), 'Image size exceeds 100MB limit', { itemIndex: i });
						}

						const body = {
							number: phoneNumber,
							image,
							caption,
						};

						const url = `${baseUrl}/actions/sendImage`;
						console.log('Making request to:', url);
						console.log('Request body:', {
							...body,
							image: body.image.substring(0, 50) + '... [content truncated]'
						});

						try {
							// Format the authorization header
							const authHeader = `Bearer ${credentials.apiToken.trim()}`;

							const response = await this.helpers.httpRequest({
								method: 'POST',
								url,
								body,
								headers: {
									'Authorization': authHeader,
									'Content-Type': 'application/json',
								},
								timeout: 300000, // 5 minutes timeout for large files
							});

							console.log('Response:', JSON.stringify(response));
							returnData.push(response as IDataObject);
						} catch (error) {
							if (error.response && (error.response.status === 400 || error.response.status === 401)) {
								returnData.push({
									success: false,
									error: error.response.data.error || error.message,
								});
							} else {
								throw error;
							}
						}
					}
					else if (operation === 'sendMedia') {
						const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
						const urlFile = this.getNodeParameter('urlFile', i) as string;
						const type = this.getNodeParameter('type', i) as string;
						const fileName = this.getNodeParameter('fileName', i) as string;
						const message = this.getNodeParameter('message', i) as string;

						const body = {
							numero: phoneNumber,
							urlFile,
							type,
							fileName,
							mensagem: message,
						};

						const url = `${baseUrl}/actions/sendMedia`;
						console.log('Making request to:', url);
						console.log('Request body:', body);

						try {
							// Format the authorization header
							const authHeader = `Bearer ${credentials.apiToken.trim()}`;

							const response = await this.helpers.httpRequest({
								method: 'POST',
								url,
								body,
								headers: {
									'Authorization': authHeader,
									'Content-Type': 'application/json',
								},
								timeout: 300000, // 5 minutes timeout for large files
							});

							console.log('Response:', JSON.stringify(response));
							returnData.push(response as IDataObject);
						} catch (error) {
							console.log('Error response:', JSON.stringify(error.response?.data));

							if (error.response && (error.response.status === 400 || error.response.status === 401)) {
								const errorMessage = error.response.data?.message || error.response.data?.error || error.message;
								returnData.push({
									success: false,
									error: errorMessage,
								});
							} else {
								throw error;
							}
						}
					}
				}
				else if (resource === 'contact') {
					if (operation === 'checkNumber') {
						const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;

						const body = {
							numero: phoneNumber,
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
									success: true,
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
				else if (resource === 'instance') {
					if (operation === 'checkStatus') {
						const url = `${baseUrl}/instance/status`;
						console.log('Making request to:', url);

						try {
							// Format the authorization header
							const authHeader = `Bearer ${credentials.apiToken.trim()}`;

							const response = await this.helpers.httpRequest({
								method: 'GET',
								url,
								headers: {
									'Authorization': authHeader,
									'Content-Type': 'application/json',
								},
							});

							console.log('Response:', JSON.stringify(response));
							returnData.push(response as IDataObject);
						} catch (error) {
							console.log('Error response:', JSON.stringify(error.response?.data));

							if (error.response && (error.response.status === 400 || error.response.status === 401)) {
								const errorMessage = error.response.data?.message || error.response.data?.error || error.message;
								returnData.push({
									success: false,
									error: errorMessage,
								});
							} else {
								throw error;
							}
						}
					} else if (operation === 'getQR') {
						const url = `${baseUrl}/instance/qr`;
						console.log('Making request to:', url);

						try {
							// Format the authorization header
							const authHeader = `Bearer ${credentials.apiToken.trim()}`;

							const response = await this.helpers.httpRequest({
								method: 'GET',
								url,
								headers: {
									'Authorization': authHeader,
									'Accept': 'application/json',
								},
							});

							console.log('Response:', JSON.stringify(response));
							returnData.push(response as IDataObject);
						} catch (error) {
							console.log('Error response:', JSON.stringify(error.response?.data));

							if (error.response && (error.response.status === 400 || error.response.status === 401)) {
								const errorMessage = error.response.data?.message || error.response.data?.error || error.message;
								returnData.push({
									success: false,
									error: errorMessage,
								});
							} else {
								throw error;
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
