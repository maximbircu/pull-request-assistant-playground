import { JsonUtils } from '../../../src/infrastructure/utils/JsonUtils'

test('overrides the config properly', () => {
    const result = JsonUtils.overrideJsonObject(
        {
            'assistant_name': 'friday',
            'log_level': 'info'
        }, {
            'assistant_name': './friday',
            'log_level': 'error',
            'assistant_controllers': ['bob'],
            'commands': {
                'merge': {
                    'default_merge_method': 'merge',
                    'required_number_of_approvals': 1
                }
            }
        }
    )

    expect(result).toEqual({
        'assistant_name': './friday',
        'log_level': 'error',
        'assistant_controllers': ['bob'],
        'commands': {
            'merge': {
                'default_merge_method': 'merge',
                'required_number_of_approvals': 1
            }
        }
    })
})

test('converts the object keys to camel case', () => {
    const result = JsonUtils.convertObjectKeysToCamelCase(
        {
            'assistant_name': 'friday',
            'log_level': 'info',
            'assistant_controllers': [],
            'commands': {
                'merge': {
                    'default_merge_method': 'merge',
                    'required_number_of_approvals': 1
                }
            }
        }
    )

    expect(result).toEqual({
        'assistantName': 'friday',
        'logLevel': 'info',
        'assistantControllers': [],
        'commands': {
            'merge': {
                'defaultMergeMethod': 'merge',
                'requiredNumberOfApprovals': 1
            }
        }
    })
})
