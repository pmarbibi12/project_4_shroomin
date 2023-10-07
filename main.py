from flask import Flask, render_template, jsonify, send_file
from ucimlrepo import fetch_ucirepo
import pandas as pd
mushroom = fetch_ucirepo(id=73)
X = mushroom.data.features 
y = mushroom.data.targets
mushroom_df = pd.concat([X, y], axis=1)
mushroom_json = mushroom_df.to_json(orient="records")


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/v1/data')
def display_data():
    return jsonify(mushroom_json)

@app.route('/api/v1/data/columns')
def display_columns():
    columns = mushroom_df.columns.to_list()
    return {"columns":columns}

@app.route('/api/v1/data/variables')
def display_variables():
    variables = mushroom.variables.to_json(orient="records")
    return variables

@app.route('/api/v1/machine-learning/features')
def display_features():
    features = X.columns.to_list()
    return {"features":features}

@app.route('/api/v1/machine-learning/targets')
def display_targets():
    targets = y.columns.to_list()
    return {"targets":targets}

@app.route('/api/v1/machine-learning/download_model')
def download_model():
    model_path = 'shroom.h5'
    return send_file(model_path, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)

