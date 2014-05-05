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

# Calculate and return Jaccard index for two sets
def get_similarity(list1,list2):
    set1 = set(list1)
    set2 = set(list2)
    set_inter = set1.intersection(set2)
    set_union = set1.union(set2)
    return float(len(set_inter))/float(len(set_union))

def build_graph(id_title_dict,id_positions_dict, id_applications_dict):
    nodes = {}
    edges = {}
    for id_1 in id_positions_dict:
        nodes[id_1] = id_title_dict[id_1]
        for id_2 in id_positions_dict:
            if id_1 != id_2:
                all_attributes_1 = id_positions_dict[id_1] + id_applications_dict[id_1]
                all_attributes_2 = id_positions_dict[id_2] + id_applications_dict[id_2]
                all_similarity = get_similarity(all_attributes_1,all_attributes_2)
                position_similarity = get_similarity(id_positions_dict[id_1], id_positions_dict[id_2])
                application_similarity = get_similarity(id_applications_dict[id_1], id_applications_dict[id_2])
                #
                # Here is where you can experiment how products connect to each other
                #

                if application_similarity > 0.5:
                    edges[(id_1,id_2)] = application_similarity
    return nodes, edges

filename = '/users/timothymeyers/projects/wearables/nodenetwork/products-rev.txt'
with open(filename, 'rU') as f:
    reader = f.readlines()
    try:
    	id_title_dict = {}
        id_positions_dict = {}
        id_applications_dict = {}
        for row in reader:
            alist = row.split('\t')
            if alist[0] != 'id':
                product_id = int(alist[0])
                id_title_dict[product_id] = alist[1]
                id_positions_dict[product_id] = alist[7].replace("\"","").split(",")
                id_applications_dict[product_id] = alist[12].replace("\"","").split(",")
        nodes, edges = build_graph(id_title_dict,id_positions_dict, id_applications_dict)

        nodes_output = ""
        for product_id in nodes:
        	nodes_output += "{name:\"%s\", tooltip:\"%s\"}," % (nodes[product_id],id_applications_dict[product_id] + id_positions_dict[product_id])
        fo = open("/users/timothymeyers/projects/wearables/nodenetwork/nodes_jaccard.txt", "w")
        fo.write(nodes_output)
        
        links_output = ""
        for (id_1,id_2) in edges:
            product_tuple = (id_1,id_2)
            links_output += "{source:%s,target:%s,value:%.2f}," % (product_tuple[0] - 1,product_tuple[1]-1, edges[product_tuple])
        fo = open("/users/timothymeyers/projects/wearables/nodenetwork/links_jaccard.txt", "w")
        fo.write(links_output)

    except csv.Error as e:
        sys.exit('file %s, line %d: %s' % (filename, reader.line_num, e))


