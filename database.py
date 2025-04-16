import sqlite3



class dataHandler:
    def __init__(self):
        self.con = sqlite3.connect("analysis.db")

        #self.con.execute("CREATE TABLE investigations (investigation_name varchar(60), id auto_increment) PRIMARY KEY(id)")
        try:
            self.con.execute("CREATE TABLE data(source VARCHAR NOT NULL, destination VARCHAR NOT NULL, time REAL NOT NULL)")
        except sqlite3.OperationalError:
            print("DB tables already exist")


    def addData(self, source, destination, sniff_time):
        query = """INSERT INTO data (source, destination, time) VALUES (?,?,?)"""
        self.con.execute(query, (source, destination, sniff_time))
        self.con.commit()
        

    
