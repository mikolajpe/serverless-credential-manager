Serverless Credential Manager
=============================

This plugin does add Cli option, that sets credentials in `admin.env` file, which is useful when you clone
existing project, and you need to set credentials in order to deploy project to either dev or live environment. 

```
$ sls credential set [-s <stage>] [-p <profile>]
```

Both parameters are optional. If not set interactive mod will kick in to let you select stage (list of stages 
will be generated based on contents of your `\_meta` folder) and profile (list of profiles will be generated 
based on `~/.aws/credentials` file contents).

### Prerequisites

* aws credentials
* serverless project

### Installation

Add dependency to your project:

File: *package.json*
```
{
    ...
    "devDependencies": {
        ...
        "serverless-credential-manager" : "^0.1.0"
        ...
    }
    ...
}
```

Add the plugin to your project by doing following modification:

File: *s-project.json*
```
{
    ...
    "plugins": [
        "serverless-credential-manager"
    ]
    ...
}
```

### Sample Usa Case scenario
This plugin is created for teams which share environments among team members.

Let say user A, creates testing environment, now he needs to commit `_meta` files related to this environment in order for others to be able to deploy to this environment as well, user A does not commit `admin.env` file as it's contents differs from user to user.
Let say user B clones repository, but he does not have credentials for testing environment, he can set them up using this plugin and be able to deploy.

No you can clone serverless project, set up credentials and deploy:
```
$ git clone git@github.com:myuserid/myprojectwithmetaconfiguration.git
$ sls credential set -s livestage -p liveprofile \
  && sls function deploy -s livestage -r my-region-1 -a \
  && sls endpoint deploy -s livestage -r my-region-1 -a
```
