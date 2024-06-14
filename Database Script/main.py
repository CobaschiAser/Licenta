import random
import string
import uuid
import psycopg2
import requests
from datetime import date, timedelta

db_conn = None

db_name = "application"
db_user = "postgres"
db_password = "aserPostgres1"
db_host = "localhost"
gmail_suffix = "@gmail.com"


def get_db_connection():
    global db_conn
    if db_conn is None:
        try:
            conn = psycopg2.connect(dbname=db_name,
                                    user=db_user,
                                    password=db_password,
                                    host=db_host)
            return conn
        except Exception as e:
            print("Error connecting to database: " + str(e))
            exit()


def clear_db():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute('TRUNCATE app_user CASCADE')
        cursor.execute('TRUNCATE depot CASCADE')
        cursor.execute('TRUNCATE depot_vehicle CASCADE')
        cursor.execute('TRUNCATE flux_parking CASCADE')
        cursor.execute('TRUNCATE move CASCADE')
        cursor.execute('TRUNCATE parking CASCADE')
        cursor.execute('TRUNCATE parking_vehicle CASCADE')
        cursor.execute('TRUNCATE preference CASCADE')
        cursor.execute('TRUNCATE ride CASCADE')
        cursor.execute('TRUNCATE request CASCADE')
        cursor.execute('TRUNCATE user_ride CASCADE')
        cursor.execute('TRUNCATE user_request CASCADE')
        cursor.execute('TRUNCATE vehicle CASCADE')

        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


def get_random_date():
    start_date = date(2024, 1, 1)
    end_date = date(2024, 3, 1)
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days + 1
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + timedelta(days=random_number_of_days)
    return random_date


def get_random_request_date():
    start_date = date(2024, 3, 1)
    end_date = date(2024, 3, 10)
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days + 1
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + timedelta(days=random_number_of_days)
    return random_date

names = []

user_list = []


class AppUser:
    def __init__(self, name):
        self.id = str(uuid.uuid4())
        self.token = str(uuid.uuid4())
        first_name, second_name = str(name).split(' ')
        self.email = first_name.lower() + '.' + second_name.lower() + gmail_suffix
        self.name = name
        chars = string.ascii_lowercase + string.ascii_uppercase + string.digits + string.punctuation
        self.password = ''.join(random.choice(chars) for i in range(12))
        self.password_code = None
        self.registration_date = get_random_date()
        self.salt = ''.join(random.choice(chars) for i in range(8))
        self.username = first_name + '_' + second_name
        self.verificated = True
        self.verification_code = ''.join(random.choice(string.digits) for i in range(5))
        self.admin = 0
        self.rides = []
        self.requests = []
        # add to user list
        user_list.append(self)


parking_id_list = []
parking_list = []


class Parking:
    def __init__(self, name, max_capacity, x, y):
        if len(parking_id_list) != 0:
            previous_id = parking_id_list[len(parking_id_list) - 1]
        else:
            previous_id = random.randint(100, 150)
        self.id = str(random.randint(int(previous_id) + 5, int(previous_id) + 20))
        self.name = name
        self.current_capacity = 0
        self.max_capacity = max_capacity
        self.x = x
        self.y = y
        self.vehicles = []
        parking_id_list.append(self.id)
        parking_list.append(self)

    def add_vehicle(self, vehicle_id):
        vehicle_to_add = find_vehicle_by_id(vehicle_id)
        if self.current_capacity < self.max_capacity:
            try:
                self.current_capacity += 1
                self.vehicles.append(vehicle_to_add)
                connection = get_db_connection()
                cursor = connection.cursor()
                cursor.execute(
                    "INSERT INTO parking_vehicle (parking_id, vehicle_id) VALUES (%s, %s)",
                    (self.id, vehicle_id)
                )
                cursor.execute(
                    "UPDATE parking SET current_capacity = %s WHERE id = %s", (self.current_capacity, self.id)
                )
                depot = depot_list[0]
                depot.current_capacity -= 1
                cursor.execute(
                    "UPDATE depot SET current_capacity = %s WHERE id = %s", (depot.current_capacity, depot.id)
                )
                cursor.execute(
                    "DELETE FROM depot_vehicle WHERE depot_id = %s AND vehicle_id = %s", (depot.id, vehicle_id)
                )
                connection.commit()
                cursor.close()
                return True
            except (Exception, psycopg2.DatabaseError) as error:
                self.current_capacity -= 1
                self.vehicles.remove(vehicle_to_add)
                print(error)
                return False
        else:
            return False


