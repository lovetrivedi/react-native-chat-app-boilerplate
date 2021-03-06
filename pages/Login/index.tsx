import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-native';
import { View, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { AppTheme } from '../../config/DefaultConfig';
import { ValidationError } from '../../config/validation';
import useTheme from "../../hooks/useTheme";
import ThemedText from '../../components/UI/ThemedText';
import useLanguage from '../../hooks/useLanguage';
import Input from '../../components/Chat/Input';
import microValidator from 'micro-validator' ;
import AuthLayout from '../../components/Chat/AuthLayout';
import SplashScreen from 'react-native-splash-screen';
import { AppLanguage } from '../../config/languages';
import { useDarkMode } from 'react-native-dark-mode';
import { isIOS } from '../../utils';

interface LoginField {
    username?: string;
    password?: string;
}

const Login: React.FunctionComponent<RouteComponentProps> = ({
    history
}: RouteComponentProps) => {

    const constants: AppLanguage = useLanguage();
    const theme: AppTheme = useTheme();
    const mode = useDarkMode();

    const validate = (data: LoginField): ValidationError => {
        const errors = microValidator.validate({
            username: {
                required: {
                    errorMsg: constants.loginValidation.username
                }
            },
            password: {
                required: {
                    errorMsg: constants.loginValidation.password
                },
                length: {
                    min: 6,
                    max: 12,
                    errorMsg: constants.loginValidation.passwordLength
                }
            },
        },data)
        
        return errors
    }

    useEffect(() => {
        SplashScreen.hide()
    },[]);

    const [username,onChangeUsername] = useState<string>("")
    const [password,onChangePassword] = useState<string>("")
    const [errors,setErrors] = useState<ValidationError>({})

    const goToSignup = () => {
        history.push('/signup')
    }
      
    const goToChatList = () => {
        const errors: ValidationError = validate({username: username,password: password})

        if(!Object.keys(errors).length)
        {
            history.push('/chatlist')
        }
        else {
            setErrors(errors)
        }
    }

    return (
        <>
            <AuthLayout buttonLabel={constants.loginButton} goToLocation={goToChatList}>
                <Input
                    placeholder={constants.usernamePlacerHolder}
                    onChangeText={onChangeUsername}
                    value={username}
                    errors={errors.username}
                    style={{color: mode ? theme.lightTextColor : theme.textColor, paddingBottom: isIOS() ? 0 : 7, height: isIOS() ? 15 : 35 }}
                />
                <Input
                    placeholder={constants.passwordPlacerHolder}
                    onChangeText={onChangePassword}
                    value={password}
                    secureTextEntry={true}
                    errors={errors.password}
                    style={{color: mode ? theme.lightTextColor : theme.textColor, paddingBottom: isIOS() ? 0 : 7, height: isIOS() ? 15 : 35 }}
                />
            </AuthLayout>
            <View style={style.topContainer}>
                <ThemedText styleKey="lightTextColor">{constants.signupCheck}</ThemedText>
                <TouchableOpacity onPress={goToSignup}>
                    <ThemedText styleKey="lightTextColor" style={{color: mode ? theme.appColor : theme.appColor}}>{constants.signupButton}</ThemedText>
                </TouchableOpacity>
            </View>
        </>
    );
}

export default Login;

interface Style {
    topContainer: ViewStyle;
}

const style: Style = StyleSheet.create<Style>({
    topContainer: {
        flexDirection: 'column',
        justifyContent: "flex-end",
        alignItems: 'center',
        paddingBottom: 10
    }
})
