import os
from printree import ptree
import json
from config import app
# from models import Users, Recipes
from flask import render_template, redirect, url_for, request, flash, jsonify
# from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from db import *


def create_product(id, name, code, number, type, count, idLocalContract, state):
    if idLocalContract:
        localContract = list(db_get_localcontract(idLocalContract))
        return {
            'id': id,
            'name': name,
            'code': code,
            'number': number,
            'type': type,
            'count': count,
            'state': state,
            'isContract': 1,
            'provider': localContract[2],
            'start': str(localContract[0]).replace('.', '-'),
            'end': str(localContract[1]).replace('.', '-'),
            'children': []
        }
    else:
        return {
            'id': id,
            'name': name,
            'code': code,
            'number': number,
            'type': type,
            'count': count,
            'state': state,
            'isContract': 0,
            'provider': 0,
            'start': None,
            'end': None,
            'children': []
        }


def add_product_child(product, child):
    product['children'].append(child)
    if len(db_get_product_children(child['id'])) > 0:
        children = db_get_product_children(child['id'])
        for ch in children:
            add_product_child(child, create_product(ch[0], ch[1], ch[2], ch[3], ch[5], ch[6], ch[7], ch[8]))


def create_product_tree(input_id):
    prod_state, product = db_get_product(input_id)
    if prod_state:
        product_root = create_product(product[0], product[1], product[2], product[3], product[5], product[6], product[7], product[8])
        children = db_get_product_children(product[0])
        for child in children:
            add_product_child(product_root, create_product(child[0], child[1], child[2], child[3], child[5], child[6], child[7], child[8]))
    return product_root


@app.route('/products/<contract_id>')
def send_products(contract_id):
    print(contract_id)
    products_id = db_get_product_contract_list(contract_id)
    root_obj = create_product('root', '', '', '', '', '', '', '')
    for pr_id in products_id:
        product_tree = create_product_tree(pr_id)
        root_obj['children'].append(product_tree)
    # ptree(root_obj)
    return root_obj


@app.route('/')
def index():
    state, contrs = db_get_government_contracts()
    contracts = []
    types = []
    states = []
    tps = db_get_types()
    sts = db_get_states()
    for t in tps:
        types.append(list(t))
    for s in sts:
        states.append(list(s))
    if state:
        for c in contrs:
            contracts.append(list(c))
        return render_template('index.html', contracts=contracts, types=types, states=states)
    else:
        return render_template('index.html')


@app.route('/getSelector')
def create_product_list():
    state, prods = db_get_products()
    res = []
    products = []
    for p in prods:
        products.append(list(p))
    if state:
        for product in products:
            if product[4] == 1:
                res.append(dict({'id': product[0], 'name': product[1]}))
    return(json.dumps(res))


@app.route('/addContract', methods=['POST'])
def create_contract():
    try:
        data = request.get_json()
        new_contract_id = int(db_add_government_contract(data)[0])
        products = data.get('products')
        for i in range(len(products)):
            products[i] = int(products[i])
        db_add_product_contract_list(new_contract_id, products)
        return jsonify({'status': 'success', 'message': 'Contract added successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})


@app.route('/changeProduct', methods=['POST'])    
def change_product():
    try:
        data = request.get_json()
        print(data)
        return jsonify({'status': 'success', 'message': 'Product changed successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})
    

if __name__ == '__main__':
    app.run()