vehicle_id_list = []
vehicle_list = []

make_list = ["BMW", "Mercedes", "Renault", "Toyota", "Nissan", "Audi", "Dacia", "Opel"]
make_dict = dict()
make_dict["BMW"] = [["320e", "Break"], ["M5", "Berlina"], ["M3", "Sedan"], ["X3", "SUV"], ["X5", "SUV"], ["X7", "SUV"],
                    ["I5", "Sedan"], ["I7", "Berlina"], ["X1", "SUV"]]
make_dict["Mercedes"] = [["CLS", "Sedan"], ["GLE", "SUV"], ["GLS", "SUV"], ["V-class", "SUV"], ["S 420", "Berlina"],
                         ["E 330", "Break"]]
make_dict["Renault"] = [["Koleos", "SUV"], ["Megane", "Break"], ["Tallisman", "Sedan"], ["Kangoo MVP", "SUV"]]
make_dict["Toyota"] = [["Hilux", "SUV"], ["Corolla", "Berlina"], ["Avensis", "Sedan"], ["Camry", "SUV"]]
make_dict["Nissan"] = [["Juke", "SUV"], ["X-Trail", "SUV"], ["Qashqai", "SUV"], ["Micra", "Sedan"]]
make_dict["Audi"] = [["A4", "Break"], ["A5", "Sedan"], ["A6", "Break"], ["A7", "Sedan"], ["Q3", "SUV"], ["Q5", "SUV"],
                     ["Q7", "SUV"]]
make_dict["Dacia"] = [["Spring", "Sedan"], ["Dokker", "Break"], ["Logan", "Break"], ["Duster", "SUV"]]
make_dict["Opel"] = [["Astra", "Break"], ["Corsa", "Break"], ["Insignia", "Sedan"]]


def get_random_vehicle_info():
    make = random.choice(make_list)
    model, type = random.choice(make_dict[make])
    if model in ["BMW", "Mercedes", "Toyota", "Audi"]:
        comfort = random.randint(3, 6)
    else:
        comfort = random.randint(2, 4)
    fabrication_year = random.randint(2021, 2024)
    if comfort + fabrication_year <= 2024:
        price_comfort = price_distance = price_time = random.random() + 2
    elif 2025 <= comfort + fabrication_year <= 2026:
        price_comfort = price_distance = price_time = random.random() + 3
    else:
        price_comfort = price_distance = price_time = random.random() + 4

    max_autonomy = random.randint(350, 500)

    number_plate = "IS-" + "".join(random.choice(string.digits) for i in range(2)) + "".join(
        random.choice(string.ascii_uppercase) for i in range(3))

    return make, model, number_plate, comfort, fabrication_year, price_comfort, price_distance, price_time, max_autonomy, type


class Vehicle:
    def __init__(self):
        if len(vehicle_id_list) != 0:
            previous_id = vehicle_id_list[len(vehicle_id_list) - 1]
        else:
            previous_id = random.randint(100, 150)
        # print(previous_id)
        self.id = str(random.randint(int(previous_id) + 5, int(previous_id) + 20))
        # print(self.id)
        make, model, number_plate, comfort, fabrication_year, price_comfort, price_distance, price_time, max_autonomy, type = get_random_vehicle_info()
        self.make = make
        self.comfort = comfort
        self.current_autonomy = 0
        self.fabrication_year = fabrication_year
        self.max_autonomy = max_autonomy
        self.model = model
        self.number_plate = number_plate
        self.price_comfort = price_comfort
        self.price_distance = price_distance
        self.price_time = price_time
        self.type = type
        vehicle_id_list.append(self.id)
        vehicle_list.append(self)


