from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_login import LoginManager
# from flask_migrate import Migrate

app = Flask(__name__)
# upl_folder = 'static/images'
contract_folder = 'contracts'
secret_folder = 'secret'
app.config['SECRET_KEY'] = 'fjkisdjhfuih2jr_'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['UPLOAD_FOLDER'] = upl_folder

# manager = LoginManager(app)