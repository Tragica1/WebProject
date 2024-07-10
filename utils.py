from db import *
from config import contract_folder, secret_folder
import os
import shutil

def normalize_order(obj):
    # print(obj)
    first_level = obj[0]['children']
    for f in first_level:
        print(f['name'])

def create_product(id, name, code, number, count, type, state, idProvider, start, end, note):
    return {
        'id': id,
        'dbID': id,
        'name': fix_quotes(str(name)),
        'code': code,
        'number': number if number else "",
        'count': count if count else 1,
        'idType': type, 
        'idState': state,
        'isContract': 1 if idProvider != None else 0,
        'idProvider': idProvider if idProvider != None else 0,
        'start': start.strftime('%Y-%m-%d') if idProvider != None and start != None else None,
        'end': end.strftime('%Y-%m-%d') if idProvider != None and start != None else None,
        'note': note,
        'files': db_get_product_files(id),
        'children': []
    }


def add_product_child(product, child):
    product['children'].append(child)
    if len(db_get_product_children(child['id'])) > 0:
        children = db_get_product_children(child['id'])
        for ch in children:
            add_product_child(child, create_product(ch[0], ch[1], ch[2], ch[3], ch[5], 
                                                    ch[6], ch[7], ch[8], ch[9], ch[10], ch[11]))


def create_product_tree(input_id):
    prod_state, product = db_get_product(input_id)
    if prod_state:
        product_root = create_product(product[0], product[1], product[2], product[3], product[5], 
                                      product[6], product[7], product[8], product[9], product[10], product[11])
        children = db_get_product_children(product[0])
        for child in children:
            add_product_child(product_root, create_product(child[0], child[1], child[2], child[3], child[5], 
                                                           child[6], child[7], child[8], child[9], child[10], child[11]))
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


def get_row(data, result):
    for item in data:    
        if (item['idType'] == 2 or item['idType'] == 3 or item['idType'] == 7 or item['idType'] == 10):
            result.append({'Название': item['name'], 'Обозначение': item['code'], 'Тип': db_get_type(item['idType'])[0], 'Зав. номер': item['number'], 'Количество': item['count']})        
        if len(item['children']) != 0:
            get_row(item['children'], result)


def get_product(data, itemId, myItem):
    for item in data:
        if item['id'] == int(itemId):
            myItem.append(item)
        if len(item['children']) != 0:
            get_product(item['children'], itemId, myItem)

def check_children(my_list, code):
    for l in my_list:
        if l['code'] == code:
            return True
    return False


def get_parents(contract_data, productCode, parents, flag):
    for item in contract_data:
        if len(item['children']) != 0:
            if check_children(item['children'], productCode):
                parents.append([item['name'], item['code']])
            get_parents(item['children'], productCode, parents, flag)


def change_product_children(data, idState):
    for item in data:
        item['idState'] = idState
        if len(item['children']) != 0:
                change_product_children(item['children'], idState)


def change_product_in_json(contract_data, product_data, file_pathes, name, code):
    for item in contract_data:
        if int(product_data['id']) == item['id']:
            if name != None and code != None:
                item['name'] = name
                item['code'] = code
            item['number'] = product_data['number'] if product_data['number'] else ""
            item['count'] = product_data['count'] if product_data['count'] else 1
            item['idType'] = product_data['idType']
            item['idState'] = product_data['idState']
            item['isContract'] = int(product_data['isContract'])
            item['idProvider'] = product_data['idProvider']
            item['start'] = str(product_data['start'])
            item['end'] = str(product_data['end'])
            item['note'] = str(product_data['note'])
            change_product_children(item['children'], product_data['idState'])
            if len(file_pathes) != 0:
                for path in file_pathes:
                    item['files'].append(path)
            return 0
        if len(item['children']) != 0:
                change_product_in_json(item['children'], product_data, file_pathes, name, code)


def delete_product_in_json(contract_data, product_id, index, files):
    for item in contract_data:
        if int(item['id']) == product_id:
            files['files'] = item['files']
            del contract_data[index]
            return files
        index+=1
        if len(item['children']) != 0:
            delete_product_in_json(item['children'], product_id, 0, files)
        

