import {
	INodeProperties,
} from 'n8n-workflow';

export const contactListOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'contactList',
				],
			},
		},
		options: [
			{
				name: 'Add',
				value: 'add',
				description: 'Add contactt to a list',
			},
			{
				name: 'Remove',
				value: 'remove',
				description: 'Remove contactt from a list',
			},
		],
		default: 'add',
		description: 'The operation to perform.',
	},
] as INodeProperties[];

export const contactListFields = [
	// ----------------------------------
	//         contactList:add
	// ----------------------------------
	{
		displayName: 'List ID',
		name: 'listId',
		type: 'number',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: [
					'add',
				],
				resource: [
					'contactList',
				],
			},
		},
		description: 'List ID',
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'number',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: [
					'add',
				],
				resource: [
					'contactList',
				],
			},
		},
		description: 'Contact ID',
	},
	// ----------------------------------
	//         contactList:remove
	// ----------------------------------
	{
		displayName: 'List ID',
		name: 'listId',
		type: 'number',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: [
					'remove',
				],
				resource: [
					'contactList',
				],
			},
		},
		description: 'List ID',
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'number',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: [
					'remove',
				],
				resource: [
					'contactList',
				],
			},
		},
		description: 'Contact ID',
	},
] as INodeProperties[];
