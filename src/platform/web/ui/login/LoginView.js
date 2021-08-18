/*
Copyright 2020 Bruno Windels <bruno@windels.cloud>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import {TemplateView} from "../general/TemplateView.js";
import {hydrogenGithubLink} from "./common.js";
import {PasswordLoginView} from "./PasswordLoginView.js";
import {CompleteSSOView} from "./CompleteSSOView.js";

export class LoginView extends TemplateView {
    render(t, vm) {
        const homeserver = t.input({
                id: "homeserver",
                type: "text",
                placeholder: vm.i18n`Your matrix homeserver`,
                value: vm.defaultHomeServer,
                onChange: () => vm.updateHomeServer(homeserver.value),
            });

        return t.div({className: "PreSessionScreen"}, [
            t.div({className: "logo"}),
            t.h1([vm.i18n`Sign In`]),
            t.mapView(vm => vm.completeSSOLoginViewModel, vm => vm ? new CompleteSSOView(vm) : null),
            t.if(vm => !vm.completeSSOLoginViewModel,
                (t, vm) => t.div({ className: "LoginView_sso form form-row" }, [t.label({ for: "homeserver" }, vm.i18n`Homeserver`), homeserver])),
            t.mapView(vm => vm.passwordLoginViewModel, vm => vm ? new PasswordLoginView(vm): null),
            t.if(vm => vm.passwordLoginViewModel && vm.startSSOLoginViewModel, t => t.p({className: "LoginView_separator"}, vm.i18n`or`)),
            t.mapView(vm => vm.startSSOLoginViewModel, vm => vm ? new StartSSOLoginView(vm) : null),
            t.if(vm => vm.errorMessage, (t, vm) => t.h5({className: "LoginView_error"}, vm.i18n(vm.errorMessage))),
            // use t.mapView rather than t.if to create a new view when the view model changes too
            t.p(hydrogenGithubLink(t))
        ]);
    }
}

class StartSSOLoginView extends TemplateView {
    render(t, vm) {
        return t.div({ className: "StartSSOLoginView" },
            t.button({
                className: "StartSSOLoginView_button button-action secondary",
                type: "button",
                onClick: () => vm.startSSOLogin()
            }, vm.i18n`Log in with SSO`)
        );
    }
}
