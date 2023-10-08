from flask import Flask, render_template, jsonify, send_file, request
from ucimlrepo import fetch_ucirepo
import pandas as pd
from tensorflow import keras

model = keras.models.load_model('shroom.h5')
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

@app.route('/api/v1/machine-learning/predict', methods=['POST'])
def predict():
    try:
        # Get the selected values from the POST request
        selected_values = request.get_json()
        # print(selected_values)
        # print("Hello")

        X_dummies = pd.get_dummies(X)
        # print(X_dummies.head())

        # Preprocess the selected values (e.g., convert them to the format expected by your model)
        user_input_df = pd.DataFrame(columns=X_dummies.columns)
        # print(f"Empty DF: {user_input_df}")

        for category, value in selected_values.items():
            # Create a column name like "category_value" based on user input
            column_name = f"{category}_{value}"
            
            # Check if the column exists in the feature columns
            if column_name in X_dummies.columns:
                user_input_df.loc[0, column_name] = 1
            else:
                # Handle the case where the selected value doesn't exist in the feature columns
                print(({'error': f'Invalid selection: {column_name}'}))
                # return jsonify({'error': f'Invalid selection: {column_name}'})

        user_input_df = user_input_df.fillna(0)

        # print(user_input_df.head())

        # Use your trained model to make a prediction
        prediction = model.predict(user_input_df)

        prediction_list = prediction.tolist()
        # print(f"prediction: {prediction}")
        # Return the prediction as a response
        return jsonify({'prediction': prediction_list})

    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True)

