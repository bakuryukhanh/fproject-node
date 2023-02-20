import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class FprojectApi implements ICredentialType {
	name = 'fprojectApi';
	displayName = 'Fproject API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: 'Basic {{$credentials.apiKey}}',
			},
		},
	};

	// test: ICredentialTestRequest = {
	// 	request: {
	// 		baseURL: 'https://api.sendgrid.com/v3',
	// 		url: '/marketing/contacts',
	// 	},
	// };
}
