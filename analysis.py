from scapy.all import *
from database import dataHandler
import math
import os


handler = dataHandler()

traffic = []

data = {}

keys = data.keys()

times = []

index = 0
for packet in PcapReader('samples/malware.pcap'):

    if DNSRR in packet:
        print(packet[DNSRR].rrname)
        print(packet[DNSRR].rdata)

    
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
