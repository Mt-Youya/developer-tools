import pandas as pd

# Load the uploaded CSV file to inspect its content
file_path = '/Users/yonjay/codes/demos/DevToolsForMT/china-city-code.csv'
data = pd.read_csv(file_path)

# Convert the DataFrame to JSON format
json_data = data.to_json(orient='records', force_ascii=False)

# Display the first few records of the converted JSON to understand its structure
result = json_data[:1000]  # Limiting output to first 1000 characters to preview the result

output_path = '/Users/yonjay/codes/demos/DevToolsForMT/china-city-code.json'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(json_data)