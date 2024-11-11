from flask import Flask, request, jsonify
from flask_cors import CORS
from funnyclass import Animal, Cow, Pig, Chicken, Farm

app = Flask(__name__)
CORS(app)

farm = Farm()

@app.route('/api/create_animal', methods=['POST'])
def create_animal():
    data = request.get_json()
    animal_type = data.get('type')
    name = data.get('name')
    age = data.get('age') 
    health = data.get('health')
    hunger = data.get('hunger')

    if animal_type == 'cow':
        milk = data.get('milk', 10) 
        animal = Cow(name, age, health, hunger, milk)
    elif animal_type == 'pig':
        dirtiness = data.get('dirtiness', 0)
        animal = Pig(name, age, health, hunger, dirtiness)
    elif animal_type == 'chicken':
        eggs = data.get('eggs', 0)
        animal = Chicken(name, age, health, hunger, eggs)
    else:
        return jsonify({'error': 'Invalid animal type'}), 400

    
    try:
        farm.add_animal(animal)
        return jsonify({'message': f'{animal_type.capitalize()} {name} joined our server!'}), 201

    except Exception as e: 
            return jsonify({'error': str(e)}), 500 

@app.route('/feed_animals', methods=['POST'])
def feed_animals():
    try:
        farm.feed_animals()
        return jsonify({'message': 'Animals fed!'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 500 

@app.route('/care_for_animals', methods=['POST'])
def care_for_animals():
    try:
        farm.care_for_animals()
        return jsonify({'message': 'Animals cared for!'}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/collect_products', methods=['POST'])
def collect_products():
    try:
        farm.collect_products()
        return jsonify({'message':'success'}), 200
    except ValueError as e:
        return jsonify({'error':str(e)}),500

@app.route('/api/status', methods=['POST'])
def status():
    return farm.status(), 201

if __name__ == '__main__':
    app.run(debug=True)
