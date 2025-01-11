import asyncio
import websockets
import pynput

caps_active = False

connected_clients = set()

async def send_message_to_clients(message):
    if connected_clients:
        for client in connected_clients:
            await client.send(message)

async def websocket_handler(websocket):
    connected_clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        connected_clients.remove(websocket)

actions = {
    "f": "Mute",
    "g": "Deafen",
}

def on_press(key):
    global caps_active

    if key == pynput.keyboard.Key.caps_lock:
        caps_active = True
    elif caps_active and key.char in actions.keys():
        print(actions[key.char])
        asyncio.run(send_message_to_clients(actions[key.char]))

def on_release(key):
    global caps_active
    if key == pynput.keyboard.Key.caps_lock:
        caps_active = False

async def main():
    server = await websockets.serve(websocket_handler, "localhost", 8310)

    with pynput.keyboard.Listener(on_press=on_press,on_release=on_release) as listener:
        await server.wait_closed()

asyncio.run(main())
