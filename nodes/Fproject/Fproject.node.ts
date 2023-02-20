import { IExecuteFunctions } from 'n8n-core';

import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';

import { OptionsWithUri } from 'request';

export class FriendGrid implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Fproject',
		name: 'fproject',
		icon: 'file:Fproject.svg',
		group: ['transform'],
		version: 1,
		description: 'Get KPI from Fproject',
		defaults: {
			name: 'fproject',
		},
		inputs: ['main'],
		outputs: ['main'],
		// credentials: [
		// 	{
		// 		name: 'friendGridApi',
		// 		required: true,
		// 	},
		// ],

		properties: [
			// Resources and operations will go here
			{ displayName: 'Api Key', name: 'apiKey', type: 'string', default: '', required: true },
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const token = this.getNodeParameter('resource', 0) as string;

		const options: OptionsWithUri = {
			headers: {
				Authorization: `Basic ${token}`,
				Cookie:
					'_redmine_session=UzNscUM5ZmZHRjVIZ2N4d3RlVG13eHoxSkY0YVBLR25tMC9NQ2FkL3o3elFsVTFkL0JDanlRRC9Yek5PaXBodHVKWWw3WHpBV1hsOXBybFR6WmwybkF2b0ZtdUVMWlVVWHJza1dCSDNZTUFCb0o4RlJsZU5KKzR6NlNCTG5PdUdGS3ZRWGVCUTQvYWU3RjRMWXh1YWJXdXFBck50Ym0xQVlQTlh1Sy9IMU9WY0cvZDRQSFJuYTZ3WlJKd1o5eDRXWnFTdFAxbTZobVVtVWhZWDdFQnUxTWZEUWk5TTdaWVNDN20rYzFTeWVZNXlrN25GNjA0djA5NCtxdXlDNE04QUVmMHBTemIvc1RYWGJ1aHplL0NBUGNIQnpsRVNvRnhqUW05UGk1ZzlZeUJTN1lvQkJ6bnRpemZIcE5XNnlyeXgtLWVuZ21kUVNJN0tUWXhPK2NFU0lRWEE9PQ%3D%3D--e0943a46b71d37a15bf03b55e3a872c13317f269; autologin=3d2a2a9abd91faed05c7dadefaafb43092b6f064',
			},
			method: 'GET',
			uri: 'http://fproject.fpt.vn/userskpi?utf8=%E2%9C%93&set_filter=1&sort=&f%5B%5D=option_kpi&op%5Boption_kpi%5D=%3D&v%5Boption_kpi%5D%5B%5D=report&f%5B%5D=month_kpi&op%5Bmonth_kpi%5D=%3D&v%5Bmonth_kpi%5D%5B%5D=2023-01&f%5B%5D=',
			json: true,
		};
		responseData = await this.helpers.request(options);
		return [this.helpers.returnJsonArray(responseData)];
	}
}
