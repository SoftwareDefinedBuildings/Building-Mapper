import os
import json

from datetime import datetime

from flask import Flask
from flask import render_template, url_for, request, jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename


ALLOWED_EXTENSIONS = ['JPEG', 'JPG', 'PNG', 'GIF']


app = Flask(__name__)
app.jinja_env.globals['static'] = (
    lambda filename: url_for('static', filename=filename))

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.getcwd() + '/tmp/store.db'
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'tmp/uploads')

db = SQLAlchemy(app)


class Zone(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(80))
    shape = db.Column(db.Text)  # store as a json blob
    extras = db.Column(db.Text)  # store extra stuff as a blob

    floor_id = db.Column(db.Integer, db.ForeignKey('floor.id'))
    floor = db.relationship('Floor',
        backref=db.backref('zones', lazy='dynamic'))

    def __init__(self, label, shape, floor, extras=None):
        self.shape = shape
        self.label = label
        self.floor = floor
        if extras is None:
            self.extras = ''

    def __repr__(self):
        return '<Zone %r>' % self.label


class Floor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(50))
    img_name = db.Column(db.String(80))
    extras = db.Column(db.Text)  # store extra stuff as a blob

    def __init__(self, label, img_name, extras=None):
        self.label = label
        self.img_name = img_name
        if extras is None:
            self.extras = ''

    def __repr__(self):
        return '<Floor %r>' % self.label


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].upper() in ALLOWED_EXTENSIONS


@app.route('/')
def list_floors():
    floors = Floor.query.all()
    return render_template('floor_list.html', floors=floors)


@app.route('/create', methods=['GET', 'POST'])
def create_new_floor():
    if request.method == 'GET':
        return render_template('create.html')
    else:
        # Otherwise it's a POST request
        try:
            data = json.loads(request.data)
            # request.data should be a Floor JSON object
            # see static/js/models.js
            process_floor_json(data)
            return jsonify(success=True)
        except:
            return jsonify(success=False, msg='Invalid Floor JSON')


def process_floor_json(data):
    floor = Floor(data['label'], data['img'])
    db.session.add(floor)

    for zone in data['zones']:
        shape_json = json.dumps(zone['shape'])
        z = Zone(zone['label'], shape_json, floor, zone['extras'])
        db.session.add(z)

    db.session.commit()


@app.route('/view/<floor_id>')
def get_floor_data(floor_id):
    try:
        floor = Floor.query.filter(Floor.id == int(floor_id)).first()
        if floor:
            return render_template('view.html', floor=floor)
        else:
            return render_template('not_found.html')
    except:
        return render_template('not_found.html')


@app.route('/upload_test')
def test_upload():
    return render_template('test.html')


@app.route('/up', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        filename = secure_filename(request.headers.get('X-File-Name'))
        if not allowed_file(filename):
            return jsonify(success=False, msg='Invalid image format')
        filename = datetime.now().strftime('%Y%m%d%H%M%S%f') + '-' + filename
        try:
            f = open(os.path.join(app.config['UPLOAD_FOLDER'], filename), 'w')
            f.write(request.data)
            f.close()
            return jsonify(success=True, imgname=filename)
        except:
            return jsonify(success=False, msg='Could not save file')


if __name__ == '__main__':
    app.run(debug=True)
