---
runme:
  id: 01HN0KM31GRPC9T0Y1NN5JFA67
  version: v2.2
---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash {"id":"01HN0KM31GRPC9T0Y1NKGKJPVT"}
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Running backend development server

### Setting up the environment (one time activity)

* Install [Python 3.11](https://www.python.org/downloads/release/python-3117/) in your system
* Make sure `poetry` is available in your system

```bash {"id":"01HN0GZ908F54V08PMEV26A5HC"}
pip install poetry

```

* Move to the root of this codebase and do poetry install, this will create the virtual environment and install all the packages necessary

```bash {"id":"01HN0GZ908F54V08PMEW4H7TD3"}
poetry install --no-root

```

* Install the pre-commit hooks in the project by issuing the below command.

```bash {"id":"01HG1F4HJ2E7YHVDTVJWMDQ9J3"}
pre-commit install -f

```

### Run the backend server

```bash {"id":"01HN0KT9WBQYQSH622MX0WMXX1"}
poetry shell
python api/index.py
```

* Open `http://localhost:5000/api/docs` in your browser to access the swagger document

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
