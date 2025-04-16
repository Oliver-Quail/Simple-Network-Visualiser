import pyshark
from database import dataHandler
from datetime import datetime
import math
import os
from scapy import *

#file_location = input("Please enter the location of the pcap file: ")
file_location = "./samples/malware.pcap"

try:
    capture = pyshark.FileCapture(file_location,  keep_packets=False)
    print("Loaded capture")
except FileNotFoundError:
    print("The file name you entered is invalid!")
    print("Exiting...")
    exit()


handler = dataHandler()

traffic = []

data = {}

keys = data.keys()

times = []

index = 0
try:
    os.mkdir("files")

except FileExistsError:
    pass

file_size = os.system("tcpdump -r "+ file_location +" -w ./files/captures -C 1")
pcap_files = len(os.listdir("./files"))

for fileNum in range(0, pcap_files):
    file = "captures" + str(fileNum)
    if fileNum == 0:
        file = "captures"
    capture = pyshark.FileCapture("./files/" +file,  keep_packets=False)
    for packet in capture:
        try:
            # fetch the source IP
            source_ip = packet.ip.src

            if source_ip not in keys:
                data[source_ip] = {}
                keys = data.keys()

            destination_ip = packet.ip.dst

            sniff_time = packet.sniff_time
            
            unix_time = sniff_time.timestamp()

            traffic.append({"source": source_ip, "desination":destination_ip, "sniff_time":unix_time})

            if math.floor(float(unix_time)) not in times:
                times.append(math.floor(float(unix_time)))
                #print(math.floor(float(unix_time)))


            if destination_ip not in data[source_ip]:
                data[source_ip][destination_ip] = 0
            
            data[source_ip][destination_ip] += 1

            if packet.dns.resp_name:
                print("aaa: " + packet.dns.resp_addr)            

        except Exception as e:
            continue
        #print(index)
        index += 1

    for record in traffic:
        handler.addData(record["source"], record["desination"], record["sniff_time"])
    traffic = []

print("exited")

os.system("rm -rf ./files")

for record in traffic:
    handler.addData(record["source"], record["desination"], record["sniff_time"])

print(data)