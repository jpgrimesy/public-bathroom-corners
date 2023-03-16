# public-bathroom-corners

## Routing Table
|       **URL**   | **REST Route** | **HTTP Verb** | **CRUD Action** |   **EJS View(s)**        |
| --------------- | -------------- | ------------- | --------------- | ------------------------ |
| /               | N/A            | GET           | read            | index.ejs                | 
| /reviews/index/:id | index       | GET           | read            | reviews.ejs, 404.ejs     |
| /reviews/full/:bathId/:reviewId| show | GET        | read          |   full-review.ejs        | 
| /reviews/new/:id   | new            | GET           | read            | new-post.ejs          | 
| /reviews/post/:id  | create         | POST          | create          |                          |
| /reviews/edit-post/:bathId/:reviewId| edit | GET    | read            | edit-post.ejs        |
| /reviews/edit/:bathId/:reviewId | update | PATCH/PUT| update          |                          |
| /reviews/delete/:bathId/:reviewId | destroy | DELETE | delete          |                          |
| /bathroom/:id    | show           | GET           | read            | bathroom.ejs                |
| /bathroom/create/:id   | create         | POST           | create             |                |
| /bathroom/update/:id   | show           | PATCH/PUT           | update             |                |
| /*              | N/A            | GET           | N/A             | 404.ejs                  |
<a href="https://www.flaticon.com/free-icons/poop" title="poop icons">Poop icons created by Freepik - Flaticon</a>