import pandas as pd

# Load the CSV file into a DataFrame
data = pd.read_csv('itinerarease/pubs/data/allpubs.csv')

# Filter rows where the region is either 'ireland' or 'northireland'
filtered_data = data[data['region'].isin(['Ireland', 'northireland'])]

# Save the filtered data to a new CSV file
filtered_data.to_csv('ireland_pubs.csv', index=False)

print("Filtered data has been saved to 'ireland_pubs.csv'.")
