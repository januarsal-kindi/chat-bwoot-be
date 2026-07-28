# Chatbot

This context defines the people and conversations represented by the chatbot application.

## Language

**User**:
A person registered to use the chatbot, uniquely identified by a normalized email address.
_Avoid_: Account, member

**Session**:
A User's authenticated use of the application on one device. A User may have multiple Sessions.
_Avoid_: Login, token

**Chat**:
A named conversation owned by one User and containing an ordered history of Messages.
_Avoid_: Thread, room

**Message**:
One contribution to a Chat, authored by either its User or the Assistant.
_Avoid_: Prompt, response

**Assistant**:
The chatbot participant that generates replies to User Messages.
_Avoid_: Bot, AI user
