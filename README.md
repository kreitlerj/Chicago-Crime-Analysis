# Chicago Crime Analysis

Data Source: [crime data](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present/ijzp-q8t2)

Data Cleaning: ETL directory

App files: app directory

App Deployment: [Chicago Crime App](https://chicago-crime-analysis.herokuapp.com/)

### Technologies
* Python
* JavaScript
* HTML, CSS
* Plotly.js
* Leaflet.js
* Flask
* SQLite
* SQLAlchemy
* Pandas
* Jupyter Notebook

### Description
This project is to show how to take city crime data and use it in a dashboard page. The data used was provided by the city of Chicago, which has data all the way back to 2001. The ETL cleans the data and pulls out the years 2017 and 2018 for comparision on the dashboard.  To compare any two years, you just need to edit the ETL script to the years to be compared. From there, the data is saved into a SQLite file. Once the app initializes, it pulls all the data for the visualizations from the SQLite file using Python and Flask and then returns it to the JavaScript. Using [Plotly.js](https://plot.ly/javascript/) and [Leaflet.js](https://leafletjs.com/index.html), visualizations are made comparing the two years of crime data. The user can then filter the data through a dropdown menu into different crime categories.
#### Visualizations:
##### Line Graph: 
Compares the number of crimes per month for each year. Useful to see how crime is either increasing or decreasing throughout the year.
##### Map: 
Compares the total number of crimes in each ward between the two years. If there was an increase, the ward is highlighted red; if there was a decrease, it is highlighted green; and, yellow for no change.
