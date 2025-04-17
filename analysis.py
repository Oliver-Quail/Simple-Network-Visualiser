from scapy.all import *
from database import dataHandler
import math
import os


def stripOuter(string):
     result = str(string)
     result = result[2:]
     result = result[:-2]
     return result

handler = dataHandler()

traffic = []

data = {}

dnsData = []

keys = data.keys()

times = []


index = 0
for packet in PcapReader('samples/malware.pcap'):
    if DNSRR in packet:
        dnsData.append([packet[DNSRR].rdata, stripOuter(packet[DNSRR].rrname)])
        print(packet[DNSRR].rrname)
        print(packet[DNSRR].rdata)
        handler.add_dns_record(packet[DNSRR].rdata, stripOuter(packet[DNSRR].rrname))
    
    if IP in packet:
        source_ip = packet[IP].src

        if source_ip not in keys:
                data[source_ip] = {}
                keys = data.keys()
        
        destination_ip = packet[IP].dst

        unix_time = packet.time * 1000000
        unix_time = int(unix_time)
        print(unix_time)
        traffic.append({"source": source_ip, "desination":destination_ip, "sniff_time":unix_time})

        if math.floor(float(unix_time)) not in times:
                    times.append(math.floor(float(unix_time)))
                    #print(math.floor(float(unix_time)))

        if destination_ip not in data[source_ip]:
            data[source_ip][destination_ip] = 0
        
        data[source_ip][destination_ip] += 1
        index += 1
        if index%1000 == 0:
            for record in traffic:
                print("Updated")
                handler.addData(record["source"], record["desination"], record["sniff_time"])
            traffic = []



for record in traffic:
    print("Updated")
    handler.addData(record["source"], record["desination"], record["sniff_time"])
