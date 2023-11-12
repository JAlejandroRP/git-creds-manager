import stdin from 'prompt-sync';
import fs from 'fs';

const CREDENTIALS_FILEPATH = process.env.HOME + '/.git-creds-manager';
const GIT_CREDENTIAL_FILEPATH = process.env.HOME + '/.git-credentials';
const prompt = stdin();
const CONTINUE_PROMPT = 'press any key to continue...';

const getCredentialInUse = () => {
  const credential = fs.readFileSync(GIT_CREDENTIAL_FILEPATH, 'utf-8');
  console.log(`*** credential in use: ${credential}`);
  prompt(CONTINUE_PROMPT);
}

const setCredentialInUser = () => {
  getCredentialsPrompt();
  const alias = prompt('enter alias of the credential to use: ');
  const credentials = getCredentials().split('\n');
  let credential = credentials.find(e => e.includes(alias))

  if (!credential) {
    console.error('credential not found');
    prompt(CONTINUE_PROMPT);
    return;
  }

  credential = credential.split('~')[1];
  // console.log(credential);
  fs.writeFileSync(GIT_CREDENTIAL_FILEPATH, credential);
  getCredentialInUse();
}

const deleteCredentiasl = () => {
  fs.writeFileSync(CREDENTIALS_FILEPATH, '');
  console.log('**** credential erased!.');
  prompt(CONTINUE_PROMPT);
};

const saveCredentialPrompt = () => {
  const alias = prompt("*** Enter the alias for the credential: ");
  const credential = prompt("*** Enter the credential: ");
  const oldContent = getCredentials()
  const contentToWrite = oldContent + alias + '~' + credential + '\n';
  fs.writeFileSync(CREDENTIALS_FILEPATH, contentToWrite);
  console.log('**** credential saved!');
  prompt(CONTINUE_PROMPT);
};

const getCredentials = () => {
  try {
    return fs.readFileSync(CREDENTIALS_FILEPATH, 'utf-8');
  }
  catch (error) {
    console.error(error.message || error);
  }
}

const getCredentialsPrompt = () => {
  try {
    console.log('*** credentials: ');
    const credentials = fs.readFileSync(CREDENTIALS_FILEPATH, 'utf-8');
    console.log(credentials || '**** no credentials stored!');
    prompt(CONTINUE_PROMPT);
  }
  catch (error) {
    console.error(error.message || error);
  }
}

const options = [
  {
    index: 0,
    "message": "list credentials",
    function: getCredentialsPrompt
  },
  {
    index: 1,
    "message": "add new credential",
    function: saveCredentialPrompt
  },
  {
    index: 2,
    "message": "delete credential",
    function: deleteCredentiasl
  },
  {
    index: 3,
    "message": "set credential to use",
    function: setCredentialInUser
  },
  {
    index: 4,
    "message": "get credential in use",
    function: getCredentialInUse
  },
];


const printOptions = () => {
  options.forEach((option, index) => {
    console.log(`${index} - ${option.message}`)
  });
  console.log('any other to exit.')
};

const executeOption = (optionIndex) => {
  optionIndex = Number(optionIndex);

  if (typeof optionIndex !== 'number') {
    console.error('option must be a number, terminating...');
    return;
  }
  if (optionIndex < 0 || optionIndex >= options.length)
    process.exit(0);

  console.log(`** You selected ${options[optionIndex].message}`);
  options[optionIndex].function();
}

console.log("git credentials manager by AlejandroRP");
while (true) {
  console.clear();
  console.log("* please select an option: ");
  printOptions();
  const selectedOption = prompt("Option: ");
  executeOption(selectedOption);
}




