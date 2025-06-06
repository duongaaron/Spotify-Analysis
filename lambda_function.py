def lambda_handler(event, context):
    """
    Lambda function that adds two numbers together.
    
    Parameters:
    - event: Contains input data, expected to have 'num1' and 'num2' keys
    - context: Lambda runtime information
    
    Returns:
    - Dictionary with the result of adding the two numbers
    """
    # Get the numbers from the event
    num1 = event.get('num1', 0)
    num2 = event.get('num2', 0)
    
    # Add the numbers
    result = num1 + num2
    
    # Return the result
    return {
        'statusCode': 200,
        'body': {
            'result': result,
            'input': {
                'num1': num1,
                'num2': num2
            }
        }
    }
