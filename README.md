# Libari
Libari is your personal Library Diary. A refined website for tracking your book reading habits.
Imagine if the world of book tracking had a website with good UX! 

---
## The Idea
I love webapps for tracking hobbies! It's a powerful way to keep the hobbyist interested in invested in their hobbies.
The idea is that it game-ifies the hobby by adding what are effectively 'Experience points' to the hobby. 
>*I set a goal to read 40 books this year and I've already read 10!*  
*Looks like my friends have read more books than me, I've gotta catch up!*  
*etc. etc. etc.*


This is the idea, make a more **stylish** and **fun to use** website for tracking book reading, mix in some social media aspects and some 
interesting ways to visualize user reading data and bada-boom bada-bing, you've got the better book-oriented social media app!

---
## The Method
Now, I know I can't magically fill my database with everybook, all the editions of each book, and honestly at the outset I don't even know how to go about 
storing all that book data and grouping them like on *other book tracking sites* or *other book api's*  
But, I don't have to. I can start by using the Google Books API to fill in the gaps for now.  
Later down the road I can flesh out the "Moderator" and "Admin" submitted/approved books, where books can be 
added by anyone but they have to be approved by privileged users.

To start, the app will have very specific and limited functionality, but as I progress, the scope and abilities of the app will grow.

---
## The Goals
### To Start
Initially, the Alpha version of the app will be capable of these limited functions:
- Simple User data (Email, Username, Password)
  - Authenticated user's can add data to their lists
- Each user has a list belonging to them holding all their Booklist Entries
  - These Booklist Entries hold all the user specific book data (Progress, Status, Rating, Start date, Finish Data, Review)
- You'll be able to follow people and see their recent book updates 
- Ability to view any person's list of books by username

### Later
After the Alpha deployment of the app, I have more things I'd like to add:
- Google Auth'd users
- User image uploading and resizing (Golang image resize background microservice)
  - Supported by RabbitMQ message broker
- Importing Book list from Goodreads (Another microservice, likely)
- Book reading data visualizations
- Much Much More
