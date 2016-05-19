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

### Sample Usage

```
$ git clone git@github.com:myuserid/myprojectwithmetaconfiguration.git
$ sls credential set -s livestage -p liveprofile \
  && sls function deploy -s livestage -r my-region-1 -a \
  && sls endpoint deploy -s livestage -r my-region-1 -a
```
