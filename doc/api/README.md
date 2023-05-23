API Documentation
![Alt Text](./api.png)
Messages API
Add a new message
Request URL:

POST http://127.0.0.1:3000/api/messages/

Request Body:

json
Copy code
{
"conversationId": "<conversationId>",
"sender": "<sender>",
"text": "<messageText>"
}
Request Body Explanation:

conversationId: String - The unique identifier of the conversation this message belongs to.
sender: String - The identifier of the user who sends the message.
text: String - The text content of the message.
Example:

json
Copy code
{
"conversationId": "9ZdC9xwFhrJdGsESZJmR",
"sender": "user1",
"text": "It works"
}
Conversations API
Create a new conversation
Request URL:

POST http://127.0.0.1:3000/api/conversations/

Request Body:

json
Copy code
{
"senderId": "<senderId>",
"receiverId": "<receiverId>"
}
Request Body Explanation:

senderId: String - The unique identifier of the user who initiates the conversation.
receiverId: String - The unique identifier of the user who is the recipient of the conversation.
Example:

json
Copy code
{
"senderId": "ziadex",
"receiverId": "sohaibex"
}
This document describes the endpoints to add a new message to a conversation and create a new conversation. To interact with these APIs, send a POST request to the specified URLs with the defined JSON bodies.
