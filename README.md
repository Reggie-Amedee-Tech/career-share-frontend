## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Description

### How to deploy

Please clone these two repos [Front End](https://github.com/Reggie-Amedee-Tech/career-share-frontend) and [Back end](https://github.com/Reggie-Amedee-Tech/career-share-backend).

Add a .env variable in BOTH project roots.

Once you do this, please reach out to me to get the necessary environment variables so you can effectively run the app.

### Career Share

**Career Share** is intended to be a community based job board where users can share resources related to career development and job placements.

The **technology used** to create this product are as follows:

- postregresql DB
- Prisma ORM
- Express
- NextJs
- NodeJs

In order to run it locally, please follow the instructions above.

I encountered some in a couple of places. The first bug I had to work through was setting up my postgresql DB. With Prisma 7, the configuration pattern changed and you know have to put your db url in the prisma.config.ts file, which is something I had to research to find out.

The second bug that I encountered was when I was trying to host my application on Render, the build kept failing for my backend. The reason why this happened is because my Supabase DB was misconfigured. Once I updated the string that Supabase provides, I updated my secrets in Render and the build succeeded.

**If I had more time**, I would encorporate geospatial aspects to our application and have a job board scrapped/rendered in my app based on a users location.

I would also turn this into a multi-tenant application so organizations can use this tool internally which can potetnailly unlock new ways to monetize the app!
