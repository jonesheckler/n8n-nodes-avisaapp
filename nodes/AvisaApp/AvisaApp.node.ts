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
		description: 'Consume Avisa App API',
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
				description: 'Base64 encoded document',
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
				description: 'Caption for the document or image',
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
				description: 'Base64 encoded image',
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
