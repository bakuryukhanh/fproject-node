import { IExecuteFunctions } from 'n8n-core';
import { INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
import HtmlTableToJson from 'html-table-to-json';
import moment from 'moment';
import { OptionsWithUrl } from 'request-promise-native';

export class Fproject implements INodeType {
	description: INodeTypeDescription = {
		// Basic node details will go here
		displayName: 'Fproject',
		name: 'fproject',
		icon: 'file:Fproject.svg',
		group: ['output'],
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
			{ displayName: 'Month', name: 'month', type: 'string', default: '', required: true },
			{
				displayName: 'Year',
				name: 'year',
				type: 'string',
				default: '',
				required: true,
			},
		],
	};
	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		const token = this.getNodeParameter('apiKey', 0) as string;
		const month = this.getNodeParameter('month', 0) as string;
		const year = this.getNodeParameter('year', 0) as string;
		console.log(month, year);
		const options: OptionsWithUrl = {
			headers: {
				Authorization: `Basic ${token}`,
				Cookie:
					'_redmine_session=UzNscUM5ZmZHRjVIZ2N4d3RlVG13eHoxSkY0YVBLR25tMC9NQ2FkL3o3elFsVTFkL0JDanlRRC9Yek5PaXBodHVKWWw3WHpBV1hsOXBybFR6WmwybkF2b0ZtdUVMWlVVWHJza1dCSDNZTUFCb0o4RlJsZU5KKzR6NlNCTG5PdUdGS3ZRWGVCUTQvYWU3RjRMWXh1YWJXdXFBck50Ym0xQVlQTlh1Sy9IMU9WY0cvZDRQSFJuYTZ3WlJKd1o5eDRXWnFTdFAxbTZobVVtVWhZWDdFQnUxTWZEUWk5TTdaWVNDN20rYzFTeWVZNXlrN25GNjA0djA5NCtxdXlDNE04QUVmMHBTemIvc1RYWGJ1aHplL0NBUGNIQnpsRVNvRnhqUW05UGk1ZzlZeUJTN1lvQkJ6bnRpemZIcE5XNnlyeXgtLWVuZ21kUVNJN0tUWXhPK2NFU0lRWEE9PQ%3D%3D--e0943a46b71d37a15bf03b55e3a872c13317f269; autologin=3d2a2a9abd91faed05c7dadefaafb43092b6f064',
			},
			method: 'GET',
			// url: 'http://fproject.fpt.vn/userskpi?utf8=%E2%9C%93&set_filter=1&sort=&f%5B%5D=option_kpi&op%5Boption_kpi%5D=%3D&v%5Boption_kpi%5D%5B%5D=report&f%5B%5D=month_kpi&op%5Bmonth_kpi%5D=%3D&v%5Bmonth_kpi%5D%5B%5D=2023-01&f%5B%5D=',
			url: 'http://fproject.fpt.vn/userskpi',
			qs: {
				utf8: '✓',
				set_filter: 1,
				sort: '',
				'f[]': ['option_kpi', 'month_kpi'],
				'op[option_kpi]': '=',
				'v[option_kpi][]': 'report',
				'op[month_kpi]': '=',
				'v[month_kpi][]': `${year}-${month}`,
			},
			useQuerystring: true,
			rejectUnauthorized: false,
		};
		const MEMBER = [
			'huyhg3',
			'huyhq29',
			'uytkg',
			'khanhtv21',
			'ducnc10',
			'thanhnv97',
			'dungtd10',
			'locntx',
			'philk',
			'taivp',
			'sangtt9',
		];

		const TARGET_POINT = {
			DEV01: 738,
			DEV02: 702,
			DEV03: 666,
		};
		const daysInMonth = moment().daysInMonth();
		const today = moment().date();
		const quotaDate = ((today / daysInMonth) * 100).toFixed(0);
		let result: any[] = [];
		console.log('options', options);

		try {
			responseData = await this.helpers.request(options);

			const jsonTables = new HtmlTableToJson(responseData);

			const resultExcel = jsonTables.results[1];

			resultExcel.forEach((item: any) => {
				if (MEMBER.includes(item['Tên đăng nhập'].toLowerCase())) {
					const targetPointIdx: 'DEV01' | 'DEV02' | 'DEV03' = item['Chức Danh'];
					const performancePoint = (
						(+item['Tổng Điểm'] / TARGET_POINT[targetPointIdx]) *
						100
					).toFixed(0);
					const performanceResult = +performancePoint >= +quotaDate ? 'OK' : 'NOT OK';
					result.push({
						name: item['Tên đăng nhập'].toLowerCase(),
						currentPoint: +item['Tổng Điểm'],
						performancePoint: `${performancePoint}%`,
						performanceResult,
					});
				}
			});
		} catch (err) {
			console.log('err', err);
		}
		return [this.helpers.returnJsonArray(result)];
	}
}
