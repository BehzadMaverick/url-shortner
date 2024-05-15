import * as fs from 'fs';
import * as path from 'path';
interface Data {
  [key: string]: any;
}

async function addEntryToJsonFile(
  fileName: string,
  key: string,
  value: any
): Promise<void> {
  try {
    let data: Data = {};

    const directory = path.dirname(fileName);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    const fileExists = await fs.promises
      .access(fileName, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (fileExists) {
      const jsonData = await fs.promises.readFile(fileName, 'utf-8');
      data = JSON.parse(jsonData);
    }

    data[key] = value;

    await fs.promises.writeFile(
      fileName,
      JSON.stringify(data, null, 2),
      'utf-8'
    );

    console.log(`Entry '${key}' added to ${fileName}.`);
  } catch (error) {
    console.error(`Error adding entry to ${fileName}: ${error}`);
  }
}

async function readFile(
  fileName: string,
): Promise<Data> {
  try {
    const fileExists = await fs.promises
      .access(fileName, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return {};
    }

    const jsonData = await fs.promises.readFile(fileName, 'utf-8');
    const data: Data = JSON.parse(jsonData);

    return data;
  } catch (error) {
    console.error(`Error checking key existence in ${fileName}: ${error}`);
    return {};
  }
}

export { readFile, addEntryToJsonFile };
