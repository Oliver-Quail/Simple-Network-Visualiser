import sqlite3



class dataHandler:
    def __init__(self):
        self.con = sqlite3.connect("analysis.db")

        #self.con.execute("CREATE TABLE investigations (investigation_name varchar(60), id auto_increment) PRIMARY KEY(id)")
        try:
            self.con.execute("CREATE TABLE data(source VARCHAR NOT NULL, destination, VARCHAR NOT NULL, count INTEGER)")
        except sqlite3.OperationalError:
            print("DB tables already exist")


    
