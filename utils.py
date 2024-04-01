from db import *
from config import contract_folder
import os

def create_product(id, name, code, number, count, type, state, note):
    return {
        'id': id,
        'name': fix_quotes(str(name)),
        'code': code,
        'number': number,
        'count': count,
        'idType': type, 
        'idState': state,
        'isContract': 0,
        'idProvider': 0,
        'start': None,
        'end': None,
        'note': note,
        'files': [],
        'children': []
    }


def add_product_child(product, child):
    product['children'].append(child)
    if len(db_get_product_children(child['id'])) > 0:
        children = db_get_product_children(child['id'])
        for ch in children:
            add_product_child(child, create_product(ch[0], ch[1], ch[2], ch[3], ch[5], ch[6], ch[7], ch[11]))


def create_product_tree(input_id):
    prod_state, product = db_get_product(input_id)
    if prod_state:
        product_root = create_product(product[0], product[1], product[2], product[3], product[5], product[6], product[7], product[11])
        children = db_get_product_children(product[0])
        for child in children:
            add_product_child(product_root, create_product(child[0], child[1], child[2], child[3], child[5], child[6], child[7], child[11]))
    return product_root


def get_contracts():
    state, contrs = db_get_government_contracts()
    contracts = []
    if state:
        for c in contrs:
            tmp = list(c)
            tmp[4] = str(tmp[4])
            tmp[5] = str(tmp[5])
            contracts.append(list(tmp))
    return contracts


def fix_quotes(string):
    counter = 1
    new_string = ""
    for i in range(len(string)):
        if string[i] == '"':
            if counter % 2 != 0:
                counter+=1
                new_string += "«"
            else:
                counter-=1
                new_string += "»"
        else:
            new_string += string[i]
    return new_string


def check_contract_file(contract_id):
    contract_file = 'contract' + contract_id + '.json'
    for file in os.listdir(os.path.join(contract_folder, 'contract_' + str(contract_id))):
        if file == contract_file:
            return [True, os.path.join(contract_folder, 'contract_' + str(contract_id), contract_file)]
    return [False, None]


def change_product_in_json(contract_data, product_data, file_pathes):
    for item in contract_data:
        if int(product_data['id']) == item['id']:
            item['number'] = product_data['number']
            item['count'] = product_data['count']
            item['idType'] = product_data['idType']
            item['idState'] = product_data['idState']
            item['isContract'] = int(product_data['isContract'])
            item['idProvider'] = product_data['idProvider']
            item['start'] = str(product_data['start'])
            item['end'] = str(product_data['end'])
            item['note'] = str(product_data['note'])
            if len(file_pathes) != 0:
                for path in file_pathes:
                    item['files'].append(path)
            return item['files']
        if len(item['children']) != 0:
            return change_product_in_json(item['children'], product_data, file_pathes)


def delete_product_in_json(contract_data, product_id, index):
    for item in contract_data:
        if int(item['id']) == product_id:
            files = item['files']
            del contract_data[index]
            return files
        index+=1
        if len(item['children']) != 0:
            return delete_product_in_json(item['children'], product_id, 0)
        

def get_new_product_id(contract_data, max_id):
    for item in contract_data:
        if int(item['id']) > max_id:
            max_id = int(item['id'])
        if len(item['children']) != 0:
            return get_new_product_id(item['children'], max_id)
    return max_id


def add_product_in_json(contract_data, product_data, file_pathes):
    for item in contract_data:
        if int(product_data['mainProductId']) == item['id']:
            new_id = get_new_product_id(contract_data, -1) + 1
            item['children'].append({
                'id': new_id,
                'name': product_data['name'],
                'code': product_data['code'],
                'number': product_data['number'],
                'count': product_data['count'],
                'idType': product_data['idType'],
                'idState': product_data['idState'],
                'isContract': int(product_data['isContract']),
                'idProvider': product_data['idProvider'],
                'start': str(product_data['start']),
                'end': str(product_data['end']),
                'note': str(product_data['note']),
                'files': file_pathes,
                'children': []
            })
            print(f'\n______new product {new_id}______\n')
            return 0
        if len(item['children']) != 0:
            add_product_in_json(item['children'], product_data, file_pathes)


def delete_file_in_json(contract_data, product_id, file_name):
    for item in contract_data:
        if int(item['id']) == int(product_id):
            for i in range(len(item['files'])):
                if file_name == item['files'][i]:
                    item['files'].remove(file_name)
                    print(item['files'])
                    return item['files']
        if len(item['children']) != 0:
            return delete_file_in_json(item['children'], product_id, file_name)


def get_products_from_json(contract_data, products):
    for item in contract_data:
        products.append({'id': int(item['id']), 'name': item['name'], 'type': 'json'})
        if len(item['children']) != 0:
            get_products_from_json(item['children'], products)


def get_product_from_json(contract_data, product_id, product):
    for item in contract_data:
        if product_id == int(item['id']):
            # print('---------------- ', item['name'])
            product['product'] = {
                'name': item['name'],
                'code': item['code'],
                'number': item['number'],
                'count': item['count'],
                'idType': item['idType'],
                'idState': item['idState'],
                'isContract': int(item['isContract']),
                'idProvider': item['idProvider'],
                'start': str(item['start']),
                'end': str(item['end']),
                'note': str(item['note']),
                'files': item['files'],
                'children': item['children']
            }
            # print(product)
            # return product
        if len(item['children']) != 0:
            get_product_from_json(item['children'], product_id, product)
        # print(item['id'], item['name'])