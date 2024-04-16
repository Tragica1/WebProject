from flask import Flask
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity, set_access_cookies, unset_jwt_cookies, get_jwt, get_current_user
from datetime import datetime, timedelta

app = Flask(__name__)
contract_folder = 'contracts'
secret_folder = 'secret'
app.config['SECRET_KEY'] = 'fjkisdjhfuih2jr_'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['JWT_SECRET_KEY'] = 'fjkisdjhfuih2jr_'
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=8)
jwt = JWTManager(app)