import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
# Prevent jsonify from sorting the months in the data dictionary alphabetically
app.config['JSON_SORT_KEYS'] = False

#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('DATABASE_URL', '') or "sqlite:///db/Chicago_Crime_DB.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
crime_2017 = Base.classes.Crime_2017
crime_2018 = Base.classes.Crime_2018


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/all_crime_data")
def allCrimeData():
    """Return all crime data"""
    
    # Create a array to sort the dictionaries by months
    months_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    # Create dictionaries to hold the month data
    monthly_crime_2017 = {}
    monthly_crime_2018 = {}

    # For loop to add the query data to the month dictionaries
    for month in months_array:
        monthly_crime_2017[month] = db.session.query(crime_2017).filter(crime_2017.Month == month).count()
        monthly_crime_2018[month] = db.session.query(crime_2018).filter(crime_2018.Month == month).count()
    
    # Create the dictionaries to hold the ward data
    ward_2017 = {}
    ward_2018 = {}

    # For loop to add the query data to the ward dictionaries (There are 50 wards)
    for i in range(1, 51):
        ward_2017[str(i)] = db.session.query(crime_2017).filter(crime_2017.Ward == float(i)).count()
        ward_2018[str(i)] = db.session.query(crime_2018).filter(crime_2018.Ward == float(i)).count()

    # Create one dictionary to hold all the data by year
    data = {'2017' : {'monthly_crime': monthly_crime_2017, 'ward_crime': ward_2017}, 
        '2018': {'monthly_crime': monthly_crime_2018, 'ward_crime': ward_2018}}

    # Return the jsonified data
    return jsonify(data)

@app.route("/crime_data/<crime>")
def crimeData(crime):
    """Return specfic crime data"""
    # Create a array to sort the dictionaries by months
    months_array = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    # Create dictionaries to hold the month data
    monthly_crime_2017 = {}
    monthly_crime_2018 = {}

    # For loop to add the query data to the month dictionaries
    for month in months_array:
        monthly_crime_2017[month] = db.session.query(crime_2017).filter(crime_2017.Crime_Type == crime).filter(crime_2017.Month == month).count()
        monthly_crime_2018[month] = db.session.query(crime_2018).filter(crime_2018.Crime_Type == crime).filter(crime_2018.Month == month).count()
    
    # Create the dictionaries to hold the ward data
    ward_2017 = {}
    ward_2018 = {}

    # For loop to add the query data to the ward dictionaries (There are 50 wards)
    for i in range(1, 51):
        ward_2017[str(i)] = db.session.query(crime_2017).filter(crime_2017.Crime_Type == crime).filter(crime_2017.Ward == float(i)).count()
        ward_2018[str(i)] = db.session.query(crime_2018).filter(crime_2018.Crime_Type == crime).filter(crime_2018.Ward == float(i)).count()

    # Create one dictionary to hold all the data by year
    data = {'2017' : {'monthly_crime': monthly_crime_2017, 'ward_crime': ward_2017}, 
        '2018': {'monthly_crime': monthly_crime_2018, 'ward_crime': ward_2018}}
    
    # Return the jsonified data
    return jsonify(data)


if __name__ == "__main__":
    app.run()
