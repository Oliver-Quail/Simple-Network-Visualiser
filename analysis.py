import pyshark
import sqlite3

#file_location = input("Please enter the location of the pcap file: ")
file_location = "./samples/malware.pcap"

try:
    capture = pyshark.FileCapture(file_location)
    print("Loaded capture")
except FileNotFoundError:
    print("The file name you entered is invalid!")
    print("Exiting...")
    exit()


for packet in capture:

    try:
        # fetch the source IP
        source_ip = packet.ip.src
        destination_ip = packet.ip.dst
        print(source_ip)
    except:
        print("failed")
        continue
    
    pass

