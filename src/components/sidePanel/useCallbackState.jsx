import { useState, useCallback, useRef, useEffect } from 'react';
import _isFunction from 'lodash/isFunction';
import _noop from 'lodash/noop';
import React from 'react';

export const useCallbackState = (initialState) => {
    const [state, setState] = useState(initialState);
    const callbackRef = useRef(_noop);

    const handleStateChange = useCallback((updatedState, callback) => {
        setState(updatedState);
        if (_isFunction(callback)) callbackRef.current = callback;
    }, []);

    useEffect(() => {
        callbackRef.current();
        callbackRef.current = _noop; // to clear the callback after it is executed
    }, [state]);

    return [state, handleStateChange];
};
