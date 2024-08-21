from datetime import datetime
import asyncio
import websockets
from rpi_ws281x import *
import json

# WebHUB websocket connection
WS_URL = "wss://a7uirjun9k.execute-api.us-east-2.amazonaws.com/stage-test-0-eqy3zt-KMrU6-117be9d/"
# WebHUB MongoDB name used to presist color values of the led matrix
UNIQUE_DB_NAME = "test-0-w3xfsh"

# Color values from 0 to 9 are used to map to 0 to 255. For example 0 (index) = 0, 3 (index) = 85
DATA_VAL_TO_COLOR_VAL = [0, 29, 57, 85, 114, 142, 170, 199, 227, 255]

# 65 x 46 sized led matrix
LED_COUNT = 65 * 46
# Led strip 1 65 x 22
LED_COUNT_1 = 65 * 22
# Led strip 2 65 x 24
LED_COUNT_2 = 65 * 24

# Initializing a blank led matrix color state which holds the color values that will be projected onto the led matrix
LED_MATRIX_COLOR_STATE = [None for _ in range(LED_COUNT * 3)]

# Raspberry GPIO pins used for each led strip
LED_PIN_1 = 18
LED_PIN_2 = 13

LED_FREQ_HZ = 800000

LED_DMA_1 = 10
LED_DMA_2 = 10

# Ranges from 1 to 255 (so its extremely low at 3 which helps with power injection and not drawing to many AMPs)
LED_BRIGHTNESS = 3
LED_INVERT = False

# This setup supports 2 channels for data overload reasons
LED_CHANNEL_1 = 0
LED_CHANNEL_2 = 1

strip_1 = Adafruit_NeoPixel(LED_COUNT_1, LED_PIN_1, LED_FREQ_HZ, LED_DMA_1, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL_1)
strip_2 = Adafruit_NeoPixel(LED_COUNT_2, LED_PIN_2, LED_FREQ_HZ, LED_DMA_2, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL_2)

strip_1.begin()
strip_2.begin()

print("Begin strip")

async def init_raspberry_pi_client(ws):
    '''
    Initializes raspberry pi client by sending setting up a room in the websocket and getting the doc data for that room
    '''

    msg = {
        "action": "request",
        "rm": "myroom-matrix",
        "_set": {
            "user": {
                "name": "raspberry-pi-client",
                "type": "raspberry-pi-client",
                "date": datetime.now().isoformat()
            }
        },
        "_getdoc": {
            "db": {
                "mongodb": {
                    "unique_db_name": UNIQUE_DB_NAME
                },
            }
        }
    }
    
    await ws.send(json.dumps(msg))

async def request_doc_data(ws):
    '''
    Requests data from mongodb database using a websocket connection
    '''

    msg = {
        "action": "request",
        "rm": "myroom-matrix",
        "_getdoc": {
            "db": {
                "mongodb": {
                    "unique_db_name": UNIQUE_DB_NAME
                },
            }
        }
    }
    
    await ws.send(json.dumps(msg))

async def handle_events():
    '''
    Handles initializing and listening to websocket connection
    '''
    
    # establishes connection to websocket hosted on AWS
    async with websockets.connect(WS_URL) as websocket:
        
        await init_raspberry_pi_client(websocket)
        
        # this function cheecks to see if there is a message to recieve from the websocket
        async def recieve_event(ws):
            event_str = await ws.recv()
            process_data(event_str, ws)
        
        # run recieve_event indefinitely
        while True:
            await recieve_event(websocket)

def process_data(event_str, ws):
    '''
    Parses through the event_str (a websocket message) passed in and updates the led matrix accordingly, requesting data using the websocket passed in if needed
    '''

    event = json.loads(event_str)
    keys = event.keys()

    # parse the data coming in from the event string as a json dictionary
    if "response" in keys:
        o1 = event["response"]
        o1_keys = o1.keys()
        if "$getdoc" in o1_keys:
            o2 = o1["$getdoc"]
            
            if "data" in o2.keys():
                o3 = o2["data"]
                if "whiteboard" in o3.keys():
                    sync_with_doc_data(o3["whiteboard"])
            
    if "broadcast" in keys:
        o1 = event["broadcast"]
        o1_keys = o1.keys()
        if "$notification" in o1_keys:
            o2 = o1["$notification"]
            o2_keys = o2.keys()
            if "data" in o2_keys:
                o3 = o2["data"]
                o3_keys = o3.keys()
                
                if "sync-with-doc" in o3_keys and o3["sync-with-docs"]:
                    # retrieve doc data
                    request_doc_data(ws)
                    
                
                if "clear" in o3_keys:
                    o4 = o3["clear"]
                    # clear the led-matrix and set all leds to the rgb array passed in as a parameter
                    strips_update_clear(o4)
                    
                if "background" in o3_keys:
                    o4 = o3["background"]
                    # update background color
                    strips_update_background(o4)
                
                if "array" in o3_keys:
                    o4 = o3["array"]
                    # update a specific array of points in the led matrix
                    strips_update_array(o4)
                    
                if "points" in o3_keys:
                    o4 = o3["points"]
                    # update a specific set of points in the led matrix
                    strips_update_points(o4)


