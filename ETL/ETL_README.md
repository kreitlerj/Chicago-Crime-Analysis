

Data Source:

Our data is pulled from: https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present/ijzp-q8t2

We chose to focus on 2017 and 2018 to map crimes by the wards they took place in. These datasets are too big to be uploaded to GitHub so the ETL must be run with the "2017_2018_Chicago_Crimes.csv". This csv is a product of a merge of two files in a separate Python notebook: 
"Crimes_-_2017.csv" and "Crimes_-_2018.csv" which are directly downloaded from the Chicago Data Portal. 

Steps:

1. The unneeded columns are dropped (['Case Number','ID','Block','IUCR','Location Description','Arrest','Domestic','Beat','FBI Code','X Coordinate','Y Coordinate'], axis=1)

2. Date and Time are stripped to separate the datetime object and the time into two separate columns. From this the number representing the month is extracted in order to call a calendar function that gives us the Month abbreviation, so we have the option to aggregate data by month (by name) within our app. 

3. We concatenate that DataFrame and drop redundancies. 

4. We then drop all crimes which we do not need since we are focusing on Violent Crimes. We also make necessary combos of columns such as ASSAULT/BATTERY.
We drop crimes pertaining to: 
['Primary Type'] != 'NARCOTICS']
['Primary Type'] != 'CRIMINAL DAMAGE']
['Primary Type'] != 'BURGLARY']
['Primary Type'] != 'THEFT']
['Primary Type'] != 'PROSTITUTION']
['Primary Type'] != 'CRIMINAL TRESPASS']
['Primary Type'] != 'MOTOR VEHICLE THEFT']
['Primary Type'] != 'WEAPONS VIOLATION']
['Primary Type'] != 'CONCEALED CARRY LICENSE VIOLATION']
['Primary Type'] != 'NON-CRIMINAL']
['Primary Type'] != 'HUMAN TRAFFICKING']
['Primary Type'] != 'NON-CRIMINAL (SUBJECT SPECIFIED)'] 
['Primary Type'] != 'ARSON']  

5. The DataFrames are then split into a 2017 table and a 2018 table so that when they are pushed to the SQLite database they exist as two separate data tables within the Chicago_Crimes_DB.sqlite. Those tables are name 'Crime_2017' and 'Crime_2018". 
