This project is to demonstrate the functioning of microservices and their integration with another team.

Our service, holiday packages, is made up of 4 microservices:

The admin microservice, runs locally on port 5001.

The discount microservice, runs locally on port 5003.

The recommendation microservice, runs locally on port 5004.

The user microservice, runs locally on port 5005.

All of these have been containerized using Docker for simplicity. Containerized MongoDB is used for ease of integration and testing.
In addition to this, team 6 accepted to integrate their services: push notifications and pricing analysis. 

What has been integrated:

The admin microservice to edit packages was integrated with the pricing service of team 6.
The user microservice to customize packages and place an order was integrated with push notifications of team 6.

How it was integrated:

Team 6 used bore, a simple tunnelling tool that will let people "expose" their API to the internet. 
Essentially, they were able to make their microservices global and share their link to us.

This link allowed our microservices to interact with theirs. 
Furthermore, each microservice uses javascript object notation (json) to share data.
For instance, the pricing service from team 6 required a base price, which will be processed by their backend and returned which can then be displayed by our service.
Simple Request ----> Response mechanism.
Similarly, other parameters can be sent as well.

NOTE:
I have used ngnix listening on default port 80 which is essentially reverse proxying requests between OUR services. 
{Runs locally. The config files have not been uploaded.}
This implies that each microservice does not directly communicate with other microservices, but sends a message to the nginx server which then forwards it to the right microservice.
