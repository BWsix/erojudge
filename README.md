# erojudge

## How to run erojudge locally (I guess?)

1. Setup Github OAuth credentials
    1. Rename [`.env.example`](./.env.example) to `.env`
    2. Register a new Github OAuth application [here](https://github.com/settings/applications/new)
    3. The Authorization callback URL should be `NEXTAUTH_URL` + `/api/auth/callback/github`
    4. Copy `Client Id` and `Client Secret`
2. Build the project
    1. Run `docker compose up -d`
3. Migrate the database
    1. Copy `.env` file into `/website`
    2. In `/website`, run `npx prisma db push && npx prisma db seed`
4. erojudge should be running at <http://localhost:3000>
