### Install global packages

```
npm install -g @microsoft/rush commitizen cz-conventional-changelog @commitlint/{cli,config-conventional} prettier
```

### Everyday rush commands

https://rushjs.io/pages/developer/new_developer/

### Installing dependencies

Instead of `npm install` use `rush update`.

https://rushjs.io/pages/commands/rush_update/

### Adding new dependencies

Instead of `npm install packageName --save` use `rush add --package packageName`.  

https://rushjs.io/pages/commands/rush_add/

### Running scripts

Instead of `npm run scriptName` or `npm scriptName` use `rushx scriptName` (in a package folder).

https://rushjs.io/pages/developer/everyday_commands/

### Configuration files

`.czrc`  
This is a configuration file for commitizen. We use it to allow creating commit messages using `git cz`. It walks you through steps to create a conventional-changelog-formatted commit message.

`.commitlintrc.json`  
This is a configuration file for commitlint. We use it in a commit-msg git hook, to validate the commit message against conventional-changelog format.