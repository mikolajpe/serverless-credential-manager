'use strict';

module.exports = function(S) {

    const path    = require( 'path' ),
        SError    = require(S.getServerlessPath('Error')),
        SCli      = require(S.getServerlessPath('utils/cli')),
        BbPromise = require( 'bluebird' );

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
                        description: 'Required - Serverless stage for which set credential'
                    }, {
                        option:      'profile',
                        shortcut:    'p',
                        description: 'Required - AWS Credential profile to be set for stage'
                    }
                ]
            });
            return BbPromise.resolve();
        }

        /**
         * Action
         */
        credentialManager() {

            let _this = this;

        }
    }

    return CredentialManager;
};
