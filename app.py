import events_handler

def application(env, start_response):
    try:
        request_body_size = int(env.get('CONTENT_LENGTH', 0))
    except (ValueError):
        request_body_size = 0
    request_body = env['wsgi.input'].read(request_body_size)
    request_body = request_body.decode('utf-8')

    # comment try except to get info

    try:
        events_handler.handle_request(request_body)
    except KeyError:
        pass

    start_response('200 OK', [('Content-Type','text/html')])
    return [b"ok"]