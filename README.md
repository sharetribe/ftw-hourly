# Sharetribe Flex Template for Web: time-based process

[![CircleCI](https://circleci.com/gh/sharetribe/ftw-hourly.svg?style=svg)](https://circleci.com/gh/sharetribe/ftw-hourly)

> **Note** If you are using day-based booking process (i.e. daily or nightly bookings), you should
> choose the original [Flex Template for Web](https://github.com/sharetribe/ftw-daily/) instead.

This is a template web application for a Sharetribe Flex marketplace using **time-based booking
process**. This repository is a fork from the existing
[FTW repository](https://github.com/sharetribe/ftw-hourly) (which is using nightly booking process).
So, if you have started working with the original FTW repository and you want to change to
FTW-hourly, you can
[change the 'upstream' remote repository](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork).
You can read more about time-based process from the related
[Flex Docs article](https://www.sharetribe.com/docs/background/time-based-template)

## Quick start

> **Note:** this template assumes that you are using
> [time-based transaction process](https://www.sharetribe.com/docs/guides/how-to-take-time-based-bookings-into-use/)
> with alias `flex-hourly-default-process/release-1`, if you are using something else, you should
> change the alias name from
> [config.js](https://github.com/sharetribe/ftw-hourly/blob/master/src/config.js#L35) and
> [util/transaction.js](https://github.com/sharetribe/ftw-hourly/blob/master/src/util/transaction.js#L111)

If you just want to get the app running quickly to test it out, first install
[Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/), and follow along:

```sh
git clone git@github.com:sharetribe/ftw-hourly.git             # clone this repository
cd ftw-hourly/                                                 # change to the cloned directory
yarn install                                                   # install dependencies
yarn run config                                                # add the mandatory env vars to your local config
yarn run dev                                                   # start the dev server, this will open a browser in localhost:3000
```

You can also follow along the
[Getting started with FTW](https://www.sharetribe.com/docs/tutorials/getting-started-with-ftw/)
tutorial and read the background article about
[Time-based template](https://www.sharetribe.com/docs/background/time-based-template/) from the
[Flex Docs website](https://www.sharetribe.com/docs/).

For more information of the configuration, see the
[FTW Environment configuration variables](https://www.sharetribe.com/docs/references/ftw-env/)
reference in Flex Docs.

> **Note:** If you want to build your own Flex marketplace on top of the template, you should fork
> the repository instead of cloning it. See the
> [How to Customize FTW](https://www.sharetribe.com/docs/guides/how-to-customize-ftw/) guide in Flex
> Docs.

## Getting started with your own customization

If you want to build your own Flex marketplace by customizing the template application, see the
[How to Customize FTW](https://www.sharetribe.com/docs/guides/how-to-customize-ftw/) guide in Flex
Docs.

## Deploying to Heroku

> **Note:** Remember to fork the repository before deploying the application. Connecting your own
> Github repository to Heroku will make manual deploys easier.

See the
[How to deploy FTW to production](https://www.sharetribe.com/docs/guides/how-to-deploy-ftw-to-production/)
guide in Flex Docs for more information.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Documentation

See the Flex Docs site: https://www.sharetribe.com/docs/

See also the [docs/](docs/) directory for some additional internal documentation.

## Get help – join Sharetribe Flex Developer Slack channel

If you have any questions about development, the best place to ask them is the Flex Developer Slack
channel at https://www.sharetribe.com/flex-slack

## License

This project is licensed under the terms of the Apache-2.0 license.

See [LICENSE](LICENSE)
