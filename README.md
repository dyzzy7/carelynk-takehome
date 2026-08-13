# Dependencies
* node.js
* npm
* postgresql

# To Run
1. Copy `env.example` to `.env`.
2. Edit `.env` with your environment variables.
3. If this is your first time running, run the Sequelize migrations:
```bash
npx sequelize-cli db:migrate
```
4. Install dependencies and run API:
```bash
npm install
npm run dev
```

# To Use
1. Upload a file to the API:
```bash
curl -X POST localhost:3001/api/docs/upload -F "file=@<PATH_TO>/Fixture.zip"
```
2. Validate worker data:
```bash
curl -X GET localhost:3001/api/workers/validate
```