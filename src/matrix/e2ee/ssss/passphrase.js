/*
Copyright 2020 The Matrix.org Foundation C.I.C.

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

import {Key} from "./common.js";

const DEFAULT_ITERATIONS = 500000;
const DEFAULT_BITSIZE = 256;

/**
 * @param  {KeyDescription} keyDescription
 * @param  {string} passphrase
 * @param  {CryptoDriver} cryptoDriver
 * @return {Key}
 */
export async function keyFromPassphrase(keyDescription, passphrase, cryptoDriver) {
    const {passphraseParams} = keyDescription;
    if (!passphraseParams) {
        throw new Error("not a passphrase key");
    }
    if (passphraseParams.algorithm !== "m.pbkdf2") {
        throw new Error(`Unsupported passphrase algorithm: ${passphraseParams.algorithm}`);
    }
    // TODO: we should we move this to platform specific code
    const textEncoder = new TextEncoder();
    const keyBits = await cryptoDriver.derive.pbkdf2(
        textEncoder.encode(passphrase),
        passphraseParams.iterations || DEFAULT_ITERATIONS,
        // salt is just a random string, not encoded in any way
        textEncoder.encode(passphraseParams.salt),
        "SHA-512",
        passphraseParams.bits || DEFAULT_BITSIZE);
    return new Key(keyDescription, keyBits);
}
