## Install global packages

```
npm install -g @microsoft/rush commitizen cz-conventional-changelog @commitlint/{cli,config-conventional} prettier
```

## Configuration files

`.czrc`  
This is a configuration file for commitizen. We use it to allow creating commit messages using `git cz`. It walks you through steps to create a conventional-changelog-formatted commit message.

`.commitlintrc.json`  
This is a configuration file for commitlint. We use it in a commit-msg git hook, to validate the commit message against conventional-changelog format.