# Sword Health - Maintenance Tasks API

##### Table of Contents **@TODO**
- [Notes about the API endpoints](#notes-about-the-api-endpoints)    
- [Application overview](#application-overview)  
- [Local setup](#local-setup)  
- [Run application](#run-application)
- [Remove application](#remove-application)
- [Unit tests](#unit-tests)


This project is a simple Node.js and Express application that provides an API for managing maintenance tasks performed during a working day.
There are two types of users for this application: the Manager and the Technician. 
The Technician is able to see, create, and update their own performed tasks, while the Manager can see tasks from all Technicians, delete them, and should be notified when a Technician performs a task.
