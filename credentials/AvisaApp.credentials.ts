import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AvisaApp implements ICredentialType {
	name = 'avisaApp';
	displayName = 'Avisa App API';
	documentationUrl = 'https://www.avisaapp.com.br';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The API token for authentication (without Bearer prefix)',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://www.avisaapp.com.br/api/v2',
			placeholder: 'https://www.avisaapp.com.br/api/v2',
			description: 'The base URL for the Avisa App API (without trailing slash)',
			required: true,
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};
}
