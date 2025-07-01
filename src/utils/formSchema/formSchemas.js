import * as yup from 'yup'

export const registerFormSchema = yup.object().shape({
  username: yup.string().required('İsim alanı boş olamaz'),
  email: yup
    .string()
    .email('Lütfen email formatınızı kontrol edin !')
    .required('Email alanı boş olamaz'),
  password: yup
    .string()
    .required('Lütfen şifrenizi giriniz')
    .test(
      'passwordFormat',
      (value) => {
        if (value.length < 8) {
          return 'Şifre en az 8 karakterden oluşmalıdır'
        }
        if (!String(value).match(/\d/) || !String(value).match(/[a-zA-Z]/)) {
          return 'Şifre en az 1 harf ve 1 rakam içermelidir'
        }
      },
      (value) => {
        if (value.length < 8) {
          return false
        }
        if (!String(value).match(/\d/) || !String(value).match(/[a-zA-Z]/)) {
          return false;
        }
        return true
      }
    ),
  agree: yup
    .boolean()
    .isTrue('Gizlilik politikası ve şartlarını onaylanması zorunda !')
    .required('Gizlilik politikası ve şartlarını onaylanması zorunda !'),
});

export const loginFormShcema = yup.object().shape({
   email: yup
    .string()
    .email('Lütfen email formatınızı kontrol edin !')
    .required('Email alanı boş olamaz'),
  password: yup
    .string()
    .required('Lütfen şifrenizi giriniz')
    .test(
      'passwordFormat',
      (value) => {
        if (value.length < 8) {
          return 'Şifre en az 8 karakterden oluşmalıdır'
        }
        if (!String(value).match(/\d/) || !String(value).match(/[a-zA-Z]/)) {
          return 'Şifre en az 1 harf ve 1 rakam içermelidir'
        }
      },
      (value) => {
        if (value.length < 8) {
          return false
        }
        if (!String(value).match(/\d/) || !String(value).match(/[a-zA-Z]/)) {
          return false;
        }
        return true
      }
    ),
});

export const landingFormSchema = yup.object().shape({
  name: yup.string().required('İsim alanı boş olamaz'),
  email: yup
    .string()
    .email('Lütfen email formatınızı kontrol edin !')
    .required('Email alanı boş olamaz'),
  message: yup
    .string()
    .required('Mesaj alanı boş olamaz')
});

export const forgotPasswordFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('Lütfen email formatınızı kontrol edin !')
    .required('Email alanı boş olamaz'),
});

export const resetPasswordFormSchema = yup.object().shape({
  password: yup
    .string()
    .required('Lütfen şifrenizi giriniz')
    .min(8,'Şifre en az 8 karakterden oluşmalıdır')
    .test(
      'passwordFormat',
      'Şifre en az 1 harf ve 1 rakam içermelidir',
      (value) => {
        if (!String(value).match(/\d/) || !String(value).match(/[a-zA-Z]/)) {
          return false;
        }
        return true
      }
    ),
    verifyPassword: yup
      .string()
      .required('Lütfen Şifrenizi Doğrulayın')
      .oneOf([yup.ref("password")], 'Şifreler eşleşmiyor'),
});