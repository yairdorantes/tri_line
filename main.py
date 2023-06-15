from fastapi import FastAPI, WebSocket
import copy

# s
app = FastAPI()

connected_clients = []
client_sockets = {}
initial_template = [[-100, -100, -100], [-100, -100, -100], [-100, -100, -100]]
# game_template = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]]
game_template = copy.deepcopy(initial_template)

# figure = "cross"

figures = {"circle": "circle", "cross": "cross"}


async def send_game_template_to_clients():
    global game_template
    try:
        if eval_game():
            print("winner", last_move)
            print(game_template)

            for client_id in connected_clients:
                websocket = client_sockets[client_id]
                await websocket.send_json(
                    {
                        "game_template": game_template,
                        "is_over": True,
                        "figure": "cross",
                        "winner": last_move,
                    }
                )
            game_template = copy.deepcopy(initial_template)
            connected_clients.clear()
            client_sockets.clear()
        else:
            for client_id in connected_clients:
                websocket = client_sockets[client_id]
                await websocket.send_json(
                    {
                        "game_template": game_template,
                        "is_over": False,
                        "figure": "cross",
                    }
                )
    except Exception as e:
        game_template = copy.deepcopy(initial_template)
        connected_clients.clear()
        client_sockets.clear()
        print("here err")


def eval_game() -> bool:
    for row in game_template:
        if sum(row) == 0 or sum(row) == 3:
            print(row, "1")
            return True
    for pos in range(len(game_template)):
        sum_elems = sum(sublist[pos] for sublist in game_template)
        if sum_elems == 0 or sum_elems == 3:
            print(sum_elems, "2")
            return True
    sum_left = sum(game_template[i][i] for i in range(3))
    if sum_left == 0 or sum_left == 3:
        print(sum_left, "3")
        return True
    sum_right = sum(game_template[i][2 - i] for i in range(3))
    if sum_right == 0 or sum_right == 3:
        print(sum_right, "4")
        return True
    return False


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    global last_move
    figure = ""
    await websocket.accept()

    # print(connected_clients)
    client_id = str(id(websocket))
    # print(client_id)

    if len(connected_clients) < 2:
        connected_clients.append(str(id(websocket)))

        client_sockets[client_id] = websocket
        if len(connected_clients) == 1:
            figure = figures["cross"]
        elif len(connected_clients) == 2:
            figure = figures["circle"]
        await websocket.send_json({figure: "cross"})
    try:
        while True:
            print(websocket.client.host)
            print(connected_clients)
            print(client_id)
            data = await websocket.receive_text()

            # if len(connected_clients) == 2:
            position = int(data)
            row = (position) // 3
            column = (position) % 3
            if client_id == connected_clients[0]:
                game_template[row][column] = 0
                last_move = "cross"

            elif client_id == connected_clients[1]:
                game_template[row][column] = 1
                last_move = "circle"

            # game_template_json = json.dumps(game_template)

            await send_game_template_to_clients()
    except Exception as e:
        print("//**", e)

    # print(f"Received message from client {client_id}: {data}"")
