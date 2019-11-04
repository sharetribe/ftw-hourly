# Transaction process

This is the transaction process that the Flex Template for Web is designed to work with by default.
The `process.edn` file describes the process flow while the `templates` folder contains notification
messages that are used by the process.

The process uses unit-based booking and time-based pricing i.e. the quantity of booked units should
be calculated from the number of time units. The process has preauthorization and it relies on the
provider to accept booking requests.

For different process descriptions for varying booking and pricing models, see the
[Flex example processes repository](https://github.com/sharetribe/flex-example-processes)
