[![api-build](https://github.com/bobis33/end-year-project/actions/workflows/api-build.yml/badge.svg)](https://github.com/bobis33/Efrei_Project/actions/workflows/api-build.yml)
[![api-test](https://github.com/bobis33/end-year-project/actions/workflows/api-test.yml/badge.svg)](https://github.com/bobis33/Efrei_Project/actions/workflows/api-test.yml)

## Description

[Nest](https://github.com/nestjs/nest).

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

> Then go to [http://localhost:3001](http://localhost:3001/api) in your browser.


## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## DB

If you do modification in db or schema, you need to run the following command to generate the migration file.

```bash
$ npm run prisma:migrate
```