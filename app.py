import os

from flask import Flask
from flask import render_template, url_for, request
from flask.ext.sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.jinja_env.globals['static'] = (
    lambda filename: url_for('static', filename=filename))

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.getcwd() + '/tmp/store.db'
db = SQLAlchemy(app)


class Zone(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(80))
    points = db.Column(db.Text)  # store as a json blob
    extras = db.Column(db.Text)  # store extra stuff as a blob

    floor_id = db.Column(db.Integer, db.ForeignKey('floor.id'))
    floor = db.relationship('Floor',
        backref=db.backref('zones', lazy='dynamic'))

    def __init__(self, label, points, floor, extras=None):
        self.points = []
        self.label = label
        self.floor = floor
        if extras is None:
            self.extras = ''

    def __repr__(self):
        return '<Zone %r>' % self.label


class Floor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(50))
    extras = db.Column(db.Text)  # store extra stuff as a blob

    def __init__(self, label, extras=None):
        self.label = label
        if extras is None:
            self.extras = ''

    def __repr__(self):
        return '<Floor %r>' % self.label


@app.route('/')
def list_floors():
    floors = Floor.query.all()
    return render_template('floor_list.html', floors=floors)


@app.route('/create', methods=['GET', 'POST'])
def create_new_floor():
    if request.method == 'GET':
        return render_template('create.html')
    else:
        return 'do some post stuff to create the new floor'


@app.route('/view/<floor_label>')
def get_floor_data(floor_label):
    return render_template('view.html', floor_label=floor_label)


if __name__ == '__main__':
    app.run(debug=True)
