const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

/**
 * Prints error, since source file was not provided
 */
const sourceFileNotProvided = () => `
${chalk.bold.red(`You didn't provide source file!`)}

You need to run the script with source file:
${chalk.cyan.bold('yarn run timezones source-file.json')}

You could find applicable IANA timezone source file in json format from moment-timezone repository:
${chalk.underline(
  'https://raw.githubusercontent.com/moment/moment-timezone/develop/data/unpacked/latest.json'
)}

`;

/**
 * Prints error, since source file did not exist.
 *
 * @param pathToFile source file.
 */
const sourceFileMissing = pathToFile => `
${chalk.bold.red(`The provided source file didn't exist!`)}

Did you mistype the name of the source file:
${chalk.cyan.bold(pathToFile)}

`;

/**
 * Prints error, since source file contained unknown JSON structure.
 */
const sourceFileHasUnknownStructure = () => `
${chalk.bold.red(`The provided source file has unknown structure!`)}

The file should contain IANA timezone data in JSON format:
{
  "version": "2019b",
  "zones": [
    {
      "name": "Africa/Abidjan",
      //...
    }
    //...
  ],
  "links": []
}
`;

/**
 * Generate the content for exported '.js' file.
 *
 * @param stringifiedZoneNames an array of timezone keys to be exported.
 *        Use JSON.stringify to generate this string.
 * @param relevantZonesPattern RexExp pattern to make it explicit that we are filtering
 *        IANA database instead of exposing all the keys.
 */
const targetFileContent = (stringifiedZoneNames, relevantZonesPattern) =>
  `// This file is generated with script:
// yarn run timezones ./iana-2019b.json
//
// Note: iana-2019b.json file is downloaded from moment-timezone Github repository:
//       https://github.com/moment/moment-timezone/tree/develop/data/unpacked
//
// Timezones are picked with RegExp:
// ${relevantZonesPattern.toString()}
//
// You could find the latest IANA timezone source file (in JSON format)
// from moment-timezone Github repository:
// https://raw.githubusercontent.com/moment/moment-timezone/develop/data/unpacked/latest.json

const ianaTimezoneKeys = ${stringifiedZoneNames}

export default ianaTimezoneKeys;
`;

/**
 * Prints path to saved export containing IANA timezone keys.
 *
 * @param pathToFile export file.
 */
const targetFileSaved = pathToFile => `
IANA timezone keys are saved to file:
${chalk.cyan.bold(pathToFile)}

You should move this file to the component directory: FieldTimeZoneInput - and use it there.

`;

/**
 * Reads a file with JSON content and returns it.
 * We expect that the provided file exists and can be parsed to JSON.
 *
 * @param sourceFile JSON file to be read.
 */
const readFileToJSON = sourceFile => {
  const rawdata = fs.readFileSync(sourceFile);
  return JSON.parse(rawdata);
};

/**
 * Creates target file name for the generated file.
 * a JS object.
 *
 * @param fileName
 * @param revision the current revision of the exported file.
 */
const targetFileName = (fileName, revision = 0) => {
  const fileNameWithoutExtension = fileName
    .split('.')
    .slice(0, -1)
    .join('.');

  const defaultExportFileName = `${fileNameWithoutExtension}-keys.js`;
  const exportFileExists = fs.existsSync(path.resolve(process.cwd(), defaultExportFileName));

  if (exportFileExists) {
    const newRevision = revision + 1;
    const exportFileNameWithRevision = `${fileNameWithoutExtension}-keys_(${newRevision}).js`;
    const revisionedExportFileExists = fs.existsSync(
      path.resolve(process.cwd(), exportFileNameWithRevision)
    );

    return revisionedExportFileExists
      ? targetFileName(fileName, newRevision)
      : exportFileNameWithRevision;
  } else {
    return defaultExportFileName;
  }
};

/**
 * Exit program with error message
 *
 * @param message Error message to be printed to console.
 */
const exitWithErrorMessage = message => {
  process.on('exit', code => {
    console.log(message);
  });
  process.exit(1);
};

const run = () => {
  const fileName = process.argv[2];

  if (fileName) {
    const pathToFile = path.resolve(process.cwd(), fileName);

    if (!fs.existsSync(pathToFile)) {
      exitWithErrorMessage(sourceFileMissing(pathToFile));
    } else {
      const source = readFileToJSON(pathToFile);
      const zones = source.zones;

      if (!zones) {
        exitWithErrorMessage(sourceFileHasUnknownStructure());
      }

      const relevantZonesPattern = new RegExp(
        '^(Africa|America|Antarctica|Asia|Atlantic|Australia|Europe|Indian|Pacific)'
      );
      const zoneNames = source.zones.map(z => z.name).filter(z => relevantZonesPattern.test(z));

      const stringifiedZoneNames = JSON.stringify(zoneNames, null, 2);
      const [cleanFileName] = fileName.split('/').slice(-1);
      const pathToExport = path.resolve(process.cwd(), targetFileName(cleanFileName));

      fs.writeFile(
        pathToExport,
        targetFileContent(stringifiedZoneNames, relevantZonesPattern),
        error => {
          if (error) {
            return console.error(error);
          }
          console.log(targetFileSaved(pathToExport));
        }
      );
    }
  } else {
    exitWithErrorMessage(sourceFileNotProvided());
  }
};

run();
