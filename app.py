import os
from printree import ptree
import json
from config import app, contract_folder
# from models import Users, Recipes
from flask import render_template, redirect, url_for, request, flash, jsonify
# from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from db import *


def create_product(id, name, code, number, count, type, state):
    # if idLocalContract:
    #     localContract = list(db_get_localcontract(idLocalContract))
    #     return {
    #         'id': id,
    #         'name': name,
    #         'code': code,
    #         'number': number,
    #         'type': type,
    #         'count': count,
    #         'state': state,
    #         'isContract': 1,
    #         'provider': localContract[2],
    #         'start': str(localContract[0]).replace('.', '-'),
    #         'end': str(localContract[1]).replace('.', '-'),
    #         'children': []
    #     }
    # else:
    return {
        'id': id,
        'name': name,
        'code': code,
        'number': number,
        'count': count,
        'idType': type, 
        'idState': state,
        'isContract': 0,
        'idProvider': 0,
        'start': None,
        'end': None,
        'children': []
    }


def add_product_child(product, child):
    product['children'].append(child)
    if len(db_get_product_children(child['id'])) > 0:
        children = db_get_product_children(child['id'])
        for ch in children:
            add_product_child(child, create_product(ch[0], ch[1], ch[2], ch[3], ch[5], ch[6], ch[7]))


def create_product_tree(input_id):
    prod_state, product = db_get_product(input_id)
    if prod_state:
        product_root = create_product(product[0], product[1], product[2], product[3], product[5], product[6], product[7])
        children = db_get_product_children(product[0])
        for child in children:
            add_product_child(product_root, create_product(child[0], child[1], child[2], child[3], child[5], child[6], child[7]))
    return product_root


def check_contract_file(contract_id):
    contract_file = 'contract' + contract_id + '.json'
    for file in os.listdir(contract_folder):
        if file == contract_file:
            return [True, os.path.join(contract_folder, contract_file)]
    return [False, None]


@app.route('/products/<contract_id>')
def send_products(contract_id):
    print(f'\nSelected contract: {contract_id}\n')
    file = check_contract_file(contract_id)
    if file[0]: 
        with open(file[1], 'r') as f:
            json_object = f.read()
        f.close()
        return json_object
    else:
        products_id = db_get_product_contract_list(contract_id)
        root_obj = create_product('root', '', '', '', '', '', '')
        json_data = {
            'data': []
        }
        for pr_id in products_id:
            product_tree = create_product_tree(pr_id)
            json_data['data'].append(product_tree)
            root_obj['children'].append(product_tree)
        json_object = json.dumps(json_data)
        with open(os.path.join(contract_folder, 'contract' + contract_id + '.json'), 'x') as f:
            f.write(json_object)
        f.close()
        return json_object


@app.route('/contacts/<company_id>')
def send_contacts(company_id):
    contacts = db_get_company_contacts(company_id)
    return json.dumps(contacts)


@app.route('/')
def index():
    state, contrs = db_get_government_contracts()
    contracts = []
    contractTypes = []
    types = []
    states = []
    companies = []
    tps = db_get_types()
    sts = db_get_states()
    comps = db_get_companies()
    contrs_types = db_get_contract_types()
    for t in tps:
        types.append(list(t))
    for s in sts:
        states.append(list(s))
    for c in comps:
        tmp = list(c)
        companies.append(tmp)
    for ct in contrs_types:
        contractTypes.append(list(ct))
    if state:
        for c in contrs:
            contracts.append(list(c))
        return render_template('index.html', contracts=contracts, types=types, states=states, companies=companies, contractTypes=contractTypes)
    else:
        return render_template('index.html', types=types, states=states, companies=companies, contractTypes=contractTypes)


@app.route('/getSelector')
def create_product_selector():
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


@app.route('/saveContract', methods=['POST'])
def save_contract():
    try:
        data = request.get_json()
        print(data)
        new_contract_id = int(db_add_government_contract(data)[0])
        products = data.get('products')
        for i in range(len(products)):
            products[i] = int(products[i])
        db_add_product_contract_list(new_contract_id, products)
        # print('Contract added successfully')
        return jsonify({'status': 'success', 'message': 'Contract added successfully'})
    except Exception as e:
        # print(e)
        return jsonify({'status': 'error', 'message': str(e)})


def change_product_in_json(contract_data, product_data):
    for item in contract_data:
        if int(product_data['id']) == item['id']:
            item['number'] = int(product_data['number'])
            item['count'] = int(product_data['count'])
            item['idType'] = product_data['idType']
            item['idState'] = product_data['idState']
            item['isContract'] = int(product_data['isContract'])
            item['idProvider'] = product_data['idProvider']
            item['start'] = str(product_data['start'])
            item['end'] = str(product_data['end'])
            return 0
        if len(item['children']) != 0:
            change_product_in_json(item['children'], product_data)


@app.route('/changeProduct', methods=['POST'])    
def change_product():
    try:
        data = request.get_json()
        # print(data)
        with open(os.path.join(contract_folder, 'contract' + data['contractId'] + '.json'), 'r') as f:
            contract_data = json.load(f)
            f.close()
        change_product_in_json(contract_data['data'], data)
        with open(os.path.join(contract_folder, 'contract' + data['contractId'] + '.json'), 'w') as f:
            json_data = json.dumps(contract_data)
            f.write(json_data)
            f.close()
        # print('Product changed successfully')
        return jsonify({'status': 'success', 'message': 'Product changed successfully'})
    except Exception as e:
        # print(e)
        return jsonify({'status': 'error', 'message': str(e)})
    

@app.route('/saveProvider', methods=['POST'])    
def save_provider():
    try:
        data = request.get_json()
        print(data)
        company_id = db_add_company(data['name'], data['address'])
        if(data['contacts']):
            for contact in data['contacts']:
                contact_id = db_add_contact(contact['name'], contact['number'])
                db_add_contact_company_list(contact_id, company_id)
        return jsonify({'status': 'success', 'message': 'Provider added successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})
    

if __name__ == '__main__':
    app.run()