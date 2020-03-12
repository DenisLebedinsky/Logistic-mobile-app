import React from 'react';
import { TouchableOpacity, View } from 'react-native';

const DebounceTouchableOpacity = ({
    children, onPress, delay = 1000, ...props
}) => {

    const debounce = () => {
        let isCooldown = false;

        return function () {
            if (isCooldown) return;
            onPress.apply(this, arguments);

            isCooldown = true;

            setTimeout(() => isCooldown = false, delay);
        };
    }

    return <TouchableOpacity onPress={debounce()} {...props}>
        {children}
    </TouchableOpacity>
}

export default DebounceTouchableOpacity;