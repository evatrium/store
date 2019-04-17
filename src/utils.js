/**
 * provides the convenience for optionally using comma separated values to pluck the properties off of the namespace
 * can be used for mapState and mapLogic
 * @example
 *
 * mapState: {
 *      access: 'loggedIn,user'
 * }
 *
 * //equal to doing
 * mapState: ({access})=>({
 *      loggedIn: access.loggedIn,
 *      user: access.user
 * })
 *
 * @param {function|Object} mapper - function or object containing the values to map
 * @param {Object} source
 * @returns {Object} - object containing the plucked properties
 */
export const mapIt = (mapper, source) => {

    if (typeof mapper === 'function') {

        return mapper(source);

    } else if (typeof mapper === 'object') {

        let selected = {};

        let keys = Object.keys(mapper);

        for (let i = 0; i < keys.length; i++) {

            const namespace = keys[i];

            if (!source[namespace]) {
                console.error(`"${namespace}" does not exist or the namespace has not been attached to state yet`);
                break;
            }

            let props = mapper[namespace];

            if (typeof props === 'string') props = props.split(/\s*,\s*/);

            for (let i = 0; i < props.length; i++) {
                selected[props[i]] = source[namespace][props[i]];
            }
        }

        return selected;

    } else {

        return {};
    }
};