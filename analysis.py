import pyshark

file_location = input("Please enter the location of the pcap file: ")


try:
    data = pyshark.FileCapture(file_location)

except FileNotFoundError:
    print("The file name you entered is invalid!")
    print("Exiting...")
    exit()