def get_allowed_prods_from_json(contract_data, main_prod, allowed_prods):
    for item in contract_data:
        if item['name'] == main_prod['name'] and item['code'] == main_prod['code']:
            allowed_prods['prods'] = item['children']            
        if len(item['children']) != 0:
            get_allowed_prods_from_json(item['children'], main_prod, allowed_prods)


def check_product_in_json(contract_data, my_prod, condition):
    for item in contract_data:
        if item['id'] == int(my_prod):
            condition['flag'] = True
        if len(item['children']) != 0:
            check_product_in_json(item['children'], my_prod, condition)


def get_new_product_id(contract_data, max_id):
    for item in contract_data:  
        if item['id'] > max_id['id']:
            max_id['id'] = item['id']
        if len(item['children']) != 0:
            get_new_product_id(item['children'], max_id)
    

def get_product_children_from_json(contract_data, id):
    for item in contract_data:
        if int(id) == item['id']:
            return item['children']
        if len(item['children']) != 0:
            return get_product_children_from_json(item['children'], id)


def change_children(data, contract_data, my_id):
    for item in data:
        get_new_product_id(contract_data, my_id)
        my_id['id'] += 1
        item['id'] = my_id['id']
        print(item['id'])
        if len(item['children']) != 0:
            change_children(item['children'], contract_data, my_id)


def add_product_in_json(contract_data, product_data, file_pathes, chl, new_id):
    for item in contract_data:
        if int(product_data['mainProductId']) == item['id']:
            item['children'].append({
                'id': new_id['id']+1,
                'dbID': product_data['dbId'],
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
                'children': chl
            })
            # print(f'\n______new product {new_id}______\n')
            return 0
        if len(item['children']) != 0:
            add_product_in_json(item['children'], product_data, file_pathes, chl, new_id)


def delete_file_in_json(contract_data, product_id, file_name, file_list):
    for item in contract_data:
        if int(item['id']) == int(product_id):
            for i in range(len(item['files'])):
                if item['files'][i]['file'] == file_name:
                    item['files'].pop(i)
                    file_list['files'] = item['files']
                    return 0
        if len(item['children']) != 0:
            delete_file_in_json(item['children'], product_id, file_name, file_list)


def get_products_from_json(contract_data, products):
    for item in contract_data:
        products.append({'id': int(item['id']), 'name': item['name'], 'code': item['code'], 'type': 'json'})
        if len(item['children']) != 0:
            get_products_from_json(item['children'], products)


def get_product_from_json(contract_data, product_id, product):
    for item in contract_data:
        if product_id == int(item['id']):
            product['product'] = {
                'id': item['id'],
                'dbID': item['dbID'],
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
        if len(item['children']) != 0:
            get_product_from_json(item['children'], product_id, product)


def check_files(contract_id, files):
    new_files = []
    for file in files:
        tmp = file.split('\\')[-1]
        print(tmp)
        my_file = os.path.join(contract_folder, 'contract_' + str(contract_id), tmp)
        print(my_file)
        if os.path.isfile(my_file) == False:
            print('!!!!!!!!!!!!!!!')
            shutil.copy(file, my_file)
        new_files.append(my_file)
    return new_files


def get_products_for_statistic(contract_data, products):
    for item in contract_data:
        products.append({'id': int(item['id']), 'isContract': int(item['isContract']), 'type': int(item['idType']), 'state': int(item['idState'])})
        if len(item['children']) != 0:
            get_products_for_statistic(item['children'], products)


def get_products_for_timechart(contract_data, products):
    for item in contract_data:
        if item['idProvider'] != 0:
            products.append({'id': int(item['id']), 'name': item['name'], 'code': item['code'], 'provider': db_get_company(item['idProvider']), 'start': item['start'], 'end': item['end']})
        if len(item['children']) != 0:
            get_products_for_timechart(item['children'], products)

def unique_id(contract_data, num):
    for item in contract_data:
        item['id'] = num['id']
        num['id']+=1
        if len(item['children']) != 0:
            unique_id(item['children'], num)
            