depot_list = []


class Depot:
    def __init__(self, name, max_capacity, x, y):
        self.id = str(random.randint(10, 50))
        self.name = name
        self.current_capacity = 0
        self.max_capacity = max_capacity
        self.x = x
        self.y = y
        depot_list.append(self)

    def add_vehicle(self, vehicle_id):
        if self.current_capacity < self.max_capacity:
            try:
                self.current_capacity += 1
                connection = get_db_connection()
                cursor = connection.cursor()
                cursor.execute(
                    "INSERT INTO depot_vehicle (depot_id, vehicle_id) VALUES (%s, %s)",
                    (self.id, vehicle_id)
                )
                cursor.execute(
                    "UPDATE depot SET current_capacity = %s WHERE id = %s", (self.current_capacity, self.id)
                )
                connection.commit()
                cursor.close()
                return True
            except (Exception, psycopg2.DatabaseError) as error:
                self.current_capacity -= 1
                print(error)
                return False
        else:
            return False


request_list = []
request_id_list = []


def find_parking_by_id(parking_id):
    global parking_list
    i_min = 0
    i_max = len(parking_list) - 1
    middle = (i_min + i_max) // 2
    while parking_list[middle].id != parking_id:
        if parking_list[middle].id < parking_id:
            i_max = middle - 1
        else:
            i_min = middle + 1
        middle = (i_min + i_max) // 2
    return parking_list[middle]


def find_vehicle_by_id(vehicle_id):
    global vehicle_list
    i_min = 0
    i_max = len(vehicle_list) - 1
    middle = (i_min + i_max) // 2
    while vehicle_list[middle].id != vehicle_id:
        if vehicle_list[middle].id < vehicle_id:
            i_min = middle + 1
        else:
            i_max = middle - 1
        middle = (i_min + i_max) // 2
    return vehicle_list[middle]


class Request:
    def __init__(self, arrival, request_date, departure, end_hour, start_hour, vehicle_id, vehicle_type):
        if len(request_id_list) != 0:
            previous_id = request_id_list[len(request_id_list) - 1]
        else:
            previous_id = random.randint(100, 150)
        self.id = str(random.randint(int(previous_id) + 5, int(previous_id) + 20))
        self.arrival = arrival
        self.date = request_date
        self.departure = departure
        self.end_hour = end_hour
        self.solved = True
        self.start_hour = start_hour
        self.started = True
        self.vehicle_id = vehicle_id
        self.vehicle_type = vehicle_type
        request_id_list.append(self.id)
        request_list.append(self)


parking_flux_id_list = []
parking_flux_list = []


class Parking_Flux:
    def __init__(self, my_date, parking_id):
        if len(parking_flux_id_list) != 0:
            previous_id = parking_flux_id_list[len(parking_flux_id_list) - 1]
        else:
            previous_id = random.randint(100, 150)
        self.id = str(random.randint(int(previous_id) + 5, int(previous_id) + 20))
        self.date = my_date
        self.input = 0
        self.output = 0
        self.parking_id = parking_id
        parking_flux_id_list.append(self.id)
        parking_flux_list.append(self)

    def one_input(self):
        self.input += 1

    def one_output(self):
        self.output += 1


ride_list = []
ride_id_list = []


class Ride:
    def __init__(self, request):
        if len(ride_id_list) != 0:
            previous_id = ride_id_list[len(ride_id_list) - 1]
        else:
            previous_id = random.randint(100, 150)
        self.id = str(random.randint(int(previous_id) + 5, int(previous_id) + 20))
        self.arrival = request.arrival
        self.date = request.date
        self.departure = request.departure
        self.distance = random.uniform(1.0, 4.0)
        self.end_hour = request.end_hour
        self.price = random.uniform(15.0, 30.0)
        self.start_hour = request.start_hour
        self.vehicle_id = request.vehicle_id
        ride_id_list.append(self.id)
        ride_list.append(self)


data_list = []


