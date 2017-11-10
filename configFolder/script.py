import xml.etree.ElementTree as etree, datetime, requests

r = requests.get('http://xmltv.xmltv.se/hd.tv6.se_2017-06-16.xml.gz')


#tree = etree.parse('hd.tv3.se_2017-06-16.xml.gz')
tree = etree.fromstring(r.content)


for programme in tree:
    start = datetime.datetime.strptime(str(programme.attrib['start'][0:12]),'%Y%m%d%H%M')
    stop = datetime.datetime.strptime(str(programme.attrib['stop'][0:12]),'%Y%m%d%H%M')
    print("Start: {0} End: {1}".format(start,stop))
    for child in programme:
        if child.tag == 'title':
            print(child.text)
        if child.tag == 'desc':
            print(child.text)
    print("--------------------------------")