def sync_with_doc_data(whiteboard):
    '''
    Parses through the whiteboard data and updates the background and led matrix color state accordingly
    '''

    # first set the background color if there is one
    if "background" in whiteboard.keys():
        
        if (whiteboard["background"]):
            
            color_background_arr = [
                whiteboard["background"]["0"],
                whiteboard["background"]["1"],
                whiteboard["background"]["2"], 
            ]
            
            strips_update_clear(color_background_arr)

    # next update the led strip with the color of each point  
    if "points" in whiteboard.keys():
        # convert points object to update points array
        points = whiteboard["points"]
        # points maybe null, None, or undefined
        indexes = points.keys() if points else []
        
        color_points_arr = []
        
        for i in indexes:
            color_points_arr.append(int(i))
            color_points_arr.append(points[i]["0"])
            color_points_arr.append(points[i]["1"])
            color_points_arr.append(points[i]["2"])
        
        strips_update_points(color_points_arr)


def strips_update_array(color_data_arr):
    '''
    Updates the led strip colors with the 'color_data_arr' data passed in as an arguement
    '''

    for i in range(0, len(color_data_arr), 3):
        r = DATA_VAL_TO_COLOR_VAL[color_data_arr[i]]
        g = DATA_VAL_TO_COLOR_VAL[color_data_arr[i + 1]]
        b = DATA_VAL_TO_COLOR_VAL[color_data_arr[i + 2]]
        set_pixel_color(
            i // 3,
            r, g, b
        )
        
        save_led_matrix_color_state(i, r, g, b)
    
    show()
    
def strips_update_points(color_points_arr):
    '''
    Updates the led strip colors with the 'color_points_arr' data passed in as an arguement
    '''
    for i in range(0, len(color_points_arr), 4):
        r = DATA_VAL_TO_COLOR_VAL[color_points_arr[i + 1]]
        g = DATA_VAL_TO_COLOR_VAL[color_points_arr[i + 2]]
        b = DATA_VAL_TO_COLOR_VAL[color_points_arr[i + 3]]
        set_pixel_color(
            color_points_arr[i],
            r, g, b
        )
        
        save_led_matrix_color_state(color_points_arr[i] * 3, r, g, b)
    
    show()
    
    
def strips_update_background(color_background_arr):
    '''
    Updates the background color of the led matrix
    '''
    
    R = DATA_VAL_TO_COLOR_VAL[color_background_arr[0]]
    G = DATA_VAL_TO_COLOR_VAL[color_background_arr[1]]
    B = DATA_VAL_TO_COLOR_VAL[color_background_arr[2]]
    
    for i in range(LED_COUNT):
            set_pixel_color(i, R, G, B)
    
    show()
    
    # Restore LED Matrix Color State
    restore_led_matrix_color_state()
    
def strips_update_clear(color_background_arr):
    '''
    Clears the led matrix color states and updates the led matrix background to the background color passed into the function
    '''

    # Clearing led matrix color state
    LED_MATRIX_COLOR_STATE.clear()
    
    R = DATA_VAL_TO_COLOR_VAL[color_background_arr[0]]
    G = DATA_VAL_TO_COLOR_VAL[color_background_arr[1]]
    B = DATA_VAL_TO_COLOR_VAL[color_background_arr[2]]
    
    for i in range(LED_COUNT):
            set_pixel_color(i, R, G, B)
            # Clear LED Matrix Color State
            
            # @ i
            LED_MATRIX_COLOR_STATE.append(None)
            # @ i + 1
            LED_MATRIX_COLOR_STATE.append(None)
            # @ i + 2
            LED_MATRIX_COLOR_STATE.append(None)
    
    show()


def restore_led_matrix_color_state():
    '''
    Restores a previously saved color state of the led matrix by iterating through the variable LED_MATRIX_COLOR_STATE
    '''

    for i in range(0, len(LED_MATRIX_COLOR_STATE), 3):
        r = LED_MATRIX_COLOR_STATE[i]
        g = LED_MATRIX_COLOR_STATE[i + 1]
        b = LED_MATRIX_COLOR_STATE[i + 2]
        if not((r == None or g == None or b == None)):
            set_pixel_color(
                i // 3,
                r, g, b
            )
    
    show() 

def save_led_matrix_color_state(index, r, g, b):
    '''
    Saves the color state for a specific led index in the led matrix
    '''

    LED_MATRIX_COLOR_STATE[index] = r
    LED_MATRIX_COLOR_STATE[index + 1] = g
    LED_MATRIX_COLOR_STATE[index + 2] = b

def set_pixel_color(pixel, r, g, b):
    '''
    Sets the pixel color given the pixel index and rgb color
    '''

    if pixel < LED_COUNT_1:
        strip_1.setPixelColor(pixel, Color(r,g,b))
    else:
        strip_2.setPixelColor(pixel - LED_COUNT_1, Color(r,g,b))


def clear():
    '''
    Clears the led matrix and sets all colors to white
    '''

    for i in range(LED_COUNT):
            set_pixel_color(i, 255, 255, 255)
    show()


def show():
    '''
    Displays any updated led colors for both strip_1 and strip_2
    '''

    strip_1.show()
    strip_2.show()

try:

    print("Establish connection...")
    # runs a continuous loop of event listeners and triggers until program is terminated
    asyncio.get_event_loop().run_until_complete(handle_events())
except KeyboardInterrupt:
    pass
finally:
    clear()

