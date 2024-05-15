# URL Shortener App

## Overview
This application is a URL shortener service built with an Express server and Socket.io for real-time communication. The service generates a shortened URL for a given original URL and ensures delivery of the shortened URL back to the client through a socket event. Clients can then use the shortened URL to retrieve the original URL.

## Features
- Generate a random 10-character code for URL shortening.
- Asynchronous read/write operations without a database.
- Real-time communication using Socket.io for sending shortened URLs and receiving acknowledgements.
- Endpoint to retrieve the original URL using the shortened URL.

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install the dependencies:
4. Add .env file as in .env.example

   ```sh
   yarn install
   ```

5. Start the server in dev:

   ```sh
   npm run dev
   ```
6. Build app:

   ```sh
   npm run build
   ```
7. Start build app:

   ```sh
   npm start
   ```

## Node Version
Ensure you are using Node.js version **20.12.2**. You can check your Node.js version by running:
```sh
node -v
```
If you need to switch versions, consider using a version manager like `nvm`.

## Endpoints

| Method | Endpoint               | Description                                          |
|--------|------------------------|------------------------------------------------------|
| POST   | /url                   | Receives a URL and returns a shortened URL.          |
| GET    | /:url         | Retrieves the original URL from the shortened URL.   |

## Socket.io

- **Namespace**: `/broadcast`
- **Events**:
  - **Send Event**: `url-response`
    - **Message Structure**:
      ```json
      {
        "shortenedURL": "http://localhost:3000/gy15GcUBBu",
        "messageId": "39d5fda1-fcd4-4056-9b9d-548dea8bcb5d"
      }
      ```
  - **Listen Event**: `acknowledge`
    - **Message Structure**:
      ```json
      {
        "messageId": "39d5fda1-fcd4-4056-9b9d-548dea8bcb5d"
      }
      ```
## Authorization

The application uses an authorization header to trace users in both the HTTP API and the Socket.io communication. This header contains a unique key to identify the user, even though we are not implementing a full user system at this time.

### HTTP API

Include an `Authorization` header with your unique key in all API requests.

## How It Works

1. **POST /url**: 
   - The client sends a POST request with a JSON body containing the original URL.
   - The server generates a random 10-character code.
   - The server creates a shortened URL using the base URL and the generated code.
   - The server sends the shortened URL back to the client through a socket event `url-response` and includes a `messageId`.

2. **Socket Event (url-response)**:
   - The server emits the `url-response` event to the client with the shortened URL and a unique `messageId`.
   - The client acknowledges the receipt by sending back an `acknowledge` event with the same `messageId`.

3. **GET /:url**:
   - The client can make a GET request using the shortened URL.
   - The server returns the original URL in a JSON object.

## Example

### Shortening a URL

1. **Client Request**:
   ```sh
   POST http://localhost:3000/url
   Content-Type: application/json

   {
     "url": "http://classcalc.com"
   }
   ```

2. **Server Response**:
   - The server sends the shortened URL through the socket event `url-response`:
     ```json
     {
       "shortenedURL": "http://localhost:3000/a2b345w68s",
       "messageId": "39d5fda1-fcd4-4056-9b9d-548dea8bcb5d"
     }
     ```

3. **Client Acknowledgement**:
   - The client acknowledges receipt by sending an `acknowledge` event:
     ```json
     {
       "messageId": "39d5fda1-fcd4-4056-9b9d-548dea8bcb5d"
     }
     ```

### Retrieving the Original URL

1. **Client Request**:
   ```sh
   GET http://localhost:3000/a2b345w68s
   ```

2. **Server Response**:
   ```json
   {
     "url": "http://classcalc.com"
   }
   ```