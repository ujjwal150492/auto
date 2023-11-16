import type { IBinaryData, IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError, BINARY_ENCODING } from 'n8n-workflow';
import type { WorkBook, WritingOptions } from 'xlsx';
import { utils as xlsxUtils, write as xlsxWrite } from 'xlsx';
import { flattenObject } from '@utils/utilities';

import get from 'lodash/get';
import iconv from 'iconv-lite';

export type JsonToSpreadsheetBinaryFormat = 'csv' | 'html' | 'rtf' | 'ods' | 'xls' | 'xlsx';

export type JsonToSpreadsheetBinaryOptions = {
	headerRow?: boolean;
	compression?: boolean;
	fileName?: string;
	sheetName?: string;
};

export type JsonToBinaryOptions = {
	fileName?: string;
	sourceKey?: string;
	encoding?: string;
	addBOM?: boolean;
	mimeType?: string;
	dataIsBase64?: boolean;
	itemIndex?: number;
};

export async function convertJsonToSpreadsheetBinary(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	fileFormat: JsonToSpreadsheetBinaryFormat,
	options: JsonToSpreadsheetBinaryOptions,
	defaultFileName = 'spreadsheet',
): Promise<IBinaryData> {
	const itemData: IDataObject[] = [];
	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
		itemData.push(flattenObject(items[itemIndex].json));
	}

	let sheetToJsonOptions;
	if (options.headerRow === false) {
		sheetToJsonOptions = { skipHeader: true };
	}

	const sheet = xlsxUtils.json_to_sheet(itemData, sheetToJsonOptions);

	const writingOptions: WritingOptions = {
		bookType: fileFormat,
		bookSST: false,
		type: 'buffer',
	};

	if (['xlsx', 'ods'].includes(fileFormat) && options.compression) {
		writingOptions.compression = true;
	}

	// Convert the data in the correct format
	const sheetName = (options.sheetName as string) || 'Sheet';
	const workbook: WorkBook = {
		SheetNames: [sheetName],
		Sheets: {
			[sheetName]: sheet,
		},
	};

	const buffer: Buffer = xlsxWrite(workbook, writingOptions);
	const fileName =
		options.fileName !== undefined ? options.fileName : `${defaultFileName}.${fileFormat}`;
	const binaryData = await this.helpers.prepareBinaryData(buffer, fileName);

	return binaryData;
}

export async function createBinaryFromJson(
	this: IExecuteFunctions,
	data: IDataObject | IDataObject[],
	options: JsonToBinaryOptions,
): Promise<IBinaryData> {
	let value;
	if (options.sourceKey) {
		value = get(data, options.sourceKey) as IDataObject;
	} else {
		value = data;
	}

	if (value === undefined) {
		throw new NodeOperationError(this.getNode(), `The value in "${options.sourceKey}" is not set`, {
			itemIndex: options.itemIndex || 0,
		});
	}

	let buffer: Buffer;
	if (!options.dataIsBase64) {
		let valueAsString = value as unknown as string;

		if (typeof value === 'object') {
			options.mimeType = 'application/json';
			valueAsString = JSON.stringify(value);
		}

		buffer = iconv.encode(valueAsString, options.encoding || 'utf8', {
			addBOM: options.addBOM,
		});
	} else {
		buffer = Buffer.from(value as unknown as string, BINARY_ENCODING);
	}

	const binaryData = await this.helpers.prepareBinaryData(
		buffer,
		options.fileName,
		options.mimeType,
	);

	if (!binaryData.fileName) {
		const fileExtension = binaryData.fileExtension ? `.${binaryData.fileExtension}` : '';
		binaryData.fileName = `file${fileExtension}`;
	}

	return binaryData;
}