def generate_a_request():
    global user_list
    global parking_list
    user = random.choice(user_list)
    departure = random.choice(parking_list)
    while departure.current_capacity == 0:
        departure = random.choice(parking_list)
    arrival = random.choice(parking_list)
    while arrival.current_capacity == arrival.max_capacity or arrival.id == departure.id:
        arrival = random.choice(parking_list)
    vehicle = random.choice(departure.vehicles)
    if len(data_list) > 0:
        previous_date = data_list[len(data_list) - 1]
    else:
        previous_date = get_random_request_date()
    request_date = min(previous_date, user.registration_date) + timedelta(days=1)
    data_list.append(request_date)
    start_hour = random.randint(1, 16)
    end_hour = random.randint(start_hour + 1, 23)
    request = Request(arrival.name, request_date, departure.name, end_hour, start_hour, vehicle.id, vehicle.type)
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO request  VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (request.id, request.arrival, request.date, request.departure,
             request.end_hour, request.solved, request.start_hour, request.started,
             request.vehicle_id, request.vehicle_type
             )
        )
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    try:
        arrival.current_capacity += 1
        arrival.vehicles.append(vehicle)
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "UPDATE parking SET current_capacity = %s WHERE id = %s", (arrival.current_capacity, arrival.id)
        )
        cursor.execute(
            "UPDATE parking_vehicle SET parking_id = %s WHERE vehicle_id = %s", (arrival.id, vehicle.id)
        )
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        arrival.current_capacity -= 1
        arrival.vehicles.remove(vehicle)
        print(error)
    try:
        departure.current_capacity -= 1
        departure.vehicles.remove(vehicle)
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "UPDATE parking SET current_capacity = %s WHERE id = %s", (departure.current_capacity, departure.id)
        )
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        departure.current_capacity += 1
        departure.vehicles.append(vehicle)
        print(error)
    try:
        user.requests.append(request)
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO user_request VALUES (%s, %s)", (user.id, request.id)
        )
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        user.requests.remove(request)
        print(error)

    ride = Ride(request)

    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO ride  VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (ride.id, ride.arrival, ride.date, ride.departure,
             ride.distance, ride.end_hour, ride.price, ride.start_hour, ride.vehicle_id
             )
        )
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

    try:
        user.rides.append(ride)
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO user_ride VALUES (%s, %s)", (user.id, ride.id)
        )
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        user.rides.remove(request)
        print(error)

    parking_flux_departure = Parking_Flux(request_date, departure.id)
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO flux_parking VALUES (%s, %s, %s, %s, %s)",
            (parking_flux_departure.id, parking_flux_departure.date,
             parking_flux_departure.input, parking_flux_departure.output,
             parking_flux_departure.parking_id)
        )
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

    parking_flux_departure.one_output()
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
             "UPDATE flux_parking SET output = %s WHERE id = %s", (parking_flux_departure.output, parking_flux_departure.id)
        )
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

    parking_flux_arrival = Parking_Flux(request_date, arrival.id)
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO flux_parking VALUES (%s, %s, %s, %s, %s)",
            (parking_flux_arrival.id, parking_flux_arrival.date,
             parking_flux_arrival.input, parking_flux_arrival.output,
             parking_flux_arrival.parking_id)
        )
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

    parking_flux_arrival.one_input()
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "UPDATE flux_parking SET input = %s WHERE id = %s",
            (parking_flux_arrival.input, parking_flux_arrival.id)
        )
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


