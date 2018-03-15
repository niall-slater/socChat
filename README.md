# socChat
A local network chat app using Socket.io and JQuery.

The app supports:

* Drag-and-drop image transmission (using base64 strings, no server-side storage needed, animated GIFs are supported)
* Persistent nicknames using cookies
* Desktop notifications where allowed (your browser may require an SSL certificate for this)
* Ephemeral chat history (it's deleted when the server shuts down)

The structure has been kept very flat and easy-to-interpret. All the server-side code is in index.js, and all the client-side code is in index.html.

Feel free to fork the project if you're learning about websockets and need some guidance.

# Using the app

1. Run your own server on a network by typing 'node index' in a command prompt from the root directory. You'll need Node.js installed.
2. Go to localhost:3000 in your browser to open the app.
3. If other people want to join, find your IPv4 address by typing 'ipconfig' in the command prompt on the machine running the server.
4. Type the IP address given into the client's web browser, followed by ':3000'.
5. You're chatting! Be nice.
