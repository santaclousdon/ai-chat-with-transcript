From the root of the project, run:

```
docker compose up --build
docker compose run api npm run migration:up
```

Go to [localhost:5173](http://localhost:5173) - you should see two users displayed that were fetched from the DB.