from flask import Flask
from flask import render_template, url_for, request

app = Flask(__name__)
app.jinja_env.globals['static'] = (
    lambda filename: url_for('static', filename=filename))


@app.route('/')
def list_floors():
    floors = [1, 2, 3, 4]
    return render_template('floor_list.html', floors=floors)


@app.route('/create', methods=['GET', 'POST'])
def create_new_floor():
    if request.method == 'GET':
        return render_template('create.html')
    else:
        return 'do some post stuff'


@app.route('/view')
def get_floor_data():
    return 'Some floor data'


if __name__ == '__main__':
    app.run(debug=True)
