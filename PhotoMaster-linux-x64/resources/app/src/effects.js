/******************************************
 *  Author : Author
 *  Created On : Thu Sep 28 2017
 *  File : effects.js
 *******************************************/

function connectEffect(seriously, src, target, effect) {
    effect.source = src;
    target.source = effect;
    seriously.go();
}

// Dictionary of effects
const effects = {
    vanilla: (seriously, src, target) => {

        // Connect target source to the source given
        target.source = src;

        // Tells seriously that we are ready to go
        seriously.go();
    },
    ascii: (seriously, src, target) => {

        // Pulls effect from seriously library
        const ascii = seriously.effect('ascii');

        // Let the source pass through the effect...
        ascii.source = src;

        // ... and to the target
        target.source = ascii;

        // Tell seriously we are ready
        seriously.go();
    },
    daltonize: (seriously, src, target) => {
        const daltonize = seriously.effect('daltonize');
        daltonize.type = '0.8';
        connectEffect(seriously, src, target, daltonize);
    },
    hex: (seriously, src, target) => {
        const hex = seriously.effect('hex');
        hex.size = 0.03;
        connectEffect(seriously, src, target, hex);
    }
}

const effectNames = Object.keys(effects);
let currentIndex = 0;

function setNextIndex() {
    const nextIndex = currentIndex + 1 < effectNames.length ? currentIndex + 1 : 0;
    currentIndex = nextIndex;
    return currentIndex;
}

function setIndexToEffectIndex(effectName) {
    currentIndex = effectNames.indexOf(effectName);
    return currentIndex;
}

// exports the choose function
exports.choose = (seriously, src, target, effectName = 'vanilla') => {
    effects[effectName](seriously, src, target);
    setIndexToEffectIndex(effectName);
}

exports.cycle = (seriously, src, target) => {
    setNextIndex();
    effects[effectNames[currentIndex]](seriously, src, target);
}