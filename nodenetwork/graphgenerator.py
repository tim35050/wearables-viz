import csv, sys


def get_position_id(position):
	if position == "Ankle": return 1
	if position == "Arm": return 2
	if position == "Back": return 3
	if position == "Body": return 4
	if position == "Body (Anywhere)": return 5
	if position == "Chest": return 6
	if position == "Ear": return 7
	if position == "Feet": return 8
	if position == "Fingers": return 9
	if position == "Hand": return 10
	if position == "Head": return 11
	if position == "Legs": return 12
	if position == "Neck": return 13
	if position == "Shoulders": return 14
	if position == "Torso": return 15
	if position == "Thighs": return 16
	if position == "Waist": return 17
	if position == "Wrist": return 18
	return 0

def get_primary_application_id(pa):
    if pa == "Entertainment": return 1
    if pa == "Fitness": return 2
    if pa == "Gaming": return 3
    if pa == "Industrial": return 4
    if pa == "Lifestyle": return 5
    if pa == "Medical": return 6
    if pa == "Pets Animals": return 7
    return 0

filename = '/users/timothymeyers/projects/wearables/nodenetwork/products.txt'
with open(filename, 'rU') as f:
    reader = f.readlines()
    try:
    	title_id_dict = {}
    	title_similars_dict = {}
    	id_position_dict = {}
    	id_positiontitle_dict = {}
        id_application_dict = {}
        id_applicationtitle_dict = {}
        for row in reader:
            alist = row.split('\t')
            if alist[0] != 'id':
                product_id = int(alist[0])
                title_id_dict[alist[1]] = product_id
                alist[3] = alist[3].replace("\"","")
                title_similars_dict[alist[1]] = alist[3].split(',')
                id_position_dict[product_id] = get_position_id(alist[7].split(',')[0].replace("\"",""))
                id_positiontitle_dict[product_id] = alist[7].split(',')[0].replace("\"","")
                id_application_dict[product_id] = get_primary_application_id(alist[12].split(',')[0].replace("\"",""))
                id_applicationtitle_dict[product_id] = alist[12].split(',')[0].replace("\"","")
        id_similars_dict = {}
        for title in title_id_dict:
        	product_id = title_id_dict[title]
        	id_similars_dict[product_id] = []
        	for similar_product_title in title_similars_dict[title]:
        		similar_product_id = title_id_dict[similar_product_title]
        		id_similars_dict[product_id].append(similar_product_id)
        used_tuples = []
        link_dict = {}
        nodes_output = ""
        for product_id in id_similars_dict:
        	nodes_output += "{name:\"%s\", position: %s, position_title: \"%s\", application: %s, application_title: \"%s\"}," % (product_id, id_position_dict[product_id], id_positiontitle_dict[product_id], id_application_dict[product_id],id_applicationtitle_dict[product_id])
        fo = open("/users/timothymeyers/projects/wearables/nodenetwork/nodes.txt", "w")
        fo.write(nodes_output)
        
        links_output = ""
        for product_id in id_similars_dict:
        	for similar_product_id in id_similars_dict[product_id]:
        		if (product_id,similar_product_id) not in used_tuples:
        			links_output += "{source:%s,target:%s}," % (product_id-1,similar_product_id-1)
        			used_tuples.append((similar_product_id,product_id))
        fo = open("/users/timothymeyers/projects/wearables/nodenetwork/links.txt", "w")
        fo.write(links_output)

    except csv.Error as e:
        sys.exit('file %s, line %d: %s' % (filename, reader.line_num, e))