def generate_not_started_request():
    global user_list
    global parking_list
    user = random.choice(user_list)
    departure = random.choice(parking_list)
    while departure.current_capacity == 0:
        departure = random.choice(parking_list)
    arrival = random.choice(parking_list)
    while arrival.current_capacity == arrival.max_capacity or arrival.id == departure.id:
        arrival = random.choice(parking_list)
    vehicle = random.choice(departure.vehicles)
    if len(data_list) > 0:
        previous_date = data_list[len(data_list) - 1]
    else:
        previous_date = get_random_request_date()
    request_date = min(previous_date, user.registration_date) + timedelta(days=1)
    data_list.append(request_date)
    start_hour = random.randint(1, 16)
    end_hour = random.randint(start_hour + 1, 23)
    request = Request(arrival.name, request_date, departure.name, end_hour, start_hour, vehicle.id, vehicle.type)
    request.started = False
    request.solved = False
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO request  VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (request.id, request.arrival, request.date, request.departure,
             request.end_hour, request.solved, request.start_hour, request.started,
             request.vehicle_id, request.vehicle_type
             )
        )
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    try:
        user.requests.append(request)
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO user_request VALUES (%s, %s)", (user.id, request.id)
        )
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        user.requests.remove(request)
        print(error)


def extract_user_names():
    global names
    url = 'https://randommer.io/api/Name?nameType=fullname&quantity=100'
    api_key = "13288dad67bb478b96edd8c05deb6375"
    headers = {"X-Api-Key": api_key}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        names = response.json()
    else:
        print("Error: " + str(response.status_code))


def create_users():
    extract_user_names()
    for name in names:
        AppUser(name)
    try:
        global user_list
        connection = get_db_connection()
        cursor = connection.cursor()
        for user in user_list:
            cursor.execute("INSERT INTO app_user VALUES (%s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s, %s)",
                           (user.id, user.token, user.email, user.admin, user.name,
                            user.password, user.password_code, user.registration_date,
                            user.salt, user.username, user.verificated, user.verification_code))
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


def create_parking():
    Parking("Pacurari", 15, 47.175602, 27.549481)
    Parking("Palas", 15, 47.157089, 27.593812)
    Parking("Copou", 20, 47.179045, 27.568965)
    Parking("Tatarasi", 15, 47.164291, 27.609454)
    Parking("Piata Unirii", 18, 47.164775, 27.580579)

    try:
        global parking_list
        connection = get_db_connection()
        cursor = connection.cursor()
        for parking in parking_list:
            cursor.execute("INSERT INTO parking VALUES (%s, %s, %s, %s, %s, %s)",
                           (parking.id, parking.current_capacity, parking.max_capacity, parking.name, parking.x,
                            parking.y))
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


def create_depot():
    Depot("Central Depot", 200, 47.1648688, 27.5732394)
    try:
        global depot_list
        depot = depot_list[0]
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("INSERT INTO depot VALUES (%s, %s, %s, %s, %s, %s)",
                       (depot.id, depot.current_capacity, depot.max_capacity, depot.name, depot.x, depot.y))
        connection.commit()
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


def create_vehicle():
    for _ in range(35):
        Vehicle()
    try:
        global vehicle_list
        global depot_list
        depot = depot_list[0]
        connection = get_db_connection()
        cursor = connection.cursor()
        for vehicle in vehicle_list:
            cursor.execute("INSERT INTO vehicle VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                           (vehicle.id, vehicle.make, vehicle.comfort, vehicle.current_autonomy,
                            vehicle.fabrication_year, vehicle.max_autonomy, vehicle.model, vehicle.number_plate,
                            vehicle.price_comfort, vehicle.price_distance, vehicle.price_time, vehicle.type))
        connection.commit()
        for vehicle in vehicle_list:
            depot.add_vehicle(vehicle.id)
        cursor.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)


def populate_parking():
    global vehicle_id_list
    global parking_list
    nr_parking_to_add = len(vehicle_list)
    '''for parking in parking_list:
        nr_parking_to_add += parking.max_capacity // 2
    '''
    while nr_parking_to_add > 0:
        vehicle_id = random.choice(vehicle_id_list)
        parking = random.choice(parking_list)
        while not parking.add_vehicle(vehicle_id):
            parking = random.choice(parking_list)
        nr_parking_to_add -= 1
        vehicle_id_list.remove(vehicle_id)


if __name__ == '__main__':
    clear_db()
    create_users()
    create_parking()
    create_depot()
    create_vehicle()
    populate_parking()
    for _ in range(150):
        generate_a_request()
    for _ in range(5):
        generate_not_started_request()
    # print(request_list)
