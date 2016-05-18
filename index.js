'use strict';

module.exports = function(S) {

    const path    = require( 'path' ),
        SUtils    = S.utils,
        SError    = require(S.getServerlessPath('Error')),
        BbPromise = require( 'bluebird'),
        os        = require('os'),
        fs        = BbPromise.promisifyAll(require('fs'));

    class CredentialManager extends S.classes.Plugin {

        /**
         * Get Name
         */
        static getName() {
            return 'com.serverless.' + this.name;
        }

        /**
         * Register Plugin Actions
         */
        registerActions() {

            S.addAction(this.credentialManager.bind(this), {
                handler:       'credentialManager',
                description:   'Enables changing credentials for your stages.',
                context:       'credential',
                contextAction: 'set',
                options:       [
                    {
                        option:      'stage',
                        shortcut:    's',
                        description: 'Optional - Serverless stage for which set credential'
                    }, {
                        option:      'profile',
                        shortcut:    'p',
                        description: 'Optional - AWS Credential profile to be set for stage'
                    }
                ]
            });
            return BbPromise.resolve();
        }

        /**
         * Action
         */
        credentialManager(evt) {

            let _this = this;
            _this.evt = evt;
            _this.provider = S.getProvider();
            _this.project  = S.getProject();

            _this.evt.options.stage   = _this.evt.options.stage ? _this.evt.options.stage : null;
            _this.evt.options.profile = _this.evt.options.profile ? _this.evt.options.profile : null;

            // Flow
            return BbPromise.try(function() {})
                .bind(_this)
                .then(function() {
                    return _this.cliPromptSelectStage('Choose a Stage: ', _this.evt.options.stage, false)
                        .then(stage => {
                        _this.evt.options.stage = stage;
                        })
                })
                .then(function() {

                    // Skip if user just made a new profile
                    if (_this.evt.options.profile) return;

                    // Select A Profile
                    _this.profiles = _this.provider.getAllProfiles();

                    if (!_this.profiles) throw new SError(`You have no profiles for ${_this.provider.getProviderName()} on this machine.  Please re-run this command and create a new profile.`);

                    let profileNameList = Object.keys(_this.profiles);

                    // if private has 1 stage, skip prompt
                    if (profileNameList.length === 1) {
                        return BbPromise.resolve(profileNameList[0]);
                    }

                    // Prompt: profile select
                    let choices = [];
                    for (let i = 0; i < profileNameList.length; i++) {
                        choices.push({
                            key: (i + 1) + ') ',
                            value: profileNameList[i],
                            label: profileNameList[i]
                        });
                    }

                    return _this.cliPromptSelect('Select a profile for your project: ', choices, false)
                        .then(profile => {
                        _this.evt.options.profile = profile[0].value;
                        })
                })
                .then(_this._setCredentials)
        }

        _setCredentials() {

            let _this = this;

            return new BbPromise(function(resolve, reject) {

                // Check Params
                if (!_this.evt.options.stage) {
                    return BbPromise.reject(new SError('Missing stage option'));
                }

                // Check Params
                if (!_this.evt.options.profile) {
                    return BbPromise.reject(new SError('Missing profile option'));
                }

                // Write to admin.env
                let adminEnv = _this.project.getRootPath('admin.env'),
                    profileEnvVar = 'AWS_' + _this.evt.options.stage.toUpperCase() + '_PROFILE';
                if (SUtils.fileExistsSync(adminEnv)) {
                    // Append to admin.env
                    fs.appendFileSync(adminEnv, os.EOL + `${profileEnvVar}=${_this.evt.options.profile}`);
                } else {
                    // Create admin.env
                    SUtils.writeFileSync(adminEnv, `${profileEnvVar}=${_this.evt.options.profile}`);
                }

                return BbPromise.resolve();
            });
        }
    }

    return CredentialManager;
};
